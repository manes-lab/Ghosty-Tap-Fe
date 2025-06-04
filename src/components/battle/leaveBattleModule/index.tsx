import React, { useState } from 'react';
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
  const leave = async () => {
    await Pomelo.leaveBattle(props.battleInfo._id);
    onLeave();
  }


  return <div className="mask" onClick={onClose}>
    <div className="leave-battle-module" onClick={(event) => {event.stopPropagation();}}>
      <div className="close-btn" onClick={onClose}></div>
      <div className="module-content">
        <div className="leave-tip">If you leave now, you will lose</div>
        <div className="battle-rewards">
          {formatNumber(props.battleInfo.coins)}
          <div className="coin"></div>
        </div>
        <div className="leave-battle-btns">
          <div className="leave-battle-btn leave-btn" onClick={leave}>Leave</div>
          <div className="leave-battle-btn stay-btn" onClick={onClose}>Stay</div>
        </div>
      </div>
    </div>
  </div>
};

export default LeaveBattle;
