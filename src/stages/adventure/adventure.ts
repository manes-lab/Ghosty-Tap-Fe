import {Container, Assets, Sprite, Graphics, GraphicsContext, Rectangle, AnimatedSprite,TextStyle } from 'pixi.js';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import api from '../../axios';
import { Block, moveTo, breathe } from '../../utils/pixi';
import * as Pomelo from '../../utils/pomelo';
import { formatTimestamp, formatNumber } from '../../utils/util';
import * as ws from '../../utils/websocket';
import { AdventureStageUI } from './ui';
import store from '../../redux/store';



const [TIME, OPEN, HIGH, LOW, CLOSE, CONFIRM] = [0, 1, 2, 3, 4, 8]
const LIMIT = 5

const DEFAULT_MAXMIN = {
    "BTC-USDT": 0.5,
    "ETH-USDT": 0.5,
    "TON-USDT": 0.5
}


export class AdventureStage extends AdventureStageUI {

    data = {
        address: '',
        state: null,
        gameId: '',
        instId: "BTC-USDT",
        gameStoped: false,
        toState: this.beforeChooseContainer,
        curState: this.beforeChooseContainer,
        coin: 0,
        roundStart: 0,
        barWidth: 20,
        maxmin: DEFAULT_MAXMIN['BTC-USDT'],
        max: 0,
        min: 0,
        selection: 0,
        selectStep: 0,
        curStep: 0,
        bars1s: [],
        barLock: false,
        strike: 0,
        lastPos: {
            x: 0,
            y: 0
        },
        loseLineY: -239,
    }
    

    constructor(options: any) {
        super();
        this.data.instId = options.instId;
        this.data.address = options.address;
    }

    load = async (elementId: string, preference: "webgl" | "webgpu" | undefined) => {
        // alert("1-load start")
        await super.load(elementId, preference)
        this.data.gameStoped = false
        this.initConnect();

        // alert("2-before  get_user_status")
        api.get_user_status({
            user_id:  this.data.address ,
        }).then((res) => {
            this.data.coin = res.data.coins;
            this.coinGraph.text = `${formatNumber(this.data.coin)}`
        })
        // alert("3-after  get_user_status")

        // await new Promise((resolve, reject) => {
        //     setTimeout(() => {
        //         resolve(1)
        //     }, 2000)
        // })

        ws.initWebSocket(this.data.instId, this.tick)

        // alert("4-after  initWebSocket")
        
        this.app.ticker.add(() => {
            if (this.data.toState != this.data.curState) {
                this.data.toState.visible = true
                this.data.curState.visible = false
                this.data.curState = this.data.toState
            }
        })
        // alert("5-load end")
        this.events["load"]();
    }
    

    destroy = async () => {
        this.data.gameStoped = true
        ws.close()
        Pomelo.leaveSpace();
        await super.destroy()
    }

    tick = (data: any) => {
        if (!data || this.data.gameStoped) {
            return;
        }
        
        let bar = data[0].map(Number)
        if (this.data.bars1s.length > 0 && bar[TIME] == this.data.bars1s[this.data.bars1s.length - 1][TIME]) {
            console.log("duplicated")
            return
        } else {
            if (this.data.bars1s.length == 0) {
                this.data.roundStart = bar[TIME]
            }
            this.data.bars1s.push(bar)
            this.dateGraph.text = formatTimestamp(bar[TIME], false);
        }
        let step = (bar[TIME] - this.data.roundStart) / 1000;
        this.data.curStep = step;
        if (step < LIMIT) {
            this.line.clear();
            this.setBarsGraph()
            this.setMarksGraph()
            if(step >= 3 && !this.data.selection){
                this.makeChoice('nobet');
            }
        }else if (step == LIMIT) {
            let bars1s = this.data.bars1s.slice(0,5);
            const curIndex = bars1s.length - 1
            const lastIndex = bars1s.length - 5
            let win = false
            if (((bars1s[lastIndex][OPEN] < bars1s[curIndex][CLOSE]) && (this.data.selection == 1)) || ((bars1s[lastIndex][OPEN] > bars1s[curIndex][CLOSE]) && (this.data.selection == -1))) { //win
                win = true

                this.data.strike += 1;
                
                setTimeout(() => {
                    let coin = 200;
                
                    if(this.data.strike > 1){
                        coin += this.getStrikeBonusRewards();
                    }
                    if(this.data.selectStep < 3){
                        coin += ((this.data.selectStep == 1 ? 100  : 50) * this.data.strike)
                    }
                    this.winCoinGraph.text = `+${coin}`;
                    setTimeout(() => {
                        this.coinValueChange(this.data.coin, coin);
                        this.data.coin += coin;
                    }, 500)

                    this.addBlock(true)
                }, 2000)

            }else if (this.data.selection == 0) { // no bet
                this.data.strike = 0;
                
            }else if(bars1s[lastIndex][OPEN] == bars1s[curIndex][CLOSE]){ //draw
                this.coinValueChange(this.data.coin, 100);
                this.data.coin += 100
            }else{ //lose
                this.data.strike = 0;
                setTimeout(() => {
                    this.addBlock(false)
                }, 2000)
            }

            this.submitData(bars1s[lastIndex][OPEN] , bars1s[curIndex][CLOSE], win);
            
            

            this.resultLine(bars1s[lastIndex][OPEN], bars1s[curIndex][CLOSE])
            this.checkStatus(bars1s[lastIndex][OPEN] , bars1s[curIndex][CLOSE]);

            setTimeout(() => {
                this.showResult(bars1s[lastIndex][OPEN] , bars1s[curIndex][CLOSE], win);
                if(this.data.strike > 1){
                    this.strikeGraph.text = `Win×${this.data.strike}`
                    this.strikeContainer.visible = true;
                    this.fireWallContainer.visible = true;
                    (this.strikeContainer.getChildByLabel("anim") as AnimatedSprite).play();
                    (this.fireWallContainer.getChildByLabel("left") as AnimatedSprite).play();
                    (this.fireWallContainer.getChildByLabel("right") as AnimatedSprite).play();
                }else{
                    this.strikeContainer.visible = false;
                    this.fireWallContainer.visible =false;
                    (this.strikeContainer.getChildByLabel("anim") as AnimatedSprite).stop();
                    (this.fireWallContainer.getChildByLabel("left") as AnimatedSprite).stop();
                    (this.fireWallContainer.getChildByLabel("right") as AnimatedSprite).stop();
                    const count = this.strikeChannelContainer.children.length
                    if (count > 0) {
                        (this.strikeChannelContainer.getChildAt(0) as Block).closeStrike()
                    }
                }
            }, 2000)
            setTimeout(() => {
                // this.data.roundStart = this.data.bars1s[this.data.bars1s.length - 1][TIME]
                //reset result
                this.line?.clear();
                this.startCircle.visible = false;
                this.endCircle.visible = false
                this.openInfoContainer.visible = false;
                this.closeInfoContainer.visible = false;
                this.finalWinContainer?.getChildByLabel('winanim')?.stop();

                this.data.bars1s = []
                this.data.selection = 0;
                this.data.toState = this.beforeChooseContainer;
                
                for (let i = 0; i < LIMIT; i ++) {
                    this.barGraphics[i].context = this.emptyBar
                }
            }, 4000)
        }

        this.updateCountDown(step);
        // this.countDownGraph.text = Math.max(5 - step, 0)
        this.resultCountDownGraph.text = 'Result in ' + Math.max(5 - step, 0) + ' s'
        

        //mail - battle Invitation notice
        this.data.state = store.getState()?.moduleSlice;
        this.mailContainer.getChildByLabel('mailMessage').visible = Boolean(this.data.state.hasNewInvitation);
    }

    initConnect = async () => {
        const tradingPairMap: {[key: string]: string} = {
            'btc': 'Bitcoin',
            'eth': 'Ethererum',
            'ton': 'Ton',
        }
        const token = tradingPairMap[this.data.instId.split("-")[0].toLowerCase()]
        const res = await api.create_game({
            type: "adventure",
            trading_pair: token
        })
        if (!res.success) {
            this.events["changeModule"]("reconnection");
            return
        }
        this.data.gameId = res.data._id
        await Pomelo.enterSpace("adventure", token);

        Pomelo.addListener("onAdd", (data: any) => { 
            data.space == 'adventure' && this.updateOnlinePlayers();
        })
        Pomelo.addListener("onLeave", (data: any) => { 
            this.updateOnlinePlayers();
        })

        // Pomelo.addListener("onPrice", (data: any) => {
        //     this.tick(data)
        // })

        this.updateOnlinePlayers();
    }

    updateOnlinePlayers = async () => {
        const res = await api.get_online_players({
            user_id: this.data.address,
            page: 0,
            limit: 3,
            type: 'adventure'
        });
        this.updatePlayersPanel(res?.data?.rank || [], res?.data?.count || 0);
    }

    submitData = (openValue:number, closeValue:number, isWin:boolean) => {
        let result = ''; //0 - fail, 1 - win, 2 - draw, 3 - no bet
        let isSuccess = isWin ? 1 : 0;
        if(openValue == closeValue){
            result = 'tie'
            isSuccess = 2;
        }else if(openValue < closeValue){
            result = 'Bullish'
        }else if(openValue > closeValue){
            result = 'Bearish'
        }

        if(this.data.selection == 0){
            isSuccess = 3;
        }
        Pomelo.submitData('adventure', {
            is_success: isSuccess,
            result,
            game_id: this.data.gameId,
            time : this.data.selectStep,
            timestamp: new Date().getTime(),
        }).then((res) => {
            
        })
    }

    getStrikeBonusRewards = () => {
        const STRIKE_BONUS = [0, 0, 50, 100, 200, 300, 400, 400, 400, 400]
        if(this.data.strike < 10){
            return STRIKE_BONUS[this.data.strike]
        }else if(this.data.strike >= 60){
            if(this.data.strike % 10 == 0){
                return 5800;
            }else{
                return 1100;
            }
        }else{
            if(this.data.strike % 10 == 0){
                return 800 + (this.data.strike / 10 - 1) * 1000;
            }else{
                return 500 + Math.floor(this.data.strike / 10) * 100;
            }
        }
    }

    updateCountDown = (step:number) => {
        if(step < 3){
            if(step == 0){
                this.clockGraph.text = '3';
            }else if(step == 1){
                this.clockGraph.text = '2';
            }else if(step == 2){
                this.clockGraph.text = '1';
            }
        }else{
            this.clockGraph.text = '3';
        }
    }

    coinValueChange = (startValue:number, increment:number) => {
        
        const totalTime = 1.2;
        let remainTime = totalTime * 1000
        const endValue = startValue + increment;

        breathe(
            this.app,
            this.mainTopCoinContainer,
            1.2, //totalTime
            2, // totalViews
            {
                minScale: 0.97,
                maxScale: 1.04,
            }
        )

        const tick = () => {
            const frames = totalTime * this.app.ticker.FPS

            const deltaValue = increment / frames
            this.coinGraph.text = `${formatNumber(Math.round(startValue += deltaValue))}`
            remainTime -= this.app.ticker.deltaMS
            if (remainTime <= 0) {
                this.coinGraph.text = `${formatNumber(Math.round(endValue))}`
                this.app.ticker.remove(tick);
            }
        }
        this.app.ticker.add(tick)
    }

    coinReduceFlying = () => {
        this.coinReduceContainer.y = this.calcLength(100);
        this.coinReduceContainer.visible = true

        const totalTime = 0.4
        moveTo(
            this.app,
            this.coinReduceContainer,
            totalTime,
            {
                fromX: this.coinReduceContainer!.x,
                toX: this.coinReduceContainer!.x,
                fromY: this.coinReduceContainer!.y,
                toY: this.coinReduceContainer!.y + this.calcLength(80)
            }
        )
        this.coinReduceContainer!.alpha = 1
        let remainTime = totalTime * 1000
        const tick = () => {
            const frames = totalTime * this.app.ticker.FPS
            const deltaAlpha = (1 - 0.5) / frames
            this.coinReduceContainer!.alpha -= deltaAlpha
            remainTime -= this.app.ticker.deltaMS
            if (remainTime <= 0) {
                this.coinReduceContainer!.visible = false
                this.app.ticker.remove(tick);
            }
        }
        this.app.ticker.add(tick)
        
    }

    earlyBounsFlying = (choice:string) => {
        const coinCount = ((this.data.selectStep == 1 ? 100  : 50) * (this.data.strike + 1));
        const coins = this.earlyBounsContainer.getChildByLabel("coins")
        coins!.text = `+${coinCount}`;
        
        this.earlyBounsContainer.x = choice == 'bullish' ? this.calcLength(24 + 145) : this.calcLength(400 + 145);
        this.earlyBounsContainer.y = this.app.screen.height - this.calcLength(247) - this.calcLength(131);
        this.earlyBounsContainer.scale = 0;
        this.earlyBounsContainer!.alpha = 1
        this.earlyBounsContainer.visible = true;

        const totalTime = 0.25
        moveTo(
            this.app,
            this.earlyBounsContainer,
            totalTime,
            {
                fromX: this.earlyBounsContainer!.x,
                toX: this.earlyBounsContainer!.x,
                fromY: this.earlyBounsContainer!.y,
                toY: this.earlyBounsContainer!.y - this.calcLength(100)
            }
        )
        
        let remainTime = totalTime * 1000
        const tick = () => {
            const frames = totalTime * this.app.ticker.FPS
            // const deltaAlpha = (1 - 0.5) / frames
            // this.earlyBounsContainer!.alpha -= deltaAlpha
            const deltaScale = 1 / frames
            this.earlyBounsContainer!.scale =  this.earlyBounsContainer!.scale.x + deltaScale
            remainTime -= this.app.ticker.deltaMS
            if (remainTime <= 0) {
                this.app.ticker.remove(tick);
                setTimeout(() => {
                    this.earlyBounsFlyingHide();
                }, 800)
            }
        }
        this.app.ticker.add(tick)
        
    }

    earlyBounsFlyingHide = () => {
        const totalTime = 0.25
        this.earlyBounsContainer!.alpha = 1
        let remainTime = totalTime * 1000
        const tick = () => {
            const frames = totalTime * this.app.ticker.FPS
            const deltaAlpha = (1 - 0.5) / frames
            this.earlyBounsContainer!.alpha -= deltaAlpha
            remainTime -= this.app.ticker.deltaMS
            if (remainTime <= 0) {
                this.app.ticker.remove(tick);
                this.earlyBounsContainer!.visible = false
            }
        }
        this.app.ticker.add(tick)
    }

    updatePlayersPanel = async (arr:Array<any>, count:number) => {
        this.playerGraph.text = count;
        this.playerAvatarContainer.removeChildren();
        this.playerAvatarContainer.boundsArea = new Rectangle(0, 0, this.calcLength(72 +  43 * (arr.length - 1)), this.calcLength(72));
        this.playerAvatarContainer.x = this.calcLength(43 * (3 - arr.length));
        for(let i = arr.length - 1; i >= 0; i--){
            const user = arr[i];
            const imgAvatar = await Assets.load(`${window.location.origin}/img/avatar${user.avatar || 1}.png`);
            const avatar = Sprite.from(imgAvatar);
            avatar.width = this.calcLength(72);
            avatar.height = this.calcLength(72);
            avatar.x = this.calcLength(43 * i);
            avatar.y = this.calcLength(0);
            this.playerAvatarContainer.addChild(avatar);
        }
    }

    playLoseAnim = () => {
        this.loseLineContainer.y = this.calcLength(-240);
        moveTo(this.app, this.loseLineContainer, 0.6, {
            fromY: this.loseLineContainer.y,
            toY: -3
        })
    }

    makeChoice = (choose:string) => {
        this.data.selectStep = this.data.curStep >= 9 ? 1 : (this.data.curStep + 1);
        this.data.selectStep < 3 && this.earlyBounsFlying(choose);
        this.data.selectStep <= 3 && this.coinReduceFlying();

        if(choose != 'nobet'){
            console.log(this.data.coin, this.data.coin < 100)
            if(this.data.coin < 100){
                this.events["changeModule"]("insufficient-balance");
                return;
            }
            this.coinValueChange(this.data.coin, -100);
            this.data.coin -= 100;
            
        }
        
        const choiceMap:any = {//"NO BET",//YOUR CHOICE
            "bearish" : {
                selection: -1,
                title: "YOUR CHOICE",
                info: "Bearish",
                style: new TextStyle({
                    fill: '#FF3A66',
                    fontFamily: 'SourceCodePro-Semibold',
                    fontSize: this.calcLength(34),
                })
            },
            "nobet" : {
                selection: 0,
                title: "NO BET",
                info: "You did not place a bet",
                style: new TextStyle({
                    fill: '#FFFFFF',
                    fontFamily: 'SourceCodePro-Semibold',
                    fontSize: this.calcLength(34),
                })
            },
            "bullish" : {
                selection: 1,
                title: "YOUR CHOICE",
                info: "Bullish",
                style: new TextStyle({
                    fill: '#73FF4E',
                    fontFamily: 'SourceCodePro-Semibold',
                    fontSize: this.calcLength(34),
                })
            },
        }
        this.data.selection = choiceMap[choose]['selection'];
        // this.yourChoiceTitleGraph.text = choiceMap[choose]['title'];
        // this.yourChoiceInfoGraph.text = choiceMap[choose]['info'];
        // this.yourChoiceInfoGraph.style = choiceMap[choose]['style'];
        if(choose == 'bullish'){
            this.chooseBullishContainer.visible = true;
            this.chooseBearishContainer.visible = false;
            this.chooseNobetContainer.visible = false;
        }else if(choose == 'bearish'){
            this.chooseBullishContainer.visible = false;
            this.chooseBearishContainer.visible = true;
            this.chooseNobetContainer.visible = false;
        }else if(choose == 'nobet'){
            this.chooseBullishContainer.visible = false;
            this.chooseBearishContainer.visible = false;
            this.chooseNobetContainer.visible = true;
        }
        this.data.toState = this.afterChooseContainer;
    }

    checkStatus = (openValue:number, closeValue:number) => {
        if(openValue == closeValue){
            this.data.toState = this.resultNeutralContainer;
        }else if(openValue < closeValue){
            this.data.toState = this.resultBullishContainer;
        }else if(openValue > closeValue){
            this.data.toState = this.resultBearishContainer;
        }
    }

    showResult = (openValue:number, closeValue:number, isWin:boolean) => {
        if(isWin){
            this.data.toState = this.finalWinContainer;
            this.finalWinContainer?.getChildByLabel('winanim')?.play();
            this.playFlyingCoins()
        }else if(this.data.selection == 0){
            this.data.toState = this.finalNobetContainer;
        }else if(openValue == closeValue){
            this.data.toState = this.finalDrawContainer;
        }else{
            this.playLoseAnim();
            this.data.toState = this.finalLoseContainer;
        }
    }

    playFlyingCoins = () => {
        const tick = () => {
            let limitCount = Math.random() * 10
            let count = 0
            for (let coin of this.flyingCoins) {
                if (count > limitCount) {
                    break
                }
                if (coin.alpha <= 0) {
                    count += 1
                    coin.alpha = 1
                    coin.x = Math.random() * this.calcLength(500) + this.calcLength(100)
                    coin.y = this.app.screen.height - this.calcLength(280 + 40)
                    const time = (Math.random() + 0.5) * 0.66;
                    moveTo(this.app, coin, time, {
                        fromX:coin.x,
                        toX: this.calcLength(553),
                        fromY: coin.y,
                        toY: this.calcLength(343)
                    }, (frames: number) => {
                        let delta = (1 - 0) / frames
                        coin.alpha = coin.alpha - delta
                    })
                }
            }
        }
        let interval = setInterval(tick, 20)
        setTimeout(() => {clearInterval(interval)}, 1000)
    }

    setMarksGraph = () => {
        const K = this.data.instId == 'TON-USDT' ? 1000 : 100;
        const k = this.data.maxmin / 9;
        for (let i = 0; i < this.markGraphics.length; i ++) {
          this.markGraphics[i].text = Math.floor((this.data.max - i * k) * K) / K;
        }
    }

    setBarsGraph = () => {
        this.klineContainer.x = this.calcLength(52);

        let bars = this.getDisplayBars()
        let lastX = this.klineContainer.width - (bars.length - 1) * this.data.barWidth;
        let lastY = this.klineContainer.height / 2
        
        for (let i = 0; i < bars.length; i++) {
            const bar = bars[i]
            const curPrice = bar[CLOSE]
            const lastPrice = i > 0 ? bars[i - 1][CLOSE] : bar[OPEN]
            let per = Math.abs(curPrice - lastPrice) / this.data.maxmin

            let w = this.data.barWidth
            let h = Math.floor(this.klineContainer.height * per)
            // h = Math.max(1, h)
            let color = 0xB14430;
            let offsetX = 0
            let offsetY = 0
            if (curPrice > lastPrice) {
                color = 0x568F45;
                offsetY = -h
            }
            i == 0 && (lastY = (this.data.max - bar[OPEN]) / this.data.maxmin * this.klineContainer.height);

            if (h >= 11) {
                const cutSize = 5;
                const x = 0
                let y = 0
                if(curPrice < lastPrice){
                    y = h;
                }
                const points = [
                    {x: x, y: y - cutSize},
                    {x: x, y: y - h + cutSize},
                    {x: x + cutSize, y: y - h + cutSize},
                    {x: x + cutSize, y: y - h},
                    {x: x + w - cutSize, y: y - h},
                    {x: x + w - cutSize, y: y - h + cutSize},
                    {x: x + w, y: y - h + cutSize},
                    {x: x + w, y: y - cutSize},
                    {x: x + w - cutSize, y: y - cutSize},
                    {x: x + w - cutSize, y: y},
                    {x: x + cutSize, y: y},
                    {x: x + cutSize, y: y - cutSize},
                    {x: x, y: y - cutSize},
                ];

                let barContext = new GraphicsContext();
                barContext.poly(points);
                barContext.fill(color);
                this.barGraphics[i].context = barContext;
            } else {
                let barContext = new GraphicsContext().rect(offsetX, offsetY, w, Math.max(1, h)).fill(color)
                this.barGraphics[i].context = barContext
            }
            this.barGraphics[i].x = lastX
            this.barGraphics[i].y = lastY

            
            
            lastX = lastX + w + this.calcLength(2);
            if (curPrice < lastPrice) {
                lastY = lastY + h
            } else {
                if (per > 0) {
                    lastY = lastY - h
                }
            }
        } 

        this.data.lastPos = {
            x: lastX,
            y: lastY
        }
        

        moveTo(this.app, this.klineContainer, 0.2, {
            fromX: this.klineContainer.x,
            toX: this.klineContainer.x - (this.data.barWidth - this.calcLength(2))
        })
    }

    getDisplayBars = () => {
        let bars1s = this.data.bars1s.slice(0, 5)
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
        
        const defaultMaxmin = DEFAULT_MAXMIN[this.data.instId];
        if (this.data.maxmin < defaultMaxmin) {
            this.data.maxmin = defaultMaxmin
            this.data.max = (max + min)/2 + defaultMaxmin / 2;
            this.data.min = (max + min)/2 - defaultMaxmin / 2;
        }
        
        return displayBars
    }

    resultLine = async (openValue, closeValue) => {
        let openBar = this.barGraphics[0]
        const fromX = openBar.x + this.data.barWidth / 2
        const fromY = openBar.y
        const toX = this.data.lastPos.x - (this.data.barWidth / 2)
        const toY = this.data.lastPos.y
        this.line.zIndex = 10

        let color = toY > fromY ? 0xB14430 : 0x568F45;
        // this.startCircle.circle(fromX, fromY, 6).fill(0xCCC18E);

    
        this.startCircle.x = fromX - this.calcLength(16);
        this.startCircle.y = fromY - this.calcLength(16);
        this.startCircle.visible = true;
        this.startCircle.zIndex = 11;
        // this.mainContainer.addChild(this.startCircle);

        // this.endCircle.circle(toX, toY, 6).fill(0xCCC18E);
        this.endCircle.x = toX - this.calcLength(16);
        this.endCircle.y = toY - this.calcLength(16);
        this.endCircle.visible = true;
        this.endCircle.zIndex = 11;
        // this.mainContainer.addChild(this.endCircle);

        this.openInfoContainer.x = this.calcLength(56);
        this.openInfoContainer.y = Math.min(fromY + this.calcLength(40), this.mainContainer.height - this.calcLength(86));
        this.openValueGraph.text = openValue;
        this.openInfoContainer.visible = true;


        this.closeInfoContainer.x = this.calcLength(426);
        this.closeInfoContainer.y = Math.min(toY + this.calcLength(40), this.mainContainer.height - this.calcLength(86));
        this.closeValueGraph.text = closeValue
        this.closeInfoContainer.visible = true;

        
        let curX = fromX
        let curY = fromY
        let remainTime = 1 * 1000
        let tick = () => {
            this.line?.clear();
            let frames = 1 * this.app.ticker.FPS
            let deltaX = (toX - fromX) / frames
            let deltaY = (toY - fromY) / frames
            curX += deltaX
            curY += deltaY
            curX = Math.min(curX, toX)
            if(toY < fromY){
                curY = Math.max(curY, toY)
            }else{
                curY = Math.min(curY, toY)
            }

            this.line.moveTo(fromX, fromY)
            this.line.lineTo(curX, curY)
            this.line.stroke({ width: 4, color: 0xCCC18E});
            
            remainTime -= this.app.ticker.deltaMS
            if (remainTime <= 0) {
                this.app.ticker.remove(tick)
            }
        }
        this.app.ticker.add(tick)
    }

    addBlock = (win: boolean) => {
        const block = new Block(this.app, win, this.winFireAsset, this.particlesAsset)
        const count = this.strikeChannelContainer.children.length
        // if (count == 2 && this.clockContainer.y == (this.app.screen.height - this.calcLength(280 + 40 + 102))) {
        //     this.clockContainer.y -= this.calcLength(114 - 2)
        // }
        const lastBlock = this.strikeChannelContainer.children[0] as Block | undefined
        let toX = - (this.calcLength(24 + 100))
        if (lastBlock) {
            toX = lastBlock.x - (this.calcLength(24 + 100))
        }
        let fromX =  -this.app.screen.width - (this.calcLength(24 + 100))
        this.strikeChannelContainer.addChildAt(block, 0)
        if (this.data.strike <= 1) {
            moveTo(this.app, this.strikeChannelContainer, 0.3, {
                fromX: this.strikeChannelContainer.x,
                toX: Math.abs(toX) + this.calcLength(40)
            })
            fromX = toX - 2 * (this.calcLength(24 + 100))
            
            lastBlock?.closeStrike()
        } else {
            toX = lastBlock!.x
            fromX = toX - (this.calcLength(24 + 100))
            const tick = () => {
                const bounds1 = block.getBounds();
                const bounds2 = lastBlock!.getBounds();

                const collision = (
                    bounds1.x < bounds2.x + bounds2.width
                    && bounds1.x + bounds1.width > bounds2.x
                    && bounds1.y < bounds2.y + bounds2.height
                    && bounds1.y + bounds1.height > bounds2.y
                );
                if (collision) {
                    lastBlock!.playParticles()
                    this.app.ticker.remove(tick)
                }
            }
            this.app.ticker.add(tick)
            setTimeout(() => {
                lastBlock?.addWin()
                this.strikeChannelContainer.removeChildAt(0)
                block.visible = false
                block.destroy()
            }, 600)
        }
        block.x = fromX
        moveTo(this.app, block, 0.5, {
            fromX,
            toX
        })
    }

   
}