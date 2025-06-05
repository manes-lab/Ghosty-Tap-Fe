import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import './style.scss';
import { message } from 'antd';
import api from '../../../axios';

const StartBattle: React.FC<{
  props: any,
  onClose: () => void,
}> = ({ props, onClose }) => {
  const currentAccount = useCurrentAccount();
  const state = useSelector((state:any) => state.moduleSlice);
  const [close, setCloseStatus] = useState(false);
  const [antagonistInfo, setAntagonistInfo] = useState({});
  useEffect(() => {
    api.get_user_status({
      user_id: currentAccount?.address == props.battleInfo.be_invite_user_id ? props.battleInfo.invite_user_id : props.battleInfo.be_invite_user_id
    }).then((res) => {
      if(res?.data){
        setAntagonistInfo(res.data.user)
      }
    })
  },[])

  useEffect(() => {
    if(props.loaded){
      setCloseStatus(true)
    }
  },[props.loaded])


  useEffect(() => {
    if(close){
      setTimeout(()=>{
        onClose();
      }, 600)
    }
  },[close])



  return <div className="start-battle">
    <div className="start-battle-content">
      <div className="battle-title">WAITING FOR TEGEN TO<br/> ENTER THE ROOM</div>
      <div className={["battle-animation", close ? 'hide' : ''].join(" ")}>
        <div className="left-user">
          <div className={["left-user-img", close ? 'hide' : ''].join(" ")}></div>
          <div className="user-info left-user-info">
            <div className="name txt-wrap">{currentAccount?.address?.slice(-6)}</div>
            <div className="avatar" style={{backgroundImage: `url(/img/avatar${state.profile?.avatar || 1}.png)`}}></div>
          </div>
        </div>
        <div className="right-user">
          <div className={["right-user-img", close ? 'hide' : ''].join(" ")}></div>
          <div className="user-info right-user-info">
            <div className="avatar" style={{backgroundImage: `url(/img/avatar${antagonistInfo?.avatar || 1}.png)`}}></div>
            <div className="name txt-wrap">{antagonistInfo?.user_id?.slice(-6)}</div>
          </div>
        </div>

        <div className="lightning"></div>
      </div>
    </div>
  </div>
};

export default StartBattle;
