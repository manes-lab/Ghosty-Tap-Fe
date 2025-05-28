import React, { useState } from 'react';
import './style.scss';

const Start: React.FC<{
  props: any,
  onStart: (token:string) => void,
  onClose: () => void,
}> = ({ props, onStart, onClose }) => {
  const [token, setToken] = useState(props.token);

  const start = (token:string) => {
    document.getElementById('trading-pair-mask')?.classList.add('hide');
    document.getElementById('trading-pair-module')?.classList.add('hide');
    setTimeout(()=>{
      onStart(token)
    }, 600)
  }

  const close = () => {
    document.getElementById('trading-pair-mask')?.classList.add('hide');
    document.getElementById('trading-pair-module')?.classList.add('hide');
    setTimeout(()=>{
      onClose()
    }, 600)
  }

  return <div className="mask trading-pair-mask" id="trading-pair-mask">
    <div className="module trading-pair-module" id="trading-pair-module">
      <div className="close-btn" onClick={close}></div>
      <div className="title">Trading Pair</div>
      <div className="module-content">
        <div className="list">
          <div className={["item btc", token == 'btc' ? 'active' : ''].join(" ")} onClick={() => { setToken('btc') }}>
            <div className="icon"></div>
            <div className="name">Bitcoin</div>
            <div className="intro">BTC/USDT</div>
          </div>
          <div className={["item eth", token == 'eth' ? 'active' : ''].join(" ")} onClick={() => { setToken('eth') }}>
            <div className="icon"></div>
            <div className="name">Ethererum</div>
            <div className="intro">ETH/USDT</div>
          </div>
          {/* <div className={["item ton", token == 'ton' ? 'active' : ''].join(" ")} onClick={() => { setToken('ton') }}>
            <div className="icon"></div>
            <div className="name">Ton</div>
            <div className="intro">TON/USDT</div>
          </div> */}
        </div>
        <div className={["confirm-btn", token ? '' : 'disabled'].join(" ")} onClick={() => {start(token)}}>Confirm</div>
      </div>
    </div>
  </div>
};

export default Start;
