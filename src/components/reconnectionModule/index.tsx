import React, { useState } from 'react';
import './style.scss';

const ConnectModule: React.FC<{
  onConnect: () => void,
  onClose: () => void,
}> = ({ onConnect, onClose }) => {
  return <div className="mask">
    <div className="module reconnect-module">
      <div className="close-btn" onClick={onClose}></div>
      <div className="title">Loading error</div>
      <div className="intro">We were unable to load the game due to network connection issues, please try again</div>
      <div className="confirm-btn" onClick={onConnect}>Enter game</div>
    </div>
  </div>
};

export default ConnectModule;
