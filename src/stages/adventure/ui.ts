import {Container, Assets, Sprite, Graphics, GraphicsContext, Text, Rectangle, AnimatedSprite, Texture, RenderContainer, Bounds, BitmapFont, BitmapText, TextStyle, CLEAR } from 'pixi.js';
import { Stage } from '../base';
// import img_home from '../../assets/images/zen/ic-home.png';
// import img_leaderboard from '../../assets/images/zen/ic-leaderboard.png';

// import img_clock from '../../assets/images/adventure/ic-clock.png';
import clock_img_0 from '../../assets/images/adventure/ic-0.png';
import clock_img_1 from '../../assets/images/adventure/ic-1.png';
import clock_img_2 from '../../assets/images/adventure/ic-2.png';
import clock_img_3 from '../../assets/images/adventure/ic-3.png';

// import img_history from '../../assets/images/adventure/ic-history.png';
// import img_coin from '../../assets/images/common/ic-coin.png';
// import bg_coin from '../../assets/images/adventure/bg-coin.png';
import ic_open from '../../assets/images/adventure/ic-open.png';
// import img_mail from '../../assets/images/battle/ic-mail.png';
import img_mail_message from '../../assets/images/battle/ic-mail-message.png';

import early_bouns from '../../assets/images/adventure/early-bouns.png';

import bg_before_choose from '../../assets/images/adventure/bg-before-choose.png';
import bg_after_choose from '../../assets/images/adventure/bg-after-choose.png';

import bg_result_bullish from '../../assets/images/adventure/bg-result-bullish.png';
import bg_result_bearish from '../../assets/images/adventure/bg-result-bearish.png';
import bg_result_neutral from '../../assets/images/adventure/bg-result-neutral.png';

import img_win from '../../assets/images/adventure/img-win.png';
import img_lose from '../../assets/images/adventure/img-lose.png';
import bg_lose_line_short from '../../assets/images/adventure/bg-lose-line-short.png';
import bg_lose_line_long from '../../assets/images/adventure/bg-lose-line-long.png';
import bg_result_draw from '../../assets/images/adventure/bg-result-draw.png';
import bg_result_no_bet from '../../assets/images/adventure/bg-result-no-bet.png';






import img_header from '../../assets/img/adventure/header.jpg';
import img_bottom_line from '../../assets/img/adventure/bottom-line.jpg';

import img_home from '../../assets/img/adventure/home.png';
import img_mail from '../../assets/img/adventure/mail.png';
import img_leaderboard from '../../assets/img/adventure/leaderboard.png';
import img_history from '../../assets/img/adventure/history.png';
import players_count_bg from '../../assets/img/adventure/players-count-bg.png';
import coin_count_bg from '../../assets/img/adventure/coin-count-bg.png';
import img_coin from '../../assets/img/adventure/coin.png';


import img_bullish_btn from '../../assets/img/adventure/bullish-btn.png';
import img_bearish_btn from '../../assets/img/adventure/bearish-btn.png';
import img_clock from '../../assets/img/adventure/clock.png';


// import bottom_btn_bg from '../../assets/img/adventure/bottom-btn-bg.png';
import choose_bullish_img from '../../assets/img/adventure/choose-bullish.png';
import choose_bearish_img from '../../assets/img/adventure/choose-bearish.png';
import choose_nobet_img from '../../assets/img/adventure/choose-nobet.png';
import result_bullish_img from '../../assets/img/adventure/result-bullish.png';
import result_bearish_img from '../../assets/img/adventure/result-bearish.png';
import result_neutral_img from '../../assets/img/adventure/result-neutral.png';
import final_win_img from '../../assets/img/adventure/final-win.png';
import final_lose_img from '../../assets/img/adventure/final-lose.png';
import final_nobet_img from '../../assets/img/adventure/final-nobet.png';
import final_draw_img from '../../assets/img/adventure/final-draw.png';
import light_gray_img from '../../assets/img/adventure/light-gray.png';
import light_white_img from '../../assets/img/adventure/light-white.png';
import light_result_bullish_img from '../../assets/img/adventure/light-result-bullish.png';
import light_result_bearish_img from '../../assets/img/adventure/light-result-bearish.png';
import light_result_neutral_img from '../../assets/img/adventure/light-result-neutral.png';
import light_final_win_img from '../../assets/img/adventure/light-final-win.png';
import light_final_lose_img from '../../assets/img/adventure/light-final-lose.png';


import early_bouns_img from '../../assets/img/adventure/early-bouns.png';
import circle_img from '../../assets/img/adventure/circle.png';






const LIMIT = 5

export class AdventureStageUI extends Stage {
    coinGraph = new BitmapText({
        text: "",
    })
    dateGraph = new BitmapText({
        text: "",
    })
    playerGraph = new BitmapText({
        text: "",
    })
    playerAvatarContainer: Container = new Container()

    //top
    mailContainer: Container = new Container()

    //mainContainer
    mainContainer: Container = new Container()
    mainTopCoinContainer: Container = new Container();
    klineContainer: Container = new Container()
    barGraphics: Graphics[] = [];


    //markContainer
    markGraphics: Text[] = [];
    oneContainer: Container = new Container()
    twoContainer: Container = new Container()
    threeContainer: Container = new Container()
    clockGraph = new BitmapText({
        text: "",
    })
    // clockContainer: Container = new Container()
    // clockZeroContainer: Container = new Container()
    // clockOneContainer: Container = new Container()
    // clockTwoContainer: Container = new Container()
    // clockThreeContainer: Container = new Container()

    //bottomContainer
    //bottom-before choose
    beforeChooseContainer: Container = new Container();
    // countDownGraph = new BitmapText({
    //     text: "5",
    // })

    strikeContainer: Container = new Container();
    strikeGraph = new BitmapText({
        text: "",
    })

    fireWallContainer: Container = new Container();

    coinReduceContainer: Container = new Container();
    earlyBounsContainer: Container = new Container();

    //bottom-after choose
    afterChooseContainer: Container = new Container();
    chooseBullishContainer: Container = new Container();
    chooseBearishContainer: Container = new Container();
    chooseNobetContainer: Container = new Container();

    // yourChoiceTitleGraph = new BitmapText({
    //     text: "NO BET",//YOUR CHOICE
    // })
    // yourChoiceInfoGraph = new BitmapText({
    //     text: "You did not place a bet",
    // })
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
    winCoinGraph = new BitmapText({
        text: "",
    })
    finalWinContainer: Container = new Container();
    finalLoseContainer: Container = new Container();
    finalDrawContainer: Container = new Container();
    finalNobetContainer: Container = new Container();

    loseLineContainer: Container = new Container();

    
    emptyBar = new GraphicsContext()
    line = new Graphics()
    startCircle = new Sprite();
    endCircle = new Sprite();
    lineTopBorder = new Graphics();
    lineBottomBorder = new Graphics();
    openInfoContainer: Container = new Container();
    closeInfoContainer: Container = new Container();
    strikeChannelContainer: Container = new Container()
    winFireAsset: any
    particlesAsset: any
    flyingCoins: Sprite[] = []

    data: {
        instId: 'BTC-USDT'
    }
    

    constructor() {
        super();
    }

    public async load(elementId: string, preference: "webgl" | "webgpu" | undefined)  {
        // await super.load(elementId, preference)
        // await this.app.init({ background: '#000000', resizeTo: document.body, preference })
        // this.app.ticker.maxFPS = 120
        // document.getElementById(elementId)!.appendChild(this.app.canvas);
        
        // this.mainContainer.addChild(this.line)
        // await this.initMainContainer();
        // await this.initBarsGraph()
        // await this.initBottom();
        
        // this.initMenu();
        // this.initMark();
        // this.initClock();
        // this.initCoinReduce();
        // this.initEarlyBouns();
        // this.initInfoCard();
        // this.initFireWall();
        // this.initStrikeChannelContainer()
        // this.initFlyingCoins()

        await super.load(elementId, preference)
        await this.app.init({ background: '#C0A373', resizeTo: document.getElementById("ghosty-page"), preference })
        this.app.ticker.maxFPS = 120
        document.getElementById(elementId)!.appendChild(this.app.canvas);
        this.initTop();
        this.initMainBg();
        this.initMain();
        this.initBottomLine();
        this.initBottom();
        this.initStrikeChannelContainer()
        this.initInfoCard();
        this.initEarlyBouns();
        this.initFlyingCoins();
        this.initFireWall();
    }
    

    public async destroy() {
        await super.destroy()
    }

    //顶部
    initTop = async () => {
        const topContainer: Container = new Container();
        topContainer.x = 0;
        topContainer.y = 0;
        topContainer.boundsArea = new Rectangle(0, 0, this.calcLength(750), this.calcLength(257));
        topContainer.zIndex = 1;

        //header
        const imgHeader = await Assets.load(img_header);
        const header = Sprite.from(imgHeader);
        header.width = this.calcLength(750);
        header.height = this.calcLength(160);
        header.x = 0;
        header.y = 0;
        topContainer.addChild(header);


        //top - menu
        const menuContainer: Container = new Container()
        menuContainer.x = this.calcLength(0);
        menuContainer.y = this.calcLength(174);
        menuContainer.boundsArea = new Rectangle(0, 0, this.calcLength(750), this.calcLength(72));

        //Home icon
        const imgHome = await Assets.load(img_home);
        const home = Sprite.from(imgHome);
        home.width = this.calcLength(70);
        home.height = this.calcLength(65);
        home.x = this.calcLength(45);
        home.y = this.calcLength(36);
        home.anchor.set(0, 0.5);
        home.eventMode = 'static';
        home.cursor = 'pointer';
        home.on('pointerdown', () => {
            this.events["changeRouter"]("/");
        });
        menuContainer.addChild(home);

    
        //leaderboard
        const imgLeaderboard = await Assets.load(img_leaderboard);
        const leaderboardBtn = Sprite.from(imgLeaderboard);
        leaderboardBtn.width = this.calcLength(60);
        leaderboardBtn.height = this.calcLength(65);
        leaderboardBtn.x = this.calcLength(242);
        leaderboardBtn.y = this.calcLength(36);
        leaderboardBtn.anchor.set(0, 0.5);
        leaderboardBtn.eventMode = 'static';
        leaderboardBtn.cursor = 'pointer';
        leaderboardBtn.on('pointerdown', () => {
            this.events["changeModule"]('leaderboard');
        });
        menuContainer.addChild(leaderboardBtn);
        
        //mail
        this.initMail();
        menuContainer.addChild(this.mailContainer);

        //players list
        const players = new Container();
        players.boundsArea = new Rectangle(0, 0, this.calcLength(237), this.calcLength(72));
        players.x = this.calcLength(480);
        players.y = 0;
        players.eventMode = 'static';
        players.cursor = 'pointer';
        players.on('pointerdown', () => {
            this.events["changeModule"]("adventure-online-players");
        });
    
        //players count bg
        const playersCountBgImg = await Assets.load(players_count_bg);
        const playersCountBg = Sprite.from(playersCountBgImg);
        playersCountBg.width = this.calcLength(105);
        playersCountBg.height = this.calcLength(60);
        playersCountBg.x = this.calcLength(612);
        playersCountBg.y = this.calcLength(36);
        playersCountBg.anchor.set(0, 0.5);
        menuContainer.addChild(playersCountBg);
        

        //players count text
        // this.playerGraph.text = '3'
        this.playerGraph.style = {
            fill: '#191919',
            fontSize: this.calcLength(30),
            fontFamily: 'Pixeloid Sans',
            align: 'center'
        }
        this.playerGraph.x = this.calcLength(192);
        this.playerGraph.y = this.calcLength(36);
        this.playerGraph.anchor.set(0.5, 0.5);
        players.addChild(this.playerGraph);

        //players avatar
        players.addChild(this.playerAvatarContainer);
        menuContainer.addChild(players);

        topContainer.addChild(menuContainer);
        this.app.stage.addChild(topContainer)
    }

    // initTopMenu = async () => {
    //     const menuContainer: Container = new Container()
    //     menuContainer.x = this.calcLength(0);
    //     menuContainer.y = this.calcLength(40);
    //     menuContainer.boundsArea = new Rectangle(0, 0, this.calcLength(750), this.calcLength(124));

    //     //Home icon
    //     const imgHome = await Assets.load(img_home);
    //     const home = Sprite.from(imgHome);
    //     home.width = this.calcLength(48);
    //     home.height = this.calcLength(48);
    //     home.x = this.calcLength(40);
    //     home.y = this.calcLength(6);
    //     home.eventMode = 'static';
    //     home.cursor = 'pointer';
    //     home.on('pointerdown', () => {
    //         this.events["changeRouter"]("/");
    //     });
    //     menuContainer.addChild(home);


    //     //Trading Pair select
    //     const select = new Container();
    //     select.boundsArea = new Rectangle(0, 0, this.calcLength(210), this.calcLength(60));
    //     select.x = this.calcLength(112);
    //     // select.eventMode = 'static';
    //     // select.cursor = 'pointer';
    //     // select.on('pointerdown', () => {
    //     //     this.events["changeModule"]("trading-pair");
    //     // });
    //     //
        

    //     //select text
    //     const selectText = new BitmapText({
    //         text: `${this.data.instId.replace('-', '/')}`,
    //         style:{
    //             fill: '#FFFFFF',
    //             fontSize: this.calcLength(30),
    //             fontFamily: 'SourceCodePro-Medium',
    //             align: 'center'
    //         }
    //     })
    //     selectText.y = this.calcLength(30)
    //     selectText.anchor.set(0, 0.5);
    //     select.addChild(selectText);
    //     //select icon
    //     const icOpen = await Assets.load(ic_open);
    //     const selectIcon = Sprite.from(icOpen);
    //     selectIcon.width = this.calcLength(16);
    //     selectIcon.height = this.calcLength(16);
    //     selectIcon.x = this.calcLength(168);
    //     selectIcon.y = this.calcLength(22);
    //     select.addChild(selectIcon);


    //     const selectBox = new Graphics().rect(0, 0, this.calcLength(220), this.calcLength(60)).fill(0x000000, 0);
    //     selectBox.eventMode = 'static';
    //     selectBox.cursor = 'pointer';
    //     selectBox.on('pointerdown', () => {
    //         this.events["changeModule"]("trading-pair");
    //     });
    //     select.addChild(selectBox);

    //     //add select
    //     menuContainer.addChild(select);


    //     //coin
    //     this.mainTopCoinContainer.width = this.calcLength(180);
    //     this.mainTopCoinContainer.height = this.calcLength(60);
    //     this.mainTopCoinContainer.x = this.calcLength(338 + 90);
    //     this.mainTopCoinContainer.y = this.calcLength(30);
    //     this.mainTopCoinContainer.eventMode = 'static';
    //     this.mainTopCoinContainer.cursor = 'pointer';
    //     this.mainTopCoinContainer.on('pointerdown', () => {
    //         this.events["changeModule"]("profile", {coin: this.data.coin});
    //     });
    //     //coin-bg
    //     const bgCoin = await Assets.load(bg_coin);
    //     const coinBg = Sprite.from(bgCoin);
    //     coinBg.width = this.calcLength(180);
    //     coinBg.height = this.calcLength(60);
    //     this.mainTopCoinContainer.addChild(coinBg);
    //     //coin-icon
    //     const imgCoin = await Assets.load(img_coin);
    //     const coinIcon = Sprite.from(imgCoin);
    //     coinIcon.width = this.calcLength(30);
    //     coinIcon.height = this.calcLength(30);
    //     coinIcon.x = this.calcLength(132);
    //     coinIcon.y = this.calcLength(15);
    //     this.mainTopCoinContainer.addChild(coinIcon);
    //     //coin-text
    //     this.coinGraph.x = this.calcLength(60);
    //     this.coinGraph.y = this.calcLength(30);
    //     this.coinGraph.anchor.set(0.5, 0.5);
    //     this.coinGraph.style = {
    //         fill: '#FFFFFF',
    //         fontSize: this.calcLength(24),
    //         fontFamily: 'SourceCodePro-Medium',
    //         align: 'center'
    //     }
    //     this.mainTopCoinContainer.addChild(this.coinGraph);
    //     this.mainTopCoinContainer.pivot.set(this.mainTopCoinContainer.width / 2, this.mainTopCoinContainer.height / 2);
    //     // this.mainTopCoinContainer.scale = 0.5;
    //     //add coin 
    //     menuContainer.addChild(this.mainTopCoinContainer);


    //     //history
    //     const imgHistory = await Assets.load(img_history);
    //     const history = Sprite.from(imgHistory);
    //     history.width = this.calcLength(48);
    //     history.height = this.calcLength(48);
    //     history.x = this.calcLength(534);
    //     history.y = this.calcLength(6);
    //     history.eventMode = 'static';
    //     history.cursor = 'pointer';
    //     history.on('pointerdown', () => {
    //         this.events["changeModule"]("adventure-history");
    //     });
    //     menuContainer.addChild(history);

    //     //leaderboard
    //     const imgLeaderboard = await Assets.load(img_leaderboard);
    //     const leaderboardBtn = Sprite.from(imgLeaderboard);
    //     leaderboardBtn.width = this.calcLength(48);
    //     leaderboardBtn.height = this.calcLength(48);
    //     leaderboardBtn.x = this.calcLength(598);
    //     leaderboardBtn.y = this.calcLength(6);
    //     leaderboardBtn.eventMode = 'static';
    //     leaderboardBtn.cursor = 'pointer';
    //     leaderboardBtn.on('pointerdown', () => {
    //         this.events["changeModule"]('leaderboard');
    //     });
    //     menuContainer.addChild(leaderboardBtn);
        
    //     //mail
    //     this.initMail();
    //     menuContainer.addChild(this.mailContainer);

    //     //date
    //     this.dateGraph.x = this.calcLength(40);
    //     this.dateGraph.y = this.calcLength(110);
    //     this.dateGraph.anchor.set(0,0.5);
    //     this.dateGraph.style = {
    //         fill: '#FFFFFF',
    //         fontSize: this.calcLength(24),
    //         fontFamily: 'SourceCodePro-Medium',
    //     }
    //     menuContainer.addChild(this.dateGraph);


    //     //players list
    //     const players = new Container();
    //     players.boundsArea = new Rectangle(0, 0, this.calcLength(264), this.calcLength(48));
    //     players.x = this.calcLength(446);
    //     players.y = this.calcLength(86);
    //     players.eventMode = 'static';
    //     players.cursor = 'pointer';
    //     players.on('pointerdown', () => {
    //         this.events["changeModule"]("adventure-online-players");
    //     });
        

    //     //players count bg
    //     const playersCountBg = new Graphics();
    //     playersCountBg.beginFill(0x313131); // 设置填充颜色为黑色
    //     playersCountBg.drawRoundedRect(0, 0, this.calcLength(84), this.calcLength(48), this.calcLength(48)); // 绘制圆角矩形
    //     playersCountBg.endFill();
    //     playersCountBg.x = this.calcLength(180);
    //     playersCountBg.y = this.calcLength(0);
    //     players.addChild(playersCountBg);
        

    //     //players count text
    //     this.playerGraph.style = {
    //         fill: '#FFFFFF',
    //         fontSize: this.calcLength(24),
    //         fontFamily: 'SourceCodePro-Medium',
    //         align: 'center'
    //     }
    //     this.playerGraph.x = this.calcLength(222);
    //     this.playerGraph.y = this.calcLength(24);
    //     this.playerGraph.anchor.set(0.5, 0.5);
    //     players.addChild(this.playerGraph);

    //     //players avatar
    //     players.addChild(this.playerAvatarContainer);
    //     menuContainer.addChild(players);
        

    //     this.app.stage.addChild(menuContainer);
    // }

    initMail = async () => {
        this.mailContainer.x = this.calcLength(144);
        this.mailContainer.y = this.calcLength(8);
        this.mailContainer.boundsArea = new Rectangle(0, 0, this.calcLength(60), this.calcLength(65));
        this.mailContainer.eventMode = 'static';
        this.mailContainer.cursor = 'pointer';
        this.mailContainer.on('pointerdown', () => {
            this.events["changeModule"]("mail-box");
        })

        const imgMail = await Assets.load(img_mail);
        const imgMailMessage = await Assets.load(img_mail_message);

        const mail = Sprite.from(imgMail);
        mail.width = this.calcLength(70);
        mail.height = this.calcLength(55);
        this.mailContainer.addChild(mail);

        const mailMessage = Sprite.from(imgMailMessage);
        mailMessage.width = this.calcLength(70);
        mailMessage.height = this.calcLength(55);
        mailMessage.label= 'mailMessage'
        this.mailContainer.addChild(mailMessage);
        mailMessage.visible = false;  
    }

    //中间部分
    initMain = async () => {
        const w = this.calcLength(714);
        const h = this.app.screen.height - this.calcLength(257 + 254 + 58);
        this.mainContainer.x = this.calcLength(18);
        this.mainContainer.y = this.calcLength(257);
        this.mainContainer.boundsArea = new Rectangle(0, 0, w, h);
        this.mainContainer.zIndex = 1;

        await this.initMainTop();
        await this.initMark();
        await this.initBarsGraph();


        const klineContainerHeight = this.app.screen.height - this.calcLength(257 + 254 + 58) - this.calcLength(189 + 107);
        this.klineContainer.x = this.calcLength(52);
        this.klineContainer.y = this.calcLength(189);
        this.klineContainer.height = klineContainerHeight;
        this.klineContainer.boundsArea = new Rectangle(0, 0, this.calcLength(458), klineContainerHeight);
        // let mask = new Graphics()
        // .rect(this.calcLength(7),0,this.calcLength(558),h)
        // .fill(0xffffff).stroke({ width: 4, color: 0xffd900 })
        // this.mainContainer.mask = mask
        // this.mainContainer.addChild(mask)
        this.mainContainer.addChild(this.klineContainer)

        


        this.app.stage.addChild(this.mainContainer)
    }

    //中间部分 - 背景框
    initMainBg = async () => {
        const mainContainerBg: Container = new Container();
        let w = this.calcLength(714);
        let h = this.app.screen.height - this.calcLength(257 + 254 + 58);
        mainContainerBg.x = this.calcLength(18);
        mainContainerBg.y = this.calcLength(257);
        mainContainerBg.boundsArea = new Rectangle(0, 0, w, h);

        const cutSize = 5;

        //底部阴影条
        const graphic0 = new Graphics();
        let x0 = 0;
        let y0 = h - cutSize * 4;
        const points0 = [
            {x: x0, y: y0},
            {x: x0, y: y0 + cutSize * 2},
            {x: x0 + cutSize, y: y0 + cutSize * 2},
            {x: x0 + cutSize, y: y0 + cutSize * 3},
            {x: x0 + cutSize * 2, y: y0 + cutSize * 3},
            {x: x0 + cutSize * 2, y: y0 + cutSize * 4},
            {x: x0 + w - cutSize * 2, y: y0 + cutSize * 4},
            {x: x0 + w - cutSize * 2, y: y0 + cutSize * 3},
            {x: x0 + w - cutSize, y: y0 + cutSize * 3},
            {x: x0 + w - cutSize, y: y0 + cutSize * 2},
            {x: x0 + w, y: y0 + cutSize * 2},
            {x: x0 + w, y: y0},
            {x: x0, y: y0},
        ];
        let barContext0 = new GraphicsContext();
        barContext0.poly(points0);
        barContext0.fill(0xA5715C);
        graphic0.context = barContext0;
        mainContainerBg.addChild(graphic0)

        //最外层黑边框
        const graphic1 = this.createJaggedRect(0, 0, w, h - cutSize * 2, cutSize, 0x191919, true);
        mainContainerBg.addChild(graphic1)

        //黑边框中间灰色部分
        const graphic2 = this.createJaggedRect(cutSize, cutSize, w - cutSize * 2, h - cutSize * 2 - cutSize * 2, cutSize, 0x303130, false);
        mainContainerBg.addChild(graphic2)

        //里层黑边框
        const graphic3 = this.createJaggedRect(cutSize * 3, cutSize * 3, w - cutSize * 6, h - cutSize * 2 - cutSize * 6, cutSize, 0x191919, true);
        mainContainerBg.addChild(graphic3)

        //绿色渐变背景
        const graphic4 = this.createJaggedRect(cutSize * 4, cutSize * 4, w - cutSize * 8, h - cutSize * 2 - cutSize * 8, cutSize, 0x41514A, false);

        // const texture = Texture.from(bg_before_choose); 
        // const bgSprite = new Sprite(texture);
        // bgSprite.x = cutSize * 4;
        // bgSprite.y = cutSize * 4;
        // bgSprite.width = w - cutSize * 8;
        // bgSprite.height = h - cutSize * 2 - cutSize * 8; 
        // bgSprite.mask = graphic4;
        // mainContainerBg.addChild(bgSprite);

        mainContainerBg.addChild(graphic4); 

        //顶部阴影条
        const graphic5 = new Graphics();
        let x5 = cutSize * 4;
        let y5 = cutSize * 4;
        const w5 = w - cutSize * 8;
        const points5 = [
            {x: x5, y: y5 + cutSize},
            {x: x5, y: y5 + cutSize * 2},
            {x: x5 + cutSize, y: y5 + cutSize * 2},
            {x: x5 + cutSize, y: y5 + cutSize},
            {x: x5 + w5 - cutSize, y: y5 + cutSize},
            {x: x5 + w5 - cutSize, y: y5 + cutSize * 2},
            {x: x5 + w5, y: y5 + cutSize * 2},
            {x: x5 + w5, y: y5 + cutSize},
            {x: x5 + w5 - cutSize, y: y5 + cutSize},
            {x: x5 + w5 - cutSize, y: y5},
            {x: x5 + cutSize, y: y5},
            {x: x5 + cutSize, y: y5 + cutSize},
            {x: x5, y: y5 + cutSize},
        ];
        let barContext5 = new GraphicsContext();
        barContext5.poly(points5);
        barContext5.fill(0x46443E);
        graphic5.context = barContext5;
        mainContainerBg.addChild(graphic5)


        this.app.stage.addChild(mainContainerBg)
    }

    createJaggedRect(x:number, y:number, w:number, h:number, cutSize:any, fillColor:number, isDoubleJagged: boolean) {
        const graphic = new Graphics();
        let points = [
            {x: x, y: y + cutSize},
            {x: x, y: y + h - cutSize},
            {x: x + cutSize, y: y + h - cutSize},
            {x: x + cutSize, y: y + h},
            {x: x + w - cutSize, y: y + h},
            {x: x + w - cutSize, y: y + h - cutSize},
            {x: x + w, y: y + h - cutSize},
            {x: x + w, y: y + cutSize},
            {x: x + w - cutSize, y: y + cutSize},
            {x: x + w - cutSize, y: y},
            {x: x + cutSize, y: y},
            {x: x + cutSize, y: y + cutSize},
            {x: x, y: y + cutSize},
        ];
        if(isDoubleJagged){
            points = [
                {x: x, y: y + cutSize * 2},
                {x: x, y: y + h - cutSize * 2},
                {x: x + cutSize, y: y + h - cutSize * 2},
                {x: x + cutSize, y: y + h - cutSize},
                {x: x + cutSize * 2, y: y + h - cutSize},
                {x: x + cutSize * 2, y: y + h},
                {x: x + w - cutSize * 2, y: y + h},
                {x: x + w - cutSize * 2, y: y + h - cutSize},
                {x: x + w - cutSize, y: y + h - cutSize},
                {x: x + w - cutSize, y: y + h - cutSize * 2},
                {x: x + w, y: y + h - cutSize * 2},
                {x: x + w, y: y + cutSize * 2},
                {x: x + w - cutSize, y: y + cutSize * 2},
                {x: x + w - cutSize, y: y + cutSize},
                {x: x + w - cutSize * 2, y: y + cutSize},
                {x: x + w - cutSize * 2, y: y},
                {x: x + cutSize * 2, y: y},
                {x: x + cutSize * 2, y: y + cutSize },
                {x: x + cutSize, y: y + cutSize},
                {x: x + cutSize, y: y + cutSize * 2},
                {x: x, y: y + cutSize * 2},
            ];
        }
        
        let barContext = new GraphicsContext();
        barContext.poly(points);
        barContext.fill(fillColor);
        graphic.context = barContext;
        return graphic;
    }

    initMainTop = async () => {
        const mainTopContainer: Container = new Container();
        const w = this.calcLength(714);
        const h = this.calcLength(84);
        mainTopContainer.x = this.calcLength(0);
        mainTopContainer.y = this.calcLength(61);
        mainTopContainer.boundsArea = new Rectangle(0, 0, w, h);

        //Trading Pair select
        const tradingPairText = new BitmapText({
            text: `${this.data.instId.replace('-', '/')}`,
            style:{
                fill: '#191919',
                fontSize: this.calcLength(30),
                fontFamily: 'Pixeloid Sans',
            }
        })
        tradingPairText.x = this.calcLength(63);
        tradingPairText.y = this.calcLength(0);
        mainTopContainer.addChild(tradingPairText);


        //date time
        this.dateGraph.x = this.calcLength(63);
        this.dateGraph.y = this.calcLength(42);
        this.dateGraph.style = {
            fill: '#191919',
            fontSize: this.calcLength(34),
            fontFamily: 'Pixeloid Sans',
        }
        mainTopContainer.addChild(this.dateGraph);


        //coin
        this.mainTopCoinContainer.width = this.calcLength(205);
        this.mainTopCoinContainer.height = this.calcLength(77);
        this.mainTopCoinContainer.x = this.calcLength(377);
        this.mainTopCoinContainer.y = this.calcLength(4);
        this.mainTopCoinContainer.eventMode = 'static';
        this.mainTopCoinContainer.cursor = 'pointer';
        this.mainTopCoinContainer.on('pointerdown', () => {
            this.events["changeModule"]("profile", {coin: this.data.coin});
        });
        //coin-bg
        const coinCountBgImg = await Assets.load(coin_count_bg);
        const coinCountBg = Sprite.from(coinCountBgImg);
        coinCountBg.width = this.calcLength(205);
        coinCountBg.height = this.calcLength(77);
        this.mainTopCoinContainer.addChild(coinCountBg);
        //coin-icon
        const imgCoin = await Assets.load(img_coin);
        const coinIcon = Sprite.from(imgCoin);
        coinIcon.width = this.calcLength(40);
        coinIcon.height = this.calcLength(39);
        coinIcon.x = this.calcLength(139);
        coinIcon.y = this.calcLength(17);
        this.mainTopCoinContainer.addChild(coinIcon);
        //coin-text
        this.coinGraph.x = this.calcLength(80);
        this.coinGraph.y = this.calcLength(38);
        this.coinGraph.anchor.set(0.5, 0.5);
        this.coinGraph.text = '16747';
        this.coinGraph.style = {
            fill: '#191919',
            fontSize: this.calcLength(24),
            fontFamily: 'Pixeloid Sans',
            align: 'center'
        }
        this.mainTopCoinContainer.addChild(this.coinGraph);
        mainTopContainer.addChild(this.mainTopCoinContainer);


        //history
        const historyImg = await Assets.load(img_history);
        const history = Sprite.from(historyImg);
        history.width = this.calcLength(71);
        history.height = this.calcLength(71);
        history.x = this.calcLength(595);
        history.y = this.calcLength(7);
        history.eventMode = 'static';
        history.cursor = 'pointer';
        history.on('pointerdown', () => {
            this.events["changeModule"]("adventure-history");
        });
        mainTopContainer.addChild(history);

        this.mainContainer.addChild(mainTopContainer)
    }

    //中间部分 - 坐标轴
    initMark = async () => {
        const markContainer: Container = new Container()
        const h = this.app.screen.height - this.calcLength(257 + 254 + 58) - this.calcLength(189 + 107);
        markContainer.x = this.calcLength(63);
        markContainer.y = this.calcLength(189);
        markContainer.height = h;
        markContainer.boundsArea = new Rectangle(0, 0, this.calcLength(595), h);


        //Mark-line
        for (let i = 0; i < 10; i ++) {
            const graphic = new Graphics().rect(0, 0, this.calcLength(458), 1).fill(0x272622);
            graphic.x = this.calcLength(0);
            graphic.y = this.calcLength(21) + h / 10 * i;
            markContainer.addChild(graphic)
        }


        //Mark-value
        let marks = []
        for (let i = 0; i < 10; i ++) {
            const graphic = new BitmapText({
                text: '123456.89',
                style:{
                    fill: '#191919',
                    fontSize: this.calcLength(24),
                    fontFamily: 'Pixeloid Sans',
                },
                x:  this.calcLength(470),
                y:  this.calcLength(5) + markContainer.height / 10 * i
            })
            graphic.zIndex = 10
            marks.push(graphic);
            markContainer.addChild(graphic)
        }
        this.markGraphics = marks;

        this.mainContainer.addChild(markContainer);
    }
    
    initBarsGraph = async () => {
        this.data.barWidth = this.calcLength(90)
        let bars = []
        for (let i = 0; i < LIMIT; i ++) {
          let graphic = new Graphics()
          this.klineContainer?.addChild(graphic)
          graphic.zIndex = 1;
          bars.push(graphic)
        }
        this.barGraphics = bars
    }

    //底部
    initBottom = async () => {
        const bottomContainer: Container = new Container();
        bottomContainer.x = this.calcLength(0);
        bottomContainer.y = this.app.screen.height - this.calcLength(302);
        bottomContainer.boundsArea = new Rectangle(0, 0, this.calcLength(750), this.calcLength(302));

        await this.initStrikeContainer();
        await this.initBeforeChoose();
        bottomContainer.addChild(this.beforeChooseContainer);

        // //YOUR CHOICE 1-3
        await this.initAfterChoosen();
        bottomContainer.addChild(this.afterChooseContainer);

        // //result 1-3
        await this.initResultBullish();
        bottomContainer.addChild(this.resultBullishContainer);
        await this.initResultBearish();
        bottomContainer.addChild(this.resultBearishContainer);
        await this.initResultNeutral();
        bottomContainer.addChild(this.resultNeutralContainer);

        //final 1-4
        await this.initFinalWin();
        bottomContainer.addChild(this.finalWinContainer);

        await this.initFinalLose();
        bottomContainer.addChild(this.finalLoseContainer);

        await this.initFinalDraw();
        bottomContainer.addChild(this.finalDrawContainer);

        await this.initFinalNobet();
        bottomContainer.addChild(this.finalNobetContainer);
    
        this.app.stage.addChild(bottomContainer)
    }

    initBottomLine = async () => {
        const imgBottomLine = await Assets.load(img_bottom_line);
        const bottomLine = Sprite.from(imgBottomLine);
        bottomLine.width = this.calcLength(750);
        bottomLine.height = this.calcLength(58);
        bottomLine.x = 0;
        bottomLine.y = this.app.screen.height - this.calcLength(58);
        this.app.stage.addChild(bottomLine);
    }


    //连胜甬道
    initStrikeChannelContainer = async () => {
        this.strikeChannelContainer.x = this.calcLength(40)
        this.strikeChannelContainer.y = this.app.screen.height - this.calcLength(433 + 20);
        this.strikeChannelContainer.zIndex = 1;
        this.winFireAsset = await Assets.load(`${window.location.origin}/img/win_fire.json`)
        this.particlesAsset = await Assets.load(`${window.location.origin}/images/particles.json`)

        this.app.stage.addChild(this.strikeChannelContainer)

        this.strikeChannelContainer.visible = true
    }

    initStrikeContainer = async () => {
        const sheet = await Assets.load(`${window.location.origin}/images/fire.json`);
        const anim = new AnimatedSprite(sheet.animations['run']);
        anim.label = "anim"
        anim.animationSpeed = 0.1666;
        anim.stop()
        anim.scale = this.app.screen.width / 1500;
        anim.x = this.calcLength(34);
        anim.y = this.calcLength(96);
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

    initCoinReduce = async () => {
        this.coinReduceContainer.boundsArea = new Rectangle(0, 0, 0, this.calcLength(30));
        this.coinReduceContainer.x = this.calcLength(380); //535
        this.coinReduceContainer.y = this.calcLength(100);
        this.coinReduceContainer.zIndex = 1

        //title
        const coins = new BitmapText({
            text: '-100',
            style:  new TextStyle({
                fill: '#FFFFFF',
                fontFamily: 'SourceCodePro-Medium',
                fontSize: this.calcLength(24),
            })
        })
        coins.x = this.calcLength(0);
        coins.y = this.calcLength(15);
        coins.anchor.set(0, 0.5);
        this.coinReduceContainer.addChild(coins);

        //coin
        const imgCoin = await Assets.load(img_coin);
        const coinIcon = Sprite.from(imgCoin);
        coinIcon.width = this.calcLength(30);
        coinIcon.height = this.calcLength(30);
        coinIcon.label = "icon"
        coinIcon.x = this.calcLength(70);
        this.coinReduceContainer.addChild(coinIcon);
        this.coinReduceContainer.visible = false;

        this.app.stage.addChild(this.coinReduceContainer);
    }

    initEarlyBouns = async () => {
        this.earlyBounsContainer.boundsArea = new Rectangle(0, 0, this.calcLength(290), this.calcLength(150));
        // this.earlyBounsContainer.x = this.calcLength(24 + 145);
        this.earlyBounsContainer.x = this.calcLength(400 + 145);
        this.earlyBounsContainer.y = this.app.screen.height - this.calcLength(247) - this.calcLength(263) - this.calcLength(131);
        this.earlyBounsContainer.width = this.calcLength(290);
        this.earlyBounsContainer.height = this.calcLength(150);
        this.earlyBounsContainer.zIndex = 10;

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
        this.earlyBounsContainer.scale = 0;

        this.earlyBounsContainer.visible = false;

        this.app.stage.addChild(this.earlyBounsContainer);
    }

    //下注前
    initBeforeChoose = async () => {
        this.beforeChooseContainer.x = this.calcLength(0);
        this.beforeChooseContainer.y = this.calcLength(0);
        this.beforeChooseContainer.boundsArea = new Rectangle(0, 0, this.calcLength(750), this.calcLength(220));

        await this.initClock();
        

        //bullish-btn
        const imgBullishBtn = await Assets.load(img_bullish_btn);
        const bullishBtn = Sprite.from(imgBullishBtn);
        bullishBtn.width = this.calcLength(220);
        bullishBtn.height = this.calcLength(210);
        bullishBtn.x = this.calcLength(48);
        bullishBtn.y = this.calcLength(10);
        bullishBtn.eventMode = 'static';
        bullishBtn.cursor = 'pointer';
        bullishBtn.on('pointerdown', () => {
            console.log(this.data.selection, "--makeChoice('bullish')--");
            if(this.data.selection){
                return;
            }
            this.makeChoice('bullish');
        });
        this.beforeChooseContainer.addChild(bullishBtn);

        // const sheet = await Assets.load(`${window.location.origin}/images/button.json`);
        // const animBullish = new AnimatedSprite(sheet.animations['bullishRun']);
        // animBullish.animationSpeed = 0.05;
        // animBullish.play();
        // animBullish.scale = this.app.screen.width / 1500;
        // animBullish.anchor.set(0.5, 1);
        // animBullish.x = this.calcLength(175);
        // animBullish.y = this.calcLength(228);
        // animBullish.zIndex = 2;
        // animBullish.eventMode = 'static';
        // animBullish.cursor = 'pointer';
        // animBullish.on('pointerdown', () => {
        //     if(this.data.selection){
        //         return;
        //     }
        //     this.makeChoice('bullish');
        // })
        // this.beforeChooseContainer.addChild(animBullish);

        //bearish-btn
        const imgBearishBtn = await Assets.load(img_bearish_btn);
        const bearishBtn = Sprite.from(imgBearishBtn);
        bearishBtn.width = this.calcLength(220);
        bearishBtn.height = this.calcLength(210);
        bearishBtn.x = this.calcLength(482);
        bearishBtn.y = this.calcLength(10);
        bearishBtn.eventMode = 'static';
        bearishBtn.cursor = 'pointer';
        bearishBtn.on('pointerdown', () => {

            if(this.data.selection){
                return;
            }
            this.makeChoice('bearish');
        });
        this.beforeChooseContainer.addChild(bearishBtn);
        // const animBearish = new AnimatedSprite(sheet.animations['bearishRun']);
        // animBearish.animationSpeed = 0.05;
        // animBearish.play();
        // animBearish.scale = this.app.screen.width / 1500;
        // animBearish.anchor.set(0.5, 1);
        // animBearish.x = this.calcLength(495);
        // animBearish.y = this.calcLength(228);
        // animBearish.zIndex = 2;
        // animBearish.eventMode = 'static';
        // animBearish.cursor = 'pointer';
        // animBearish.on('pointerdown', () => {
        //     if(this.data.selection){
        //         return;
        //     }
        //     this.makeChoice('bearish');
        // })
        // this.beforeChooseContainer.addChild(animBearish);



        
        this.beforeChooseContainer.visible = true;
    }

    initClock = async () => {
        const clockContainer: Container = new Container();
        clockContainer.x = this.app.screen.width / 2 - this.calcLength(81);
        clockContainer.y = this.calcLength(0);
        clockContainer.boundsArea = new Rectangle(0, 0, this.calcLength(162), this.calcLength(220));

        const clockImg = await Assets.load(img_clock);
        const clock = Sprite.from(clockImg);
        clock.anchor.set(0.5, 0.5); // 设置锚点为中心
        clock.x = this.calcLength(81);
        clock.y = this.calcLength(110);
        clock.width = this.calcLength(162);
        clock.height = this.calcLength(220);
        clockContainer.addChild(clock);


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


        this.clockGraph.text = '3'
        this.clockGraph.style = {
            fill: '#191919',
            fontSize: this.calcLength(48),
            fontFamily: 'Pixeloid Sans',
            align: 'center'
        }
        this.clockGraph.x = this.calcLength(87);
        this.clockGraph.y = this.calcLength(101);
        this.clockGraph.anchor.set(0.5, 0);
        clockContainer.addChild(this.clockGraph);
        this.beforeChooseContainer.addChild(clockContainer)
    }

    //下注后
    initAfterChoosen = async () => {
        this.afterChooseContainer.x = this.calcLength(34);
        this.afterChooseContainer.y = this.calcLength(0);
        this.afterChooseContainer.boundsArea = new Rectangle(0, 0, this.calcLength(682), this.calcLength(218));

        //bg
        // const bottomBtnBg = await Assets.load(bottom_btn_bg);
        // const bg = Sprite.from(bottomBtnBg);
        // bg.width = this.calcLength(682);
        // bg.height = this.calcLength(218);
        // this.afterChooseContainer.addChild(bg);

        this.chooseBullishContainer.boundsArea = new Rectangle(0, 0, this.calcLength(682), this.calcLength(218));

        //light
        const grayLightImg = await Assets.load(light_gray_img);
        const light = Sprite.from(grayLightImg);
        light.x = this.calcLength(12);
        light.y = this.calcLength(14);
        light.width = this.calcLength(658);
        light.height = this.calcLength(180);

        //Bullish
        const chooseBullishImg = await Assets.load(choose_bullish_img);
        const chooseBullish = Sprite.from(chooseBullishImg);
        chooseBullish.width = this.calcLength(682);
        chooseBullish.height = this.calcLength(218);
        this.chooseBullishContainer.addChild(chooseBullish);
        this.chooseBullishContainer.addChild(light);
        this.chooseBullishContainer.visible = false;
        this.afterChooseContainer.addChild(this.chooseBullishContainer);


        //Bearish
        const chooseBearishImg = await Assets.load(choose_bearish_img);
        const chooseBearish = Sprite.from(chooseBearishImg);
        chooseBearish.width = this.calcLength(682);
        chooseBearish.height = this.calcLength(218);
        this.chooseBearishContainer.addChild(chooseBearish);
        this.chooseBearishContainer.addChild(light);
        this.chooseBearishContainer.visible = false;
        this.afterChooseContainer.addChild(this.chooseBearishContainer);


        //Nobet
        const chooseNobetImg = await Assets.load(choose_nobet_img);
        const chooseNobet = Sprite.from(chooseNobetImg);
        chooseNobet.width = this.calcLength(682);
        chooseNobet.height = this.calcLength(218);
        this.chooseNobetContainer.addChild(chooseNobet);
        this.chooseNobetContainer.addChild(light);
        this.chooseNobetContainer.visible = false;
        this.afterChooseContainer.addChild(this.chooseNobetContainer);


        // //title
        // this.yourChoiceTitleGraph.x = this.calcLength(335);
        // this.yourChoiceTitleGraph.y = this.calcLength(55);
        // this.yourChoiceTitleGraph.anchor.set(0.5, 0.5);
        // this.yourChoiceTitleGraph.style =  new TextStyle({
        //     fill: '#000000',
        //     stroke: 'rgba(0,0,0,1)',
        //     strokeThickness: 1,
        //     fontFamily: 'SourceCodePro-Medium-stroke',
        //     fontSize: this.calcLength(28),
        //     letterSpacing: 6,
        // })
        // this.afterChooseContainer.addChild(this.yourChoiceTitleGraph);

        // //info
        // this.yourChoiceInfoGraph.x = this.calcLength(335);
        // this.yourChoiceInfoGraph.y = this.calcLength(155);
        // this.yourChoiceInfoGraph.anchor.set(0.5, 0.5);
        // this.yourChoiceInfoGraph.style =  new TextStyle({
        //     fill: '#FFFFFF',
        //     fontFamily: 'SourceCodePro-Semibold',
        //     fontSize: this.calcLength(34),
        // })
        // this.afterChooseContainer.addChild(this.yourChoiceInfoGraph);

        // //result
        // const resultText = new BitmapText({
        //     text: "Result in",
        //     style:  new TextStyle({
        //         fill: 'rgba(255,255,255,0.40)',
        //         fontFamily: 'SourceCodePro-Medium',
        //         fontSize: this.calcLength(24),
        //         letterSpacing: 1
        //     })
        // });
        // resultText.x = this.calcLength(240); //238 400
        // resultText.y = this.calcLength(184);
        // this.afterChooseContainer.addChild(resultText);

        // result-countDown
        this.resultCountDownGraph.x = this.calcLength(566);
        this.resultCountDownGraph.y = this.calcLength(134);
        this.resultCountDownGraph.style =  new TextStyle({
            fill: '#191919',
            fontFamily: 'Pixeloid Sans',
            fontSize: this.calcLength(17),
            // letterSpacing: 1
        })
        this.resultCountDownGraph.anchor.set(0.5, 0);
        this.afterChooseContainer.addChild(this.resultCountDownGraph);

        this.afterChooseContainer.visible = false;
    }

    //K线结果
    initResultBullish = async () => {
        this.resultBullishContainer.x = this.calcLength(34);
        this.resultBullishContainer.y = this.calcLength(0);
        this.resultBullishContainer.boundsArea = new Rectangle(0, 0, this.calcLength(682), this.calcLength(218));

        //light
        const resultBullishLightImg = await Assets.load(light_result_bullish_img);
        const light = Sprite.from(resultBullishLightImg);
        light.x = this.calcLength(12);
        light.y = this.calcLength(14);
        light.width = this.calcLength(658);
        light.height = this.calcLength(180);

        //Bullish
        const resultBullishImg = await Assets.load(result_bullish_img);
        const resultBullish = Sprite.from(resultBullishImg);
        resultBullish.width = this.calcLength(682);
        resultBullish.height = this.calcLength(218);
        this.resultBullishContainer.addChild(resultBullish);
        this.resultBullishContainer.addChild(light);
        this.resultBullishContainer.visible = false;
    }

    initResultBearish = async () => {
        this.resultBearishContainer.x = this.calcLength(34);
        this.resultBearishContainer.y = this.calcLength(0);
        this.resultBearishContainer.boundsArea = new Rectangle(0, 0, this.calcLength(682), this.calcLength(218));

        //light
        const resultBearishLightImg = await Assets.load(light_result_bearish_img);
        const light = Sprite.from(resultBearishLightImg);
        light.x = this.calcLength(12);
        light.y = this.calcLength(14);
        light.width = this.calcLength(658);
        light.height = this.calcLength(180);

        //Bearish
        const resultBearishImg = await Assets.load(result_bearish_img);
        const resultBearish = Sprite.from(resultBearishImg);
        resultBearish.width = this.calcLength(682);
        resultBearish.height = this.calcLength(218);
        this.resultBearishContainer.addChild(resultBearish);
        this.resultBearishContainer.addChild(light);
        this.resultBearishContainer.visible = false;
    }

    initResultNeutral = async () => {
        this.resultNeutralContainer.x = this.calcLength(34);
        this.resultNeutralContainer.y = this.calcLength(0);
        this.resultNeutralContainer.boundsArea = new Rectangle(0, 0, this.calcLength(682), this.calcLength(218));

        //light
        const resultNeutralLightImg = await Assets.load(light_result_neutral_img);
        const light = Sprite.from(resultNeutralLightImg);
        light.x = this.calcLength(12);
        light.y = this.calcLength(14);
        light.width = this.calcLength(658);
        light.height = this.calcLength(180);

        //Neutral
        const resultNeutralImg = await Assets.load(result_neutral_img);
        const resultNeutral = Sprite.from(resultNeutralImg);
        resultNeutral.width = this.calcLength(682);
        resultNeutral.height = this.calcLength(218);
        this.resultNeutralContainer.addChild(resultNeutral);
        this.resultNeutralContainer.addChild(light);
        this.resultNeutralContainer.visible = false;
    }

    // initResultBullish = async () => {
    //     this.resultBullishContainer.boundsArea = new Rectangle(0, 0, this.calcLength(670), this.calcLength(280));
    //     this.resultBullishContainer.x = this.calcLength(40);

    //     //resultBullishContainer-bg
    //     const bgResultBullish = await Assets.load(bg_result_bullish);
    //     const bg = Sprite.from(bgResultBullish);
    //     bg.width = this.calcLength(670);
    //     bg.height = this.calcLength(280);
    //     this.resultBullishContainer.addChild(bg);

    //     //info
    //     const infoText = new BitmapText({
    //         text: "Bullish",
    //         style: new TextStyle({
    //             fill: '#000000',
    //             fontFamily: 'SourceCodePro-Semibold',
    //             fontSize: this.calcLength(34),
    //             letterSpacing: 1
    //         })
    //     });
    //     infoText.x = this.calcLength(335);
    //     infoText.y = this.calcLength(155);
    //     infoText.anchor.set(0.5, 0.5);
    //     this.resultBullishContainer.addChild(infoText);

    //     //tip
    //     const tipText = new BitmapText({
    //         text: "Based on the trading data within the",
    //         style: new TextStyle({
    //             fill: 'rgba(0,0,0,0.60)',
    //             fontFamily: 'SourceCodePro-Medium',
    //             fontSize: this.calcLength(24),
    //             letterSpacing: 0
    //         })
    //     });
    //     tipText.x = this.calcLength(50);
    //     tipText.y = this.calcLength(184);
    //     tipText.anchor.set(0, 0);
    //     this.resultBullishContainer.addChild(tipText);

    //     const tipTimeText = new BitmapText({
    //         text: "5s",
    //         style: new TextStyle({
    //             fill: 'rgba(0,0,0,1)',
    //             fontFamily: 'SourceCodePro-Medium',
    //             fontSize: this.calcLength(24),
    //             letterSpacing: 0
    //         })
    //     });
    //     tipTimeText.x = this.calcLength(582);
    //     tipTimeText.y = this.calcLength(184);
    //     tipTimeText.anchor.set(0, 0);
    //     this.resultBullishContainer.addChild(tipTimeText);

    //     this.resultBullishContainer.visible = false;
    // }

    // initResultBearish = async () => {
    //     this.resultBearishContainer.boundsArea = new Rectangle(0, 0, this.calcLength(670), this.calcLength(280));
    //     this.resultBearishContainer.x = this.calcLength(40);

    //     //resultBullishContainer-bg
    //     const bgResultBearish = await Assets.load(bg_result_bearish);
    //     const bg = Sprite.from(bgResultBearish);
    //     bg.width = this.calcLength(670);
    //     bg.height = this.calcLength(280);
    //     this.resultBearishContainer.addChild(bg);

    //     //info
    //     const infoText = new BitmapText({
    //         text: "Bearish",
    //         style:  new TextStyle({
    //             fill: '#FFFFFF',
    //             fontFamily: 'SourceCodePro-Semibold',
    //             fontSize: this.calcLength(34),
    //             letterSpacing: 1
    //         })
    //     });
    //     infoText.x = this.calcLength(335);
    //     infoText.y = this.calcLength(155);
    //     infoText.anchor.set(0.5, 0.5);
    //     this.resultBearishContainer.addChild(infoText);

    //     //tip
    //     const tipText = new BitmapText({
    //         text: "Based on the trading data within the",
    //         style: new TextStyle({
    //             fill: 'rgba(255,255,255,0.60)',
    //             fontFamily: 'SourceCodePro-Medium',
    //             fontSize: this.calcLength(24),
    //             letterSpacing: 0
    //         })
    //     });
    //     tipText.x = this.calcLength(50);
    //     tipText.y = this.calcLength(184);
    //     tipText.anchor.set(0, 0);
    //     this.resultBearishContainer.addChild(tipText);

    //     const tipTimeText = new BitmapText({
    //         text: "5s",
    //         style: new TextStyle({
    //             fill: 'rgba(255,255,255,1)',
    //             fontFamily: 'SourceCodePro-Medium',
    //             fontSize: this.calcLength(24),
    //             letterSpacing: 0
    //         })
    //     });
    //     tipTimeText.x = this.calcLength(582);
    //     tipTimeText.y = this.calcLength(184);
    //     tipTimeText.anchor.set(0, 0);
    //     this.resultBearishContainer.addChild(tipTimeText);

    //     this.resultBearishContainer.visible = false;
    // }

    // initResultNeutral = async () => {
    //     this.resultNeutralContainer.boundsArea = new Rectangle(0, 0, this.calcLength(670), this.calcLength(280));
    //     this.resultNeutralContainer.x = this.calcLength(40);

    //     //resultBullishContainer-bg
    //     const bgResultNeutral = await Assets.load(bg_result_neutral);
    //     const bg = Sprite.from(bgResultNeutral);
    //     bg.width = this.calcLength(670);
    //     bg.height = this.calcLength(280);
    //     this.resultNeutralContainer.addChild(bg);

    //     //info
    //     const infoText = new BitmapText({
    //         text: "Neutral",
    //         style: new TextStyle({
    //             fill: '#FFFFFF',
    //             fontFamily: 'SourceCodePro-Semibold',
    //             fontSize: this.calcLength(34),
    //             letterSpacing: 1
    //         })
    //     });
    //     infoText.x = this.calcLength(335);
    //     infoText.y = this.calcLength(155);
    //     infoText.anchor.set(0.5, 0.5);
    //     this.resultNeutralContainer.addChild(infoText);

    //     //tip
    //     const tipText = new BitmapText({
    //         text: "Based on the trading data within the",
    //         style: {
    //             fill: 'rgba(255,255,255,0.60)',
    //             fontFamily: 'SourceCodePro-Medium',
    //             fontSize: this.calcLength(24),
    //             letterSpacing: 0
    //         }
    //     });
    //     tipText.x = this.calcLength(50);
    //     tipText.y = this.calcLength(184);
    //     tipText.anchor.set(0, 0);
    //     this.resultNeutralContainer.addChild(tipText);

    //     const tipTimeText = new BitmapText({
    //         text: "5s",
    //         style:  new TextStyle({
    //             fill: 'rgba(255,255,255,1)',
    //             fontFamily: 'SourceCodePro-Medium',
    //             fontSize: this.calcLength(24),
    //             letterSpacing: 0
    //         })
    //     });
    //     tipTimeText.x = this.calcLength(582);
    //     tipTimeText.y = this.calcLength(184);
    //     tipTimeText.anchor.set(0, 0);
    //     this.resultNeutralContainer.addChild(tipTimeText);

    //     this.resultNeutralContainer.visible = false;
    // }

    //最终输赢
    initFinalWin = async () => {
        this.finalWinContainer.x = this.calcLength(34);
        this.finalWinContainer.y = this.calcLength(0);
        this.finalWinContainer.boundsArea = new Rectangle(0, 0, this.calcLength(682), this.calcLength(218));

        //light
        const finalWinLightImg = await Assets.load(light_final_win_img);
        const light = Sprite.from(finalWinLightImg);
        light.x = this.calcLength(12);
        light.y = this.calcLength(14);
        light.width = this.calcLength(658);
        light.height = this.calcLength(180);

        //Win
        const finalWinImg = await Assets.load(final_win_img);
        const finalWin = Sprite.from(finalWinImg);
        finalWin.width = this.calcLength(682);
        finalWin.height = this.calcLength(218);
        this.finalWinContainer.addChild(finalWin);
        this.finalWinContainer.addChild(light);
        this.finalWinContainer.visible = false;

        //coinText
        this.winCoinGraph.style =  new TextStyle({
            fill: '#191919',
            fontFamily: 'Pixeloid Sans',
            fontSize: this.calcLength(36),
        })
        this.winCoinGraph.x = this.calcLength(99);
        this.winCoinGraph.y = this.calcLength(107);
        this.winCoinGraph.anchor.set(0.5, 0);
        this.finalWinContainer.addChild(this.winCoinGraph);
    }

    initFinalLose = async () => {
        this.finalLoseContainer.x = this.calcLength(34);
        this.finalLoseContainer.y = this.calcLength(0);
        this.finalLoseContainer.boundsArea = new Rectangle(0, 0, this.calcLength(682), this.calcLength(218));

        //light
        const finalLoseLightImg = await Assets.load(light_final_lose_img);
        const light = Sprite.from(finalLoseLightImg);
        light.x = this.calcLength(12);
        light.y = this.calcLength(14);
        light.width = this.calcLength(658);
        light.height = this.calcLength(180);

        //Lose
        const finalLoseImg = await Assets.load(final_lose_img);
        const finalLose = Sprite.from(finalLoseImg);
        finalLose.width = this.calcLength(682);
        finalLose.height = this.calcLength(218);
        this.finalLoseContainer.addChild(finalLose);
        this.finalLoseContainer.addChild(light);
        this.finalLoseContainer.visible = false;

        //coinText
        const coinText = new BitmapText({
            text: "+0",
            style: new TextStyle({
                fill: '#191919',
                fontFamily: 'Pixeloid Sans',
                fontSize: this.calcLength(36),
            })
        });
        coinText.x = this.calcLength(99);
        coinText.y = this.calcLength(107);
        coinText.anchor.set(0.5, 0);
        this.finalLoseContainer.addChild(coinText);
    }

    initFinalDraw = async () => {
        this.finalDrawContainer.x = this.calcLength(34);
        this.finalDrawContainer.y = this.calcLength(0);
        this.finalDrawContainer.boundsArea = new Rectangle(0, 0, this.calcLength(682), this.calcLength(218));

        //light
        const finalDrawLightImg = await Assets.load(light_white_img);
        const light = Sprite.from(finalDrawLightImg);
        light.x = this.calcLength(12);
        light.y = this.calcLength(14);
        light.width = this.calcLength(658);
        light.height = this.calcLength(180);

        //Draw
        const finalDrawImg = await Assets.load(final_draw_img);
        const finalDraw = Sprite.from(finalDrawImg);
        finalDraw.width = this.calcLength(682);
        finalDraw.height = this.calcLength(218);
        this.finalDrawContainer.addChild(finalDraw);
        this.finalDrawContainer.addChild(light);
        this.finalDrawContainer.visible = false;

        //coinText
        const coinText = new BitmapText({
            text: "+100",
            style:  new TextStyle({
                fill: '#191919',
                fontFamily: 'Pixeloid Sans',
                fontSize: this.calcLength(36),
            })
        });
        coinText.x = this.calcLength(99);
        coinText.y = this.calcLength(107);
        coinText.anchor.set(0.5, 0);
        this.finalDrawContainer.addChild(coinText);
    }

    initFinalNobet = async () => {
        this.finalNobetContainer.x = this.calcLength(34);
        this.finalNobetContainer.y = this.calcLength(0);
        this.finalNobetContainer.boundsArea = new Rectangle(0, 0, this.calcLength(682), this.calcLength(218));

        //light
        const finalNobetLightImg = await Assets.load(light_gray_img);
        const light = Sprite.from(finalNobetLightImg);
        light.x = this.calcLength(12);
        light.y = this.calcLength(14);
        light.width = this.calcLength(658);
        light.height = this.calcLength(180);

        //Nobet
        const finalNobetImg = await Assets.load(final_nobet_img);
        const finalNobet = Sprite.from(finalNobetImg);
        finalNobet.width = this.calcLength(682);
        finalNobet.height = this.calcLength(218);
        this.finalNobetContainer.addChild(finalNobet);
        this.finalNobetContainer.addChild(light);
        this.finalNobetContainer.visible = false;

        //coinText
        const coinText = new BitmapText({
            text: "+0",
            style:  new TextStyle({
                fill: '#191919',
                fontFamily: 'Pixeloid Sans',
                fontSize: this.calcLength(36),
            })
        });
        coinText.x = this.calcLength(99);
        coinText.y = this.calcLength(107);
        coinText.anchor.set(0.5, 0);
        this.finalNobetContainer.addChild(coinText);
    }

    // initResultWin = async () => {
    //     this.finalWinContainer.boundsArea = new Rectangle(0, 0, this.calcLength(670), this.calcLength(280));
    //     this.finalWinContainer.x = this.calcLength(40);

    //     //bg
    //     const sheet = await Assets.load(`${window.location.origin}/images/win.json`);
    //     const anim = new AnimatedSprite(sheet.animations['run']);
    //     anim.label = 'winanim'
    //     anim.animationSpeed = 0.1666;
    //     anim.stop();
    //     anim.scale = this.app.screen.width / 1500;
    //     anim.x = 0
    //     anim.y = 0
    //     this.finalWinContainer.addChild(anim);

    //     //avatar
    //     const imgWin = await Assets.load(img_win);
    //     const winAvatar = Sprite.from(imgWin);
    //     winAvatar.width = this.calcLength(152);
    //     winAvatar.height = this.calcLength(152);
    //     winAvatar.x = this.calcLength(143);
    //     winAvatar.y = this.calcLength(54);
    //     this.finalWinContainer.addChild(winAvatar);

    //     const winText = new BitmapText({
    //         text: "You Win!",
    //         style:  new TextStyle({
    //             fill: '#FFDC7D',
    //             stroke: '#000000',
    //             strokeThickness: 3,
    //             fontFamily: 'SourceCodePro-Medium',
    //             fontSize: this.calcLength(36),
    //             letterSpacing: 0
    //         })
    //     });
    //     winText.x = this.calcLength(349);
    //     winText.y = this.calcLength(60);
    //     this.finalWinContainer.addChild(winText);

    //     //coinIcon
    //     const imgCoin = await Assets.load(img_coin);
    //     const coinIcon = Sprite.from(imgCoin);
    //     coinIcon.width = this.calcLength(48);
    //     coinIcon.height = this.calcLength(48);
    //     coinIcon.x = this.calcLength(349);
    //     coinIcon.y = this.calcLength(144);
    //     this.finalWinContainer.addChild(coinIcon);

    //     //coinText
    //     this.winCoinGraph.style =  new TextStyle({
    //         fill: '#FFFFFF',
    //         stroke: '#000000',
    //         strokeThickness: 1,
    //         fontFamily: 'SourceCodePro-Semibold-stroke',
    //         fontSize: this.calcLength(30),
    //         letterSpacing: 0
    //     })
    //     this.winCoinGraph.x = this.calcLength(421);
    //     this.winCoinGraph.y = this.calcLength(150);
    //     this.finalWinContainer.addChild(this.winCoinGraph);

    //     this.finalWinContainer.visible = false;
    // }

    // initResultLose = async () => {
    //     this.finalLoseContainer.boundsArea = new Rectangle(0, 0, this.calcLength(670), this.calcLength(280));
    //     let mask = new Graphics()
    //     .rect(0, 0, this.calcLength(670), this.calcLength(280))
    //     .fill(0xffffff).stroke({ width: 4, color: 0xffd900 })
    //     this.finalLoseContainer.mask = mask
    //     this.finalLoseContainer.addChild(mask)
    //     this.finalLoseContainer.x = this.calcLength(40);

    //     //bg
    //     const bgResultNoBet = await Assets.load(bg_result_no_bet);
    //     const bg = Sprite.from(bgResultNoBet);
    //     bg.width = this.calcLength(670);
    //     bg.height = this.calcLength(280);
    //     this.finalLoseContainer.addChild(bg);

    //     //line
    //     this.loseLineContainer.x = 0;
    //     this.loseLineContainer.y = this.calcLength(-240);
    //     this.loseLineContainer.width = this.calcLength(670);
    //     this.loseLineContainer.height = this.calcLength(280);
    //     const bgLoseLineShort = await Assets.load(bg_lose_line_short);
    //     const lineShort = Sprite.from(bgLoseLineShort);
    //     lineShort.width = this.calcLength(408);
    //     lineShort.height = this.calcLength(148);
    //     lineShort.x = this.calcLength(131);
    //     this.loseLineContainer.addChild(lineShort);
    //     const bgLoseLineLong = await Assets.load(bg_lose_line_long);
    //     const lineLong = Sprite.from(bgLoseLineLong);
    //     lineLong.width = this.calcLength(624);
    //     lineLong.height = this.calcLength(240);
    //     lineLong.x = this.calcLength(23);
    //     this.loseLineContainer.addChild(lineLong);
    //     this.finalLoseContainer.addChild(this.loseLineContainer);
        

    //     //avatar
    //     const imgLose = await Assets.load(img_lose);
    //     const winAvatar = Sprite.from(imgLose);
    //     winAvatar.width = this.calcLength(152);
    //     winAvatar.height = this.calcLength(152);
    //     winAvatar.x = this.calcLength(143);
    //     winAvatar.y = this.calcLength(54);
    //     this.finalLoseContainer.addChild(winAvatar);

    //     const winText = new BitmapText({
    //         text: "You Lose : (",
    //         style:  new TextStyle({
    //             fill: '#FF6861',
    //             fontFamily: 'SourceCodePro-Medium',
    //             fontSize: this.calcLength(36),
    //             letterSpacing: 0
    //         })
    //     });
    //     winText.x = this.calcLength(349);
    //     winText.y = this.calcLength(60);
    //     this.finalLoseContainer.addChild(winText);

    //     //coinIcon
    //     const imgCoin = await Assets.load(img_coin);
    //     const coinIcon = Sprite.from(imgCoin);
    //     coinIcon.width = this.calcLength(48);
    //     coinIcon.height = this.calcLength(48);
    //     coinIcon.x = this.calcLength(349);
    //     coinIcon.y = this.calcLength(144);
    //     this.finalLoseContainer.addChild(coinIcon);

    //     //coinText
    //     const coinText = new BitmapText({
    //         text: "+ 0",
    //         style: new TextStyle({
    //             fill: '#FFFFFF',
    //             fontFamily: 'SourceCodePro-Semibold',
    //             fontSize: this.calcLength(28),
    //             letterSpacing: 0
    //         })
    //     });
    //     coinText.x = this.calcLength(421);
    //     coinText.y = this.calcLength(150);
    //     this.finalLoseContainer.addChild(coinText);

    //     this.finalLoseContainer.visible = false;

    //     this.playLoseAnim();
    // }

    // initResultDraw = async () => {
    //     this.finalDrawContainer.boundsArea = new Rectangle(0, 0, this.calcLength(670), this.calcLength(280));
    //     this.finalDrawContainer.x = this.calcLength(40);

    //     //bg
    //     const bgResultDraw = await Assets.load(bg_result_draw);
    //     const bg = Sprite.from(bgResultDraw);
    //     bg.width = this.calcLength(670);
    //     bg.height = this.calcLength(280);
    //     this.finalDrawContainer.addChild(bg);

    //     //info
    //     const infoText = new BitmapText({
    //         text: "It's a draw!",
    //         style:  new TextStyle({
    //             fill: 'rgba(255,255,255,1)',
    //             fontFamily: 'SourceCodePro-Semibold',
    //             fontSize: this.calcLength(36),
    //             letterSpacing: 4
    //         })
    //     });
    //     infoText.x = this.calcLength(335);
    //     infoText.y = this.calcLength(89);
    //     infoText.anchor.set(0.5, 0.5);
    //     this.finalDrawContainer.addChild(infoText);

    //     //coinIcon
    //     const imgCoin = await Assets.load(img_coin);
    //     const coinIcon = Sprite.from(imgCoin);
    //     coinIcon.width = this.calcLength(48);
    //     coinIcon.height = this.calcLength(48);
    //     coinIcon.x = this.calcLength(276);
    //     coinIcon.y = this.calcLength(144);
    //     this.finalDrawContainer.addChild(coinIcon);

    //     //coinText
    //     const coinText = new BitmapText({
    //         text: "+ 100",
    //         style:  new TextStyle({
    //             fill: '#FFFFFF',
    //             fontFamily: 'SourceCodePro-Semibold',
    //             fontSize: this.calcLength(28),
    //             letterSpacing: 0
    //         })
    //     });
    //     coinText.x = this.calcLength(344);
    //     coinText.y = this.calcLength(150);
    //     this.finalDrawContainer.addChild(coinText);

    //     this.finalDrawContainer.visible = false;
    // }

    // initResultNoBet = async () => {
    //     this.finalNobetContainer.boundsArea = new Rectangle(0, 0, this.calcLength(670), this.calcLength(280));
    //     this.finalNobetContainer.x = this.calcLength(40);

    //     //resultBullishContainer-bg
    //     const bgResultNoBet = await Assets.load(bg_result_no_bet);
    //     const bg = Sprite.from(bgResultNoBet);  
    //     bg.width = this.calcLength(670);
    //     bg.height = this.calcLength(280);
    //     this.finalNobetContainer.addChild(bg);

    //     //info
    //     const infoText = new BitmapText({
    //         text: "You did not place a bet",
    //         style:  new TextStyle({
    //             fill: 'rgba(255,255,255,0.60)',
    //             fontFamily: 'SourceCodePro-Semibold',
    //             fontSize: this.calcLength(36),
    //             letterSpacing: 1
    //         })
    //     });
    //     infoText.x = this.calcLength(335);
    //     infoText.y = this.calcLength(89);
    //     infoText.anchor.set(0.5, 0.5);
    //     this.finalNobetContainer.addChild(infoText);

    //     //coinIcon
    //     const imgCoin = await Assets.load(img_coin);
    //     const coinIcon = Sprite.from(imgCoin);
    //     coinIcon.width = this.calcLength(48);
    //     coinIcon.height = this.calcLength(48);
    //     coinIcon.x = this.calcLength(276);
    //     coinIcon.y = this.calcLength(144);
    //     this.finalNobetContainer.addChild(coinIcon);

    //     //coinText
    //     const coinText = new BitmapText({
    //         text: "+ 0",
    //         style:  new TextStyle({
    //             fill: '#FFFFFF',
    //             fontFamily: 'SourceCodePro-Semibold',
    //             fontSize: this.calcLength(28),
    //             letterSpacing: 1
    //         })
    //     });
    //     coinText.x = this.calcLength(344);
    //     coinText.y = this.calcLength(150);
    //     this.finalNobetContainer.addChild(coinText);

    //     this.finalNobetContainer.visible = false;
    // }

    initInfoCard = async () => {
        // this.openInfoContainer.zIndex = 100;
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
        openBorder.fill(0xCCC18E);
        // openBorder.zIndex = 11;


        const closeBorder = new Graphics();
        closeBorder.moveTo(this.calcLength(10), this.calcLength(10));
        for(let i = 0; i < points.length; i++){
            const item = points[i]
            closeBorder.lineTo(this.calcLength(item.x), this.calcLength(item.y));
        }
        closeBorder.fill(0xCCC18E);
        // closeBorder.zIndex = 11;


        //open title
        const openTitle = new BitmapText({
            x: this.calcLength(19),
            y: this.calcLength(12),
            text: 'Open price',
            style:  new TextStyle({
                fill: '#191919',
                fontSize: this.calcLength(22),
                fontFamily: 'Pixeloid Sans',
            })
        })

        //close title
        const closeTitle = new BitmapText({
            x: this.calcLength(19),
            y: this.calcLength(12),
            text: 'Close price',
            style:  new TextStyle({
                fill: '#191919',
                fontSize: this.calcLength(22),
                fontFamily: 'Pixeloid Sans',
            })
        })


        //open value
        this.openValueGraph.x = this.calcLength(19);
        this.openValueGraph.y = this.calcLength(46);
        this.openValueGraph.text = '56899'
        this.openValueGraph.style =  new TextStyle({
            fill: '#191919',
            fontSize: this.calcLength(24),
            fontFamily: 'Pixeloid Sans',
        })

        //close value
        this.closeValueGraph.x = this.calcLength(19);
        this.closeValueGraph.y = this.calcLength(46);
        this.closeValueGraph.text = '78990'
        this.closeValueGraph.style =  new TextStyle({
            fill: '#191919',
            fontSize: this.calcLength(24),
            fontFamily: 'Pixeloid Sans',
        })

        this.openInfoContainer.addChild(openBorder);
        this.openInfoContainer.addChild(openTitle);
        this.openInfoContainer.addChild(this.openValueGraph);
        this.openInfoContainer.zIndex = 12;
        this.openInfoContainer.visible = false;
        this.klineContainer.addChild(this.openInfoContainer);

        this.closeInfoContainer.addChild(closeBorder);
        this.closeInfoContainer.addChild(closeTitle);
        this.closeInfoContainer.addChild(this.closeValueGraph);
        this.closeInfoContainer.zIndex = 12;
        this.closeInfoContainer.visible = false;
        this.klineContainer.addChild(this.closeInfoContainer);


        this.startCircle.width = this.calcLength(16);
        this.startCircle.height = this.calcLength(16);
        const imgCircle = await Assets.load(circle_img);
        this.startCircle = Sprite.from(imgCircle);
        this.endCircle = Sprite.from(imgCircle);
        this.startCircle.visible = false;
        this.endCircle.visible = false;

        this.klineContainer.addChild(this.line);
        this.klineContainer.addChild(this.startCircle);
        this.klineContainer.addChild(this.endCircle);
    }

    initFlyingCoins = async () => {
        const imgCoin = await Assets.load(img_coin);
        for (let i = 0; i < 200; i ++) {
            const coin = Sprite.from(imgCoin)
            // coin.visible = false
            coin.alpha = 0
            coin.width = this.calcLength(30);
            coin.height = this.calcLength(30);
            coin.x = this.calcLength(506);
            coin.y = this.calcLength(50)
            coin.zIndex = 10
            this.app.stage.addChild(coin)
            this.flyingCoins.push(coin)
        }
        
    }
    
}