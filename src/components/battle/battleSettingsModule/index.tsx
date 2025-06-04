import React, { useState, useRef, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import './style.scss';
import { isMobile } from '../../../utils/util';
import * as Pomelo from '../../../utils/pomelo';
import { message, Dropdown, InputNumber, Slider } from 'antd';
import api from '../../../axios';
// import { setProfile } from '../../../redux/slice';
import getConfig from '../../../config';
import { CopyToClipboard } from 'react-copy-to-clipboard'; 
// import copy from 'copy-to-clipboard'; 

const BattleSettings: React.FC<{
  props: any,
  onClose: () => void,
}> = ({ props, onClose }) => {
  const CONFIG = getConfig();
  // const dispatch = useDispatch();
  const currentAccount = useCurrentAccount();
  const copyToClipboardRef = useRef(null);
  const battleSettingsModule  = useRef(null);
  // const textAreaRef  = useRef(null);

  const battleUser = props.data?.user;
  const [currentPair, setCurrentPair] = useState(props.data?.pair || 'Bitcoin');
  const [maxCoins, setMaxCoins] = useState(0);
  const [marks, setMarks] = useState({
    "0": ' ',
    "25": ' ',
    "50": ' ',
    "75": ' ',
    "100": ' '
  });
  const [battleRewards, setBattleRewards] = useState(props.data?.rewards || 0);
  const [ battleSliderRate, setBattleSliderRate] = useState(0);
  const [ battleSliderStep, setBattleSliderStep] = useState(0);
  const [isLoading, setLoadingStatus] = useState(true);

  const [leftTime, setLeftTime] = useState(30);
  const [hasSentRequest, setSentRequestStatus] = useState(false);
  // const [copyFlag, setCopyFlag] = useState(1);
  const [inviteCode, setInviteCode] = useState('');
  const [link, setLink] = useState('');
  const [hasRecreate, setHasRecreate] = useState(false);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  

  const tradingPairMap: {[key: string]: any} = {
    'Bitcoin': 'BTC/USDT',
    'Ethererum': 'ETH/USDT',
    'Ton': 'Ton/USDT',
  }

  const menuItems: MenuProps['items']  = [
    {
      key: 'Bitcoin',
      label: (
        <div className={["trading-pair-dropdown-item bitcoin", currentPair == 'Bitcoin' ? 'active' : ''].join(" ")} onClick={() => {setCurrentPair('Bitcoin')}}>
          Bitcoin <span>BTC/USDT</span>
        </div>
      ),
    },
    {
      key: 'Ethererum',
      label: (
        <div className={["trading-pair-dropdown-item ethererum", currentPair == 'Ethererum' ? 'active' : ''].join(" ")} onClick={() => {setCurrentPair('Ethererum')}}>
          Ethererum <span>ETH/USDT</span>
        </div>
      ),
    },
  ];



  useEffect(() => {
    (async () => {
      // if(!props.data?.rewards){
        const res = await api.get_user_status({
          user_id: currentAccount?.address,
        });
        
        if(battleUser){
          const res2 = await api.get_user_status({
            user_id: battleUser
          })
          setMaxCoins(Math.min(res.data.coins, res2.data.coins))
        }else{
          setMaxCoins(res.data.coins)
        }

      // }else{

      // }
      document.getElementsByClassName("ant-input-number-input")[0]?.focus();
      if(isMobile() &&  battleSettingsModule.current){
        battleSettingsModule.current.style.marginTop = '-12rem';
      }
      setLoadingStatus(false);
    })();
  },[])

  // useEffect(() => {
  //   setBattleSliderRate(Math.floor(battleRewards / maxCoins * 100));
  // }, [battleRewards, maxCoins]);

  useEffect(() => {
    !props.data?.rewards && setBattleRewards(Math.round(maxCoins * 0.1));
    setBattleSliderStep(Math.round(maxCoins * 0.25));
  }, [maxCoins]);


  // useEffect(() => {
  //   const marksMap = {};
  //   marksMap[0] = ' ';
  //   marksMap[String(maxCoins * 0.25)] = ' ';
  //   marksMap[String(maxCoins * 0.5)] = ' ';
  //   marksMap[String(maxCoins * 0.75)] = ' ';
  //   marksMap[String(maxCoins)] = ' ';
  //   setMarks(marksMap)

  //   !props.data?.rewards && setBattleRewards(Math.round(maxCoins * 0.1));
  // }, [maxCoins]);
  

  useEffect(() => {
    if(hasSentRequest){
      let interval:any = null;
      let leftSeconds = 30;
      interval = setInterval(() => {
        setLeftTime(leftSeconds--);

        if(leftSeconds < 0){
          clearInterval(interval);
          setSentRequestStatus(false);
          setLeftTime(30);
        }
      }, 1000);
      return () => {
          if (interval) {
            clearInterval(interval);
          }
      };
    }
  }, [hasSentRequest]);



  useEffect(() => {
    props.data?.type == 'share-link' && 
    api.get_invite_code({
      user_id: currentAccount?.address,
    }).then(res => {
      setInviteCode(res.data.code);
    })
  },[])



  const parser = (value) => {
    value < 0 && (value = 0);
    value > Number(maxCoins || 0) && (value = maxCoins);
    if (value != 0) { 
      value = Math.floor(value);
    } 
    return value

  };

  const onChange = (value) => {
    setBattleRewards(value);
  }


  const clearNumberInput = (e: any) => {
    if (
      e.keyCode === 8 ||
      e.keyCode === 46 ||
      e.keyCode === 37 ||
      e.keyCode === 39 
    ) {
      return;
    }
    if (e.key < '0' || e.key > '9' || e.key === '.') {
      e.preventDefault();
    }
    if(e.target.ariaValueNow > maxCoins){
      e.preventDefault();
    }
  }

  const onFocus = () => {
    setBattleSliderRate(0);
    const rect = document.getElementsByClassName("ant-input-number-input")[0].getBoundingClientRect();
    const distanceFromTop = rect.top + window.pageYOffset;
    if(isMobile() &&  battleSettingsModule.current){
      battleSettingsModule.current.style.marginTop = '-12rem';
    }
    if (distanceFromTop < 0) {
      window.scrollTo(0, window.pageYOffset + distanceFromTop);
    }

  }

  const onBlur = () => {
    battleSettingsModule.current && (battleSettingsModule.current.style.marginTop = '0')
    window.scrollTo(0, 0);
  }


  const onSliderChange = (value) => {
    setBattleSliderRate(value);
    setBattleRewards(Math.floor(maxCoins * value / 100));
  }


  const formatterRate = (value) => {
    return `${value}%`
  }

  const checkUserStatus = async () => {
    const res = await api.get_user_current_status({
      user_id: currentAccount?.address,
      battle_user_id: battleUser,
    })
    if(res?.success){
      if(res.data.status == 'Available'){
        return true;
      }else{
        const messageMap = {
          Block: 'The Tegen has blocked you, you cannot send a battle invitation',
          OffLine: 'The Tegen has left the game, you cannot send a battle invitation',
          Playing: 'The Tegen is busy playing, you cannot send a battle invitation'
        }
        message.open({
          type: 'info',
          content: messageMap[res.data.status],
          className: 'q-toast-message',
          duration: 5,
        });
      }
      return false;
    }
  }

  const sendRequest = async () => {
    if(battleRewards <= 0 || (battleUser && !await checkUserStatus())){
      return false;
    }
    const res = await Pomelo.sendBattleInvitation(battleUser, currentPair, battleRewards)
    setSentRequestStatus(true);
  }

  const createLink = async () => {
    if(battleRewards <= 0){return;}
    setIsCreatingLink(true);
    const res = await api.create_battle_invitation({
      user_id: currentAccount?.address,
      trading_pair: currentPair,
      coins:battleRewards
    });

    setLink(`${CONFIG.miniAppUrl}?startapp=${inviteCode}_i=${res.data?.invitation?._id}`);
    // copy(`${CONFIG.miniAppUrl}?startapp=${inviteCode}_i=${res.data?.invitation?._id}`)
    // copySuccess();
  }

  useEffect(() => {
    if(!link){return;}
    setIsCreatingLink(false);
    setHasRecreate(true);
    message.open({
      type: 'info',
      content: 'Link generated. Click to copy',
      className: 'q-toast-message',
      duration: 5,
    });
    // if (copyToClipboardRef.current) {
    //   copyToClipboardRef.current.onClick();
    // }
  },[link])


  useEffect(() => {
    setHasRecreate(false);
  },[battleRewards, currentPair])


  // useEffect(() => {
  //   if(!link){return;}
  //   const textArea = textAreaRef.current;
  //   textArea.value = link;
  //   if (navigator.userAgent.match(/ipad|iphone/i)) {
  //     const range = document.createRange();
  //     range.selectNodeContents(textArea);
  //     const selection = window.getSelection();
  //     selection.removeAllRanges();
  //     selection.addRange(range);
  //     textArea.setSelectionRange(0, 999999);
  //   } else {
  //     textArea.select();
  //   }
  //   document.execCommand('copy');
  //   copySuccess();
  // },[link])


  const copySuccess = () => {
    message.open({
      type: 'info',
      content: 'Copied to clipboard',
      className: 'q-toast-message',
      duration: 5,
    });
  }

  const showRule = async () => {
    message.open({
      type: 'info',
      content: 'The loser is required to pay the winner Bet amount of coins, Bet amount shall not exceed the maximum sum that the Tegen with the fewest coins can afford to pay',
      className: 'q-toast-message',
      duration: 5,
    });
  }


  return <div className="mask battle-settings-mask">
    <div className="battle-settings-module" ref={battleSettingsModule}>
      <div className="close-btn" onClick={onClose}></div>
      <div className="title">
        Battle Settings
        <div className="rule-btn" onClick={showRule}></div>
      </div>
      <div className="module-content">
        <div className="mini-title">1.Choose the trading pair</div>
        {/* <Dropdown overlayClassName={"trading-pair-dropdown-list"} menu={{ items: menuItems }} placement="bottom" arrow> */}
          <div className={["current-tab", currentPair.toLowerCase()].join(" ")}>
            {currentPair}
            <span>{tradingPairMap[currentPair]}</span>
          </div>
        {/* </Dropdown> */}


        <div className="mini-title">2.Set the bet amount</div>
        <InputNumber className="rewards-input" autoFocus max={maxCoins} min={0} changeOnWheel={false} inputMode="numeric" pattern="[0-9]*" stringMode={false} placeholder="amount" value={battleRewards} formatter={parser}  onInput={onChange} onKeyDown={clearNumberInput} onFocus={onFocus} onBlur={onBlur}/>
        {/*  formatter={parser} */}
        {
          !isLoading && <Slider className="rewards-slider" tooltipPrefixCls="rewards-slider-tooltip"   marks={marks} value={battleSliderRate}   max={100}  onChange={onSliderChange} tooltip={{ open: true, placement:"top", className:"rewards-slider-tooltip", getPopupContainer: (triggerNode) => triggerNode.parentElement,formatter:formatterRate}}   />
          // step={battleSliderStep}
        }

        {/* getPopupContainer={() => document.body} tooltipProp={tooltipProp} */}
        
        {
          props.data?.type == 'share-link' ? <>
            {/* <textarea
              ref={textAreaRef}
              style={{ position: 'absolute', left: '-9999px' }}
              readOnly
            /> */}
            {isCreatingLink ? <div className="confirm-btn">···</div> : <>
              {
                hasRecreate ? <CopyToClipboard ref={copyToClipboardRef} text={link} onCopy={copySuccess}>
                  <div className="confirm-btn" >Copy link</div>
                </CopyToClipboard> : <div className={["confirm-btn", battleRewards <= 0 ? "disabled" : ""].join(" ")} onClick={createLink}>{link ? 'Recreate link' : 'Create link'}</div>
              }
            </>}
            

            {/* {reset && (
              <CopyToClipboard ref={copyToClipboardRef} text={link} onCopy={copySuccess}>
                <div className="confirm-btn" >Copy link</div>
              </CopyToClipboard>
            )} */}
            <div className="tip">
              Link is valid for 24 hours, a new link needs to be created when modifying the settings
            </div>
          </> : (
            (hasSentRequest || battleRewards <= 0) ? <div className="confirm-btn disabled">Request Sent {hasSentRequest && <>({leftTime}s)</>}</div> : <div className="confirm-btn" onClick={sendRequest}>Send a Battle Request</div>
          )
        }
      </div>
    </div>
  </div>
};

export default BattleSettings;
