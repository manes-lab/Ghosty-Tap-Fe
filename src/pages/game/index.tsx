import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import { show, close, updateModule, updateNewInvitation } from '../../redux/slice';
import './style.scss';

import { message } from 'antd';
import api from '../../axios';
import { AdventureStage } from '../../stages/adventure/adventure';
import { ZenStage } from '../../stages/zen/zen';
import { BattleStage } from '../../stages/battle/battle';
import { SquareStage } from '../../stages/square/square';

import LoadingModule from '../../components/loadingModule';
import TradingPairModule from '../../components/tradingPairModule';
import InsufficientBalanceModule from '../../components/insufficientBalanceModule';
import CoinsRechargingModule from '../../components/coinsRecharging';
import ReconnectionModule from '../../components/reconnectionModule';
import HistoryModule from '../../components/historyModule';
import ProfileModule from '../../components/profileModule';
import LeaderboardModule from '../../components/leaderboardModule';
import AdventureOnlinePlayersModule from '../../components/adventureOnlinePlayersModule';
import ZenOnlinePlayersModule from '../../components/zenOnlinePlayersModule';

import StartBattleModule from '../../components/battle/startBattleModule';
import BattleResultModule from '../../components/battle/battleResultModule';
// import BattleSettingsModule from '../../components/battle/battleSettingsModule';
import LeaveBattleModule from '../../components/battle/leaveBattleModule';
// import RejectBattleModule from '../../components/battle/rejectBattleModule';
// import BattleInvitationModule from '../../components/battle/battleInvitationModule';
import BattleHistory from '../../components/battle/battleHistory';
import MailBox from '../../components/battle/mailBox';
import InviteNoticeSettings from '../../components/battle/inviteNoticeSettings';
import { Stage } from '../../stages/base';


let curStage: AdventureStage | ZenStage | BattleStage | SquareStage |undefined


const Game: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const state = useSelector((state:any) => state.moduleSlice);

  
  // const [curStage, setCurStage] = useState<PlayStage | ZenStage>()
  const [curOptions, setOptions] = useState({})
  const [token, setToken] = useState('btc');
  const [curModule, setCurModule] = useState('');//trading-pair, insufficient-balance, adventure-history, coins-recharging, reconnection, leaderboard, online-players, battle-settings, leave-battle
  //reject-battle, battle-invitation
  const [curUser, setCurUser] = useState();
  const [showProfileModule, setProfileModuleStatus] = useState(false);

  const [curBattleResult, setCurBattleResult] = useState();
  const [showBattleResultModule, setBattleResultModuleStatus] = useState(false);

  const [stageIsLoading, setStageLoadingStatus] = useState(true);
  

  useEffect(() => {
    (async () => {
      const mode = location.state?.mode || 'adeventure'
      const t = location.state?.token || 'btc'
      const options = location.state?.options || {}
      setToken(t)
      setOptions({...options})
      if(mode == 'battle'){
        resetStatus();
      }
      setCurModule('loading');
      await loadStage(mode, {
        instId: `${t.toUpperCase()}-USDT`, 
        profile: state.profile,
        currentAccount: currentAccount,
        address: currentAccount?.address,
        ...options
      });
    })()
  },[location.state?.mode, location.state?.token, location.state?.options?._id])

  useEffect(() => {
    if(!currentAccount?.address){
      backHome();
    }
  },[currentAccount])

  const resetStatus = () => {
    dispatch(updateModule({
      module: "battleSettings", 
      show: false,
      args: null
    }))
    setCurModule('');
    setProfileModuleStatus(false);
    setBattleResultModuleStatus(false);
    setStageLoadingStatus(true);
  }

  const backHome = async () => {
    await destroyStage();
    navigate('/');
  }

  const loadStage = async (stage: string, options: any) => {
    await destroyStage();
    let newStage: AdventureStage | ZenStage | BattleStage | SquareStage  | Stage = new Stage()
    if (stage == "adventure") {
      newStage = new AdventureStage(options)
    } else if (stage == "zen") {
      newStage = new ZenStage(options)
    } else if (stage == "battle") {
      newStage = new BattleStage(options)
    } else if(stage == 'square'){
      newStage = new SquareStage(options)
    }
    newStage!.on("changeModule", (module:string, args:any) => {
      if(module == 'profile' || module == 'mail-box' || module == 'leaderboard'){
        message.open({
          type: 'info',
          content: 'Coming soon ',
          className: 'q-toast-message',
          duration: 5,
        });
        return;
      }
      if(module == 'profile'){
        setCurUser({user_id: currentAccount?.address});
        setProfileModuleStatus(true);
      }else{
        setCurModule(module);
        module == 'mail-box' && dispatch(updateNewInvitation(false))
      }
    })
    newStage!.on("showBattleResult", (args:any) => {
      showBattleResult(args)
    })
    newStage!.on("changeRouter", async (path:string) => {
      await destroyStage();
      navigate(path);
    })
    newStage!.on("leaveBattle", () => {
      if (!curStage?.data.settlement) {
        setCurModule("leave-battle");
      } else {
        destroyStage();
        try{
          navigate(-1);
        }catch(e){
          navigate('/');
        }
      }
    })
    newStage!.on("inviteBattle", () => {
      // dispatch(show({module: "battle-settings", args: {type: 'share-link'}}))
      dispatch(updateModule({
        module: "battleSettings", 
        show: true,
        args: {type: 'share-link'}
      }))
    })
    newStage!.on("load", () => {
      if(location.state?.mode == 'battle'){
        
        setStageLoadingStatus(false);
      }else{
        setCurModule("");//leave-battle, battle-result, battle-history, mail-box, invite-notice-settings
      }
    })
    curStage = newStage!
    await newStage!.load("stage", undefined)
    
  }

  const destroyStage = async () => {
    try {
      await curStage?.destroy()
    } catch (e) { 
      console.log(e)
    }
  }

  const changeStage = async (mode:string = location.state?.mode, t = token, opts = curOptions) => {
    navigate(`/${mode}`, {
      state: {
        mode: mode, 
        token: t,
        options : opts
      },
      replace: true
    })
  }

  const showUser = (user:any) => {
    message.open({
      type: 'info',
      content: 'Coming soon ',
      className: 'q-toast-message',
      duration: 5,
    });
    return;
    setCurUser(user);
    setProfileModuleStatus(true);
  }

  const showBattleResult = (item:any) => {
    setCurBattleResult(item);
    setBattleResultModuleStatus(true);
  }

  const confirmLeaveBattle = () => {
    navigate(-1);
  }

  const closeResultModule = async () => {
    if(/\/battle/.test(window.location.href)){
      await destroyStage();
      try{
        navigate(-1);
      }catch(e){
        navigate('/');
      }
    }else{
      setBattleResultModuleStatus(false)
    }
  }


  return (
    <div id="stage">
      {curModule == 'trading-pair' && <TradingPairModule props={{token: token}} onStart={(t) => changeStage(location.state?.mode, t)} onClose={() => {setCurModule('')}}/>}
      {curModule == 'insufficient-balance' && <InsufficientBalanceModule onStart={changeStage} onClose={() => {setCurModule('')}}/>}
      {curModule == 'coins-recharging' && <CoinsRechargingModule onStart={changeStage} onClose={() => {setCurModule('')}}/>}
      {curModule == 'adventure-history' && <HistoryModule props={{}} onClose={() => {setCurModule('')}}/>}
      {curModule == 'reconnection' &&  <ReconnectionModule onClose={backHome} onConnect={()=>{changeStage()}}/>}
      {curModule == 'leaderboard' && <LeaderboardModule props={{stage: location.state?.mode}} onClose={() => {setCurModule('')}} onShowUser={showUser}/>}
      {curModule == 'adventure-online-players' && <AdventureOnlinePlayersModule props={{stage: location.state?.mode}} onClose={() => {setCurModule('')}} onShowUser={showUser}/>}
      {curModule == 'zen-online-players' && <ZenOnlinePlayersModule props={{stage: location.state?.mode}} onClose={() => {setCurModule('')}} onShowUser={showUser}/>}

      
      
      
      {curModule == 'leave-battle' &&  <LeaveBattleModule props={{battleInfo: curOptions}} onClose={() => {setCurModule('')}} onLeave={confirmLeaveBattle}/>}
      {curModule == "mail-box" &&  <MailBox props={{}} onClose={() => {setCurModule('')}} onShowUser={showUser}/>}
      {curModule == 'battle-history' &&  <BattleHistory props={{}} onClose={() => {setCurModule('')}} onShowResult={showBattleResult}/>}
      {curModule == "invite-notice-settings" &&  <InviteNoticeSettings props={{}} onClose={() => {setCurModule('')}}/>}


      {/* {curModule == 'battle-settings' &&  <BattleSettingsModule props={{}} onClose={() => {setCurModule('')}}/>}
      {curModule == 'reject-battle' &&  <RejectBattleModule props={{}} onClose={() => {setCurModule('')}}/>}
      {curModule == 'battle-invitation' &&  <BattleInvitationModule props={{}} onClose={() => {setCurModule('')}}/>} */}
      

  
      
      {curModule == 'loading' && (
        location.state?.mode == 'battle' ? 
        <StartBattleModule props={{loaded: !stageIsLoading, battleInfo: curOptions}} onClose={() => {setCurModule('')}}/> 
        : 
        <LoadingModule onClose={()=>{}}/>
      )}
      {showBattleResultModule && <BattleResultModule props={{result: curBattleResult, battleId: curBattleResult?._id}} onClose={closeResultModule}/>}
      {showProfileModule && <ProfileModule props={{user: curUser, mode: location.state?.mode}} onClose={() => {setProfileModuleStatus(false);}}/>}
    </div>
  )
};

export default Game;
