import * as PIXI from 'pixi.js';

export class Stage {
    app: PIXI.Application = new PIXI.Application();
    events: Record<string, Function> = {}
    elementId: string | undefined

    public async load(elementId: string, preference: "webgl" | "webgpu" | undefined) {
        this.elementId = elementId
    }
    public async destroy() {
        this.app.destroy({removeView: true}, {});
    }
    on = (event: string, callback: Function) => {
        this.events[event] = callback
    }
    calcLength = (length:number) => {
        if(!this.app || !this.app?.screen) return 20;
        return this.app.screen.width * length / 750;
    }
}