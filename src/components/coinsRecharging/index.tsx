import React, { useState } from 'react';
import './style.scss';

const Start: React.FC<{
  onStart: (mode:string) => void,
  onClose: () => void,
}> = ({ onStart, onClose }) => {
  return <div className="mask coins-recharging-mask">
    <div className="coins-recharging-module">
      <div className="close-btn" onClick={onClose}></div>
      <div className="title">Recharging</div>
      <div className="intro">Time for a break from tapping. Bet your coins in Adventure Mode to earn more!</div>
      <div className="confirm-btn" onClick={() => {onStart('adventure')}}></div>
    </div>
  </div>
};

export default Start;
