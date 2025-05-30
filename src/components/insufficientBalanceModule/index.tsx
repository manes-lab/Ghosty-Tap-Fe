import React, { useState } from 'react';
import './style.scss';

const insufficientBalanceModule: React.FC<{
  onStart: (mode:string) => void,
  onClose: () => void,
}> = ({ onStart, onClose }) => {
  return <div className="mask">
    <div className="insufficient-balance-module">
      <div className="close-btn" onClick={onClose}></div>
      <div className="title">Insufficient Balance</div>
      <div className="intro">Play in  <span>ZEN-Mode</span> to get more coins</div>
      <div className="confirm-btn" onClick={() => {onStart('zen')}}></div>
      {/* Go to ZEN-Mode */}
    </div>
  </div>
};

export default insufficientBalanceModule;
