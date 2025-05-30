import React, { useState } from 'react';
import './style.scss';

const Start: React.FC<{
  onStart: (mode:string) => void,
  onClose: () => void,
}> = ({ onStart, onClose }) => {
  return <div className="mask coins-recharging-mask">
    <div className="coins-recharging-module">
      <div className="close-btn" onClick={onClose}></div>
      <div className="title">Coins recharging</div>
      <div className="intro">It's time for a break from tapping! Use your coins to place bets in the adventure mode to earn more coins!</div>
      <div className="confirm-btn" onClick={() => {onStart('adventure')}}></div>
    </div>
  </div>
};

export default Start;
