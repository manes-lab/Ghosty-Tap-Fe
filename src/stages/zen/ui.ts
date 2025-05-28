import {Container, Assets, Sprite, Graphics, Text, Rectangle, AnimatedSprite, TilingSprite, BitmapText } from 'pixi.js';
import { Stage } from '../base';

import img_home from '../../assets/images/adventure/ic-home.png';
import img_leaderboard from '../../assets/images/adventure/ic-leaderboard.png';
import img_coin from '../../assets/images/common/ic-coin.png';
import bg_coin from '../../assets/images/zen/bg-coin.png';
import ic_open from '../../assets/images/zen/ic-open.png';
import img_mail from '../../assets/images/battle/ic-mail.png';
import img_mail_message from '../../assets/images/battle/ic-mail-message.png';

// import progress_bottom from '../../assets/images/zen/progress-bottom.png'
// import progress_cover from '../../assets/images/zen/progress-cover.png'
// import progress_head from '../../assets/images/zen/progress-head.png'
// import digits_bottom from '../../assets/images/zen/digits.png'
// import recharging_coin from '../../assets/images/common/ic-coin.png'
import img_crack from '../../assets/images/zen/crack.png'
// import progress_stripe_bottom from '../../assets/images/zen/stripe-bottom.png'


import progress_bottom from '../../assets/img/zen/progress-bottom.png'
import progress_cover from '../../assets/img/zen/progress-cover.png'
import progress_head from '../../assets/img/zen/progress-head.png'
import digits_bottom from '../../assets/img/zen/digits.png'
import recharging_coin from '../../assets/img/zen/progress-head.png'

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

    crackAsset: any

    //markContainer
    markGraphics: Text[] = [];

    data = {}

    constructor() {
        super()
    }

    public async load(elementId: string, preference: "webgl" | "webgpu" | undefined) {
        await this.app.init({ background: '#94D3F3', resizeTo: document.body, preference })
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
        
        const bg = await Assets.load(`${window.location.origin}/images/background.png`)
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
        this.anim.y = this.app.screen.height - this.calcLength(206 + 148)
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
        const h = this.app.screen.height - this.calcLength(40+124+50+14);
        this.buttonMask.rect(0, this.calcLength(40+124+50+14), this.app.screen.width, h).fill({ r: 0, g: 0, b: 0, a: 0 })
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
        menuContainer.y = this.calcLength(40);
        menuContainer.boundsArea = new Rectangle(0, 0, this.calcLength(750), this.calcLength(124));

        //Home icon
        const imgHome = await Assets.load(img_home);
        const home = Sprite.from(imgHome);
        home.width = this.calcLength(48);
        home.height = this.calcLength(48);
        home.x = this.calcLength(40);
        home.y = this.calcLength(6);
        home.eventMode = 'static';
        home.cursor = 'pointer';
        home.on('pointerdown', () => {
            this.events["changeRouter"]("/");
        });
        menuContainer.addChild(home);


        //Trading Pair select
        const select = new Container();
        select.boundsArea = new Rectangle(0, 0, this.calcLength(210), this.calcLength(60));
        select.x = this.calcLength(112);
        // select.eventMode = 'static';
        // select.cursor = 'pointer';
        // select.on('pointerdown', () => {
        //     this.events["changeModule"]("trading-pair");
        // });
        //select text
        const selectText = new BitmapText({
            text: `${this.data.instId.replace('-', '/')}`,
            style:{
                fill: '#000000',
                fontSize: this.calcLength(30),
                fontFamily: 'SourceCodePro-Medium',
                align: 'center'
            }
        })
        selectText.y = this.calcLength(30)
        selectText.anchor.set(0, 0.5);
        select.addChild(selectText);
        //select icon
        const icOpen = await Assets.load(ic_open);
        const selectIcon = Sprite.from(icOpen);
        selectIcon.width = this.calcLength(16);
        selectIcon.height = this.calcLength(16);
        selectIcon.x = this.calcLength(177);
        selectIcon.y = this.calcLength(22);
        select.addChild(selectIcon);

        const selectBox = new Graphics().rect(0, 0, this.calcLength(220), this.calcLength(60)).fill(0x000000, 0);
        selectBox.eventMode = 'static';
        selectBox.cursor = 'pointer';
        selectBox.on('pointerdown', () => {
            this.events["changeModule"]("trading-pair");
        });
        select.addChild(selectBox);
        //add select
        menuContainer.addChild(select);


        //coin
        const coin = new Container();
        coin.width = this.calcLength(180);
        coin.height = this.calcLength(60);
        coin.x = this.calcLength(382);
        coin.eventMode = 'static';
        coin.cursor = 'pointer';
        coin.on('pointerdown', () => {
            this.events["changeModule"]("profile", {coin: this.data.coin});
        });
        //coin-bg
        const bgCoin = await Assets.load(bg_coin);
        const coinBg = Sprite.from(bgCoin);
        coinBg.width = this.calcLength(180);
        coinBg.height = this.calcLength(60);
        coin.addChild(coinBg);
        //coin-icon
        const imgCoin = await Assets.load(img_coin);
        this.coinIcon = Sprite.from(imgCoin);
        this.coinIcon.width = this.calcLength(30);
        this.coinIcon.height = this.calcLength(30);
        this.coinIcon.x = this.calcLength(132);
        this.coinIcon.y = this.calcLength(15);
        coin.addChild(this.coinIcon);
        //coin-text
        this.coinGraph.x = this.calcLength(60);
        this.coinGraph.y = this.calcLength(30);
        this.coinGraph.anchor.set(0.5, 0.5);
        this.coinGraph.style = {
            fill: '#111111',
            fontSize: this.calcLength(24),
            fontFamily: 'SourceCodePro-Medium',
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
            fill: '#FC7817',
            stroke: '#000000',
            strokeThickness: 1,
            fontSize: this.calcLength(34),
            fontFamily: 'SourceCodePro-Semibold-stroke',
            align: 'center'
        }
        this.addCoinGraph.visible = false;
        this.app.stage.addChild(this.addCoinGraph);


        //leaderboard
        const imgLeaderboard = await Assets.load(img_leaderboard);
        const leaderboardBtn = Sprite.from(imgLeaderboard);
        leaderboardBtn.width = this.calcLength(48);
        leaderboardBtn.height = this.calcLength(48);
        leaderboardBtn.x = this.calcLength(598);
        leaderboardBtn.y = this.calcLength(6);
        leaderboardBtn.eventMode = 'static';
        leaderboardBtn.cursor = 'pointer';
        leaderboardBtn.on('pointerdown', () => {
            this.events["changeModule"]('leaderboard');
        });
        menuContainer.addChild(leaderboardBtn);


        //mail
        this.initMail();
        menuContainer.addChild(this.mailContainer);


        //date
        this.dateGraph.x = this.calcLength(40);
        this.dateGraph.y = this.calcLength(110);
        this.dateGraph.style = {
            fill: '#000000',
            fontSize: this.calcLength(24),
            fontFamily: 'SourceCodePro-Medium',
        }
        menuContainer.addChild(this.dateGraph);

        //players list
        const players = new Container();
        players.boundsArea = new Rectangle(0, 0, this.calcLength(264), this.calcLength(48));
        players.x = this.calcLength(446);
        players.y = this.calcLength(86);
        players.eventMode = 'static';
        players.cursor = 'pointer';
        players.on('pointerdown', () => {
            this.events["changeModule"]("online-players");
        });
        

        //players count bg
        const playersCountBg = new Graphics();
        playersCountBg.beginFill(0x7DB4D1); // 设置填充颜色为黑色
        playersCountBg.drawRoundedRect(0, 0, this.calcLength(84), this.calcLength(48), this.calcLength(48)); // 绘制圆角矩形
        playersCountBg.endFill();
        playersCountBg.x = this.calcLength(180);
        playersCountBg.y = this.calcLength(0);
        players.addChild(playersCountBg);
        

        //players count text
        this.playerGraph.style = {
            fill: '#FFFFFF',
            fontSize: this.calcLength(24),
            fontFamily: 'SourceCodePro-Medium',
            align: 'center'
        }
        this.playerGraph.x = this.calcLength(222);
        this.playerGraph.y = this.calcLength(24);
        this.playerGraph.anchor.set(0.5, 0.5);
        players.addChild(this.playerGraph);

        //players avatar
        players.addChild(this.playerAvatarContainer);
        menuContainer.addChild(players);
        


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
        const h = this.app.screen.height - this.calcLength(40+124+50+40+280+40);
        const lineH = this.calcLength(28);
        const markContainer: Container = new Container({isRenderGroup: true})
        markContainer.x = this.calcLength(0);
        markContainer.y = this.calcLength(40+124+50);
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
                    fill: `rgba(0,0,0,0.4)`,
                    fontSize: this.calcLength(24),
                    fontFamily: 'SourceCodePro-Medium',
                    letterSpacing: 1
                },
                x:  this.calcLength(610),
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
        const h = this.app.screen.height - this.calcLength(40+124+50+40+280+40);
        this.topContainer.x = this.calcLength(30);
        this.topContainer.y = this.calcLength(40+124+50+14);
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
        this.progressContainer.y = this.app.screen.height - this.calcLength(118 + 60)
        
        const progressBottomAsset = await Assets.load(progress_bottom)
        const progressBottom = Sprite.from(progressBottomAsset)
        progressBottom.width = this.calcLength(465)
        progressBottom.height = this.calcLength(37)
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
        digitsContainer.y = -this.calcLength(5)
        const digitsBottomAsset = await Assets.load(digits_bottom)
        const digitsBottom = Sprite.from(digitsBottomAsset)
        digitsBottom.width = this.calcLength(124)
        digitsBottom.height = this.calcLength(46)
        this.digits.anchor = 0.5
        this.digits.x = digitsBottom.width / 2
        this.digits.y = digitsBottom.height / 2
        this.digits.style = {
            fill: '#E0C5AF',
            fontSize: this.calcLength(24),
            fontFamily: 'SourceCodePro-Medium',
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
        rechargingBottom.width = this.calcLength(465)
        rechargingBottom.height = this.calcLength(37)
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
            fontFamily: 'SourceCodePro-Medium',
        }
        this.rechargingContainer.addChild(rechargingCoin)


        const digitsBottom2 = Sprite.from(digitsBottomAsset)
        digitsBottom2.width = this.calcLength(124)
        digitsBottom2.height = this.calcLength(46)
        digitsBottom2.x = this.calcLength(505);
        digitsBottom2.y = -this.calcLength(5);

        const digits2 = new BitmapText({
            text: '0'
        });
        digits2.x = this.calcLength(62 + 505)
        digits2.y = this.calcLength(18)
        digits2.anchor.set(0.5, 0.5);
        digits2.style = {
            fill: '#E0C5AF',
            fontSize: this.calcLength(24),
            fontFamily: 'SourceCodePro-Medium',
        }
        this.rechargingContainer.addChild(digitsBottom2)
        this.rechargingContainer.addChild(digits2)
        this.rechargingContainer.addChild(this.rechargingText)
        this.rechargingContainer.visible = false
    }

    initBarsGraph = async () => {
        this.crackAsset = await Assets.load(img_crack)
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