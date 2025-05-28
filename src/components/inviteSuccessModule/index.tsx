import React, { useState } from 'react';
import './style.scss';
import { formatNumber } from '../../utils/util';

const Bouns: React.FC<{
  props: any,
  onClose: () => void,
}> = ({ props, onClose }) => {

  const close = () => {
    onClose();
  }

  return <div className="mask">
    <div className="module invite-success-module">
      <div className="close-btn" onClick={onClose}></div>
      <div className="title">CONGRATULATION!</div>
      <div className="module-content">
        <div className="intro">
          You've accepted <span>{props.inviteUserInfo?.user_id?.slice(-6)}'s</span> invitation to play Tegan Tap!
        </div>
        <div className="coins">+{formatNumber(props.rewards)}</div>
        <div className="tip">Here's your bonus Tegen Coins</div>
        <div className="confirm-btn" onClick={close}>Thank you, Tegens!</div>
      </div>
    </div>
  </div>
};

export default Bouns;
