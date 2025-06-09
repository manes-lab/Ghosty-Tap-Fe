import React, { useState, useEffect } from 'react';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import './style.scss';
import api from '../../../axios/index';
import * as Pomelo from '../../../utils/pomelo';
import { formatNumber } from '../../../utils/util';
import { message } from 'antd';

const LeaveBattle: React.FC<{
  props: any,
  onClose: () => void,
  onLeave: () => void,
}> = ({ props, onClose, onLeave }) => {
  const currentAccount = useCurrentAccount();

  const [canClose, setCanClose] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setCanClose(true), 600); 
    return () => clearTimeout(timer);
  },[])

  const leave = async () => {
    await Pomelo.leaveBattle(props.battleInfo._id);
    onLeave();
  }


  const close = async () => {
    if (!canClose) return; 
    onClose();
  }


  return <div className="mask" onClick={close}>
    <div className="leave-battle-module" onClick={(event) => {event.stopPropagation();}}>
      <div className="close-btn" onClick={close}></div>
      <div className="module-content">
        <div className="leave-tip">If you leave now, you will lose</div>
        <div className="battle-rewards">
          {formatNumber(props.battleInfo.coins)}
          <div className="coin"></div>
        </div>
        <div className="leave-battle-btns">
          <div className="leave-battle-btn leave-btn" onClick={leave}>Leave</div>
          <div className="leave-battle-btn stay-btn" onClick={close}>Stay</div>
        </div>
      </div>
    </div>
  </div>
};

export default LeaveBattle;
