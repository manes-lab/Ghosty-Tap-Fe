import React, { useState, useEffect } from 'react';
import * as Pomelo from '../../utils/pomelo';



const Game: React.FC = () => {

  let battleId = ''

  useEffect(() => {
    (async () => {
        await Pomelo.robotEnterSquare("robot1")
        let battleOver = false
        Pomelo.addListener("battleOver", async (msg: any) => {
            console.log(msg)
            battleOver = true
        })
        Pomelo.addListener("inviteBattle", async (msg: any) => {
            console.log(msg, "inviteBattle")
            // const info = await api.get_invitation_for_battle({invite_id: msg.invite_id})
            const res: any = await Pomelo.dealBattleInvitation(msg.invite_id, "Accept")
            console.log(res)
            battleId = res.data._id
            await sleep(3000)
            Pomelo.readyForBattle(battleId)
        })
        Pomelo.addListener("battleStep", async (msg: any) => {
            console.log(battleId)
            console.log(msg)
            const ret = await Pomelo.submitData("battle", {
                battle_id: msg.battle_id,
                is_success: 1,
                result: "Bearish",
                time: 1
            })
        })

        Pomelo.addListener("acceptBattle", async (msg: any) => {
            console.log(msg)
            // const res = await Pomelo.readyForBattle(msg._id)
        //   await sleep(3000)
        //   const res = await Pomelo.readyForBattle(msg._id)
        })

        Pomelo.addListener("battleReady", async (msg: any) => {
            console.log(msg, "battleReady")
            const res = await Pomelo.readyForBattle(msg.battle_id)
          })

        const res = await Pomelo.sendBattleInvitation("1408854003", 'Ethererum', 1);
    })()
    return () => {
    };
  },[])

  const sleep = async (ms: number) => {
    await new Promise((resovle, reject) => {
        setTimeout(() => {resovle(null)}, ms)
    })
  }

  return (
    <div>
      haha
    </div>
  )
};

export default Game;
