import {Container, Assets, Sprite, Graphics, GraphicsContext, Text, Rectangle, AnimatedSprite, RenderContainer, Bounds, BitmapFont, BitmapText, TextStyle, CLEAR  } from 'pixi.js';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import { Stage } from '../base';
import img_bg from '../../assets/images/square/bg.png';
import img_home from '../../assets/images/zen/ic-home.png';

import img_leaderboard from '../../assets/images/zen/ic-leaderboard.png';
import img_history from '../../assets/images/square/ic-history.png';
import img_setting from '../../assets/images/square/ic-setting.png';
import img_coin from '../../assets/images/common/ic-coin.png';
import bg_coin from '../../assets/images/square/bg-coin.png';
import img_mail from '../../assets/images/battle/ic-mail.png';
import img_mail_message from '../../assets/images/battle/ic-mail-message.png';

export class SquareStageUI extends Stage {
    coinGraph = new BitmapText({
        text: "",
    })
    playerGraph = new BitmapText({
        text: "",
    })
    background: Container = new Container({isRenderGroup: true})
    playerAvatarContainer: Container = new Container()
    mailContainer: Container = new Container()

    data : {
        touches: any,
        mouseDown: boolean,
        isDragging: boolean
    } = {
        mouseDown: false,
        isDragging: false,
        touches: []
    }
    

    constructor() {
        super();
    }

    public async load(elementId: string, preference: "webgl" | "webgpu" | undefined)  {
        await super.load(elementId, preference)
        await this.app.init({ background: '#000000', resizeTo: document.body, preference })
        this.app.ticker.maxFPS = 120
        document.getElementById(elementId)!.appendChild(this.app.canvas);
        this.app.stage.addChild(this.background)
        this.background.zIndex = -1
        
        
        this.initMenu();
        this.initInviteBtn();
        await this.initBg();
        
    }
    

    public async destroy() {
        await super.destroy()
    }

    initBg = async () => {
        const bg: Container = new Container();
        
        bg.x =  -this.app.screen.width / 2
        bg.y = 0;

        //background
        const imgBg = await Assets.load(img_bg);
        const background = Sprite.from(imgBg);
        // bg.scale = 0.5
        background.width = 2048;
        background.height = 2048;
        bg.addChild(background);

        //capybara-anim-1
        const sheet1 = await Assets.load(`${window.location.origin}/images/square/capybara-anim-1.json`);
        const capybara1 = new AnimatedSprite(sheet1.animations['run']);
        capybara1.animationSpeed = 0.16;
        capybara1.play();
        capybara1.scale = bg.scale.x / 2;
        capybara1.x =  693
        capybara1.y = 1018;
        bg.addChild(capybara1);

        //capybara-anim-2
        const sheet2 = await Assets.load(`${window.location.origin}/images/square/capybara-anim-2.json`);
        const capybara2 = new AnimatedSprite(sheet2.animations['run']);
        capybara2.animationSpeed = 0.16;
        capybara2.play();
        capybara2.scale = bg.scale.x / 2;
        capybara2.x =  982
        capybara2.y = 1240
        bg.addChild(capybara2);

        //capybara-anim-3
        const sheet3 = await Assets.load(`${window.location.origin}/images/square/capybara-anim-3.json`);
        const capybara3 = new AnimatedSprite(sheet3.animations['run']);
        capybara3.animationSpeed = 0.16;
        capybara3.play();
        capybara3.scale = bg.scale.x / 2;
        capybara3.x =  480
        capybara3.y = 1408
        bg.addChild(capybara3);

        //capybara-anim-4
        const sheet4 = await Assets.load(`${window.location.origin}/images/square/capybara-anim-4.json`);
        const capybara4 = new AnimatedSprite(sheet4.animations['run']);
        capybara4.animationSpeed = 0.16;
        capybara4.play();
        capybara4.scale = bg.scale.x / 2;
        capybara4.x =  716
        capybara4.y = 1498
        bg.addChild(capybara4);

        //capybara-anim-5
        const sheet5 = await Assets.load(`${window.location.origin}/images/square/capybara-anim-5.json`);
        const capybara5 = new AnimatedSprite(sheet5.animations['run']);
        capybara5.animationSpeed = 0.16;
        capybara5.play();
        capybara5.scale = bg.scale.x / 2;
        capybara5.x =  1052
        capybara5.y = 1080
        bg.addChild(capybara5);


        //capybara-anim-6
        const sheet6 = await Assets.load(`${window.location.origin}/images/square/capybara-anim-6.json`);
        const capybara6 = new AnimatedSprite(sheet6.animations['run']);
        capybara6.animationSpeed = 0.16;
        capybara6.play();
        capybara6.scale = bg.scale.x / 2;
        capybara6.x =  803
        capybara6.y = 550
        bg.addChild(capybara6);


        //capybara-anim-7
        const sheet7 = await Assets.load(`${window.location.origin}/images/square/capybara-anim-7.json`);
        const capybara7 = new AnimatedSprite(sheet7.animations['run']);
        capybara7.animationSpeed = 0.16;
        capybara7.play();
        capybara7.scale = bg.scale.x / 2;
        capybara7.x =  250
        capybara7.y = 841
        bg.addChild(capybara7);

        //capybara-anim-8
        const sheet8 = await Assets.load(`${window.location.origin}/images/square/capybara-anim-8.json`);
        const capybara8 = new AnimatedSprite(sheet8.animations['run']);
        capybara8.animationSpeed = 0.16;
        capybara8.play();
        capybara8.scale = bg.scale.x / 2;
        capybara8.x =  1428
        capybara8.y = 840
        bg.addChild(capybara8);

        //capybara-anim-9
        const sheet9 = await Assets.load(`${window.location.origin}/images/square/capybara-anim-9.json`);
        const capybara9 = new AnimatedSprite(sheet9.animations['run']);
        capybara9.animationSpeed = 0.16;
        capybara9.play();
        capybara9.scale = bg.scale.x / 2;
        capybara9.x =  1010
        capybara9.y = 240
        bg.addChild(capybara9);

        //capybara-anim-3
        const sheet10 = await Assets.load(`${window.location.origin}/images/square/capybara-anim-10.json`);
        const capybara10 = new AnimatedSprite(sheet10.animations['run']);
        capybara10.animationSpeed = 0.16;
        capybara10.play();
        capybara10.scale = bg.scale.x / 2;
        capybara10.x =  530
        capybara10.y = 580
        bg.addChild(capybara10);


        //capybara-anim-11
        const sheet11 = await Assets.load(`${window.location.origin}/images/square/capybara-anim-11.json`);
        const capybara11 = new AnimatedSprite(sheet11.animations['run']);
        capybara11.animationSpeed = 0.16;
        capybara11.play();
        capybara11.scale = bg.scale.x / 2;
        capybara11.x =  1162
        capybara11.y = 450
        bg.addChild(capybara11);

        bg.scale = this.app.screen.width / 2000 * 2;


        bg.eventMode = 'dynamic';
        //================ mouse =================
        bg.cursor = 'pointer';

        
        const move = (e: any) => {
            const borderX = -(2048 * bg.scale.x - this.app.screen.width)
            const borderY = -(2048 * bg.scale.y - this.app.screen.height)
            this.data.isDragging = true
            let newX = bg.x + e.movement.x
            let newY = bg.y + e.movement.y
            if (newX > 0) {
                newX = 0
            }
            if (newX < borderX) {
                newX = borderX
            }
            if (newY > 0) {
                newY = 0
            }
            if (newY < borderY) {
                newY = borderY
            }
            bg.x = newX
            bg.y = newY
        }
        bg.on('mousedown', (e) => {
            this.data.mouseDown = true
            this.data.isDragging = false
        })
        bg.on('mouseout', () => {
            this.data.mouseDown = false
            this.data.isDragging = true
        })
        
        bg.on('mousemove', (e) => {
            if(document.getElementsByClassName('mask').length > 0){
                return;
            }
            if (this.data.mouseDown) {
                move(e)
            }
        })
        bg.on('mouseup', (e) => {
            this.data.mouseDown = false
            let isDragging = this.data.isDragging
            this.data.isDragging = false
            if (isDragging) {
                return
            }
            this.events["changeModule"]("online-players");
        })
        bg.on('wheel', (e) => {
            
        })

        // =================  touch ====================
        let wheel = (deltaY: number, x: number, y: number) => {
            let delta = deltaY / 5000
            bg.scale = bg.scale.x - delta
            const borderX = -(2048 * bg.scale.x - this.app.screen.width)
            const borderY = -(2048 * bg.scale.y - this.app.screen.height)
            const mouseBgXScale = (x - bg.x) / bg.width
            const mouseBgYScale = (y - bg.y) / bg.width
            let newX = bg.x + delta * bg.width * mouseBgXScale
            let newY = bg.y + delta * bg.height * mouseBgYScale
            for (let i = 0; i < 2; i ++) {
                if (newX > 0) {
                    newX -= Math.abs(delta * bg.width * mouseBgXScale)
                }
                if (newX < borderX) {
                    newX += Math.abs(delta * bg.width * mouseBgXScale)
                }
                if (newY > 0) {
                    newY -= Math.abs(delta * bg.height * mouseBgYScale)
                }
                if (newY < borderY) {
                    newY += Math.abs(delta * bg.height * mouseBgYScale)
                }
            }
            
            bg.x = newX
            bg.y = newY
            bg.scale = Math.max(0.5, bg.scale.x)
            bg.scale = Math.min(1.8, bg.scale.x)
        }

        bg.on('touchstart', (e) => {
            this.data.touches.push({
                x: e.x,
                y: e.y
            })
            // if (this.data.touches.length > 1) {
            //     let p1 = this.data.touches[0]
            //     let p2 = this.data.touches[1]
            //     const delta = (Math.abs(p1.x - p2.x) / this.app.screen.width + Math.abs(p1.y - p2.y) / this.app.screen.height) / 2
            //     const centerX = (p1.x + p2.x) / 2
            //     const centerY = (p1.y + p2.y) / 2
            //     wheel(delta, centerX, centerY)
            // }
        })
        bg.on('touchmove', (e) => {
            if(document.getElementsByClassName('mask').length > 0){
                return;
            }
            move(e)
        })
        bg.on('touchend', (e) => {
            this.data.mouseDown = false
            let show = !(this.data.isDragging || this.data.touches.length > 1)
            this.data.touches = []
            this.data.isDragging = false
            if (show) {
                this.events["changeModule"]("online-players");
            }
            
        })
        bg.on('tap', (e) => {
            console.log(e)
        })
        this.background.addChild(bg)
    }


    initMenu = async () => {
        const menuContainer: Container = new Container()
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


        //coin
        const coinContainer = new Container();
        coinContainer.width = this.calcLength(180);
        coinContainer.height = this.calcLength(60);
        coinContainer.x = this.calcLength(274 + 90);
        coinContainer.y = this.calcLength(30);
        coinContainer.eventMode = 'static';
        coinContainer.cursor = 'pointer';
        coinContainer.on('pointerdown', () => {
            this.events["changeModule"]("profile", {coin: this.data.coin});
        });

        //coin-bg
        const bgCoin = await Assets.load(bg_coin);
        const coinBg = Sprite.from(bgCoin);
        coinBg.width = this.calcLength(180);
        coinBg.height = this.calcLength(60);
        coinContainer.addChild(coinBg);
        //coin-icon
        const imgCoin = await Assets.load(img_coin);
        const coinIcon = Sprite.from(imgCoin);
        coinIcon.width = this.calcLength(30);
        coinIcon.height = this.calcLength(30);
        coinIcon.x = this.calcLength(132);
        coinIcon.y = this.calcLength(15);
        coinContainer.addChild(coinIcon);
        //coin-text
        this.coinGraph.x = this.calcLength(60);
        this.coinGraph.y = this.calcLength(30);
        this.coinGraph.anchor.set(0.5, 0.5);
        this.coinGraph.style = {
            fill: '#0D0E27',
            fontSize: this.calcLength(24),
            fontFamily: 'SourceCodePro-Medium',
            align: 'center'
        }
        coinContainer.addChild(this.coinGraph);
        coinContainer.pivot.set(coinContainer.width / 2, coinContainer.height / 2);
        // coinContainer.scale = 0.5;
        //add coin 
        menuContainer.addChild(coinContainer);


        //setting
        const imgSetting = await Assets.load(img_setting);
        const setting = Sprite.from(imgSetting);
        setting.width = this.calcLength(48);
        setting.height = this.calcLength(48);
        setting.x = this.calcLength(470);
        setting.y = this.calcLength(6);
        setting.eventMode = 'static';
        setting.cursor = 'pointer';
        setting.on('pointerdown', () => {
            this.events["changeModule"]("invite-notice-settings");
        });
        menuContainer.addChild(setting);


        //history
        const imgHistory = await Assets.load(img_history);
        const history = Sprite.from(imgHistory);
        history.width = this.calcLength(48);
        history.height = this.calcLength(48);
        history.x = this.calcLength(534);
        history.y = this.calcLength(6);
        history.eventMode = 'static';
        history.cursor = 'pointer';
        history.on('pointerdown', () => {
            this.events["changeModule"]("battle-history");
        });
        menuContainer.addChild(history);

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
        playersCountBg.beginFill(0xFFFFFF); // 设置填充颜色为黑色
        playersCountBg.drawRoundedRect(0, 0, this.calcLength(84), this.calcLength(48), this.calcLength(48)); // 绘制圆角矩形
        playersCountBg.endFill();
        playersCountBg.x = this.calcLength(180);
        playersCountBg.y = this.calcLength(0);
        players.addChild(playersCountBg);
        

        //players count text
        this.playerGraph.style = {
            fill: '#000000',
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

    initInviteBtn = async () => {
        const sheet = await Assets.load(`${window.location.origin}/images/invite.json`);
        const animInvite = new AnimatedSprite(sheet.animations['run']);
        animInvite.animationSpeed = 0.05;
        animInvite.play();
        animInvite.scale = this.app.screen.width / 1500;
        animInvite.anchor.set(0.5, 1);
        animInvite.x = this.calcLength(375);
        animInvite.y = this.app.screen.height - this.calcLength(40);
        // animBullish.zIndex = 2;
        animInvite.eventMode = 'static';
        animInvite.cursor = 'pointer';
        animInvite.on('pointerdown', () => {
            this.events["inviteBattle"]();
        })
        this.app.stage.addChild(animInvite);
    }
}