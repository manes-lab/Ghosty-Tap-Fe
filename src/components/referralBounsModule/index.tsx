import React, { useState } from 'react';
import './style.scss';

const Bouns: React.FC<{
  onClose: () => void,
}> = ({ onClose }) => {

  return <div className="mask">
    <div className="module referral-bouns-module">
      <div className="close-btn" onClick={onClose}></div>
      <div className="title">Referral Bonus</div>
      <div className="bouns-list">
        <div className="bouns-list-head">
          <div className="bouns-list-head-item">Invite</div>
          <div className="bouns-list-head-item right">
            <div className="item-right-content">
              <div>Bonus per successful referral</div>
              <div>Bonus per successful referral</div>
            </div>
          </div>
        </div>
        <div className="bouns-list-body">
          <div className="bouns-list-body-item">
            1-5
            <div className="coins">3000</div>
          </div>
          <div className="bouns-list-body-item">
            5-10
            <div className="coins">5000</div>
          </div>
          <div className="bouns-list-body-item">
            10-20
            <div className="coins">10000</div>
          </div>
          <div className="bouns-list-body-item">
            20-30
            <div className="coins">20000</div>
          </div>
          <div className="bouns-list-body-item">
            30+
            <div className="coins">50000</div>
          </div>
        </div>
      </div>
      <div className="confirm-btn" onClick={onClose}>OK</div>
    </div>
  </div>
};

export default Bouns;
