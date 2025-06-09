import {Container, Assets, Sprite, Graphics, GraphicsContext, Text, Rectangle, AnimatedSprite, RenderContainer, Bounds, BitmapFont, BitmapText, TextStyle, CLEAR } from 'pixi.js';
import { Stage } from '../base';

// import img_clock from '../../assets/images/battle/ic-clock.png';
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
// import img_coin from '../../assets/images/common/ic-coin.png';

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



import bg from '../../assets/img/battle/bg.png';
import bg_bottom from '../../assets/img/battle/bg-bottom.png';
import main_content_bg from '../../assets/img/battle/main-content-bg.png';
import quit_img from '../../assets/img/battle/quit.png';
import img_coin from '../../assets/img/common/coin.png';
import left_user from '../../assets/img/battle/left-user.png';
import right_user from '../../assets/img/battle/right-user.png';
import title_bg from '../../assets/img/battle/title-bg.png';
import btn_img from '../../assets/img/battle/btn.png';
import bullish_img from '../../assets/img/battle/bullish.png';
import bearish_img from '../../assets/img/battle/bearish.png';
import win_avatar from '../../assets/img/battle/win-avatar.png';
import lose_avatar from '../../assets/img/battle/lose-avatar.png';
import after_choose_bg from '../../assets/img/battle/after-choose-bg.png';
import early_bouns_img from '../../assets/img/adventure/early-bouns.png';
import img_clock from '../../assets/img/battle/clock.png';




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
    markContainer: Container = new Container()
    markGraphics: Text[] = [];
    clockContainer: Container = new Container()
    clockGraph = new BitmapText({
        text: "",
    })
    countdownNum = new BitmapText({
        text: "",
    })

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
        text: "Result in 2s",
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
    winCoinGraph = new Text()
    resultWinContainer: Container = new Container();
    resultLoseContainer: Container = new Container();
    resultDrawContainer: Container = new Container();
    resultNoBetContainer: Container = new Container();

    // loseLineContainer: Container = new Container();

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
        await this.app.init({ background: '#E5D2B2', resizeTo: document.getElementById("ghosty-page"), preference })
        this.app.ticker.maxFPS = 120
        document.getElementById(elementId)!.appendChild(this.app.canvas);


        await this.initBg();
        
        this.topContainer.addChild(this.line)
        await this.initTopContainer();
        await this.initBarsGraph()
        await this.initBottom();
        
        await this.initMenu();
        await this.initMark();
        await this.initCountdown();
        // this.initMail();
        await this.initEarlyBouns();
        this.initInfoCard();
        this.initFireWall();
        this.initStrikeChannelContainer()
    }
    

    public async destroy() {
        await super.destroy()
    }

    initBg = async () => {
        const bg_img = await Assets.load(bg);
        const pageBg = Sprite.from(bg_img);
        pageBg.width = this.calcLength(750);
        pageBg.height = this.app.screen.height;
        this.app.stage.addChild(pageBg)

        const bg_bottom_img = await Assets.load(bg_bottom);
        const pageBgBottom = Sprite.from(bg_bottom_img);
        pageBgBottom.width = this.calcLength(750);
        pageBgBottom.height = this.calcLength(350);
        pageBgBottom.y = this.app.screen.height - this.calcLength(350);
        this.app.stage.addChild(pageBgBottom)


        const main_content_bg_img = await Assets.load(main_content_bg);
        const mainContentBg = Sprite.from(main_content_bg_img);
        mainContentBg.width = this.calcLength(734);
        mainContentBg.height = this.app.screen.height - this.calcLength(312 + 407);
        mainContentBg.x = this.calcLength(8);
        mainContentBg.y = this.calcLength(312);
        this.app.stage.addChild(mainContentBg)
    }

    initMenu = async () => {
        this.bannerContainer.x = this.calcLength(0);
        this.bannerContainer.y = this.calcLength(0);
        this.bannerContainer.boundsArea = new Rectangle(0, 0, this.calcLength(750), this.calcLength(350));


        //TradingPair
        const tradingPair = new BitmapText({
            text: `${this.data.instId.replace('-', '/')}`,
            style:  new TextStyle({
                fill: '#282722',
                fontSize: this.calcLength(36),
                fontFamily: 'Gagalin',
                stroke: '#CAAD95',
                strokeThickness: 1,
            })
        })
        tradingPair.x = this.calcLength(375);
        tradingPair.y = this.calcLength(86);
        tradingPair.anchor.set(0.5, 0.5);
        tradingPair.label = 'tradingPair';
        this.bannerContainer.addChild(tradingPair);


        //leave
        const quitImg = await Assets.load(quit_img);
        const leaveIcon = Sprite.from(quitImg);
        leaveIcon.width = this.calcLength(36);
        leaveIcon.height = this.calcLength(36);
        leaveIcon.x = this.calcLength(375) + tradingPair.width / 2 + this.calcLength(12);
        leaveIcon.y = this.calcLength(70);
        leaveIcon.eventMode = 'static';
        leaveIcon.cursor = 'pointer';
        leaveIcon.on('pointerdown', () => {
            this.events["leaveBattle"]();
        })
        this.bannerContainer.addChild(leaveIcon);


        //coin
        this.rewardsContainer.x = this.calcLength(215);
        this.rewardsContainer.y = this.calcLength(120);

        //coin-bg
        const coinBg = new Graphics();
        coinBg.beginFill(0xCAAD95);
        coinBg.lineStyle(2, 0x60483A); 
        coinBg.drawRoundedRect(0, 0, this.calcLength(320), this.calcLength(66), this.calcLength(10));
        coinBg.endFill();
        this.rewardsContainer.addChild(coinBg);

        //coin-text
        const rewards = new BitmapText({
            text: "13",
            style: {
                fill: '#3F3027',
                fontSize: this.calcLength(40),
                fontFamily: 'LogoSC LongZhuTi',
            }
        });
        rewards.x = this.calcLength(160 - 50);
        rewards.y = this.calcLength(33);
        rewards.label = 'rewards'
        rewards.anchor.set(0, 0.5);
        this.rewardsContainer.addChild(rewards);

        //coin-icon
        const imgCoin = await Assets.load(img_coin);
        const coinIcon = Sprite.from(imgCoin);
        coinIcon.x = this.calcLength(240);
        coinIcon.y = this.calcLength(13);
        coinIcon.width = this.calcLength(40);
        coinIcon.height = this.calcLength(40);
        coinIcon.label = 'coinIcon'
        this.rewardsContainer.addChild(coinIcon);
        // this.rewardsContainer.pivot.set(0, this.rewardsContainer.height / 2);
        this.bannerContainer.addChild(this.rewardsContainer);


        //my avatar
        // const myAvatarImg = await Assets.load(`${window.location.origin}/img/avatar${this.data.myAvatarIndex}.png`);
        const myAvatarImg = await Assets.load(left_user);
        const myAvatar = Sprite.from(myAvatarImg);
        myAvatar.width = this.calcLength(147);
        myAvatar.height = this.calcLength(147);
        myAvatar.x = this.calcLength(33);
        myAvatar.y = this.calcLength(200);
        this.bannerContainer.addChild(myAvatar);

        //my name
        // const myName = new BitmapText({
        //     text: "You",
        //     style: {
        //         fill: '#FBEED0',
        //         fontSize: this.calcLength(24),
        //         fontFamily: 'SourceCodePro-Bold',
        //     }
        // });
        // myName.x = this.calcLength(40);
        // myName.y = this.calcLength(136);
        // myName.anchor.set(0, 0.5);
        // this.bannerContainer.addChild(myName);


        //antagonist avatar
        // const antagonistAvatarImg = await Assets.load(`${window.location.origin}/img/avatar1.png`);
        const antagonistAvatarImg = await Assets.load(right_user);
        const antagonistAvatar = Sprite.from(antagonistAvatarImg);
        antagonistAvatar.width = this.calcLength(147);
        antagonistAvatar.height = this.calcLength(151);
        antagonistAvatar.x = this.calcLength(572);
        antagonistAvatar.y = this.calcLength(198);
        this.bannerContainer.addChild(antagonistAvatar);


        //antagonist name
        // const antagonistName = new BitmapText({
        //     text: '',
        //     style: {
        //         fill: '#FBEED0',
        //         fontSize: this.calcLength(24),
        //         fontFamily: 'SourceCodePro-Bold',
        //     }
        // });
        // antagonistName.x = this.calcLength(710);
        // antagonistName.y = this.calcLength(136);
        // antagonistName.anchor.set(1, 0.5);
        // antagonistName.label = 'antagonistName'
        // this.bannerContainer.addChild(antagonistName);
        
        this.initScoreboardGraph();
        this.initBattleResultsGraph();

        this.app.stage.addChild(this.bannerContainer);
    }

    initScoreboardGraph = async () => {
        const myScoreContainer: Container = new Container()
        myScoreContainer.x = this.calcLength(210);
        myScoreContainer.y = this.calcLength(211);

        for(let i = 0; i<5; i++){
            const numBg = new Graphics();
            numBg.beginFill(0xCAAD95);
            numBg.lineStyle(2, 0x60483A); 
            numBg.drawRoundedRect(0, 0, this.calcLength(24), this.calcLength(38), this.calcLength(4));
            numBg.endFill();
            numBg.x = this.calcLength(i * 24);
            myScoreContainer.addChild(numBg);
        }


        let myNums = []
        for(let i = 0; i<5; i++){
            const num = new BitmapText({
                text: '0',
                style: {
                    fill: '#3F3027',
                    fontSize: this.calcLength(24),
                    fontFamily: 'LogoSC LongZhuTi',
                }
            });
            num.x = this.calcLength(12) + this.calcLength(i * 24);
            num.y = this.calcLength(19);
            num.anchor.set(0.5, 0.5);
            myScoreContainer.addChild(num);
            myNums.push(num);
        }
        this.myScoreNumsText = myNums;
        this.bannerContainer.addChild(myScoreContainer);


        const antagonistScoreContainer: Container = new Container()
        antagonistScoreContainer.x = this.calcLength(410);
        antagonistScoreContainer.y = this.calcLength(211);

        for(let i = 0; i<5; i++){
            const numBg = new Graphics();
            numBg.beginFill(0xCAAD95);
            numBg.lineStyle(2, 0x60483A); 
            numBg.drawRoundedRect(0, 0, this.calcLength(24), this.calcLength(38), this.calcLength(4));
            numBg.endFill();
            numBg.x = this.calcLength(i * 24);
            antagonistScoreContainer.addChild(numBg);
        }


        let antagonistNums = []
        for(let i = 0; i<5; i++){
            const num = new BitmapText({
                text: '0',
                style: {
                    fill: '#3F3027',
                    fontSize: this.calcLength(24),
                    fontFamily: 'LogoSC LongZhuTi',
                }
            });
            num.x = this.calcLength(12) + this.calcLength(i * 24);
            num.y = this.calcLength(19);
            num.anchor.set(0.5, 0.5);
            antagonistScoreContainer.addChild(num);
            antagonistNums.push(num);
        }
        this.antagonistScoreNumsText = antagonistNums;
        this.bannerContainer.addChild(antagonistScoreContainer);
    }

    initBattleResultsGraph = async () => {
        const myBattleResultsContainer: Container = new Container()
        myBattleResultsContainer.x = this.calcLength(210);
        myBattleResultsContainer.y = this.calcLength(259);
        let myBattles = []
        for(let i = 0; i<10; i++){
            const graphic = new Graphics();
            graphic.beginFill(0x60483A);
            graphic.lineStyle(1, 0x60483A); 
            graphic.drawRoundedRect(0, 0, this.calcLength(10), this.calcLength(10), this.calcLength(10));
            graphic.endFill();
            graphic.x = this.calcLength(12 * i);
            myBattleResultsContainer.addChild(graphic);
            myBattles.push(graphic);
        }
        this.myBattleResultsGraphics = myBattles;
        this.bannerContainer.addChild(myBattleResultsContainer);


        const antagonistBattleResultsContainer: Container = new Container()
        antagonistBattleResultsContainer.x = this.calcLength(410);
        antagonistBattleResultsContainer.y = this.calcLength(259);
        let antagonistBattles = [];
        for(let i = 0; i<10; i++){
            const graphic = new Graphics();
            graphic.beginFill(0x60483A);
            graphic.lineStyle(1, 0x60483A); 
            graphic.drawRoundedRect(0, 0, this.calcLength(10), this.calcLength(10), this.calcLength(10));
            graphic.endFill();
            graphic.x = this.calcLength(12 * i);
            antagonistBattleResultsContainer.addChild(graphic);
            antagonistBattles.push(graphic);
        }
        this.antagonistBattleResultsGraphics = antagonistBattles;
        this.bannerContainer.addChild(antagonistBattleResultsContainer);
    }

    initTopContainer = async () => {
        // this.topContainer.boundsArea = new Rectangle(0, 0, this.app.screen.width, this.app.screen.height / 2)
        const h = this.app.screen.height - this.calcLength(312 + 407 + 100 + 100);
        this.topContainer.x = this.calcLength(90);
        this.topContainer.y = this.calcLength(312 + 100);
        this.topContainer.boundsArea = new Rectangle(0, 0, this.calcLength(480), h);
        this.topContainer.zIndex = 1;

        this.klineContainer.x = 0;
        this.klineContainer.y = 0;
        this.klineContainer.height = h;
        this.klineContainer.boundsArea = new Rectangle(0, 0, this.calcLength(480), h);
        let mask = new Graphics()
        // Add the rectangular area to show
        .rect(this.calcLength(7),0,this.calcLength(480),h)
        .fill(0xffffff).stroke({ width: 4, color: 0xffd900 })
        this.topContainer.mask = mask
        this.topContainer.addChild(mask)
        this.topContainer.addChild(this.klineContainer)
        this.app.stage.addChild(this.topContainer)
    }

    initMark = async () => {
        const h = this.app.screen.height - this.calcLength(312 + 407 + 100 + 100);
        this.markContainer.x = this.calcLength(90);
        this.markContainer.y = this.calcLength(312 + 100);
        this.markContainer.height = h;
        this.markContainer.boundsArea = new Rectangle(0, 0, this.calcLength(570), h);


        //Mark-line
        for (let i = 0; i < 10; i ++) {
            const graphic = new Graphics().rect(0, 0, this.calcLength(480), 1).fill(0x75695F);
            graphic.x = this.calcLength(0);
            graphic.y = this.calcLength(14) + this.klineContainer.height / 10 * i;
            this.markContainer.addChild(graphic)
        }


        //Mark-value
        let marks = []
        for (let i = 0; i < 10; i ++) {
            const graphic = new BitmapText({
                text: '',
                style:{
                    fill: `#CAAD95`,
                    fontSize: this.calcLength(18),
                    fontFamily: 'LogoSC LongZhuTi',
                },
                x:  this.calcLength(490),
                y:  this.klineContainer.height / 10 * i
            })
            graphic.zIndex = 10
            graphic.alpha = 0.4
            marks.push(graphic);
            this.markContainer.addChild(graphic)
        }
        this.markGraphics = marks;

        this.markContainer.visible = false;
        this.app.stage.addChild(this.markContainer);
    }

    initBarsGraph = async () => {
        this.data.barWidth = this.calcLength(94)
        let bars = []
        for (let i = 0; i < LIMIT; i ++) {
          let graphic = new Graphics()
          this.klineContainer?.addChild(graphic)
          graphic.zIndex = 1;
          bars.push(graphic)
        }
        this.barGraphics = bars
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

    initCountdown = async () => {
        this.countdownNum.style = {
            fill: `#CAAD95`,
            fontSize: this.calcLength(100),
            fontFamily: 'Gagalin',
        }
        this.countdownNum.x = this.calcLength(375);
        this.countdownNum.y = this.calcLength(312) + (this.app.screen.height - this.calcLength(312 + 407)) / 2;
        this.countdownNum.anchor.set(0.5, 0.5);
        this.countdownNum.zIndex = 20;

        this.app.stage.addChild(this.countdownNum);
    }

    initStrikeChannelContainer = async () => {
        this.strikeChannelContainer.x = this.calcLength(40)
        this.strikeChannelContainer.y = this.app.screen.height - this.calcLength(280 + 40 + 82);
        this.winFireAsset = await Assets.load(`${window.location.origin}/img/win_fire.json`)
        this.particlesAsset = await Assets.load(`${window.location.origin}/img/particles.json`)

        this.app.stage.addChild(this.strikeChannelContainer)

        this.strikeChannelContainer.visible = true
    }

    initStrikeContainer = async () => {
        const sheet = await Assets.load(`${window.location.origin}/img/fire.json`);
        const anim = new AnimatedSprite(sheet.animations['run']);
        anim.label = "anim"
        anim.animationSpeed = 0.1666;
        anim.stop()
        anim.scale = this.app.screen.width / 750;
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

        const firewallLeft = await Assets.load(`${window.location.origin}/img/firewall-left.json`);
        const firewallRight = await Assets.load(`${window.location.origin}/img/firewall-right.json`);
        const firewallLeftAnim = new AnimatedSprite(firewallLeft.animations['run']);
        firewallLeftAnim.label = "left"
        firewallLeftAnim.animationSpeed = 0.15;
        firewallLeftAnim.stop();
        firewallLeftAnim.scale = this.app.screen.width / 750;
        firewallLeftAnim.x = 0
        firewallLeftAnim.y = 0;
        this.fireWallContainer.addChild(firewallLeftAnim);

        const firewallRightAnim = new AnimatedSprite(firewallRight.animations['run']);
        firewallRightAnim.label = "right"
        firewallRightAnim.animationSpeed = 0.15;
        firewallRightAnim.stop();
        firewallRightAnim.anchor.set(1, 0)
        firewallRightAnim.scale = this.app.screen.width / 750;
        firewallRightAnim.x = this.app.screen.width
        firewallRightAnim.y = 0;
        this.fireWallContainer.addChild(firewallRightAnim);

        this.fireWallContainer.zIndex = 50;
        this.fireWallContainer.visible = false;

        this.app.stage.addChild(this.fireWallContainer);
    }

    initEarlyBouns = async () => {
        this.earlyBounsContainer.boundsArea = new Rectangle(0, 0, this.calcLength(290), this.calcLength(150));
        this.earlyBounsContainer.x = this.calcLength(4 + 145);
        // this.earlyBounsContainer.x = this.calcLength(400 + 145);
        this.earlyBounsContainer.y = this.app.screen.height - this.calcLength(500);
        this.earlyBounsContainer.width = this.calcLength(290);
        this.earlyBounsContainer.height = this.calcLength(150);
        this.earlyBounsContainer.zIndex = 11;

        //bg
        const imgEarlyBouns = await Assets.load(early_bouns_img);
        const bg = Sprite.from(imgEarlyBouns);
        bg.width = this.calcLength(272);
        bg.height = this.calcLength(263);
        this.earlyBounsContainer.addChild(bg);


        //coins
        const coins = new BitmapText({
            text: '+1000',
            style:  new TextStyle({
                fill: '#E78712',
                stroke: '#000000',
                fontFamily: 'Gagalin',
                fontSize: this.calcLength(40),
            })
        })
        coins.label = "coins"
        coins.x = this.calcLength(125);
        coins.y = this.calcLength(130);
        coins.anchor.set(0.5, 0.5);
        coins.rotation = -Math.PI / 8;
        this.earlyBounsContainer.addChild(coins);
        this.earlyBounsContainer.pivot.set(this.earlyBounsContainer.width / 2, this.earlyBounsContainer.height / 2);

        this.earlyBounsContainer.visible = false;
        this.app.stage.addChild(this.earlyBounsContainer);
    }

    initBottom = async () => {
        const bottomContainer: Container = new Container()
        bottomContainer.y = this.app.screen.height - this.calcLength(393);
        bottomContainer.boundsArea = new Rectangle(0, 0, this.calcLength(750), this.calcLength(393));

        // Loading
        await this.initLoadingBoard();
        bottomContainer.addChild(this.loadingBoardContainer);


        await this.initStrikeContainer();
        await this.initBeforeChoose();
        bottomContainer.addChild(this.beforeChooseContainer);

        // YOUR CHOICE 1-3
        await this.initAfterChoosen();
        bottomContainer.addChild(this.afterChooseContainer);

        //result 1-3
        await this.initResultBullish();
        bottomContainer.addChild(this.resultBullishContainer);
        await this.initResultBearish();
        bottomContainer.addChild(this.resultBearishContainer);
        await this.initResultNeutral();
        bottomContainer.addChild(this.resultNeutralContainer);

        // //result 1-4
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

    initLoadingBoard = async () => {
        this.loadingBoardContainer.boundsArea = new Rectangle(0, 0, this.calcLength(750), this.calcLength(393));

        //title
        const bgTitle = await Assets.load(title_bg);
        const titleBg = Sprite.from(bgTitle);
        titleBg.width = this.calcLength(590);
        titleBg.height = this.calcLength(94);
        titleBg.x = this.calcLength(80);
        this.loadingBoardContainer.addChild(titleBg);

        const title = new BitmapText({
            text: 'WAITING',
            style:  new TextStyle({
                fill: '#60483A',
                fontFamily: 'Gagalin',
                fontSize: this.calcLength(48),
            })
        })
        title.x = this.calcLength(375);
        title.y = this.calcLength(36);
        title.anchor.set(0.5, 0.5);
        this.loadingBoardContainer.addChild(title);


        //bg
        const bgAfterChoose = await Assets.load(after_choose_bg);
        const infoBg = Sprite.from(bgAfterChoose);
        infoBg.width = this.calcLength(590);
        infoBg.height = this.calcLength(132);
        infoBg.x = this.calcLength(80);
        infoBg.y = this.calcLength(125);
        this.loadingBoardContainer.addChild(infoBg);


        //tip
        const tipText = new BitmapText({
            text: "Battle is about to begin",
            style:  new TextStyle({
                fill: '#282722',
                fontFamily: 'Gagalin',
                fontSize: this.calcLength(48),
            })
        });
        tipText.x = this.calcLength(375);
        tipText.y = this.calcLength(182);
        tipText.anchor.set(0.5, 0.5);
        this.loadingBoardContainer.addChild(tipText);

        this.loadingBoardContainer.visible = true;
    }

    initBeforeChoose = async () => {
        this.beforeChooseContainer.boundsArea = new Rectangle(0, 0, this.calcLength(750), this.calcLength(393));

        //title
        const bgTitle = await Assets.load(title_bg);
        const titleBg = Sprite.from(bgTitle);
        titleBg.width = this.calcLength(590);
        titleBg.height = this.calcLength(94);
        titleBg.x = this.calcLength(80);
        this.beforeChooseContainer.addChild(titleBg);

        const title = new BitmapText({
            text: 'PLACE YOUR BET',
            style:  new TextStyle({
                fill: '#60483A',
                fontFamily: 'Gagalin',
                fontSize: this.calcLength(48),
            })
        })
        title.x = this.calcLength(375);
        title.y = this.calcLength(36);
        title.anchor.set(0.5, 0.5);
        this.beforeChooseContainer.addChild(title);


        await this.initClock()


        //bullish btn
        const btnImg = await Assets.load(btn_img);
        const bullishBtnIcon = Sprite.from(btnImg);
        bullishBtnIcon.width = this.calcLength(173);
        bullishBtnIcon.height = this.calcLength(153);
        bullishBtnIcon.x = this.calcLength(88);
        bullishBtnIcon.y = this.calcLength(39);
        bullishBtnIcon.eventMode = 'static';
        bullishBtnIcon.cursor = 'pointer';
        bullishBtnIcon.on('pointerdown', () => {
            if(this.data.selection){
                return;
            }
            this.makeChoice('bullish');
        })
        this.beforeChooseContainer.addChild(bullishBtnIcon);


        const bullishImg = await Assets.load(bullish_img);
        const bullishBtn = Sprite.from(bullishImg);
        bullishBtn.width = this.calcLength(287);
        bullishBtn.height = this.calcLength(83);
        bullishBtn.x = this.calcLength(31);
        bullishBtn.y = this.calcLength(193);
        bullishBtn.eventMode = 'static';
        bullishBtn.cursor = 'pointer';
        bullishBtn.on('pointerdown', () => {
            if(this.data.selection){
                return;
            }
            this.makeChoice('bullish');
        })
        this.beforeChooseContainer.addChild(bullishBtn);


        //bearish btn
        const bearishBtnIcon = Sprite.from(btnImg);
        bearishBtnIcon.width = this.calcLength(173);
        bearishBtnIcon.height = this.calcLength(153);
        bearishBtnIcon.x = this.calcLength(496);
        bearishBtnIcon.y = this.calcLength(39);
        bearishBtnIcon.eventMode = 'static';
        bearishBtnIcon.cursor = 'pointer';
        bearishBtnIcon.on('pointerdown', () => {
            if(this.data.selection){
                return;
            }
            this.makeChoice('bearish');
        })
        this.beforeChooseContainer.addChild(bearishBtnIcon);


        const bearishImg = await Assets.load(bearish_img);
        const bearishBtn = Sprite.from(bearishImg);
        bearishBtn.width = this.calcLength(287);
        bearishBtn.height = this.calcLength(83);
        bearishBtn.x = this.calcLength(437);
        bearishBtn.y = this.calcLength(193);
        bearishBtn.eventMode = 'static';
        bearishBtn.cursor = 'pointer';
        bearishBtn.on('pointerdown', () => {
            if(this.data.selection){
                return;
            }
            this.makeChoice('bearish');
        })
        this.beforeChooseContainer.addChild(bearishBtn);
        
        this.beforeChooseContainer.visible = false;
    }

    initClock = async () => {
        const clockContainer: Container = new Container();
        clockContainer.x = this.app.screen.width / 2 - this.calcLength(40);
         clockContainer.y = this.calcLength(101);
        clockContainer.boundsArea = new Rectangle(0, 0, this.calcLength(79), this.calcLength(110));
        clockContainer.zIndex = 11

        const imgClock = await Assets.load(img_clock);
        const clock = Sprite.from(imgClock);
        clock.anchor.set(0.5, 0.5); 
        clock.x = this.calcLength(40);
        clock.y = this.calcLength(55);
        clock.width = this.calcLength(79);
        clock.height = this.calcLength(110);
        clockContainer.addChild(clock);
        // clockContainer.visible = false;


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


        this.clockGraph.style = {
            fill: '#3F3027',
            fontSize: this.calcLength(35),
            fontFamily: "LogoSC LongZhuTi",
            align: 'center'
        }
        this.clockGraph.x = this.calcLength(40);
        this.clockGraph.y = this.calcLength(70);
        this.clockGraph.anchor.set(0.5, 0.5);
        clockContainer.addChild(this.clockGraph);

        this.beforeChooseContainer.addChild(clockContainer);
    }

    initAfterChoosen = async () => {
        this.afterChooseContainer.boundsArea = new Rectangle(0, 0, this.calcLength(750), this.calcLength(393));

        //title
        const bgTitle = await Assets.load(title_bg);
        const titleBg = Sprite.from(bgTitle);
        titleBg.width = this.calcLength(590);
        titleBg.height = this.calcLength(94);
        titleBg.x = this.calcLength(80);
        this.afterChooseContainer.addChild(titleBg);

        this.yourChoiceTitleGraph.x = this.calcLength(375);
        this.yourChoiceTitleGraph.y = this.calcLength(36);
        this.yourChoiceTitleGraph.anchor.set(0.5, 0.5);
        this.yourChoiceTitleGraph.style =  new TextStyle({
            fill: '#60483A',
            fontFamily: 'Gagalin',
            fontSize: this.calcLength(48),
        })
        this.afterChooseContainer.addChild(this.yourChoiceTitleGraph);



        //bg
        const bgAfterChoose = await Assets.load(after_choose_bg);
        const infoBg = Sprite.from(bgAfterChoose);
        infoBg.width = this.calcLength(590);
        infoBg.height = this.calcLength(132);
        infoBg.x = this.calcLength(80);
        infoBg.y = this.calcLength(125);
        this.afterChooseContainer.addChild(infoBg);


        //info
        this.yourChoiceInfoGraph.x = this.calcLength(375);
        this.yourChoiceInfoGraph.y = this.calcLength(162);
        this.yourChoiceInfoGraph.anchor.set(0.5, 0.5);
        this.yourChoiceInfoGraph.style =  new TextStyle({
            fill: '#282722',
            fontFamily: 'Gagalin',
            fontSize: this.calcLength(48),
        })
        this.afterChooseContainer.addChild(this.yourChoiceInfoGraph);

        //result-countDown
        this.resultCountDownGraph.x = this.calcLength(375);
        this.resultCountDownGraph.y = this.calcLength(193);
        this.resultCountDownGraph.anchor.set(0.5, 0);
        this.resultCountDownGraph.style =  new TextStyle({
            fill: '#3F3027',
            fontFamily: 'LogoSC LongZhuTi',
            fontSize: this.calcLength(32),
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
        this.resultWinContainer.boundsArea = new Rectangle(0, 0, this.calcLength(673), this.calcLength(283));
        this.resultWinContainer.x = this.calcLength(38);

        //bg
        const sheet = await Assets.load(`${window.location.origin}/img/battle-win.json`);
        const anim = new AnimatedSprite(sheet.animations['run']);
        anim.label = 'winanim'
        anim.animationSpeed = 0.1666;
        anim.stop();
        anim.scale = this.app.screen.width / 750;
        anim.x = 0
        anim.y = 0
        this.resultWinContainer.addChild(anim);

        //avatar
        const imgWin = await Assets.load(win_avatar);
        const winAvatar = Sprite.from(imgWin);
        winAvatar.width = this.calcLength(200);
        winAvatar.height = this.calcLength(200);
        winAvatar.x = this.calcLength(76);
        winAvatar.y = this.calcLength(31);
        this.resultWinContainer.addChild(winAvatar);


        const winText = new Text("You Win!", {
            fill: '#272622',
            stroke: '#FDEF55',
            strokeThickness: 4,
            fontFamily: 'Gagalin',
            fontSize: this.calcLength(48),
        });
        winText.x = this.calcLength(344);
        winText.y = this.calcLength(76);
        this.resultWinContainer.addChild(winText);

        //coinText
        this.winCoinGraph =  new Text("",{
            fill: '#272622',
            fontFamily: 'LogoSC LongZhuTi',
            fontSize: this.calcLength(32),
            stroke: '#FDEF55',
            strokeThickness: 3,
        })
        this.winCoinGraph.x = this.calcLength(344);
        this.winCoinGraph.y = this.calcLength(140);
        this.resultWinContainer.addChild(this.winCoinGraph);

        this.resultWinContainer.visible = false;
    }

    initResultLose = async () => {
        this.resultLoseContainer.boundsArea = new Rectangle(0, 0, this.calcLength(673), this.calcLength(283));
        this.resultLoseContainer.x = this.calcLength(38);

        //bg
        const sheet = await Assets.load(`${window.location.origin}/img/battle-lose.json`);
        const anim = new AnimatedSprite(sheet.animations['run']);
        anim.label = 'winanim'
        anim.animationSpeed = 0.1666;
        anim.stop();
        anim.scale = this.app.screen.width / 750;
        anim.x = 0
        anim.y = 0
        this.resultLoseContainer.addChild(anim);

        //avatar
        const imgLose = await Assets.load(lose_avatar);
        const loseAvatar = Sprite.from(imgLose);
        loseAvatar.width = this.calcLength(200);
        loseAvatar.height = this.calcLength(200);
        loseAvatar.x = this.calcLength(76);
        loseAvatar.y = this.calcLength(31);
        this.resultLoseContainer.addChild(loseAvatar);

        const loseText = new Text("YOU lose", {
            fill: '#272622',
            fontFamily: 'Gagalin',
            fontSize: this.calcLength(48),
            stroke: '#7BB4C7',
            strokeThickness: 4,
        });
        loseText.x = this.calcLength(344);
        loseText.y = this.calcLength(76);
        this.resultLoseContainer.addChild(loseText);

        //coinText
        const coinText = new Text('-100', {
            fill: '#272622',
            fontFamily: 'LogoSC LongZhuTi',
            fontSize: this.calcLength(32),
            stroke: '#7BB4C7',
            strokeThickness: 3,
        });
        coinText.x = this.calcLength(344);
        coinText.y = this.calcLength(140);
        this.resultLoseContainer.addChild(coinText);

        this.resultLoseContainer.visible = false;
    }

    initResultDraw = async () => {
        this.resultDrawContainer.boundsArea = new Rectangle(0, 0, this.calcLength(673), this.calcLength(283));
        this.resultDrawContainer.x = this.calcLength(38);

        //bg
        const sheet = await Assets.load(`${window.location.origin}/img/battle-draw.json`);
        const anim = new AnimatedSprite(sheet.animations['run']);
        anim.label = 'winanim'
        anim.animationSpeed = 0.1666;
        anim.stop();
        anim.scale = this.app.screen.width / 750;
        anim.x = 0
        anim.y = 0
        this.resultDrawContainer.addChild(anim);

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
        this.waitingBattleResultContainer.boundsArea = new Rectangle(0, 0, this.calcLength(750), this.calcLength(393));

        //title
        const bgTitle = await Assets.load(title_bg);
        const titleBg = Sprite.from(bgTitle);
        titleBg.width = this.calcLength(590);
        titleBg.height = this.calcLength(94);
        titleBg.x = this.calcLength(80);
        this.waitingBattleResultContainer.addChild(titleBg);

        const title = new BitmapText({
            text: 'WAITING',
            style:  new TextStyle({
                fill: '#60483A',
                fontFamily: 'Gagalin',
                fontSize: this.calcLength(48),
            })
        })
        title.x = this.calcLength(375);
        title.y = this.calcLength(36);
        title.anchor.set(0.5, 0.5);
        this.waitingBattleResultContainer.addChild(title);

        //bg
        const bgAfterChoose = await Assets.load(after_choose_bg);
        const infoBg = Sprite.from(bgAfterChoose);
        infoBg.width = this.calcLength(590);
        infoBg.height = this.calcLength(132);
        infoBg.x = this.calcLength(80);
        infoBg.y = this.calcLength(125);
        this.waitingBattleResultContainer.addChild(infoBg);

        //info
        const waitingBattleResultTip = new BitmapText({
            text: "Waiting for tegen to finish the game",
            style:  new TextStyle({
                fill: '#282722',
                fontFamily: 'Gagalin',
                fontSize: this.calcLength(30),
            })
        });
        waitingBattleResultTip.x = this.calcLength(375);
        waitingBattleResultTip.y = this.calcLength(186);
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