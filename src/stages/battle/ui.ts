import {Container, Assets, Sprite, Graphics, GraphicsContext, Text, Rectangle, AnimatedSprite, RenderContainer, Bounds, BitmapFont, BitmapText, TextStyle, CLEAR } from 'pixi.js';
import { Stage } from '../base';

import img_clock from '../../assets/images/battle/ic-clock.png';
import clock_img_0 from '../../assets/images/battle/ic-0.png';
import clock_img_1 from '../../assets/images/battle/ic-1.png';
import clock_img_2 from '../../assets/images/battle/ic-2.png';
import clock_img_3 from '../../assets/images/battle/ic-3.png';
import clock_img_4 from '../../assets/images/battle/ic-4.png';
import clock_img_5 from '../../assets/images/battle/ic-5.png';

import bg_banner from '../../assets/images/battle/bg_banner.png';
import img_leave from '../../assets/images/battle/ic-leave.png';
import img_mail from '../../assets/images/battle/ic-mail.png';
import img_mail_message from '../../assets/images/battle/ic-mail-message.png';
import img_coin from '../../assets/images/common/ic-coin.png';

import early_bouns from '../../assets/images/adventure/early-bouns.png';

import bg_before_choose from '../../assets/images/battle/bg-before-choose.png';
import bg_after_choose from '../../assets/images/battle/bg-after-choose.png';

import bg_result_bullish from '../../assets/images/battle/bg-result-bullish.png';
import bg_result_bearish from '../../assets/images/battle/bg-result-bearish.png';
import bg_result_neutral from '../../assets/images/battle/bg-result-neutral.png';

import img_win from '../../assets/images/adventure/img-win.png';
import img_lose from '../../assets/images/adventure/img-lose.png';
import bg_lose_line_short from '../../assets/images/adventure/bg-lose-line-short.png';
import bg_lose_line_long from '../../assets/images/adventure/bg-lose-line-long.png';
import bg_result_draw from '../../assets/images/battle/bg-result-draw.png';
import bg_result_no_bet from '../../assets/images/battle/bg-result-no-bet.png';

const LIMIT = 5

export class BattleStageUI extends Stage {
    myScoreNumsText: BitmapText[] = [];
    antagonistScoreNumsText: BitmapText[] = [];
    myBattleResultsGraphics: Graphics[] = [];
    antagonistBattleResultsGraphics: Graphics[] = [];

    rewardsContainer: Container = new Container()
    bannerContainer: Container = new Container()
    mailContainer: Container = new Container()

    //topContainer
    topContainer: Container = new Container()
    topCoinContainer: Container = new Container();
    klineContainer: Container = new Container()
    barGraphics: Graphics[] = [];

    //markContainer
    markGraphics: Text[] = [];
    clockContainer: Container = new Container()
    clockZeroContainer: Container = new Container()
    clockOneContainer: Container = new Container()
    clockTwoContainer: Container = new Container()
    clockThreeContainer: Container = new Container()
    clockFourContainer: Container = new Container()
    clockFiveContainer: Container = new Container()

    //bottomContainer
    //bottom-before choose
    beforeChooseContainer: Container = new Container();

    strikeContainer: Container = new Container();
    strikeGraph = new BitmapText({
        text: "",
    })

    fireWallContainer: Container = new Container();

    coinReduceContainer: Container = new Container();
    earlyBounsContainer: Container = new Container();
    loadingBoardContainer: Container = new Container();

    //bottom-after choose
    afterChooseContainer: Container = new Container();
    yourChoiceTitleGraph = new BitmapText({
        text: "NO BET",//YOUR CHOICE
    })
    yourChoiceInfoGraph = new BitmapText({
        text: "You did not place a bet",
    })
    resultCountDownGraph = new BitmapText({
        text: "2s",
    })

    //result
    openValueGraph = new BitmapText({
        text: "",
    })
    closeValueGraph = new BitmapText({
        text: "",
    })
    //bottom-result
    resultBullishContainer: Container = new Container();
    resultBearishContainer: Container = new Container();
    resultNeutralContainer: Container = new Container();
    //bottom-result-coin
    winCoinGraph = new BitmapText({
        text: "",
    })
    resultWinContainer: Container = new Container();
    resultLoseContainer: Container = new Container();
    resultDrawContainer: Container = new Container();
    resultNoBetContainer: Container = new Container();

    loseLineContainer: Container = new Container();

    waitingBattleResultContainer: Container = new Container();

    
    emptyBar = new GraphicsContext()
    line = new Graphics()
    startCircle = new Graphics();
    endCircle = new Graphics();
    lineTopBorder = new Graphics();
    lineBottomBorder = new Graphics();
    openInfoContainer: Container = new Container();
    closeInfoContainer: Container = new Container();
    strikeChannelContainer: Container = new Container()
    winFireAsset: any
    particlesAsset: any
    flyingCoins: Sprite[] = []

    data: {}
    

    constructor() {
        super();
    }

    public async load(elementId: string, preference: "webgl" | "webgpu" | undefined)  {
        await super.load(elementId, preference)
        await this.app.init({ background: '#E5D2B2', resizeTo: document.body, preference })
        this.app.ticker.maxFPS = 120
        document.getElementById(elementId)!.appendChild(this.app.canvas);
        
        this.topContainer.addChild(this.line)
        await this.initTopContainer();
        await this.initBarsGraph()
        await this.initBottom();
        
        await this.initMenu();
        await this.initMark();
        await this.initLoadingBoard();
        this.initClock();
        this.initMail();
        this.initEarlyBouns();
        this.initInfoCard();
        this.initFireWall();
        this.initStrikeChannelContainer()
    }
    

    public async destroy() {
        await super.destroy()
    }

    initStrikeChannelContainer = async () => {
        this.strikeChannelContainer.x = this.calcLength(40)
        this.strikeChannelContainer.y = this.app.screen.height - this.calcLength(280 + 40 + 82);
        this.winFireAsset = await Assets.load(`${window.location.origin}/images/win_fire.json`)
        this.particlesAsset = await Assets.load(`${window.location.origin}/images/particles.json`)

        this.app.stage.addChild(this.strikeChannelContainer)

        this.strikeChannelContainer.visible = true
    }


    initTopContainer = async () => {
        // this.topContainer.boundsArea = new Rectangle(0, 0, this.app.screen.width, this.app.screen.height / 2)
        const h = this.app.screen.height - this.calcLength(40+124+50+40+280+40+28);
        this.topContainer.x = this.calcLength(30);
        this.topContainer.y = this.calcLength(40+124+50+14);
        this.topContainer.boundsArea = new Rectangle(0, 0, this.calcLength(558), h);
        this.topContainer.zIndex = 1;

        this.klineContainer.x = 0;
        this.klineContainer.y = 0;
        this.klineContainer.height = h;
        this.klineContainer.boundsArea = new Rectangle(0, 0, this.calcLength(558), h);
        let mask = new Graphics()
        // Add the rectangular area to show
        .rect(this.calcLength(7),0,this.calcLength(558),h)
        .fill(0xffffff).stroke({ width: 4, color: 0xffd900 })
        this.topContainer.mask = mask
        this.topContainer.addChild(mask)
        this.topContainer.addChild(this.klineContainer)
        this.app.stage.addChild(this.topContainer)
    }

    initBarsGraph = async () => {
        this.data.barWidth = this.calcLength(110)
        let bars = []
        for (let i = 0; i < LIMIT; i ++) {
          let graphic = new Graphics()
          this.klineContainer?.addChild(graphic)
          graphic.zIndex = 1;
          bars.push(graphic)
        }
        this.barGraphics = bars
    }

    initMenu = async () => {
        this.bannerContainer.x = this.calcLength(0);
        this.bannerContainer.y = this.calcLength(0);
        this.bannerContainer.boundsArea = new Rectangle(0, 0, this.calcLength(750), this.calcLength(240));


        const bg = await Assets.load(bg_banner);
        const bannerBg = Sprite.from(bg);
        bannerBg.width = this.calcLength(750);
        bannerBg.height = this.calcLength(240);
        this.bannerContainer.addChild(bannerBg);


        //TradingPair
        const tradingPair = new BitmapText({
            text: `${this.data.instId.replace('-', '/')}`,
            style:{
                fill: '#FBEED0',
                fontSize: this.calcLength(26),
                fontFamily: 'SourceCodePro-Semibold',
            }
        })
        tradingPair.x = this.calcLength(375)
        tradingPair.y = this.calcLength(32)
        tradingPair.anchor.set(0.5, 0.5);
        tradingPair.label = 'tradingPair';
        this.bannerContainer.addChild(tradingPair);


        //leave
        const imgQuit = await Assets.load(img_leave);
        const leaveIcon = Sprite.from(imgQuit);
        leaveIcon.width = this.calcLength(30);
        leaveIcon.height = this.calcLength(30);
        leaveIcon.x = this.calcLength(375) + tradingPair.width / 2 + this.calcLength(16);
        leaveIcon.y = this.calcLength(17);
        leaveIcon.eventMode = 'static';
        leaveIcon.cursor = 'pointer';
        leaveIcon.on('pointerdown', () => {
            this.events["leaveBattle"]();
        })
        this.bannerContainer.addChild(leaveIcon);


        //coin
        this.rewardsContainer.x = this.calcLength(0);
        this.rewardsContainer.y = this.calcLength(83);
        //coin-text
        const rewards = new BitmapText({
            text: "130, 0000",
            style: {
                fill: '#322314',
                fontSize: this.calcLength(30),
                fontFamily: 'SourceCodePro-Bold',
            }
        });
        rewards.label = 'rewards'
        // rewards.anchor.set(0.5, 0)
        this.rewardsContainer.addChild(rewards);
        //coin-icon
        const imgCoin = await Assets.load(img_coin);
        const coinIcon = Sprite.from(imgCoin);
        coinIcon.width = this.calcLength(30);
        coinIcon.height = this.calcLength(30);
        coinIcon.label = 'coinIcon'
        this.rewardsContainer.addChild(coinIcon);
        this.rewardsContainer.pivot.set(0, this.rewardsContainer.height / 2);
        this.bannerContainer.addChild(this.rewardsContainer);


        //my avatar
        const myAvatarImg = await Assets.load(`${window.location.origin}/img/avatar${this.data.myAvatarIndex}.png`);
        const myAvatar = Sprite.from(myAvatarImg);
        myAvatar.width = this.calcLength(80);
        myAvatar.height = this.calcLength(80);
        myAvatar.x = this.calcLength(40);
        myAvatar.y = this.calcLength(28);
        this.bannerContainer.addChild(myAvatar);

        //my name
        const myName = new BitmapText({
            text: "You",
            style: {
                fill: '#FBEED0',
                fontSize: this.calcLength(24),
                fontFamily: 'SourceCodePro-Bold',
            }
        });
        myName.x = this.calcLength(40);
        myName.y = this.calcLength(136);
        myName.anchor.set(0, 0.5);
        this.bannerContainer.addChild(myName);


        //antagonist avatar
        // const antagonistAvatarImg = await Assets.load(`${window.location.origin}/img/avatar1.png`);
        // const antagonistAvatar = Sprite.from(antagonistAvatarImg);
        // antagonistAvatar.width = this.calcLength(80);
        // antagonistAvatar.height = this.calcLength(80);
        // antagonistAvatar.x = this.calcLength(630);
        // antagonistAvatar.y = this.calcLength(28);
        // this.bannerContainer.addChild(antagonistAvatar);


        //antagonist name
        const antagonistName = new BitmapText({
            text: '',
            style: {
                fill: '#FBEED0',
                fontSize: this.calcLength(24),
                fontFamily: 'SourceCodePro-Bold',
            }
        });
        antagonistName.x = this.calcLength(710);
        antagonistName.y = this.calcLength(136);
        antagonistName.anchor.set(1, 0.5);
        antagonistName.label = 'antagonistName'
        this.bannerContainer.addChild(antagonistName);
        
        this.initScoreboardGraph();
        this.initBattleResultsGraph();

        this.app.stage.addChild(this.bannerContainer);
    }

    initScoreboardGraph = async () => {
        const myScoreContainer: Container = new Container()
        myScoreContainer.x = this.calcLength(223);
        myScoreContainer.y = this.calcLength(130);
        let myNums = []
        for(let i = 0; i<5; i++){
            const num = new BitmapText({
                text: '0',
                style: {
                    fill: '#322314',
                    fontSize: this.calcLength(32),
                    fontFamily: 'D-DINExp',
                }
            });
            num.x = this.calcLength(13.5) + this.calcLength(i * 27);
            num.y = this.calcLength(22);
            num.anchor.set(0.5, 0.5);
            myScoreContainer.addChild(num);
            myNums.push(num);
        }
        this.myScoreNumsText = myNums;
        this.bannerContainer.addChild(myScoreContainer);


        const antagonistScoreContainer: Container = new Container()
        antagonistScoreContainer.x = this.calcLength(392.5);
        antagonistScoreContainer.y = this.calcLength(130);
        let antagonistNums = []
        for(let i = 0; i<5; i++){
            const num = new BitmapText({
                text: '0',
                style: {
                    fill: '#322314',
                    fontSize: this.calcLength(32),
                    fontFamily: 'D-DINExp',
                }
            });
            num.x = this.calcLength(13.5) + this.calcLength(i * 27);
            num.y = this.calcLength(22);
            num.anchor.set(0.5, 0.5);
            antagonistScoreContainer.addChild(num);
            antagonistNums.push(num);
        }
        this.antagonistScoreNumsText = antagonistNums;
        this.bannerContainer.addChild(antagonistScoreContainer);
    }

    initBattleResultsGraph = async () => {
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

        const myBattleResultsContainer: Container = new Container()
        myBattleResultsContainer.x = this.calcLength(223);
        myBattleResultsContainer.y = this.calcLength(194);
        let myBattles = []
        for(let i = 0; i<10; i++){
            const graphic = new Graphics();
            graphic.beginFill('rgba(0, 0, 0, 0.3)');
            graphic.poly(points).fill();
            graphic.x = this.calcLength(14 * i);
            myBattleResultsContainer.addChild(graphic);
            myBattles.push(graphic);
        }
        this.myBattleResultsGraphics = myBattles;
        this.bannerContainer.addChild(myBattleResultsContainer);


        const antagonistBattleResultsContainer: Container = new Container()
        antagonistBattleResultsContainer.x = this.calcLength(400);
        antagonistBattleResultsContainer.y = this.calcLength(194);
        let antagonistBattles = [];
        for(let i = 0; i<10; i++){
            const graphic = new Graphics();
            graphic.beginFill('rgba(0, 0, 0, 0.3)');
            graphic.poly(points).fill();
            graphic.x = this.calcLength(14 * i);
            antagonistBattleResultsContainer.addChild(graphic);
            antagonistBattles.push(graphic);
        }
        this.antagonistBattleResultsGraphics = antagonistBattles;
        this.bannerContainer.addChild(antagonistBattleResultsContainer);
    }

    initMail = async () => {
        this.mailContainer.x = this.calcLength(662);
        this.mailContainer.y = this.calcLength(231);
        this.mailContainer.boundsArea = new Rectangle(this.calcLength(662), this.calcLength(231), this.calcLength(48), this.calcLength(48));
        this.mailContainer.eventMode = 'static';
        this.mailContainer.cursor = 'pointer';
        this.mailContainer.on('pointerdown', () => {
            this.events["changeModule"]("mail-box");
        })

        const imgMail = await Assets.load(img_mail);
        const imgMailMessage = await Assets.load(img_mail_message);

        const mail = Sprite.from(imgMail);
        mail.width = this.calcLength(48);
        mail.height = this.calcLength(48);
        this.mailContainer.addChild(mail);

        const mailMessage = Sprite.from(imgMailMessage);
        mailMessage.width = this.calcLength(48);
        mailMessage.height = this.calcLength(48);
        mailMessage.label = 'mailMessage';
        this.mailContainer.addChild(mailMessage);
        mailMessage.visible = false;

        this.app.stage.addChild( this.mailContainer);
    }

    initMark = async () => {
        const h = this.app.screen.height - this.calcLength(40+124+50+40+280+40);
        const markContainer: Container = new Container()
        markContainer.x = this.calcLength(0);
        markContainer.y = this.calcLength(40+124+50);
        markContainer.height = h;
        markContainer.boundsArea = new Rectangle(0, 0, this.calcLength(750), h);


        //Mark-line
        for (let i = 0; i < 10; i ++) {
            const graphic = new Graphics().rect(0, 0, this.calcLength(560), 1).fill(0x000000, 0.16);
            graphic.x = this.calcLength(40);
            graphic.y = this.calcLength(14) + this.klineContainer.height / 9 * i;
            markContainer.addChild(graphic)
        }


        //Mark-value
        let marks = []
        for (let i = 0; i < 10; i ++) {
            const graphic = new BitmapText({
                text: '',
                style:{
                    fill: `rgba(0,0,0,1)`,
                    fontSize: this.calcLength(24),
                    fontFamily: 'SourceCodePro-Medium',
                },
                x:  this.calcLength(610),
                y:  this.klineContainer.height / 9 * i
            })
            graphic.zIndex = 10
            graphic.alpha = 0.4
            marks.push(graphic);
            markContainer.addChild(graphic)
        }
        this.markGraphics = marks;

        this.app.stage.addChild(markContainer);
    }

    initClock = async () => {
        this.clockContainer.x = this.app.screen.width / 2 - this.calcLength(50);
        this.clockContainer.y = this.app.screen.height - this.calcLength(280 + 40 + 102);
        this.clockContainer.boundsArea = new Rectangle(0, 0, this.calcLength(100), this.calcLength(100));
        this.clockContainer.zIndex = 10

        const imgClock = await Assets.load(img_clock);
        const clock = Sprite.from(imgClock);
        clock.anchor.set(0.5, 0.5); // 设置锚点为中心
        clock.x = this.calcLength(50);
        clock.y = this.calcLength(50);
        clock.width = this.calcLength(100);
        clock.height = this.calcLength(100);
        this.clockContainer.addChild(clock);
        // this.clockContainer.visible = false;
        this.app.stage.addChild(this.clockContainer)


        const maxRotation = Math.PI / 45; // 180/45 = 4
        const minRotation = -maxRotation;
        const frames = 0.08 * this.app.ticker.FPS
        const swingSpeed = maxRotation / frames * 1.5
        let swingDirection = -1;
        this.app.ticker.add(() => {
            clock.rotation += swingDirection * swingSpeed;
            if (clock.rotation >= maxRotation) {
                swingDirection = -1;
            } else if (clock.rotation <= minRotation) {
                swingDirection = 1;
            }
        })

        const imgClock0 = await Assets.load(clock_img_0);
        const zero = Sprite.from(imgClock0);
        zero.width = this.calcLength(38);
        zero.height = this.calcLength(30);
        zero.x = this.calcLength(50);
        zero.y = this.calcLength(41);
        zero.anchor.set(0.5, 0);
        this.clockZeroContainer.addChild(zero);
        this.clockZeroContainer.visible = false;
        this.clockContainer.addChild(this.clockZeroContainer);


        const imgClock1 = await Assets.load(clock_img_1);
        const one = Sprite.from(imgClock1);
        one.width = this.calcLength(38);
        one.height = this.calcLength(30);
        one.x = this.calcLength(50);
        one.y = this.calcLength(41);
        one.anchor.set(0.5, 0);
        this.clockOneContainer.addChild(one);
        this.clockOneContainer.visible = false;
        this.clockContainer.addChild(this.clockOneContainer);


        const imgClock2 = await Assets.load(clock_img_2);
        const two = Sprite.from(imgClock2);
        two.width = this.calcLength(38);
        two.height = this.calcLength(30);
        two.x = this.calcLength(50);
        two.y = this.calcLength(41);
        two.anchor.set(0.5, 0);
        this.clockTwoContainer.addChild(two);
        this.clockTwoContainer.visible = false;
        this.clockContainer.addChild(this.clockTwoContainer);

        const imgClock3 = await Assets.load(clock_img_3);
        const three = Sprite.from(imgClock3);
        three.width = this.calcLength(38);
        three.height = this.calcLength(30);
        three.x = this.calcLength(50);
        three.y = this.calcLength(41);
        three.anchor.set(0.5, 0);
        this.clockThreeContainer.addChild(three);
        this.clockThreeContainer.visible = false;
        this.clockContainer.addChild(this.clockThreeContainer);

        const imgClock4 = await Assets.load(clock_img_4);
        const four = Sprite.from(imgClock4);
        four.width = this.calcLength(38);
        four.height = this.calcLength(30);
        four.x = this.calcLength(50);
        four.y = this.calcLength(41);
        four.anchor.set(0.5, 0);
        this.clockFourContainer.addChild(four);
        this.clockFourContainer.visible = false;
        this.clockContainer.addChild(this.clockFourContainer);

        const imgClock5 = await Assets.load(clock_img_5);
        const five = Sprite.from(imgClock5);
        five.width = this.calcLength(38);
        five.height = this.calcLength(30);
        five.x = this.calcLength(50);
        five.y = this.calcLength(41);
        five.anchor.set(0.5, 0);
        this.clockFiveContainer.addChild(five);
        this.clockFiveContainer.visible = false;
        this.clockContainer.addChild(this.clockFiveContainer);

        this.clockContainer.visible = false;
    }

    initBottom = async () => {
        const bottomContainer: Container = new Container()
        bottomContainer.y = this.app.screen.height - this.calcLength(280 + 40);
        bottomContainer.boundsArea = new Rectangle(0, 0, this.calcLength(750), this.calcLength(560));

        await this.initStrikeContainer();
        await this.initBeforeChoose();
        bottomContainer.addChild(this.beforeChooseContainer);

        //Loading
        await this.initLoadingBoard();
        bottomContainer.addChild(this.loadingBoardContainer);

        //YOUR CHOICE 1-3
        await this.initAfterChoosen();
        bottomContainer.addChild(this.afterChooseContainer);

        //result 1-3
        await this.initResultBullish();
        bottomContainer.addChild(this.resultBullishContainer);
        await this.initResultBearish();
        bottomContainer.addChild(this.resultBearishContainer);
        await this.initResultNeutral();
        bottomContainer.addChild(this.resultNeutralContainer);

        //result 1-4
        await this.initResultWin();
        bottomContainer.addChild(this.resultWinContainer);

        await this.initResultLose();
        bottomContainer.addChild(this.resultLoseContainer);

        await this.initResultDraw();
        bottomContainer.addChild(this.resultDrawContainer);

        await this.initResultNoBet();
        bottomContainer.addChild(this.resultNoBetContainer);

        await this.initWaitingBattleResult();
        bottomContainer.addChild(this.waitingBattleResultContainer);
    
        this.app.stage.addChild(bottomContainer)
    }

    initStrikeContainer = async () => {
        const sheet = await Assets.load(`${window.location.origin}/images/fire.json`);
        const anim = new AnimatedSprite(sheet.animations['run']);
        anim.label = "anim"
        anim.animationSpeed = 0.1666;
        anim.stop()
        anim.scale = this.app.screen.width / 1500;
        anim.x = 0
        anim.y = this.calcLength(102);
        this.strikeContainer.addChild(anim);


        
        this.strikeContainer.zIndex = 3;
        this.strikeContainer.visible = false;

        this.beforeChooseContainer.addChild(this.strikeContainer);
    }

    initFireWall = async () => {
        this.fireWallContainer.zIndex = -1
        this.fireWallContainer.boundsArea = new Rectangle(0, 0, this.app.stage.width, Math.min(this.calcLength(1624), this.app.stage.height));

        const firewallLeft = await Assets.load(`${window.location.origin}/images/firewall-left.json`);
        const firewallRight = await Assets.load(`${window.location.origin}/images/firewall-right.json`);
        const firewallLeftAnim = new AnimatedSprite(firewallLeft.animations['run']);
        firewallLeftAnim.label = "left"
        firewallLeftAnim.animationSpeed = 0.15;
        firewallLeftAnim.stop();
        firewallLeftAnim.scale = this.app.screen.width / 1500;
        firewallLeftAnim.x = 0
        firewallLeftAnim.y = 0;
        this.fireWallContainer.addChild(firewallLeftAnim);

        const firewallRightAnim = new AnimatedSprite(firewallRight.animations['run']);
        firewallRightAnim.label = "right"
        firewallRightAnim.animationSpeed = 0.15;
        firewallRightAnim.stop();
        firewallRightAnim.anchor.set(1, 0)
        firewallRightAnim.scale = this.app.screen.width / 1500;
        firewallRightAnim.x = this.app.screen.width
        firewallRightAnim.y = 0;
        this.fireWallContainer.addChild(firewallRightAnim);

        this.fireWallContainer.zIndex = 50;
        this.fireWallContainer.visible = false;

        this.app.stage.addChild(this.fireWallContainer);
    }

    initEarlyBouns = async () => {
        this.earlyBounsContainer.boundsArea = new Rectangle(0, 0, this.calcLength(290), this.calcLength(150));
        this.earlyBounsContainer.x = this.calcLength(70 + 145);
        this.earlyBounsContainer.y = this.app.screen.height - this.calcLength(280 + 40) + this.calcLength(128);
        this.earlyBounsContainer.zIndex = 1;

        //bg
        const early_bouns_img = await Assets.load(early_bouns);
        const bg = Sprite.from(early_bouns_img);
        bg.width = this.calcLength(290);
        bg.height = this.calcLength(150);
        this.earlyBounsContainer.addChild(bg);


        //coins
        const coins = new BitmapText({
            text: '+1000',
            style:  new TextStyle({
                fill: '#FFDC7D',
                stroke: '#000000',
                strokeThickness: 1,
                fontFamily: 'SourceCodePro-Semibold-stroke',
                fontSize: this.calcLength(34),
            })
        })
        coins.label = "coins"
        coins.x = this.calcLength(126);
        coins.y = this.calcLength(52);
        coins.anchor.set(0.5, 0.5);
        coins.rotation = -Math.PI / 18;
        this.earlyBounsContainer.addChild(coins);
        this.earlyBounsContainer.pivot.set(this.earlyBounsContainer.width / 2, this.earlyBounsContainer.height / 2);
        this.earlyBounsContainer.scale = 0;

        this.earlyBounsContainer.visible = false;

        this.app.stage.addChild(this.earlyBounsContainer);
    }

    initLoadingBoard = async () => {
        this.loadingBoardContainer.boundsArea = new Rectangle(0, 0, this.calcLength(670), this.calcLength(280));
        this.loadingBoardContainer.x = this.calcLength(40);

        //resultBullishContainer-bg
        const bgResultBullish = await Assets.load(bg_after_choose);
        const bg = Sprite.from(bgResultBullish);
        bg.width = this.calcLength(670);
        bg.height = this.calcLength(280);
        this.loadingBoardContainer.addChild(bg);

        //info
        const titleText = new BitmapText({
            text: "WAITING",
            style:  new TextStyle({
                fill: '#000000',
                fontFamily: 'SourceCodePro-Semibold-stroke',
                fontSize: this.calcLength(28),
                letterSpacing: 6,
            })
        });
        titleText.x = this.calcLength(335);
        titleText.y = this.calcLength(55);
        titleText.anchor.set(0.5, 0.5);
        this.loadingBoardContainer.addChild(titleText);

        //tip
        const tipText = new BitmapText({
            text: "Battle is about to begin",
            style:  new TextStyle({
                fill: 'rgba(255,255,255,0.60)',
                fontFamily: 'SourceCodePro-Semibold',
                fontSize: this.calcLength(36),
                letterSpacing: 1
            })
        });
        tipText.x = this.calcLength(335);
        tipText.y = this.calcLength(154);
        tipText.anchor.set(0.5, 0);
        this.loadingBoardContainer.addChild(tipText);

        this.loadingBoardContainer.visible = true;
    }

    initBeforeChoose = async () => {
        this.beforeChooseContainer.boundsArea = new Rectangle(0, 0, this.calcLength(670), this.calcLength(280));
        this.beforeChooseContainer.x = this.calcLength(40);
        //bg
        const bgBeforeChoose = await Assets.load(bg_before_choose);
        const chooseBg = Sprite.from(bgBeforeChoose);
        chooseBg.width = this.calcLength(670);
        chooseBg.height = this.calcLength(280);
        this.beforeChooseContainer.addChild(chooseBg);
        

        //bullish-btn
        const sheet = await Assets.load(`${window.location.origin}/images/button.json`);
        const animBullish = new AnimatedSprite(sheet.animations['bullishRun']);
        animBullish.animationSpeed = 0.05;
        animBullish.play();
        animBullish.scale = this.app.screen.width / 1500;
        animBullish.anchor.set(0.5, 1);
        animBullish.x = this.calcLength(175);
        animBullish.y = this.calcLength(228);
        animBullish.zIndex = 2;
        animBullish.eventMode = 'static';
        animBullish.cursor = 'pointer';
        animBullish.on('pointerdown', () => {
            if(this.data.selection){
                return;
            }
            this.makeChoice('bullish');
        })
        this.beforeChooseContainer.addChild(animBullish);

        //bearish-btn
        // const sheet2 = await Assets.load(`${window.location.origin}/images/bearish.json`);
        const animBearish = new AnimatedSprite(sheet.animations['bearishRun']);
        animBearish.animationSpeed = 0.05;
        animBearish.play();
        animBearish.scale = this.app.screen.width / 1500;
        animBearish.anchor.set(0.5, 1);
        animBearish.x = this.calcLength(495);
        animBearish.y = this.calcLength(228);
        animBearish.zIndex = 2;
        animBearish.eventMode = 'static';
        animBearish.cursor = 'pointer';
        animBearish.on('pointerdown', () => {
            if(this.data.selection){
                return;
            }
            this.makeChoice('bearish');
        })
        this.beforeChooseContainer.addChild(animBearish);
        
        this.beforeChooseContainer.visible = false;
    }

    initAfterChoosen = async () => {
        this.afterChooseContainer.boundsArea = new Rectangle(0, 0, this.calcLength(670), this.calcLength(280));
        this.afterChooseContainer.x = this.calcLength(40);

        //bg
        const bgAfterChoose = await Assets.load(bg_after_choose);
        const bg1 = Sprite.from(bgAfterChoose);
        bg1.width = this.calcLength(670);
        bg1.height = this.calcLength(280);
        this.afterChooseContainer.addChild(bg1);

        //title
        this.yourChoiceTitleGraph.x = this.calcLength(335);
        this.yourChoiceTitleGraph.y = this.calcLength(55);
        this.yourChoiceTitleGraph.anchor.set(0.5, 0.5);
        this.yourChoiceTitleGraph.style =  new TextStyle({
            fill: '#000000',
            stroke: 'rgba(0,0,0,1)',
            strokeThickness: 1,
            fontFamily: 'SourceCodePro-Medium-stroke',
            fontSize: this.calcLength(28),
            letterSpacing: 6,
        })
        this.afterChooseContainer.addChild(this.yourChoiceTitleGraph);

        //info
        this.yourChoiceInfoGraph.x = this.calcLength(335);
        this.yourChoiceInfoGraph.y = this.calcLength(155);
        this.yourChoiceInfoGraph.anchor.set(0.5, 0.5);
        this.yourChoiceInfoGraph.style =  new TextStyle({
            fill: '#FFFFFF',
            fontFamily: 'SourceCodePro-Semibold',
            fontSize: this.calcLength(34),
        })
        this.afterChooseContainer.addChild(this.yourChoiceInfoGraph);

        //result
        const resultText = new BitmapText({
            text: "Result in",
            style:  new TextStyle({
                fill: 'rgba(255,255,255,0.40)',
                fontFamily: 'SourceCodePro-Medium',
                fontSize: this.calcLength(24),
                letterSpacing: 1
            })
        });
        resultText.x = this.calcLength(240); //238 400
        resultText.y = this.calcLength(184);
        this.afterChooseContainer.addChild(resultText);

        //result-countDown
        this.resultCountDownGraph.x = this.calcLength(404);
        this.resultCountDownGraph.y = this.calcLength(184);
        this.resultCountDownGraph.style =  new TextStyle({
            fill: '#FFFFFF',
            fontFamily: 'SourceCodePro-Medium',
            fontSize: this.calcLength(24),
            letterSpacing: 1
        })
        this.afterChooseContainer.addChild(this.resultCountDownGraph);

        this.afterChooseContainer.visible = false;
    }

    initResultBullish = async () => {
        this.resultBullishContainer.boundsArea = new Rectangle(0, 0, this.calcLength(670), this.calcLength(280));
        this.resultBullishContainer.x = this.calcLength(40);

        //resultBullishContainer-bg
        const bgResultBullish = await Assets.load(bg_result_bullish);
        const bg = Sprite.from(bgResultBullish);
        bg.width = this.calcLength(670);
        bg.height = this.calcLength(280);
        this.resultBullishContainer.addChild(bg);

        //info
        const infoText = new BitmapText({
            text: "Bullish",
            style: new TextStyle({
                fill: '#000000',
                fontFamily: 'SourceCodePro-Semibold',
                fontSize: this.calcLength(34),
                letterSpacing: 1
            })
        });
        infoText.x = this.calcLength(335);
        infoText.y = this.calcLength(155);
        infoText.anchor.set(0.5, 0.5);
        this.resultBullishContainer.addChild(infoText);

        //tip
        const tipText = new BitmapText({
            text: "Based on the trading data within the",
            style: new TextStyle({
                fill: 'rgba(0,0,0,0.60)',
                fontFamily: 'SourceCodePro-Medium',
                fontSize: this.calcLength(24),
                letterSpacing: 0
            })
        });
        tipText.x = this.calcLength(50);
        tipText.y = this.calcLength(184);
        tipText.anchor.set(0, 0);
        this.resultBullishContainer.addChild(tipText);

        const tipTimeText = new BitmapText({
            text: "5s",
            style: new TextStyle({
                fill: 'rgba(0,0,0,1)',
                fontFamily: 'SourceCodePro-Medium',
                fontSize: this.calcLength(24),
                letterSpacing: 0
            })
        });
        tipTimeText.x = this.calcLength(582);
        tipTimeText.y = this.calcLength(184);
        tipTimeText.anchor.set(0, 0);
        this.resultBullishContainer.addChild(tipTimeText);

        this.resultBullishContainer.visible = false;
    }

    initResultBearish = async () => {
        this.resultBearishContainer.boundsArea = new Rectangle(0, 0, this.calcLength(670), this.calcLength(280));
        this.resultBearishContainer.x = this.calcLength(40);

        //resultBullishContainer-bg
        const bgResultBearish = await Assets.load(bg_result_bearish);
        const bg = Sprite.from(bgResultBearish);
        bg.width = this.calcLength(670);
        bg.height = this.calcLength(280);
        this.resultBearishContainer.addChild(bg);

        //info
        const infoText = new BitmapText({
            text: "Bearish",
            style:  new TextStyle({
                fill: '#FFFFFF',
                fontFamily: 'SourceCodePro-Semibold',
                fontSize: this.calcLength(34),
                letterSpacing: 1
            })
        });
        infoText.x = this.calcLength(335);
        infoText.y = this.calcLength(155);
        infoText.anchor.set(0.5, 0.5);
        this.resultBearishContainer.addChild(infoText);

        //tip
        const tipText = new BitmapText({
            text: "Based on the trading data within the",
            style: new TextStyle({
                fill: 'rgba(255,255,255,0.60)',
                fontFamily: 'SourceCodePro-Medium',
                fontSize: this.calcLength(24),
                letterSpacing: 0
            })
        });
        tipText.x = this.calcLength(50);
        tipText.y = this.calcLength(184);
        tipText.anchor.set(0, 0);
        this.resultBearishContainer.addChild(tipText);

        const tipTimeText = new BitmapText({
            text: "5s",
            style: new TextStyle({
                fill: 'rgba(255,255,255,1)',
                fontFamily: 'SourceCodePro-Medium',
                fontSize: this.calcLength(24),
                letterSpacing: 0
            })
        });
        tipTimeText.x = this.calcLength(582);
        tipTimeText.y = this.calcLength(184);
        tipTimeText.anchor.set(0, 0);
        this.resultBearishContainer.addChild(tipTimeText);

        this.resultBearishContainer.visible = false;
    }

    initResultNeutral = async () => {
        this.resultNeutralContainer.boundsArea = new Rectangle(0, 0, this.calcLength(670), this.calcLength(280));
        this.resultNeutralContainer.x = this.calcLength(40);

        //resultBullishContainer-bg
        const bgResultNeutral = await Assets.load(bg_result_neutral);
        const bg = Sprite.from(bgResultNeutral);
        bg.width = this.calcLength(670);
        bg.height = this.calcLength(280);
        this.resultNeutralContainer.addChild(bg);

        //info
        const infoText = new BitmapText({
            text: "Neutral",
            style: new TextStyle({
                fill: '#FFFFFF',
                fontFamily: 'SourceCodePro-Semibold',
                fontSize: this.calcLength(34),
                letterSpacing: 1
            })
        });
        infoText.x = this.calcLength(335);
        infoText.y = this.calcLength(155);
        infoText.anchor.set(0.5, 0.5);
        this.resultNeutralContainer.addChild(infoText);

        //tip
        const tipText = new BitmapText({
            text: "Based on the trading data within the",
            style: {
                fill: 'rgba(255,255,255,0.60)',
                fontFamily: 'SourceCodePro-Medium',
                fontSize: this.calcLength(24),
                letterSpacing: 0
            }
        });
        tipText.x = this.calcLength(50);
        tipText.y = this.calcLength(184);
        tipText.anchor.set(0, 0);
        this.resultNeutralContainer.addChild(tipText);

        const tipTimeText = new BitmapText({
            text: "5s",
            style:  new TextStyle({
                fill: 'rgba(255,255,255,1)',
                fontFamily: 'SourceCodePro-Medium',
                fontSize: this.calcLength(24),
                letterSpacing: 0
            })
        });
        tipTimeText.x = this.calcLength(582);
        tipTimeText.y = this.calcLength(184);
        tipTimeText.anchor.set(0, 0);
        this.resultNeutralContainer.addChild(tipTimeText);

        this.resultNeutralContainer.visible = false;
    }

    initResultWin = async () => {
        this.resultWinContainer.boundsArea = new Rectangle(0, 0, this.calcLength(670), this.calcLength(280));
        this.resultWinContainer.x = this.calcLength(40);

        //bg
        const sheet = await Assets.load(`${window.location.origin}/images/battle-win.json`);
        const anim = new AnimatedSprite(sheet.animations['run']);
        anim.label = 'winanim'
        anim.animationSpeed = 0.1666;
        anim.stop();
        anim.scale = this.app.screen.width / 1500;
        anim.x = 0
        anim.y = 0
        this.resultWinContainer.addChild(anim);

        //avatar
        const imgWin = await Assets.load(img_win);
        const winAvatar = Sprite.from(imgWin);
        winAvatar.width = this.calcLength(152);
        winAvatar.height = this.calcLength(152);
        winAvatar.x = this.calcLength(143);
        winAvatar.y = this.calcLength(54);
        this.resultWinContainer.addChild(winAvatar);

        const winText = new BitmapText({
            text: "You Win!",
            style:  new TextStyle({
                fill: '#FFDC7D',
                stroke: '#000000',
                strokeThickness: 3,
                fontFamily: 'SourceCodePro-Medium',
                fontSize: this.calcLength(36),
                letterSpacing: 0
            })
        });
        winText.x = this.calcLength(349);
        winText.y = this.calcLength(60);
        this.resultWinContainer.addChild(winText);

        //coinIcon
        // const imgCoin = await Assets.load(img_coin);
        // const coinIcon = Sprite.from(imgCoin);
        // coinIcon.width = this.calcLength(48);
        // coinIcon.height = this.calcLength(48);
        // coinIcon.x = this.calcLength(349);
        // coinIcon.y = this.calcLength(144);
        // this.resultWinContainer.addChild(coinIcon);

        //coinText
        this.winCoinGraph.style =  new TextStyle({
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 1,
            fontFamily: 'SourceCodePro-Semibold-stroke',
            fontSize: this.calcLength(30),
            letterSpacing: 0
        })
        this.winCoinGraph.x = this.calcLength(349);
        this.winCoinGraph.y = this.calcLength(150);
        this.resultWinContainer.addChild(this.winCoinGraph);

        this.resultWinContainer.visible = false;
    }

    initResultLose = async () => {
        this.resultLoseContainer.boundsArea = new Rectangle(0, 0, this.calcLength(670), this.calcLength(280));
        let mask = new Graphics()
        .rect(0, 0, this.calcLength(670), this.calcLength(280))
        .fill(0xffffff).stroke({ width: 4, color: 0xffd900 })
        this.resultLoseContainer.mask = mask
        this.resultLoseContainer.addChild(mask)
        this.resultLoseContainer.x = this.calcLength(40);

        //bg
        const bgResultNoBet = await Assets.load(bg_result_no_bet);
        const bg = Sprite.from(bgResultNoBet);
        bg.width = this.calcLength(670);
        bg.height = this.calcLength(280);
        this.resultLoseContainer.addChild(bg);

        //line
        this.loseLineContainer.x = 0;
        this.loseLineContainer.y = this.calcLength(-240);
        this.loseLineContainer.width = this.calcLength(670);
        this.loseLineContainer.height = this.calcLength(280);
        const bgLoseLineShort = await Assets.load(bg_lose_line_short);
        const lineShort = Sprite.from(bgLoseLineShort);
        lineShort.width = this.calcLength(408);
        lineShort.height = this.calcLength(148);
        lineShort.x = this.calcLength(131);
        this.loseLineContainer.addChild(lineShort);
        const bgLoseLineLong = await Assets.load(bg_lose_line_long);
        const lineLong = Sprite.from(bgLoseLineLong);
        lineLong.width = this.calcLength(624);
        lineLong.height = this.calcLength(240);
        lineLong.x = this.calcLength(23);
        this.loseLineContainer.addChild(lineLong);
        this.resultLoseContainer.addChild(this.loseLineContainer);
        

        //avatar
        const imgLose = await Assets.load(img_lose);
        const winAvatar = Sprite.from(imgLose);
        winAvatar.width = this.calcLength(152);
        winAvatar.height = this.calcLength(152);
        winAvatar.x = this.calcLength(143);
        winAvatar.y = this.calcLength(54);
        this.resultLoseContainer.addChild(winAvatar);

        const winText = new BitmapText({
            text: "You Lose : (",
            style:  new TextStyle({
                fill: '#FF6861',
                fontFamily: 'SourceCodePro-Medium',
                fontSize: this.calcLength(36),
                letterSpacing: 0
            })
        });
        winText.x = this.calcLength(349);
        winText.y = this.calcLength(60);
        this.resultLoseContainer.addChild(winText);

        //coinIcon
        // const imgCoin = await Assets.load(img_coin);
        // const coinIcon = Sprite.from(imgCoin);
        // coinIcon.width = this.calcLength(48);
        // coinIcon.height = this.calcLength(48);
        // coinIcon.x = this.calcLength(349);
        // coinIcon.y = this.calcLength(144);
        // this.resultLoseContainer.addChild(coinIcon);

        //coinText
        const coinText = new BitmapText({
            text: "- 100", //+ 0
            style: new TextStyle({
                fill: '#FFFFFF',
                fontFamily: 'SourceCodePro-Semibold',
                fontSize: this.calcLength(28),
                letterSpacing: 0
            })
        });
        coinText.x = this.calcLength(349);
        coinText.y = this.calcLength(150);
        this.resultLoseContainer.addChild(coinText);

        this.resultLoseContainer.visible = false;

        this.playLoseAnim();
    }

    initResultDraw = async () => {
        this.resultDrawContainer.boundsArea = new Rectangle(0, 0, this.calcLength(670), this.calcLength(280));
        this.resultDrawContainer.x = this.calcLength(40);

        //bg
        const bgResultDraw = await Assets.load(bg_result_draw);
        const bg = Sprite.from(bgResultDraw);
        bg.width = this.calcLength(670);
        bg.height = this.calcLength(280);
        this.resultDrawContainer.addChild(bg);

        //info
        const infoText = new BitmapText({
            text: "It's a draw!",
            style:  new TextStyle({
                fill: 'rgba(255,255,255,1)',
                fontFamily: 'SourceCodePro-Semibold',
                fontSize: this.calcLength(36),
                letterSpacing: 4
            })
        });
        infoText.x = this.calcLength(335);
        infoText.y = this.calcLength(89);
        infoText.anchor.set(0.5, 0.5);
        this.resultDrawContainer.addChild(infoText);

        //coinIcon
        // const imgCoin = await Assets.load(img_coin);
        // const coinIcon = Sprite.from(imgCoin);
        // coinIcon.width = this.calcLength(48);
        // coinIcon.height = this.calcLength(48);
        // coinIcon.x = this.calcLength(276);
        // coinIcon.y = this.calcLength(144);
        // this.resultDrawContainer.addChild(coinIcon);

        //coinText
        const coinText = new BitmapText({
            text: "+ 0",//+ 100
            style:  new TextStyle({
                fill: '#FFFFFF',
                fontFamily: 'SourceCodePro-Semibold',
                fontSize: this.calcLength(28),
                letterSpacing: 0
            })
        });
        coinText.x = this.calcLength(276);
        coinText.y = this.calcLength(150);
        this.resultDrawContainer.addChild(coinText);

        this.resultDrawContainer.visible = false;
    }

    initResultNoBet = async () => {
        this.resultNoBetContainer.boundsArea = new Rectangle(0, 0, this.calcLength(670), this.calcLength(280));
        this.resultNoBetContainer.x = this.calcLength(40);

        //resultBullishContainer-bg
        const bgResultNoBet = await Assets.load(bg_result_no_bet);
        const bg = Sprite.from(bgResultNoBet);  
        bg.width = this.calcLength(670);
        bg.height = this.calcLength(280);
        this.resultNoBetContainer.addChild(bg);

        //info
        const infoText = new BitmapText({
            text: "You did not place a bet",
            style:  new TextStyle({
                fill: 'rgba(255,255,255,0.60)',
                fontFamily: 'SourceCodePro-Semibold',
                fontSize: this.calcLength(36),
                letterSpacing: 1
            })
        });
        infoText.x = this.calcLength(335);
        infoText.y = this.calcLength(89);
        infoText.anchor.set(0.5, 0.5);
        this.resultNoBetContainer.addChild(infoText);

        //coinIcon
        // const imgCoin = await Assets.load(img_coin);
        // const coinIcon = Sprite.from(imgCoin);
        // coinIcon.width = this.calcLength(48);
        // coinIcon.height = this.calcLength(48);
        // coinIcon.x = this.calcLength(276);
        // coinIcon.y = this.calcLength(144);
        // this.resultNoBetContainer.addChild(coinIcon);

        //coinText
        const coinText = new BitmapText({
            text: "+ 0",
            style:  new TextStyle({
                fill: '#FFFFFF',
                fontFamily: 'SourceCodePro-Semibold',
                fontSize: this.calcLength(28),
                letterSpacing: 1
            })
        });
        coinText.x = this.calcLength(276);
        coinText.y = this.calcLength(150);
        this.resultNoBetContainer.addChild(coinText);

        this.resultNoBetContainer.visible = false;
    }

    initWaitingBattleResult = async () => {
        this.waitingBattleResultContainer.boundsArea = new Rectangle(0, 0, this.calcLength(670), this.calcLength(280));
        this.waitingBattleResultContainer.x = this.calcLength(40);

        //bg
        const bgAfterChoose = await Assets.load(bg_after_choose);
        const bg1 = Sprite.from(bgAfterChoose);
        bg1.width = this.calcLength(670);
        bg1.height = this.calcLength(280);
        this.waitingBattleResultContainer.addChild(bg1);

        //title
        const waitingBattleResultTitle = new BitmapText({
            text: "WAITING",
            style:  new TextStyle({
                fill: '#000000',
                stroke: 'rgba(0,0,0,1)',
                strokeThickness: 1,
                fontFamily: 'SourceCodePro-Semibold-stroke',
                fontSize: this.calcLength(28),
                letterSpacing: 6,
            })
        });
        waitingBattleResultTitle.x = this.calcLength(335);
        waitingBattleResultTitle.y = this.calcLength(55);
        waitingBattleResultTitle.anchor.set(0.5, 0.5);
        this.waitingBattleResultContainer.addChild(waitingBattleResultTitle);

        //info
        const waitingBattleResultTip = new BitmapText({
            text: "Waiting for tegen to finish the game",
            style:  new TextStyle({
                fill: '#AF9A78',
                fontFamily: 'SourceCodePro-Medium',
                fontSize: this.calcLength(24),
                letterSpacing: 1
            })
        });
        waitingBattleResultTip.x = this.calcLength(335);
        waitingBattleResultTip.y = this.calcLength(171);
        waitingBattleResultTip.anchor.set(0.5, 0.5);
        this.waitingBattleResultContainer.addChild(waitingBattleResultTip);

        this.waitingBattleResultContainer.visible = false;
    }

    initInfoCard = async () => {
        this.openInfoContainer.zIndex = 100;
        this.openInfoContainer.boundsArea = new Rectangle(0,0,this.calcLength(170),this.calcLength(86));


        const points = [{x: 0, y:10}, {x: 0, y:76}
            , {x: 10, y:76}, {x: 10, y:86}, 
            {x: 160, y:86}, {x: 160, y:76}, {x: 170, y:76}, {x: 170, y:10}, {x: 160, y:10}, {x: 160, y:0}, {x: 10, y:0}, {x: 10, y:10}
        ];

        const openBorder = new Graphics();
        openBorder.moveTo(this.calcLength(10), this.calcLength(10));
        for(let i = 0; i < points.length; i++){
            const item = points[i]
            openBorder.lineTo(this.calcLength(item.x), this.calcLength(item.y));
        }
        openBorder.fill(0x473421).stroke({ width: 1, color: 0x473421 });
        // openBorder.zIndex = 11;


        const closeBorder = new Graphics();
        closeBorder.moveTo(this.calcLength(10), this.calcLength(10));
        for(let i = 0; i < points.length; i++){
            const item = points[i]
            closeBorder.lineTo(this.calcLength(item.x), this.calcLength(item.y));
        }
        closeBorder.fill(0x473421).stroke({ width: 1, color: 0x473421 });
        // closeBorder.zIndex = 11;


        //open title
        const openTitle = new BitmapText({
            x: this.calcLength(19),
            y: this.calcLength(12),
            text: 'Open price',
            style:  new TextStyle({
                fill: '#FFFFFF',
                fontSize: this.calcLength(22),
                fontFamily: 'SourceCodePro-Medium',
            })
        })

        //close title
        const closeTitle = new BitmapText({
            x: this.calcLength(19),
            y: this.calcLength(12),
            text: 'Close price',
            style:  new TextStyle({
                fill: '#FFFFFF',
                fontSize: this.calcLength(22),
                fontFamily: 'SourceCodePro-Medium',
            })
        })


        //open value
        this.openValueGraph.x = this.calcLength(19);
        this.openValueGraph.y = this.calcLength(46);
        this.openValueGraph.text = '56899'
        this.openValueGraph.style =  new TextStyle({
            fill: '#FFFFFF',
            fontSize: this.calcLength(24),
            fontFamily: 'SourceCodePro-Medium',
        })

        //close value
        this.closeValueGraph.x = this.calcLength(19);
        this.closeValueGraph.y = this.calcLength(46);
        this.closeValueGraph.text = '78990'
        this.closeValueGraph.style =  new TextStyle({
            fill: '#FFFFFF',
            fontSize: this.calcLength(24),
            fontFamily: 'SourceCodePro-Medium',
        })

        this.openInfoContainer.addChild(openBorder);
        this.openInfoContainer.addChild(openTitle);
        this.openInfoContainer.addChild(this.openValueGraph);
        this.openInfoContainer.zIndex = 12;
        this.openInfoContainer.visible = false;
        this.topContainer.addChild(this.openInfoContainer);

        this.closeInfoContainer.addChild(closeBorder);
        this.closeInfoContainer.addChild(closeTitle);
        this.closeInfoContainer.addChild(this.closeValueGraph);
        this.closeInfoContainer.zIndex = 12;
        this.closeInfoContainer.visible = false;
        this.topContainer.addChild(this.closeInfoContainer);

        this.topContainer.addChild(this.lineTopBorder);
        this.topContainer.addChild(this.lineBottomBorder);
    }
}