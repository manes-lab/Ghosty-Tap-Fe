import {Container, Assets, Sprite, Graphics, GraphicsContext, Rectangle, TilingSprite, TickerCallback } from 'pixi.js';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import api from '../../axios';
import * as ws from '../../utils/websocket';
import { moveTo } from '../../utils/pixi';
import * as Pomelo from '../../utils/pomelo';
import { formatTimestamp, formatNumber, formatCountdown } from '../../utils/util';
import { ZenStageUI } from './ui';

const [TIME, OPEN, HIGH, LOW, CLOSE, CONFIRM] = [0, 1, 2, 3, 4, 8]
const LIMIT = 5
const DEFAULT_MAXMIN = 0.5
const MAX_COIN = 3000
const SINGLE_JUMP_COIN = 50
const COOLING_DOWN = 10 * 60 * 1000

export class ZenStage extends ZenStageUI {

    data: {
        address: string,
        gameId: string,
        instId: string,
        gameStoped: boolean,
        barWidth: number,
        bars1s: number[],
        maxmin: number,
        max: number,
        min: number,
        collisionY: number,
        flyingCoinY: number,
        jumpLock: boolean,
        collisionBarIndex: number,
        coin: number,
        barsData: {collision: number, timeout?: number, move?: TickerCallback<any>}[],
        cd: number
        curCoin: number
    } = {
        address: "",
        gameId: '',
        instId: "BTC-USDT",
        gameStoped: false,
        barWidth: 20,
        bars1s: [],
        maxmin: DEFAULT_MAXMIN,
        max:0,
        min:0,
        flyingCoinY: 0,
        collisionY: 0,
        jumpLock: false,
        collisionBarIndex: 0,
        coin: 0,
        barsData: [],
        cd: 0,
        curCoin: 0
    }

    constructor(options: any) {
        super()
        this.data.instId = options.instId;
        this.data.address = options.address
        console.log(options, '---options---');
    }

    load = async (elementId: string, preference: "webgl" | "webgpu" | undefined) => {
        await super.load(elementId, preference)
        this.data.gameStoped = false
        this.initConnect();

        const res = await api.get_user_status({
            user_id: this.data.address,
        })
        this.data.coin = res.data.coins
        this.data.cd = res.data.zen_cd
        this.data.curCoin = res.data.zen_cd ? 0 : res.data.zen_coins
        this.updateProgress()

        // await new Promise((resolve, reject) => {
        //     setTimeout(() => {
        //         resolve(1)
        //     }, 2000)
        // })


        ws.initWebSocket(this.data.instId, this.tick)
        this.app.ticker.add(() => {
            this.coinGraph.text = `${formatNumber(this.data.coin)}`
            if (this.data.cd > 0) {
                this.progressContainer.visible = false
                this.rechargingContainer.visible = true
                this.data.cd -= this.app.ticker.deltaMS
                this.rechargingText.text = `reset after ${formatCountdown(Math.floor(this.data.cd / 1000))}`
            } else {
                this.progressContainer.visible = true
                this.rechargingContainer.visible = false
            }
        })

        this.events["load"]();
    }

    destroy = async () => {
        this.data.gameStoped = true
        ws.close()
        Pomelo.leaveSpace();
        this.app.destroy({removeView: true}, {children: true});
    }

    tick = (data: any) => {
        if (!data || this.data.gameStoped) {
            return
        }
        let bar = data[0].map(Number)
        if (this.data.bars1s.length > 0 && bar[TIME] == this.data.bars1s[this.data.bars1s.length - 1][TIME]) {
            this.data.bars1s[this.data.bars1s.length - 1] = bar
        } else {
            if (this.data.bars1s.length > LIMIT) {
                this.data.bars1s.splice(0, 1)
                this.data.barsData.splice(0, 1)
            }
            this.data.bars1s.push(bar)
            this.data.barsData.push({collision: 0})
            this.dateGraph.text = formatTimestamp(bar[TIME]);
        }
        this.setBarsGraph()
        this.setMarksGraph()
    }

    initConnect = async () => {
        const tradingPairMap: {[key: string]: string} = {
            'btc': 'Bitcoin',
            'eth': 'Ethererum',
            'ton': 'Ton',
        }
        const token = tradingPairMap[this.data.instId.split("-")[0].toLowerCase()]
        const res = await api.create_game({
            type: "zen",
            trading_pair: token
        })
        if (!res.success) {
            this.events["changeModule"]("reconnection");
            return
        }
        this.data.gameId = res.data._id

        await Pomelo.enterSpace("zen", token)

        Pomelo.addListener("onAdd", (data: any) => { 
            data.space == 'zen' && this.updateOnlinePlayers();
        })
        Pomelo.addListener("onLeave", (data: any) => { 
            data.space == 'zen' && this.updateOnlinePlayers();
        })

        this.updateOnlinePlayers();
    }

    updateOnlinePlayers = async () => {
        const res = await api.get_online_players({
            user_id: this.data.address,
            page: 0,
            limit: 5,
            type: 'zen'
        });
        this.updatePlayersPanel(res?.data?.rank || [], res?.data?.count);
    }

    submitData = () => {
        this.data.coin += SINGLE_JUMP_COIN;
        this.data.curCoin += SINGLE_JUMP_COIN

        console.log("---submitData---", this.data.gameId);
        Pomelo.submitData('zen', {
            game_id: this.data.gameId,
            timestamp: new Date().getTime(),
        }).then((res) => {
            console.log(res)
        })
        if (this.data.curCoin >= MAX_COIN) {
            this.data.cd = COOLING_DOWN
            this.data.curCoin = 0
        }
    }

    updatePlayersPanel = async (arr:Array<any>, count:number) => {
        this.playerGraph.text = count;
        this.playerAvatarContainer.removeChildren();
        this.playerAvatarContainer.boundsArea = new Rectangle(0, 0, this.calcLength(50 * arr.length), this.calcLength(50));
        this.playerAvatarContainer.x = this.calcLength(50 * (5 - arr.length));
        for(let i = 0; i< arr.length; i++){
            const user = arr[i];

            const avatarContainer = new Container();
            avatarContainer.boundsArea = new Rectangle(0, 0,  this.calcLength(50),  this.calcLength(50));
            avatarContainer.x = this.calcLength(50 * i);
            avatarContainer.zIndex = 5 - i;

            // const avatarBg = new Graphics().circle(this.calcLength(24), this.calcLength(24), this.calcLength(24)).fill(0x94D3F3);
            // avatarContainer.addChild(avatarBg);

            const imgAvatar = await Assets.load(`${window.location.origin}/img/avatar${user.avatar}.png`);
            const avatar = Sprite.from(imgAvatar);
            avatar.width = this.calcLength(50);
            avatar.height = this.calcLength(50);
            avatar.x = this.calcLength(0);
            avatar.y = this.calcLength(0);
            avatarContainer.addChild(avatar);

            this.playerAvatarContainer.addChild(avatarContainer);
        }
    }

    setBarsGraph = async () => {
        this.klineContainer.x = 0

        const swapBar = this.barGraphics[0]
        this.barGraphics.push(swapBar)

        let bars = this.getDisplayBars()
        this.data.collisionBarIndex = bars.length - 3
        let lastX = this.klineContainer.width - (bars.length - 1) * this.data.barWidth
        let lastY = this.klineContainer.height / 2
        
        for (let i = 0; i < bars.length; i++) {
            this.barGraphics[i]?.removeChildren();
            const bar = bars[i]
            const curPrice = bar[CLOSE]
            const lastPrice = i > 0 ? bars[i - 1][CLOSE] : bar[OPEN]
            let per = Math.abs(curPrice - lastPrice) / this.data.maxmin

            let w = this.data.barWidth
            let h = Math.floor(this.klineContainer.height * per)
            let color = 0xBB4F23;
            let offsetX = 0
            let offsetY = 0
            if (curPrice > lastPrice) { 
                color = 0xA9A100;
                offsetY = -h
            }

            const x = 0
            let y = 0
            if (curPrice < lastPrice) {
                y = h;
            }


            i === 0 && (lastY = (this.data.max - bar[OPEN]) / this.data.maxmin * this.klineContainer.height);

            if (!this.barGraphics[i].context) {
                this.barGraphics[i].context = new GraphicsContext();
            }
            this.barGraphics[i].clear()
            try {
                clearTimeout(this.data.barsData[i].timeout)
                this.app.ticker.remove(this.data.barsData[i].move!)
            } catch (e) {
                console.log(e)
            }

            this.barGraphics[i].x = lastX
            this.barGraphics[i].y = lastY
            


            this.barGraphics[i].clear();
            this.barGraphics[i]
            .beginFill(color)
            .lineStyle(2, 0x60483A)
            .drawRoundedRect(offsetX, offsetY, w, h, 6)
            .endFill();


            if (h >= 11) {
                const cutSize = 5;
                const points = [
                    { x: x, y: y - cutSize },
                    { x: x, y: y - h + cutSize },
                    { x: x + cutSize, y: y - h + cutSize },
                    { x: x + cutSize, y: y - h },
                    { x: x + w - cutSize, y: y - h },
                    { x: x + w - cutSize, y: y - h + cutSize },
                    { x: x + w, y: y - h + cutSize },
                    { x: x + w, y: y - cutSize },
                    { x: x + w - cutSize, y: y - cutSize },
                    { x: x + w - cutSize, y: y },
                    { x: x + cutSize, y: y },
                    { x: x + cutSize, y: y - cutSize },
                    { x: x, y: y - cutSize },
                ];
                
                
                // this.barGraphics[i].context.poly(points).fill(color)
            } else {

                // this.barGraphics[i].context.rect(offsetX, offsetY, w, Math.max(1, h)).fill(color)
                
                // this.barGraphics[i].context = barContext
                
                
            }
            

            if(this.data.barsData[i]['collision']){
                const top = 15;
                if(h > top){
                    const height = Math.min(h-top, this.calcLength(340));
                    const crack = TilingSprite.from(this.crackAsset)
                    crack.tileScale = this.calcLength(90 / 180)
                    crack.x = this.calcLength(10)
                    crack.y = Math.max(y - (h - top), y - height)
                    crack.width = this.calcLength(90)
                    crack.height = height;
                    this.barGraphics[i].addChild(crack);
                }
            }


            if (i == this.data.collisionBarIndex) {
                if (curPrice > lastPrice) {
                    this.data.collisionY = lastY + this.topContainer.y
                } else {
                    this.data.collisionY = lastY + h + this.topContainer.y
                }
                this.data.flyingCoinY = this.data.collisionY - h
            }

            lastX = lastX + w + this.calcLength(2);
            if (curPrice < lastPrice) {
                lastY = lastY + h
            } else {
                if (per > 0) {
                    lastY = lastY - h
                }
            }

        } 
        moveTo(this.app, this.klineContainer, 0.2, {
            fromX: this.klineContainer.x,
            toX: this.klineContainer.x - (this.data.barWidth - this.calcLength(2))
        })
    }

    getDisplayBars = () => {
        let bars1s = this.data.bars1s;
        const lastIndex = bars1s.length - 1
        let displayBars: any[] = []
        let max: number = Math.max(bars1s[lastIndex][OPEN], bars1s[lastIndex][CLOSE])
        let min: number = Math.min(bars1s[lastIndex][OPEN], bars1s[lastIndex][CLOSE])
        for (let i = 0; i < bars1s.length ; i ++) {
            let bar = bars1s[i]
            max = Math.max(max, Number(bar[OPEN]), Number(bar[CLOSE]))
            min = Math.min(min, Number(bar[OPEN]), Number(bar[CLOSE]))
            displayBars.push(bar)
        }
        this.data.maxmin = (max - min) * 1.5;
        this.data.max = (max + min) / 2 + this.data.maxmin / 2;
        this.data.min = (max + min) / 2 - this.data.maxmin / 2;
        
        if (this.data.maxmin < DEFAULT_MAXMIN) {
            this.data.maxmin = DEFAULT_MAXMIN
            this.data.max = (max + min)/2 + DEFAULT_MAXMIN / 2;
            this.data.min = (max + min)/2 - DEFAULT_MAXMIN / 2;
        }
        
        return displayBars
    }

    updateProgress = () => {
        const cover = this.progressContainer.getChildByLabel("cover")
        const head = this.progressContainer.getChildByLabel("head")
        const scale = (MAX_COIN - this.data.curCoin) / MAX_COIN
        cover!.width = scale * this.calcLength(464)
        head!.x = cover!.width - this.calcLength(24)
        this.digits.text = MAX_COIN - this.data.curCoin
    }

    coinFlying = () => {
        this.addCoinGraph.y = this.data.flyingCoinY  - this.calcLength(39);
        this.addCoinGraph.visible = true;

        const totalTime = 0.8
        this.flyingCoin!.x = this.anim!.x
        this.flyingCoin!.y = this.data.flyingCoinY - this.calcLength(30)
        this.flyingCoin!.scale = 1;
        
        

        this.flyingCoin!.visible = true
        moveTo(
            this.app,
            this.flyingCoin,
            totalTime,
            {
                fromX: this.flyingCoin!.x,
                toX: this.calcLength(621),
                fromY: this.flyingCoin!.y,
                toY: this.calcLength(157)
            }
        )
        this.flyingCoin!.alpha = 0
        this.flyingCoin!.width = this.calcLength(30)
        this.flyingCoin!.height = this.calcLength(30)
        let remainTime = totalTime * 1000
        const tick = () => {
            const frames = totalTime * this.app.ticker.FPS
            const deltaAlpha = (1 - 0) / frames
            const deltaScale = 0.3 / frames
            this.flyingCoin!.alpha += deltaAlpha
            let scale = this.flyingCoin?.scale.x as number
            if (remainTime / (totalTime * 1000) > 0.5) {
                scale += deltaScale
            } else {
                scale -= deltaScale
            }
            this.flyingCoin!.scale = scale
            remainTime -= this.app.ticker.deltaMS
            if (remainTime <= 0) {
                this.addCoinGraph.visible = false;
                this.flyingCoin!.visible = false
                this.app.ticker.remove(tick)
            }
        }
        this.app.ticker.add(tick)
        
    }

    jump = async () => {
        if (this.data.jumpLock) {
            return
        }
        if (this.data.curCoin >= MAX_COIN || this.data.cd > 0) {
            this.events['changeModule']("coins-recharging")
            return
        }
        this.data.jumpLock = true
        this.anim!.visible = false
        this.jumpSprite!.visible = true
        let fromY = this.jumpSprite!.y
        let toY = this.data.collisionY
        let up = true
        const collisionBarIndex = this.data.collisionBarIndex
        let floatingBar = this.barGraphics[collisionBarIndex]
        
        let tick = () => {
            let deltaY = (toY - fromY) / (0.2 * this.app.ticker.FPS)
            if (up) {
                this.jumpSprite!.y += deltaY
                if (this.data.barsData[collisionBarIndex] && !this.data.barsData[collisionBarIndex].collision) {
                    if (this.checkCollision(this.jumpSprite!, floatingBar)) {
                        this.submitData()
                        this.updateProgress()
                        this.data.barsData[collisionBarIndex].collision = 1

                        
                        const w = this.barGraphics[collisionBarIndex].width;
                        const h = this.barGraphics[collisionBarIndex].height;
                        const y = this.barGraphics[collisionBarIndex]['fillStyle']['color'] == 16726630 ? h : 0;
                        const top = 15;
                        if(h > top){
                            const height = Math.min(h-top, this.calcLength(340));
                            const crack = TilingSprite.from(this.crackAsset)
                            crack.tileScale = this.calcLength(90 / 180)
                            crack.x = this.calcLength(10)
                            crack.y = Math.max(y - (h - top), y - height)
                            crack.width = this.calcLength(90)
                            crack.height = height;
                            this.barGraphics[collisionBarIndex].addChild(crack);
                        }
        

                        this.coinFlying()
                        moveTo(
                            this.app,
                            floatingBar,
                            0.05,
                            {
                                fromY: floatingBar.y,
                                toY: floatingBar.y - 5
                            }
                        )
                        this.data.barsData[collisionBarIndex].timeout = setTimeout(() => { 
                            let bar = floatingBar
                            this.data.barsData[collisionBarIndex].move = moveTo(
                                this.app,
                                bar,
                                0.05,
                                {
                                    fromY: bar.y,
                                    toY: bar.y + 5
                                }
                            )
                        }, 100)
                        up = false
                    }
                }
                if (this.jumpSprite!.y <= toY) {
                    up = false
                }

            } else {
                this.jumpSprite!.y -= deltaY
                if (this.jumpSprite!.y >= fromY) {
                    this.app.ticker.remove(tick)
                    this.jumpSprite!.y = this.anim!.y
                    this.anim!.visible = true
                    this.jumpSprite!.visible = false
                    this.data.jumpLock = false
                }
            }
            
        }
        this.app.ticker.add(tick)
    }

    checkCollision = (object1: any, object2: any) => {
        const bounds1 = object1.getBounds();
        const bounds2 = object2.getBounds();

        return (
            bounds1.x < bounds2.x + bounds2.width
            && bounds1.x + bounds1.width > bounds2.x
            && bounds1.y < bounds2.y + bounds2.height
            && bounds1.y + bounds1.height > bounds2.y
        );
    }

    setMarksGraph = () => {
        const k = this.data.maxmin / 9;
        for (let i = 0; i < this.markGraphics.length; i ++) {
          this.markGraphics[i].text = Math.floor((this.data.max - i * k) * 100) / 100;
        }
    }
}