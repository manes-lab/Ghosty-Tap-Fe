import React, { useState, useEffect } from 'react';
import './style.scss';
import LeaderboardContent from '../leaderboardContent';


const LeaderboardModule: React.FC<{
  props:any,
  onClose: () => void,
  onShowUser: (user:any) => void,
}> = ({ props, onClose, onShowUser }) => {
  let isInit = true;
  useEffect(() => {
    if(isInit){
      isInit = false;
      (async () => {
        // await fetchData();
      })();
    }
    // loadStage("adventure", {instId: 'BTC-USDT'});
  },[])

  const close = () => {
    document.getElementById('leaderboard-mask')?.classList.add('hide');
    document.getElementById('leaderboard')?.classList.add('hide');
    setTimeout(()=>{
      onClose()
    }, 600)
  }

  
  return <div className={["mask leaderboard-mask", props.stage+'-leaderboard-mask'].join(" ")} id="leaderboard-mask" onClick={close}>
    <LeaderboardContent props={{from: 'leaderboard-module'}} onShowUser={onShowUser}/>
  </div>
};

export default LeaderboardModule;
