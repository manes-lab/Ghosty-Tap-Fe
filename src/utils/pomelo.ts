
declare global {
    interface Window {
        pomelo: any;
    }
}

const pomelo = window.pomelo
// let url = `wss://${window.location.host}`
// if (window.location.protocol == "http:") {
//     url = `ws://${window.location.host}`
// }
// let url = "ws://13.228.213.110"
export async function enterSquare(data: any) {
    return await new Promise((resolve, reject) => {
        pomelo.init({
            // url,
            // path: "",
            log: true
        }, function() {
            var route = "connector.entryHandler.enterSquare";
            pomelo.request(route, {
                ...data
            }, function(res: any) {
                console.log(data, res, '---enterSquare----');
                if(res.error) {
                    reject({res, success: false})
                }
                resolve({res, success: true})
            });
        });
    })
}

export async function leaveSquare(account: string) {
    let route = "connector.entryHandler.leaveSquare"
    await new Promise((resolve, reject) => {
        pomelo.request(route, {
             token: localStorage.getItem("ghosty-tap-"+account) || ""
        }, function(data: any) {
            console.log(data, '---leaveSquare----');
            pomelo.addListener("disconnect", () => {
                resolve(null)
            })
            pomelo.disconnect()
        });
        
    })
}

export function addListener(route: string, callback: Function) {
    pomelo.addListener(route, callback)
}

export function removeListener(route: string) {
    pomelo.removeListener(route)
}

export async function enterSpace(type: string, tradingPair: string, account: string) {
    return await new Promise((resolve, reject) => {
        let route = "space.base.enterSpace"
        pomelo.request(route, {
            type,
            tradingPair,
            token: localStorage.getItem("ghosty-tap-"+account) || ""
        }, function(data: any) {
            console.log( type,
                tradingPair,
                localStorage.getItem("ghosty-tap-"+account), data, '---enterSpace----');
            if(data.error) {
                reject({data, success: false})
            }
            resolve({data, success: true})
        });
    })
}

export async function leaveSpace(account: string) {
    return await new Promise((resolve, reject) => {
        let route = "space.base.leaveSpace"
        pomelo.request(route, {
        }, function(data: any) {
            console.log(
                localStorage.getItem("ghosty-tap-"+account), data, '---leaveSpace----');
            if(data.error) {
                reject({data, success: false})
            }
            resolve({data, success: true})
        });
    })
}

export async function submitData(mode:string, params:any, account: string) {
    return await new Promise((resolve, reject) => {
        let route = "space.base.submitZenGameData"
        if (mode == "adventure") {
            route = "space.base.submitAdventureGameData"
        } else if (mode == "battle") {
            route = "battle.base.submitBattleAdventureGameData"
        }

        pomelo.request(route, params, function(data: any) {
            if(data.error) {
                reject(data)
            }
            resolve(data)
        });
    })
}

export async function sendBattleInvitation(userId: string, tradingPair: string, coins: number) {
    return await new Promise((resolve, reject) => {
        let route = "battle.base.sendInvitation"
        let params = {
            be_invite_user_id: userId,
            trading_pair: tradingPair,
            coins: coins
        }
        pomelo.request(route, params, function(data: any) {
            if(data.error) {
                reject(data)
            }
            resolve(data)
        });
    })
}

export async function dealBattleInvitation(inviteId:string, type: string) {
    return await new Promise((resolve, reject) => {
        let route = "battle.base.dealInvitation"
        let params = {
            invite_id: inviteId,
            type
        }
        pomelo.request(route, params, function(data: any) {
            if(data.error) {
                reject(data)
            }
            resolve(data)
        });
    })
}


export async function leaveBattle(battleId: string) {
    return await new Promise((resolve, reject) => {
        let route = "battle.base.leaveBattle"
        let params = {
            battle_id: battleId,
        }
        pomelo.request(route, params, function(data: any) {
            if(data.error) {
                reject(data)
            }
            resolve(data)
        });
    })
}

export async function readyForBattle(battleId: string) {
    return await new Promise((resolve, reject) => {
        let route = "battle.base.ready"
        let params = {
            battle_id: battleId,
        }
        pomelo.request(route, params, function(data: any) {
            if(data.error) {
                reject(data)
            }
            resolve(data)
        });
    })
}




//======================================  DEBUG  ==================================

export async function robotEnterSquare(userId: string) {
    return await new Promise((resolve, reject) => {
        pomelo.init({
            log: true
        }, function() {
            var route = "connector.entryHandler.robotEnterSquare";
            pomelo.request(route, {
                userId,
            }, function(data: any) {
                if(data.error) {
                    reject({data, success: false})
                }
                resolve({data, success: true})
            });
        });
    })
}