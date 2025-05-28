import {Container, Assets, Sprite, Graphics, GraphicsContext, Rectangle, AnimatedSprite,TextStyle } from 'pixi.js';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import api from '../../axios';
import * as Pomelo from '../../utils/pomelo';
import { formatTimestamp, formatNumber } from '../../utils/util';
import * as ws from '../../utils/websocket';
import { SquareStageUI } from './ui';



export class SquareStage extends SquareStageUI {
    data : {
        address: string,
        coin: number,
        gameStoped: boolean,
    } = {
        address: "",
        coin: 0,
        gameStoped: false,
    }
    

    constructor(options: any) {
        super();
        this.data.address = options.address
        console.log(options, '---options---');
    }

    load = async (elementId: string, preference: "webgl" | "webgpu" | undefined) => {
        await super.load(elementId, preference)
        this.data.gameStoped = false
        this.initConnect();

        api.get_user_status({
            user_id: this.data.address,
        }).then((res) => {
            this.data.coin = res.data.coins;
            this.coinGraph.text = `${formatNumber(this.data.coin)}`
        })


        this.events["load"]();
    }
    

    destroy = async () => {
        this.data.gameStoped = true
        ws.close()
        Pomelo.leaveSpace();
        await super.destroy()
    }

    initConnect = async () => {
        // await Pomelo.enterSpace("square", '');

        Pomelo.addListener("onAdd", (data: any) => { 
            data.space == 'square' && this.updateOnlinePlayers();
        })
        Pomelo.addListener("onLeave", (data: any) => { 
            this.updateOnlinePlayers();
        })

        this.updateOnlinePlayers();
    }

    updateOnlinePlayers = async () => {
        const res = await api.get_online_players({
            user_id: this.data.address,
            page: 0,
            limit: 5,
            type: 'pk'
        });
        this.updatePlayersPanel(res?.data?.rank || [], res?.data?.count);
    }

    updatePlayersPanel = async (arr:Array<any>, count:number) => {
        this.playerGraph.text = count;
        this.playerAvatarContainer.removeChildren();
        this.playerAvatarContainer.boundsArea = new Rectangle(0, 0, this.calcLength(48 + 36 * (arr.length - 1)), this.calcLength(48));
        this.playerAvatarContainer.x = this.calcLength(36 * (5 - arr.length));
        for(let i = 0; i< arr.length; i++){
            const user = arr[i];
            const avatarContainer = new Container();
            avatarContainer.boundsArea = new Rectangle(0, 0,  this.calcLength(48),  this.calcLength(48));
            avatarContainer.x = this.calcLength(36 * i);
            avatarContainer.zIndex = 5 - i;

            const avatarBg = new Graphics().circle(this.calcLength(24), this.calcLength(24), this.calcLength(24)).fill('black');
            avatarContainer.addChild(avatarBg);
        
            const imgAvatar = await Assets.load(`${window.location.origin}/img/avatar${user.avatar || 1}.png`);
            const avatar = Sprite.from(imgAvatar);
            avatar.width = this.calcLength(44);
            avatar.height = this.calcLength(44);
            avatar.x = this.calcLength(2);
            avatar.y = this.calcLength(2);
            avatarContainer.addChild(avatar);

            this.playerAvatarContainer.addChild(avatarContainer);
        }
    }

   
}