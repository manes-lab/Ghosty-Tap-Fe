import {Container, Assets, Sprite, Graphics, GraphicsContext, BitmapText, Rectangle, AnimatedSprite,TextStyle } from 'pixi.js';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import api from '../../axios';
import { Block, moveTo, breathe } from '../../utils/pixi';
import * as Pomelo from '../../utils/pomelo';
import { formatTimestamp, formatNumber, padZero } from '../../utils/util';
import * as ws from '../../utils/websocket';
import { BattleStageUI } from './ui';
import store from '../../redux/store';


const [TIME, OPEN, HIGH, LOW, CLOSE, CONFIRM] = [0, 1, 2, 3, 4, 8]
const LIMIT = 5

const DEFAULT_MAXMIN = {
    "BTC-USDT": 0.5,
    "ETH-USDT": 0.5,
    "TON-USDT": 0.5
}


export class BattleStage extends BattleStageUI {

    data = {
        address: "",
        state: null,
        gameId: '',
        userId: '',
        instId: "BTC-USDT",
        rewards: 0,
        preparedBars: [],
        popupBars: [],
        battleResults: [],
        antagonistResults: [],
        ready: false,
        antagonistReady: false,
        gameStoped: true,
        toClockCount: this.clockZeroContainer,
        curClockCount: this.clockZeroContainer,
        toState: this.beforeChooseContainer,
        curState: this.beforeChooseContainer,
        myAvatarIndex: 1,
        user: {},
        coin: 0,
        antagonistCoin: 0,
        roundStart: 0,
        barWidth: 20,
        maxmin: DEFAULT_MAXMIN['BTC-USDT'],
        max:0,
        min:0,
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
        settlement: false,
        interval: -1
    }
    

    constructor(options: any) {
        super();
        this.data.address = options.address
        console.log(options, '---options---');
        this.data.rewards = options.coins;
        this.data.instId = options.instId;
        this.data.gameId = options._id;
        this.data.userId = this.data.address == options.be_invite_user_id ? options.invite_user_id : options.be_invite_user_id;
        // this.data.preparedBars = options.data.bars

        this.data.myAvatarIndex = 1 //options.profile.avatar;
    }

    load = async (elementId: string, preference: "webgl" | "webgpu" | undefined) => {
        const bars_res = await api.get_battle_bars({
            battle_id: this.data.gameId
        });
        this.data.preparedBars = bars_res.data;

        this.data.popupBars = this.data.preparedBars[0]
        for (let i = 0; i < 4; i ++) {
            this.data.popupBars.push([0, 0, 0, 0, 0])
        }
        this.initConnect();
        await super.load(elementId, preference)
        this.initMenuInfo();

        this.app.ticker.add(() => {
            if (this.data.toState != this.data.curState) {
                this.data.toState.visible = true
                this.data.curState.visible = false
                this.data.curState = this.data.toState
            }
            if(this.data.toClockCount){
                if (this.data.toClockCount != this.data.curClockCount) {
                    this.data.toClockCount.visible = true
                    this.data.curClockCount.visible = false
                    this.data.curClockCount = this.data.toClockCount
                }
            }else{
                this.data.curClockCount.visible = false
            }
            
        })
        
        let checkReady = () => {
            if (this.data.ready && this.data.antagonistReady) {
                this.app.ticker.remove(checkReady)
                
                this.data.gameStoped = false
                this.events["load"]();
                this.clockContainer.visible = true
                let step = 5
                let loadingCountDown = () => {
                    console.log(step)
                    this.clockContainer.visible = true;
                    switch (step) {
                        case 5:
                            this.data.toClockCount = this.clockFiveContainer;
                            break
                        case 4:
                            this.data.toClockCount = this.clockFourContainer;
                            break
                        case 3:
                            this.data.toClockCount = this.clockThreeContainer;
                            break
                        case 2:
                            this.data.toClockCount = this.clockTwoContainer;
                            break
                        case 1:
                            this.data.toClockCount = this.clockOneContainer;
                            break
                        default:
                            this.data.toClockCount = null;
                            this.clockContainer.visible = false;
                            this.loadingBoardContainer.visible = false
                            this.beforeChooseContainer.visible = true
                            // this.tick()
                            this.data.interval = setInterval(this.tick, 1000)
                            break
                    }
                    if (step > 0) {
                        step -= 1
                        setTimeout(loadingCountDown, 1000)
                    }
                }
                loadingCountDown()
            }
        }
        // this.events["load"](); //----test
        this.app.ticker.add(checkReady)
        this.data.ready = true
        Pomelo.readyForBattle(this.data.gameId)
    }
    

    destroy = async () => {
        this.data.gameStoped = true
        clearInterval(this.data.interval)
        Pomelo.leaveBattle(this.data.gameId)
        Pomelo.leaveSpace();
        await super.destroy()
    }

    tick = () => {
        console.log(this.data.gameStoped, this.data.settlement)
        if (this.data.gameStoped) {
            if (this.data.settlement) {
                // ws.close()
                this.events['showBattleResult']({_id: this.data.gameId})
            }
            return
        }

        // let step = LIMIT + 4 - this.data.popupBars.length
        let step = this.data.curStep
        if (this.data.popupBars.length > 0) {
            let bar = this.data.popupBars.shift()!.map(Number)
            this.data.bars1s.push(bar)
        }
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
            let result:number = 0;
            console.log(bars1s)
            if (((bars1s[lastIndex][OPEN] < bars1s[curIndex][CLOSE]) && (this.data.selection == 1)) || ((bars1s[lastIndex][OPEN] > bars1s[curIndex][CLOSE]) && (this.data.selection == -1))) { //win
                result = 1;
                win = true

                this.data.strike += 1;
                
                setTimeout(() => {
                    let coin = 100;
                
                    if(this.data.strike > 1){
                        coin += this.getStrikeBonusRewards();
                    }
                    if(this.data.selectStep < 3){
                        coin += ((this.data.selectStep == 1 ? 100  : 50) * this.data.strike)
                    }
                    this.winCoinGraph.text = `+${coin}`;
                    // setTimeout(() => {
                    //     this.coinValueChange(this.data.coin, coin, this.myScoreNumsText);
                    //     this.data.coin += coin;
                    // }, 500)

                    this.addBlock(true)
                }, 2000)

            }else if (this.data.selection == 0) { // no bet
                this.data.strike = 0;
                
            }else if(bars1s[lastIndex][OPEN] == bars1s[curIndex][CLOSE]){ //draw
                result = 3;
                // this.coinValueChange(this.data.coin, 100);
            }else{ //lose
                result = 2;
                
                this.data.strike = 0;
                // this.data.coin > 100 && this.coinValueChange(this.data.coin, -100);
                // this.data.coin = Math.max(this.data.coin - 100, 0);
                setTimeout(() => {
                    this.addBlock(false)
                }, 2000)
            }
            this.submitData(bars1s[lastIndex][OPEN] , bars1s[curIndex][CLOSE], win, result);
            
            

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
                //reset result
                if (this.data.battleResults.length < 10) {
                    this.data.popupBars = this.data.preparedBars[this.data.battleResults.length]
                } 
                this.line?.clear();
                this.startCircle?.clear();
                this.endCircle?.clear();
                this.lineTopBorder?.clear();
                this.lineBottomBorder?.clear();
                this.openInfoContainer.visible = false;
                this.closeInfoContainer.visible = false;
                this.resultWinContainer?.getChildByLabel('winanim')?.stop();

                this.data.bars1s = []
                this.data.selection = 0;
                this.data.toState = this.beforeChooseContainer;
                
                for (let i = 0; i < LIMIT; i ++) {
                    this.barGraphics[i].context = this.emptyBar
                }

                if (this.data.battleResults.length >= 10) {
                    this.data.gameStoped = true;
                    this.waitingBattleResultContainer.visible = true;
                }
            }, 4000)
        }
        

        this.updateCountDown(step);
        this.resultCountDownGraph.text = Math.max(5 - step, 0) + 's'

        //mail - battle Invitation notice
        this.data.state = store.getState()?.moduleSlice;
        this.mailContainer.getChildByLabel('mailMessage').visible = Boolean(this.data.state.hasNewInvitation);
        this.data.curStep += 1
        if (this.data.curStep >= 10) {
            this.data.curStep = 0
        }
    }

    initMenuInfo = async () => {
        const tradingPair = this.bannerContainer.getChildByLabel('tradingPair') as Text;
        tradingPair.text = this.data.instId.replace("-", "/");


        const rewards = this.rewardsContainer.getChildByLabel('rewards') as Text;
        rewards.text = formatNumber(this.data.rewards);
        rewards.x = (this.calcLength(750 - 42) - rewards.width) / 2;

        const coinIcon = this.rewardsContainer.getChildByLabel('coinIcon') as Sprite;
        coinIcon.x = rewards.x + rewards.width + this.calcLength(12);

        

        api.get_user_status({
            user_id: this.data.address,
        }).then((res) => {
            this.data.myAvatarIndex = 1  //res.data.user.avatar
        })


        api.get_user_status({
            user_id: this.data.userId
        }).then(async (res) => {
            if(res.data?.user){
                const userName = res.data?.user?.user_id?.slice(-6) || ''
                const text = this.bannerContainer.getChildByLabel('antagonistName') as Text;
                text.text = userName.length > 10 ? (userName.slice(0, 7) + '...') : userName;


                //antagonist avatar
                const antagonistAvatarImg = await Assets.load(`${window.location.origin}/images/avatar${res.data?.user?.avatar}.png`);
                const antagonistAvatar = Sprite.from(antagonistAvatarImg);
                antagonistAvatar.width = this.calcLength(80);
                antagonistAvatar.height = this.calcLength(80);
                antagonistAvatar.x = this.calcLength(630);
                antagonistAvatar.y = this.calcLength(28);
                this.bannerContainer.addChild(antagonistAvatar);
            }
        }).catch(async () => {
            const text = this.bannerContainer.getChildByLabel('antagonistName') as Text;
            text.text = this.data.userId


            //antagonist avatar
            const antagonistAvatarImg = await Assets.load(`${window.location.origin}/images/avatar1.png`);
            const antagonistAvatar = Sprite.from(antagonistAvatarImg);
            antagonistAvatar.width = this.calcLength(80);
            antagonistAvatar.height = this.calcLength(80);
            antagonistAvatar.x = this.calcLength(630);
            antagonistAvatar.y = this.calcLength(28);
            this.bannerContainer.addChild(antagonistAvatar);
        })
    }

    initConnect = async () => {
        Pomelo.addListener('battleReady', (msg: any) => {
            console.log("----battleReady------");
            if (msg.battle_id != this.data.gameId) {
                return
            }
            this.data.antagonistReady = true
        })
        Pomelo.addListener('battleOver', (msg: any) => {
            console.log(msg, "battleOver")
            if (msg.battle_id != this.data.gameId) {
                return
            }
            this.data.settlement = true
            if (msg.reason == "leave") {
                this.data.gameStoped = true
            }
        })
        Pomelo.addListener('battleStep', (msg: any) => {
            console.log(msg)
            if (msg.battle_id != this.data.gameId) {
                return
            }
            let result = 0
            if(msg.result == 'tie'){
                result = 3;
            }else{
                if (msg.is_success == 1) {
                    result = 1
                } else if (msg.is_success == 0) {
                    result = 2
                }
            }
            this.data.antagonistResults.push(result)
            this.setBattleResultsGraph(false)
            this.coinValueChange(this.data.antagonistCoin, msg.coins - this.data.antagonistCoin, this.antagonistScoreNumsText);
            this.data.antagonistCoin = msg.coins
            
        })
        // this.events['changeModule']("battle-settings")
        // const tradingPairMap: {[key: string]: string} = {
        //     'btc': 'Bitcoin',
        //     'eth': 'Ethererum',
        //     'ton': 'Ton',
        // }
        // await Pomelo.enterSpace("battle", tradingPairMap[this.data.instId.split("-")[0].toLowerCase()]);
    }

    submitData = (openValue:number, closeValue:number, isWin:boolean, flag: number) => {
        let result = '';
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
        
        Pomelo.submitData('battle', {
            is_success: isSuccess,
            result,
            battle_id: this.data.gameId,
            time : this.data.selectStep,
            timestamp: new Date().getTime(),
        }).then((res: any) => {
            if (res.msg == 'game over') {
                this.data.settlement = true
                return
            }
            this.data.battleResults.push(flag);
            setTimeout(() => {
                this.coinValueChange(this.data.coin, res.data.coins - this.data.coin, this.myScoreNumsText);
                this.data.coin = res.data.coins
                this.setBattleResultsGraph(true);
            }, 2000)
            
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
                this.data.toClockCount = this.clockThreeContainer;
                // this.clockThreeContainer.visible = true;
            }else if(step == 1){
                this.data.toClockCount = this.clockTwoContainer;
                // this.clockThreeContainer.visible = false;
                // this.clockTwoContainer.visible = true;
            }else if(step == 2){
                this.data.toClockCount = this.clockOneContainer;
                // this.clockTwoContainer.visible = false;
                // this.clockOneContainer.visible = true;
            }
            this.clockContainer.visible = true;
        }else{
            if(step == 3){
                this.data.toClockCount = this.clockZeroContainer;
                // this.clockOneContainer.visible = false;
                // this.clockZeroContainer.visible = true;
            }else{
                this.data.toClockCount = null;
                // this.clockZeroContainer.visible = false;
                this.clockContainer.visible = false;
            }
        }
    }

    coinValueChange = (startValue:number, increment:number, scoreObjects: BitmapText[]) => {
        const totalTime = 1.2;
        let remainTime = totalTime * 1000
        const endValue = Math.max(startValue + increment, 0);

        let score;
        const tick = () => {
            const frames = totalTime * this.app.ticker.FPS

            const deltaValue = endValue ? increment / frames : 0;
            score = Math.round(startValue += deltaValue)
            remainTime -= this.app.ticker.deltaMS
            this.setScoreboardGraph(score, scoreObjects);
            if (remainTime <= 0) {
                score  = Math.round(endValue)
                this.setScoreboardGraph(score, scoreObjects);
                this.app.ticker.remove(tick);
            }
        }
        this.app.ticker.add(tick)
    }

    earlyBounsFlying = (choice:string) => {
        const coinCount = ((this.data.selectStep == 1 ? 100  : 50) * (this.data.strike + 1));
        const coins = this.earlyBounsContainer.getChildByLabel("coins")
        coins!.text = `+${coinCount}`;
        
        this.earlyBounsContainer.x = choice == 'bullish' ? this.calcLength(70 + 145) : this.calcLength(390 + 145);
        this.earlyBounsContainer.y = this.app.screen.height - this.calcLength(280 + 40) + this.calcLength(128);
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

    playLoseAnim = () => {
        this.loseLineContainer.y = this.calcLength(-240);
        moveTo(this.app, this.loseLineContainer, 0.6, {
            fromY: this.loseLineContainer.y,
            toY: -3
        })
    }

    makeChoice = (choose:string) => {
        this.data.selectStep = this.data.curStep >= LIMIT ? 1 : (this.data.curStep + 1);
        this.data.selectStep < 3 && this.earlyBounsFlying(choose);

        // if(choose != 'nobet' && this.data.coin >= 100){
        //     this.coinValueChange(this.data.coin, -100, this.myScoreNumsText);
        //     this.data.coin -= 100;
        // }
        
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
        this.yourChoiceTitleGraph.text = choiceMap[choose]['title'];
        this.yourChoiceInfoGraph.text = choiceMap[choose]['info'];
        this.yourChoiceInfoGraph.style = choiceMap[choose]['style'];
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
            this.data.toState = this.resultWinContainer;
            this.resultWinContainer?.getChildByLabel('winanim')?.play();
        }else if(this.data.selection == 0){
            this.data.toState = this.resultNoBetContainer;
        }else if(openValue == closeValue){
            this.data.toState = this.resultDrawContainer;
        }else{
            this.playLoseAnim();
            this.data.toState = this.resultLoseContainer;
        }
    }

    setMarksGraph = () => {
        const K = this.data.instId == 'TON-USDT' ? 1000 : 100;
        const k = this.data.maxmin / 9;
        for (let i = 0; i < this.markGraphics.length; i ++) {
          this.markGraphics[i].text = Math.floor((this.data.max - i * k) * K) / K;
        }
    }

    setScoreboardGraph = (score, scoreObjects: BitmapText[]) => {
        const scoreArr = padZero(score).split("")
        for (let i = 0; i < 5; i++) {
            scoreObjects[i]['text'] = scoreArr[i];
        }
    }

    setBattleResultsGraph = (me = true) => {

        const colorArr = ['rgba(0, 0, 0, 0.3)', '#61D642', '#FF3A66', '#A9A9A9'] 
        //0 - no bet, 1 - win, 2 - lose, 3 - draw
        //0 - fail, 1 - win, 2 - draw, 3 - no bet   server
        // [0xFF3A66, 0x61D642, #A9A9A9, 0x0000004D]//00000004D
        const w = this.calcLength(10);
        const h = this.calcLength(10);
        const cutSize = this.calcLength(2);
        const points = [
            {x: 0, y: cutSize},
            {x: 0, y: h - cutSize},
            {x: cutSize, y: h - cutSize},
            {x: cutSize, y: h},
            {x: w - cutSize, y: h},
            {x: w - cutSize, y: h - cutSize},
            {x: w, y: h - cutSize},
            {x: w, y: cutSize},
            {x: w - cutSize, y: cutSize},
            {x: w - cutSize, y: 0},
            {x: cutSize, y: 0},
            {x: cutSize, y: cutSize},
            {x: 0, y: cutSize},
        ];

        for (let i = 0; i < 10; i++) {
            if (me) {
                let myResultColor = colorArr[this.data.battleResults[i] || 0];
                let myResultContext = new GraphicsContext();
                myResultContext.poly(points);
                myResultContext.fillStyle = myResultColor;
                myResultContext.fill();//.rect(0, 0 ,w, h)
                this.myBattleResultsGraphics[i].context = myResultContext;
                this.myBattleResultsGraphics[i].x = this.calcLength(14 * i);
            } else {
                let antagonistResultColor = colorArr[this.data.antagonistResults[i] || 0];
                let antagonistResultContext = new GraphicsContext();
                antagonistResultContext.poly(points);
                antagonistResultContext.fillStyle = antagonistResultColor;
                antagonistResultContext.fill();
                this.antagonistBattleResultsGraphics[i].context = antagonistResultContext;
                this.antagonistBattleResultsGraphics[i].x = this.calcLength(14 * i);
            }
        }
    }

    setBarsGraph = () => {
        this.klineContainer.x = 0;

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
            let color = 0xff3a66;
            let offsetX = 0
            let offsetY = 0
            if (curPrice > lastPrice) {
                color = 0x73ff4e;
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

    resultLine = (openValue, closeValue) => {
        let openBar = this.barGraphics[0]
        const fromX = openBar.x - this.data.barWidth / 2
        const fromY = openBar.y
        const toX = this.data.lastPos.x - (this.data.barWidth / 2 * 3)
        const toY = this.data.lastPos.y
        this.line.zIndex = 10

        let color = toY > fromY ? 0xff3a66 : 0x73ff4e;

        this.startCircle.circle(fromX, fromY, 6).fill(0xffffff).stroke({ width: 2, color: 0x000000 });
        this.startCircle.zIndex = 11;
        this.topContainer.addChild(this.startCircle);

        this.endCircle.circle(toX, toY, 6).fill(0xffffff).stroke({ width: 2, color: 0x000000 });
        this.endCircle.zIndex = 11;
        this.topContainer.addChild(this.endCircle);

        this.openInfoContainer.x = this.calcLength(6);
        this.openInfoContainer.y = Math.min(fromY + this.calcLength(40), this.topContainer.height - this.calcLength(86));
        this.openValueGraph.text = openValue;
        this.openInfoContainer.visible = true;


        this.closeInfoContainer.x = this.calcLength(388);
        this.closeInfoContainer.y = Math.min(toY + this.calcLength(40), this.topContainer.height - this.calcLength(86));
        this.closeValueGraph.text = closeValue
        this.closeInfoContainer.visible = true;

        
        let curX = fromX
        let curY = fromY
        let remainTime = 1 * 1000
        let tick = () => {
            this.line?.clear();
            this.lineTopBorder.clear();
            this.lineBottomBorder.clear();
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
            this.line.stroke({ width: 4, color: color });

            this.lineTopBorder.moveTo(fromX, fromY -  2);
            this.lineTopBorder.lineTo(curX, curY - 2)
            this.lineTopBorder.stroke({ width: 3, color: 0x4B3421 });

            this.lineBottomBorder.moveTo(fromX, fromY +  2);
            this.lineBottomBorder.lineTo(curX, curY + 2)
            this.lineBottomBorder.stroke({ width: 3, color: 0x4B3421 });
            
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
        if (count == 2 && this.clockContainer.y == (this.app.screen.height - this.calcLength(280 + 40 + 102))) {
            this.clockContainer.y -= this.calcLength(114 - 2)
        }
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