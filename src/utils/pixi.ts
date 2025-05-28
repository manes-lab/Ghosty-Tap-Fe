import * as PIXI from 'pixi.js';
export function moveTo(app: PIXI.Application, item: any, time: number, args: {fromX?: number, fromY?: number, toX?: number, toY?: number}, withTick?: Function) {
    
    let remainTime = time * 1000
    const tick = () => {
        try {
            const frames = time * app.ticker.FPS
            let deltaX = 0
            let deltaY = 0
            if (args.fromX != undefined && args.toX != undefined) {
                deltaX = (args.toX - args.fromX) / frames
                if (Math.abs(deltaX) > Math.abs(args.toX - item.x)) {
                    deltaX = args.toX - item.x
                }
            }
            if (args.fromY != undefined && args.toY != undefined) {
                deltaY = (args.toY - args.fromY) / frames
                if (Math.abs(deltaX) > Math.abs(args.toY - item.y)) {
                    deltaX = args.toY - item.y
                }
            }
            item.x += deltaX
            item.y += deltaY
            if (withTick) {
                withTick(frames)
            }
            remainTime -= app.ticker.deltaMS
            if (remainTime <= 0) {
                app.ticker.remove(tick)
            }
        } catch (e) {
            console.log(e)
            app.ticker.remove(tick)
        }
        
    }
    app.ticker.add(tick)
    return tick
}


export function breathe(app: PIXI.Application, item: any, time: number, views: number, args: {minScale?: number,  maxScale?: number }) {
    
    let remainTime = time * 1000
    let shrink = 1;
    const tick = () => {
        try {
            const frames = time * app.ticker.FPS / views / 2
            let deltaScale = 0
            if (args.minScale != undefined && args.maxScale != undefined) {
                if(shrink == 1){
                    deltaScale = (args.maxScale - args.minScale) / frames
                    if (Math.abs(deltaScale) > Math.abs(args.maxScale - item.scale.x)) {
                        deltaScale = args.maxScale - item.scale.x
                    }
                }else{
                    deltaScale = (args.minScale - args.maxScale) / frames
                    if (Math.abs(deltaScale) > Math.abs(args.minScale - item.scale.x)) {
                        deltaScale = args.minScale - item.scale.x
                    }
                }
            }

            let currentScale = item.scale.x + deltaScale;
            item.scale.set(currentScale, currentScale) 
            if(item.scale.x == args.minScale || item.scale.x == args.maxScale){
                shrink *= -1;
            }

            remainTime -= app.ticker.deltaMS
            if (remainTime <= 0) {
                item.scale.set(1, 1) 
                app.ticker.remove(tick)
            }
        } catch (e) {
            console.log(e)
            app.ticker.remove(tick)
        }
        
    }
    app.ticker.add(tick)
    return tick
}


export class Block extends PIXI.Container{
    app: PIXI.Application
    win: boolean
    strike: number
    constructor(app: PIXI.Application, win: boolean, winFireAsset: any, particlesAsset: any) {
        super()
        this.app = app
        this.win = win
        this.strike = 1
        this.y = this.calcLength(30)

        const anim = new PIXI.AnimatedSprite(winFireAsset.animations['run']);
        anim.anchor = {
            x: 0,
            y: 0.5
        }
        anim.label = "anim"
        anim.animationSpeed = 0.1666;
        anim.stop();
        // anim.scale = this.app.screen.width / 1500;
        anim.x = -this.calcLength(20)
        anim.y = -this.calcLength(5);
        anim.width = this.calcLength(120)
        anim.height = this.calcLength(90)
        anim.visible = false
        this.addChild(anim);

        const particles = new PIXI.AnimatedSprite(particlesAsset.animations['run'])
        particles.anchor = {
            x: 0,
            y: 0.5
        }
        particles.label = "particles"
        particles.animationSpeed = 0.1666;
        particles.stop();
        particles.width = this.calcLength(176)
        particles.height = this.calcLength(184)
        particles.visible = false
        this.addChild(particles);

        this.boundsArea = new PIXI.Rectangle(0, 0, this.calcLength(120), this.calcLength(90))
        let text = "Lose"
        let color = "#BB5656"
        let fontColor = "#282722"
        if (win) {
            text = "Win"
            color = "#E5A251"
            fontColor = "#282722"
        }
        let graphics = new PIXI.Graphics().poly([
            {x: 0, y: this.calcLength(10)},
            {x: this.calcLength(10), y: this.calcLength(10)},
            {x: this.calcLength(10), y: 0},
            {x: this.calcLength(90), y: 0},
            {x: this.calcLength(90), y: this.calcLength(10)},
            {x: this.calcLength(100), y: this.calcLength(10)},
            {x: this.calcLength(100), y: this.calcLength(50)},
            {x: this.calcLength(90), y: this.calcLength(50)},
            {x: this.calcLength(90), y: this.calcLength(60)},
            {x: this.calcLength(10), y: this.calcLength(60)},
            {x: this.calcLength(10), y: this.calcLength(50)},
            {x: 0, y: this.calcLength(50)},
            {x: 0, y: this.calcLength(10)},
        ]).fill(color)
        graphics.label = "graphics"
        graphics.y = -this.calcLength(30)
        this.addChild(graphics)
        

        let textGraphics = new PIXI.BitmapText({
            text,
            style: {
                fill: fontColor,
                fontSize: this.calcLength(24),
                fontFamily: 'Pixelify Sans',
                align: "center"
            }
        })
        textGraphics.label = "text"
        textGraphics.anchor = 0.5
        textGraphics.x = this.calcLength(100 / 2)
        this.addChild(textGraphics)

    }

    calcLength = (length:number) => {
        return this.app.screen.width * length / 750;
    }

    addWin = () => {
        if (!this.win) {
            return
        }
        // this.zIndex = 1
        this.strike += 1
        const graphics = this.getChildByLabel("graphics")
        const anim = this.getChildByLabel("anim") as PIXI.AnimatedSprite
        const text = this.getChildByLabel("text") as PIXI.Text
        graphics!.visible = false;
        anim!.visible = true;
        anim.play();
        text.text = "Winx" + this.strike
        text.x = this.calcLength(40);
        text.style = {
            fill: "#FFFFFF",
            fontSize: this.calcLength(24),
            fontFamily: 'SourceCodePro-Medium',
            align: "center"
        }
    }

    closeStrike = () => {
        this.zIndex = 0
        if (!this.win) {
            return
        }
        const graphics = this.getChildByLabel("graphics") as PIXI.Graphics
        const anim = this.getChildByLabel("anim") as PIXI.AnimatedSprite
        const text = this.getChildByLabel("text") as PIXI.Text

        graphics!.visible = true;
        anim!.visible = false;
        graphics.fill("#FEAA1E");
        anim.stop();
        if (this.strike > 1) {
            text.style.fill = "#000000"
            text.x = this.calcLength(100/ 2);
            text.style = {
                fill: "#000000",
                fontSize: this.calcLength(24),
                fontFamily: 'SourceCodePro-Medium',
                align: "center"
            }
        }
    }

    playParticles = () => {
        if (!this.win) {
            return
        }
        const particles = this.getChildByLabel("particles") as PIXI.AnimatedSprite
        particles.visible = true
        particles.x = -this.calcLength(50)
        particles.play()
        moveTo(this.app, particles, 0.3, {
            fromX: particles.x,
            toX: 0
        })
        setTimeout(() => {
            particles.visible = false
            particles.stop()
        }, 400)
    }

}