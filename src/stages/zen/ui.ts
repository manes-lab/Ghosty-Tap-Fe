import {Container, Assets, Sprite, Graphics, Text, Rectangle, AnimatedSprite, TilingSprite, BitmapText } from 'pixi.js';
import { Stage } from '../base';

import img_mail from '../../assets/images/battle/ic-mail.png';
import img_mail_message from '../../assets/images/battle/ic-mail-message.png';



import progress_bottom from '../../assets/img/zen/progress-bottom.png'
import progress_cover from '../../assets/img/zen/progress-cover.png'
import progress_head from '../../assets/img/zen/progress-head.png'
import digits_bottom from '../../assets/img/zen/digits.png'
import recharging_coin from '../../assets/img/zen/progress-head.png'




import img_head from '../../assets/img/zen/head.png';
import img_coin from '../../assets/img/common/coin.png';
import img_leaderboard from '../../assets/img/adventure/leaderboard.png';
import img_crack1 from '../../assets/img/zen/crack-1.png'
import img_crack2 from '../../assets/img/zen/crack-2.png'


const LIMIT = 5
const MAX_COIN = 3000

export class ZenStageUI extends Stage {
    background: Container = new Container({isRenderGroup: true})
    barGraphics: Graphics[] = [];
    topContainer: Container = new Container()
    klineContainer: Container = new Container({isRenderGroup: true})
    buttonMask: Graphics = new Graphics()
    anim: AnimatedSprite | undefined
    jumpSprite: AnimatedSprite | undefined
    coinIcon: Sprite | undefined
    flyingCoin: Sprite | undefined
    progressContainer: Container = new Container({isRenderGroup: true})
    rechargingContainer: Container = new Container({isRenderGroup: true})
    digits: BitmapText = new BitmapText({
        text: MAX_COIN
    })
    rechargingText: BitmapText = new BitmapText({
        text: "reset after"
    })

    mailContainer: Container = new Container()

    //menuContainer
    coinGraph = new BitmapText({
        text: "0",
    })
    dateGraph = new BitmapText({
        text: "",
    })
    playerGraph = new BitmapText({
        text: "",
    })
    playerAvatarContainer: Container = new Container()


    addCoinGraph = new BitmapText({
        text: "+50",
    })

    crackAsset1: any
    crackAsset2: any

    //markContainer
    markGraphics: Text[] = [];

    data = {}

    constructor() {
        super()
    }

    public async load(elementId: string, preference: "webgl" | "webgpu" | undefined) {
        await this.app.init({ background: '#5B98AA', resizeTo: document.getElementById("ghosty-page"), preference })
        this.app.ticker.maxFPS = 120
        document.getElementById(elementId)!.appendChild(this.app.canvas);
        this.app.stage.addChild(this.background)
        this.background.zIndex = -1
        
        this.initButtonMask();
        this.initMenu();
        this.initTopContainer();
        this.initBarsGraph()
        this.initMark();
        this.initProgress()
        
        const bg = await Assets.load(`${window.location.origin}/img/background.png`)
        for (let i = 0; i < 2; i ++) {
            let bgSprite = new Sprite(bg)
            bgSprite.width = this.app.screen.width
            bgSprite.height = 3248 / 1500 * this.app.screen.width;
            bgSprite.y = this.app.screen.height - bgSprite.height;
            if (i == 1) {
                bgSprite.x = this.app.screen.width
            }
            this.background.addChild(bgSprite)
        }
        this.app.ticker.add(() => {
            this.background.x -= 5
            if (this.background.x <= -this.app.screen.width) {
                this.background.x = 0
            }
        })
        this.data.collisionY = this.app.screen.height / 2

        const sheet = await Assets.load(`${window.location.origin}/img/beaver.json`);
        this.anim = new AnimatedSprite(sheet.animations['run']);
        this.anim.anchor = {
            x: 0.5,
            y: 0
        }
        this.anim.animationSpeed = 0.1666;
        this.anim.play();
        this.anim.scale = 0.3
        this.anim.x = this.barGraphics[2].x - this.data.barWidth / 4
        this.anim.y = this.app.screen.height - this.calcLength(259 + 154)
        this.app.stage.addChild(this.anim);

        this.jumpSprite = new AnimatedSprite(sheet.animations['jump']);
        this.jumpSprite.anchor = {
            x: 0.5,
            y: 0
        }
        this.jumpSprite.animationSpeed = 0.1666;
        this.jumpSprite.play();
        this.jumpSprite.scale = 0.3
        this.jumpSprite.x = this.barGraphics[2].x - this.data.barWidth / 4
        this.jumpSprite.y = this.app.screen.height / 4 * 2.95
        this.jumpSprite.visible = false
        this.app.stage.addChild(this.jumpSprite);
    }

    public async destroy() {
        this.app.destroy({removeView: true}, {children: true});
    }

    initButtonMask = async () => {
        const h = this.app.screen.height - this.calcLength(300);
        this.buttonMask.rect(0, this.calcLength(300), this.app.screen.width, h).fill({ r: 0, g: 0, b: 0, a: 0 })
        this.buttonMask.zIndex = 2
        this.buttonMask.eventMode = 'static';
        this.buttonMask.on('pointerdown', () => {
            this.jump()
        });
        this.app.stage.addChild(this.buttonMask)
    }

    initMenu = async () => {
        const menuContainer: Container = new Container({isRenderGroup: true})
        menuContainer.x = this.calcLength(0);
        menuContainer.y = this.calcLength(0);
        menuContainer.boundsArea = new Rectangle(0, 0, this.calcLength(750), this.calcLength(300));

        //Head-title
        const imgHead = await Assets.load(img_head);
        const head = Sprite.from(imgHead);
        head.width = this.calcLength(248);
        head.height = this.calcLength(44);
        head.x = this.calcLength(251);
        head.y = this.calcLength(32);
        menuContainer.addChild(head);


        //Back
        const backBtn = new BitmapText({
            text: `Back`,
            style:{
                fill: '#CAAD95',
                fontSize: this.calcLength(32),
                fontFamily: 'LogoSC LongZhuTi',
                align: 'center'
            }
        })
        backBtn.x = this.calcLength(31);
        backBtn.y = this.calcLength(60);
        backBtn.anchor.set(0, 0.5);
        backBtn.eventMode = 'static';
        backBtn.cursor = 'pointer';
        backBtn.on('pointerdown', () => {
            this.events["changeRouter"]("/");
        });
        menuContainer.addChild(backBtn);


        //Trading Pair select
        const select = new Container();
        select.boundsArea = new Rectangle(0, 0, this.calcLength(236), this.calcLength(60));
        select.x = this.calcLength(31);
        select.y = this.calcLength(127);
        // select.eventMode = 'static';
        // select.cursor = 'pointer';
        // select.on('pointerdown', () => {
        //     this.events["changeModule"]("trading-pair");
        // });

        const selectBg = new Graphics();
        selectBg.beginFill(0xCAAD95);
        selectBg.drawRoundedRect(0, 0, this.calcLength(236), this.calcLength(60), this.calcLength(30));
        selectBg.endFill();
        select.addChild(selectBg);


        //select text
        const selectText = new BitmapText({
            text: `${this.data.instId.replace('-', '/')}`,
            style:{
                fill: '#282722',
                fontSize: this.calcLength(32),
                fontFamily: 'LogoSC LongZhuTi',
                align: 'center'
            }
        })
        selectText.x = this.calcLength(118)
        selectText.y = this.calcLength(30)
        selectText.anchor.set(0.5, 0.5);
        select.addChild(selectText);


        //select icon
        // const icOpen = await Assets.load(ic_open);
        // const selectIcon = Sprite.from(icOpen);
        // selectIcon.width = this.calcLength(16);
        // selectIcon.height = this.calcLength(16);
        // selectIcon.x = this.calcLength(177);
        // selectIcon.y = this.calcLength(22);
        // select.addChild(selectIcon);


        //select icon
        // const icOpen = await Assets.load(ic_open);
        // const selectIcon = Sprite.from(icOpen);
        // selectIcon.width = this.calcLength(16);
        // selectIcon.height = this.calcLength(16);
        // selectIcon.x = this.calcLength(177);
        // selectIcon.y = this.calcLength(22);
        // select.addChild(selectIcon);

        // const selectBox = new Graphics().rect(0, 0, this.calcLength(220), this.calcLength(60)).fill(0x000000, 0);
        // selectBox.eventMode = 'static';
        // selectBox.cursor = 'pointer';
        // selectBox.on('pointerdown', () => {
        //     this.events["changeModule"]("trading-pair");
        // });
        // select.addChild(selectBox);
        //add select
        menuContainer.addChild(select);


        //coin
        const coin = new Container();
        coin.width = this.calcLength(236);
        coin.height = this.calcLength(60);
        coin.x = this.calcLength(416);
        coin.y = this.calcLength(127);
        coin.eventMode = 'static';
        coin.cursor = 'pointer';
        coin.on('pointerdown', () => {
            this.events["changeModule"]("profile", {coin: this.data.coin});
        });
        //coin-bg
        const coinBg = new Graphics();
        coinBg.beginFill(0xCAAD95);
        coinBg.drawRoundedRect(0, 0, this.calcLength(236), this.calcLength(60), this.calcLength(30));
        coinBg.endFill();
        coin.addChild(coinBg);

        //coin-icon
        const imgCoin = await Assets.load(img_coin);
        this.coinIcon = Sprite.from(imgCoin);
        this.coinIcon.width = this.calcLength(40);
        this.coinIcon.height = this.calcLength(40);
        this.coinIcon.x = this.calcLength(185);
        this.coinIcon.y = this.calcLength(10);
        coin.addChild(this.coinIcon);

        //coin-text
        this.coinGraph.x = this.calcLength(92);
        this.coinGraph.y = this.calcLength(30);
        this.coinGraph.anchor.set(0.5, 0.5);
        this.coinGraph.style = {
            fill: '#282722',
            fontSize: this.calcLength(32),
            fontFamily: 'LogoSC LongZhuTi',
            align: 'center'
        }
        coin.addChild(this.coinGraph);
        //add coin 
        menuContainer.addChild(coin);


        //flying Coin
        this.flyingCoin = Sprite.from(img_coin)
        this.flyingCoin.width = this.calcLength(30);
        this.flyingCoin.height = this.calcLength(30);
        this.flyingCoin.anchor = 0.5
        this.flyingCoin.visible = false
        this.flyingCoin.zIndex = 10
        this.app.stage.addChild(this.flyingCoin)

        //add coin
        this.addCoinGraph.x = this.calcLength(320);
        this.addCoinGraph.y = this.calcLength(300);
        this.addCoinGraph.anchor.set(0.5, 0.5);
        this.addCoinGraph.style = {
            fill: '#BB4F23',
            fontSize: this.calcLength(28),
            fontFamily: 'LogoSC LongZhuTi',
            align: 'center'
        }
        this.addCoinGraph.visible = false;
        this.app.stage.addChild(this.addCoinGraph);


        // leaderboard
        const imgLeaderboard = await Assets.load(img_leaderboard);
        const leaderboardBtn = Sprite.from(imgLeaderboard);
        leaderboardBtn.width = this.calcLength(60);
        leaderboardBtn.height = this.calcLength(63);
        leaderboardBtn.x = this.calcLength(660);
        leaderboardBtn.y = this.calcLength(123);
        leaderboardBtn.eventMode = 'static';
        leaderboardBtn.cursor = 'pointer';
        leaderboardBtn.on('pointerdown', () => {
            this.events["changeModule"]('leaderboard');
        });
        menuContainer.addChild(leaderboardBtn);


        //mail
        // this.initMail();
        // menuContainer.addChild(this.mailContainer);


        //date
        this.dateGraph.x = this.calcLength(52);
        this.dateGraph.y = this.calcLength(256);
        this.dateGraph.style = {
            fill: '#E0C5AF',
            fontSize: this.calcLength(24),
            fontFamily: 'LogoSC LongZhuTi',
        }
        menuContainer.addChild(this.dateGraph);

        //players list
        const players = new Container();
        players.boundsArea = new Rectangle(0, 0, this.calcLength(310), this.calcLength(50));
        players.x = this.calcLength(404);
        players.y = this.calcLength(246);
        players.eventMode = 'static';
        players.cursor = 'pointer';
        players.on('pointerdown', (e) => {
            e.stopPropagation();
            // setTimeout(() => {
                this.events["changeModule"]("zen-online-players");
            // }, 300);
        });


        //players avatar
        players.addChild(this.playerAvatarContainer);
        menuContainer.addChild(players);
        

        //players count bg
        const playersCountBg = new Graphics();
        playersCountBg.beginFill(0xCAAD95); 
        playersCountBg.lineStyle(2, 0x5B97AA); 
        playersCountBg.drawRoundedRect(0, 0, this.calcLength(84), this.calcLength(38), this.calcLength(38)); // 绘制圆角矩形
        playersCountBg.endFill();
        playersCountBg.x = this.calcLength(226);
        playersCountBg.y = this.calcLength(6);
        players.addChild(playersCountBg);
        

        //players count text
        this.playerGraph.style = {
            fill: '#282722',
            fontSize: this.calcLength(32),
            fontFamily: 'LogoSC LongZhuTi',
            align: 'center'
        }
        this.playerGraph.x = this.calcLength(268);
        this.playerGraph.y = this.calcLength(25);
        this.playerGraph.anchor.set(0.5, 0.5);
        players.addChild(this.playerGraph);

        
        this.app.stage.addChild(menuContainer);
    }

    initMail = async () => {
        this.mailContainer.x = this.calcLength(662);
        this.mailContainer.y = this.calcLength(6);
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
        this.mailContainer.addChild(mailMessage);
        mailMessage.visible = false;  
    }

    initMark = () => {
        const h = this.app.screen.height - this.calcLength(375 + 501);
        const markContainer: Container = new Container({isRenderGroup: true})
        markContainer.x = this.calcLength(0);
        markContainer.y = this.calcLength(375);
        markContainer.boundsArea = new Rectangle(0, 0, this.calcLength(750), h);

        //Mark-line
        for (let i = 0; i < 10; i ++) {
            const graphic = new Graphics().rect(0, 0, this.calcLength(560), 1).fill(0xCAAD95, 1);
            graphic.x = this.calcLength(30);
            graphic.y = this.calcLength(14) + this.klineContainer.height / 9 * i;
            markContainer.addChild(graphic)
        }

        //Mark-value
        let marks = []
        for (let i = 0; i < 10; i ++) {
            const graphic = new BitmapText({
                text: '',
                style:{
                    fill: `#CAAD95`,
                    fontSize: this.calcLength(22),
                    fontFamily: 'LogoSC LongZhuTi',
                    letterSpacing: 1
                },
                x:  this.calcLength(600),
                y:  this.calcLength(14) + this.klineContainer.height / 9 * i
            })
            graphic.anchor.set(0, 0.5);
            marks.push(graphic);
            markContainer.addChild(graphic)
        }
        this.markGraphics = marks;

        this.app.stage.addChild(markContainer);
    }

    initTopContainer = () => {
        const h = this.app.screen.height - this.calcLength(375 + 501);
        this.topContainer.x = this.calcLength(20);
        this.topContainer.y = this.calcLength(375);
        this.topContainer.boundsArea = new Rectangle(0, 0, this.calcLength(558), h);
        this.topContainer.zIndex = 10;
        this.klineContainer.boundsArea = new Rectangle(0, 0, this.calcLength(558), h);
        let mask = new Graphics()
        // Add the rectangular area to show
        .rect(this.calcLength(16),0,this.calcLength(558),h)
        .fill(0xffffff).stroke({ width: 4, color: 0xffd900 })
        this.topContainer.mask = mask
        this.topContainer.addChild(mask)
        this.topContainer.addChild(this.klineContainer)
        this.app.stage.addChild(this.topContainer)
    }

    initProgress = async () => {
        this.app.stage.addChild(this.progressContainer)
        this.progressContainer.x = this.calcLength(52)
        this.progressContainer.y = this.app.screen.height - this.calcLength(215 + 36)
        
        const progressBottomAsset = await Assets.load(progress_bottom)
        const progressBottom = Sprite.from(progressBottomAsset)
        progressBottom.width = this.calcLength(455)
        progressBottom.height = this.calcLength(36)
        this.progressContainer.addChild(progressBottom)


        //条纹
        // const stripeMask = new Container()
        // stripeMask.x = this.calcLength(24)
        // stripeMask.y = this.calcLength(6)
        // let mask = new Graphics()
        // .poly([
        //     {x: 0, y: 0},
        //     {x: this.calcLength(458), y: 0},
        //     {x: this.calcLength(458 + 6), y: this.calcLength(6)},
        //     {x: this.calcLength(458 + 12), y: this.calcLength(12)},
        //     {x: this.calcLength(458 + 18), y: this.calcLength(18)},
        //     {x: this.calcLength(458 + 18), y: this.calcLength(24)},
        //     {x: this.calcLength(458 + 18), y: this.calcLength(30)},
        //     {x: this.calcLength(458 + 12), y: this.calcLength(36)},
        //     {x: this.calcLength(458 + 6), y: this.calcLength(42)},
        //     {x: this.calcLength(458), y: this.calcLength(48)},
        //     {x: 0, y: this.calcLength(48)},
        //     {x: this.calcLength(-6), y: this.calcLength(42)},
        //     {x: this.calcLength(-12), y: this.calcLength(36)},
        //     {x: this.calcLength(-18), y: this.calcLength(30)},
        //     {x: this.calcLength(-18), y: this.calcLength(24)},
        //     {x: this.calcLength(-18), y: this.calcLength(18)},
        //     {x: this.calcLength(-12), y: this.calcLength(12)},
        //     {x: this.calcLength(-6), y: this.calcLength(6)},
        // ])
        // .fill(0xffffff)
        // stripeMask.mask = mask
        // stripeMask.addChild(mask)
        // this.progressContainer.addChild(stripeMask)

        
        // const stripeContainer = new Container({isRenderGroup: true})
        // stripeContainer.x = this.calcLength(-18)
        // const progressStripeBottomAsset = await Assets.load(progress_stripe_bottom)
        // for (let i = 0; i < 2; i ++) {
        //     let stripeSprite = new Sprite(progressStripeBottomAsset)
        //     stripeSprite.width = this.calcLength(464)
        //     stripeSprite.height = this.calcLength(48)
        //     if (i == 1) {
        //         stripeSprite.x = this.calcLength(464)
        //     }
        //     stripeContainer.addChild(stripeSprite)
        // }
        // this.app.ticker.add(() => {
        //     stripeContainer.x -= 1
        //     if (stripeContainer.x <= -this.calcLength(464)) {
        //         stripeContainer.x = 0
        //     }
        // })
        // stripeMask.addChild(stripeContainer)


        
        const progressCoverAsset = await Assets.load(progress_cover)
        const progressCover = TilingSprite.from(progressCoverAsset)
        progressCover.tileScale = this.calcLength(356 / 356)
        progressCover.x = this.calcLength(0)
        progressCover.y = this.calcLength(0)
        progressCover.width = this.calcLength(356)
        progressCover.height = this.calcLength(36)

        
        
        const progressHeadAsset = await Assets.load(progress_head)
        const progressHead = Sprite.from(progressHeadAsset)
        progressHead.x = progressCover.width - this.calcLength(24)
        progressHead.y =  -this.calcLength(6)
        progressHead.width = this.calcLength(48)
        progressHead.height = this.calcLength(48)

        const digitsContainer = new Container({isRenderGroup: true})
        digitsContainer.x = this.calcLength(505)
        digitsContainer.y = -this.calcLength(14)
        const digitsBottomAsset = await Assets.load(digits_bottom)
        const digitsBottom = Sprite.from(digitsBottomAsset)
        digitsBottom.width = this.calcLength(137)
        digitsBottom.height = this.calcLength(64)
        this.digits.anchor = 0.5
        this.digits.x = digitsBottom.width / 2
        this.digits.y = digitsBottom.height / 2
        this.digits.style = {
            fill: '#E0C5AF',
            fontSize: this.calcLength(24),
            fontFamily: 'LogoSC LongZhuTi',
        }

        
        progressCover.label = "cover"
        progressHead.label = "head"
        this.progressContainer.addChild(progressCover)
        this.progressContainer.addChild(progressHead)
        digitsContainer.addChild(digitsBottom)
        digitsContainer.addChild(this.digits)
        this.progressContainer.addChild(digitsContainer)
        
        this.app.stage.addChild(this.rechargingContainer)
        this.rechargingContainer.x = this.calcLength(52)
        this.rechargingContainer.y = this.app.screen.height - this.calcLength(118 + 60)
        const rechargingBottom = Sprite.from(progressBottomAsset)
        rechargingBottom.width = this.calcLength(455)
        rechargingBottom.height = this.calcLength(36)
        this.rechargingContainer.addChild(rechargingBottom)

        const rechargingCoinAsset = await Assets.load(recharging_coin)
        const rechargingCoin = Sprite.from(rechargingCoinAsset)
        rechargingCoin.anchor.set(0, 0.5)
        rechargingCoin.x = this.calcLength(90)
        rechargingCoin.y = rechargingBottom.height / 2
        rechargingCoin.width = this.calcLength(30)
        rechargingCoin.height = this.calcLength(30)
        this.rechargingText.anchor.set(0, 0.5)
        this.rechargingText.x = this.calcLength(90 + 30 + 16)
        this.rechargingText.y = rechargingBottom.height / 2
        this.rechargingText.style = {
            fill: '#FFFFFF',
            fontSize: this.calcLength(24),
            fontFamily: 'LogoSC LongZhuTi',
        }
        this.rechargingContainer.addChild(rechargingCoin)


        const digitsBottom2 = Sprite.from(digitsBottomAsset)
        digitsBottom2.width = this.calcLength(137)
        digitsBottom2.height = this.calcLength(64)
        digitsBottom2.x = this.calcLength(505);
        digitsBottom2.y = -this.calcLength(14);

        const digits2 = new BitmapText({
            text: '0'
        });
        digits2.x = this.calcLength(68 + 505)
        digits2.y = this.calcLength(18)
        digits2.anchor.set(0.5, 0.5);
        digits2.style = {
            fill: '#E0C5AF',
            fontSize: this.calcLength(24),
            fontFamily: 'LogoSC LongZhuTi',
        }
        this.rechargingContainer.addChild(digitsBottom2)
        this.rechargingContainer.addChild(digits2)
        this.rechargingContainer.addChild(this.rechargingText)
        this.rechargingContainer.visible = false
    }

    initBarsGraph = async () => {
        this.crackAsset1 = await Assets.load(img_crack1)
        this.crackAsset2 = await Assets.load(img_crack2)
        this.data.barWidth = this.calcLength(110)
        let bars = []
        let lastX = this.klineContainer.width - (LIMIT - 1) * this.data.barWidth
        for (let i = 0; i < LIMIT + 1; i ++) {
          let graphic = new Graphics()
          graphic.x = lastX
          graphic.zIndex = 1;
          this.klineContainer?.addChild(graphic)
          bars.push(graphic)
          lastX += this.data.barWidth + this.calcLength(2);
        }
        this.barGraphics = bars
    }
}