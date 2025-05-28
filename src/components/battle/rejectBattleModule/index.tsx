import React from 'react';
import './style.scss';

const RejectBattle: React.FC<{
  props: any,
  onClose: () => void,
}> = ({ props, onClose }) => {
  return <div className="mask reject-battle-mask">
    <div className="module  reject-battle-module">
      <div className="close-btn" onClick={onClose}></div>
      <div className="invite-user">
        <div className="avatar" style={props.data.user?.avatar ? {backgroundImage: `url(/images/avatar${props.data.user?.avatar}.png)`} : {backgroundImage: `url(/images/avatar1.png)`}}>
          <div className="user-status available"></div>
        </div>
        <div className="name txt-wrap">{props.data.user?.user_id?.slice(-6)}</div>
      </div>
      <div className="intro">Rejected your battle invitation</div>
      <div className="confirm-btn" onClick={onClose}>OK</div>
    </div>
  </div>
};

export default RejectBattle;
