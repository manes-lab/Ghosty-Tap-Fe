import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import './style.scss';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { message } from 'antd';

import api from '../../axios';
import { formatNumber, formatDate } from '../../utils/util';
import getConfig from '../../config';
import { show, updateModule } from '../../redux/slice';

const ProfilePage = () => {
  const currentAccount = useCurrentAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const CONFIG = getConfig();
  const copyToClipboardRef = useRef(null);

  const { id } = useParams();
  const [curUser, setCurUser] = useState();
  const [isSelf, setSelfStatus] = useState(id == currentAccount?.address);

  const [currentTab, setCurrentTab] = useState('zen');
  const [totalCoins, setTotalCoins] = useState(0);
  const [gameCount, setGameCount] = useState(0);
  const [list, setList] = useState([]);

  const [showShareModule, setShareModuleStatus] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [tokenMap, setTokenMap] = useState({
    'Bitcoin': 'btc',
    'Ethererum': 'eth',
    'Ton': 'ton'
  });

  useEffect(() => {
    api.get_user_status({
      user_id: id
    }).then((res) => {
      if(res?.data){
        setCurUser({ ...res.data.user, coins: res.data.coins, status: res.data.status });
      }
    })
  },[])


  useEffect(() => {
    fetchData();
  },[currentTab])

  const changeTab = async (tab:string) => {
    setList([]);
    setCurrentTab(tab)
  }

  const fetchData = async () => {
    try {
      const res:any = await api.get_profile_data({
        user_id: id,
        type: currentTab == 'battle' ? 'pk' : currentTab
      });
      if(res.success){
        const {data, coins, total_tegen_coins, total_type_game_count } = res;
        setTotalCoins(total_tegen_coins);
        setGameCount(total_type_game_count || 0);
        setList(data);
      }
    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const share = () => {
    getShareLink();
    setShareModuleStatus(true);
  }

  const toBattle = async () => {
    const res = await api.get_user_current_status({
      user_id: currentAccount?.address,
      battle_user_id: id,
    })
    if(res?.success){
      if(res.data.status == 'Available'){
        // dispatch(show({module: "battle-settings", args: {
        //   user: id
        // }}))
        dispatch(updateModule({
          module: "battleSettings", 
          show: true,
          args: {
            user: id
          }
        }))
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
    }
  }

  const getShareLink = async () => {
    if(shareUrl){
      return shareUrl;
    }else{
      const res = await api.get_invite_code({
        user_id: currentAccount?.address,
      });

      const res2 = await api.get_invite_code({
        user_id: id
      });
      if(res.success && res2.success){
        const url = `${CONFIG.miniAppUrl}?startapp=${res.data.code}_t=${res2.data.code}`;
        setShareUrl(url);
        return url;
      }
    }
  }

  const shareLink = async () => {
    const url = await getShareLink();
    const link = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=This is ${curUser.user_id?.slice(-6)} profile on TegenTap 😁 Come play TegenTap and earn coins! `
    window.open(link, '_blank');
  }

  const copyLink = async () => {
    copyToClipboardRef.current?.onClick();
  }

  const copySuccess = () => {
    message.open({
      type: 'info',
      content: 'Copied to clipboard',
      className: 'q-toast-message',
      duration: 5,
    });
  }


  const saveImage = () => {

  }

  const onClick = (event:any) => {
    event.stopPropagation();
  }


  return <div className="profile-page">
    <div className="share-btn" onClick={share}></div>
    {curUser && <div className={["user", isSelf ? 'self' : ''].join(" ")}>
      <div className="avatar" style={curUser.avatar ? {backgroundImage: `url(/img/avatar${curUser.avatar}.png)`} : {backgroundImage: `url(/img/avatar1.png)`}}>
        <div className={["user-status", curUser.status?.toLowerCase()].join(" ")}></div>
      </div>
      <div className="name">{curUser.user_id?.slice(-6)}</div>
      <div className="join-date">{formatDate(new Date(curUser.async_time).getTime()).date},{formatDate(new Date(curUser.async_time).getTime()).year} joined </div>
      <div className="coins">
        <div className="coins-value">{formatNumber(curUser.coins)}</div>
      </div>
      <div className="coins-tip">Available Tegen coins</div>
      {/* <div className="info ">Total Games Played: {user.total_count}</div>
      <div className="info ">Longest winning streak: {user.consecutive_wins_count}</div> */}

      {!isSelf && (
        curUser.status?.toLowerCase() == 'available' ?
        <div className="battle-btn" onClick={toBattle}>Battle</div>
        :
        <div className="battle-btn disabled">Battle</div>
      )}
    </div>}
    <div className="content">
      <div className="tabs">
        <div className={['tab-item', currentTab == 'zen' ? 'active' : ''].join(' ')}  onClick={() => {changeTab('zen')}}>ZEN</div>
        <div className={['tab-item', currentTab == 'adventure' ? 'active' : ''].join(' ')} onClick={() => {changeTab('adventure')}}>Adventure</div>
        <div className={['tab-item', currentTab == 'battle' ? 'active' : ''].join(' ')}  onClick={() => {changeTab('battle')}}>PK</div>
      </div>
      <div className="info-box">
        {currentTab == 'zen' && <div className={["info-content", currentTab == 'zen' ? '' : 'animate'].join(" ")}>
          <div className="info ">Total Tegen coins:  {formatNumber(totalCoins)}</div>
        </div>}

        {currentTab == 'adventure' && <div className="info-content animate">
          {new Array(2).fill().map((_, index) => {
            return <>
              <div className="info ">Total Adventure Game:  {formatNumber(gameCount)}</div>
              <div className="info ">Total Tegen coins: {formatNumber(totalCoins)}</div>
            </>
          })}
        </div>}

        {currentTab == 'battle' && <div className="info-content animate">
          {new Array(2).fill().map((_, index) => {
            return <>
              <div className="info ">Total PVP Game:  {formatNumber(gameCount)}</div>
              <div className="info ">Total Tegen coins: {formatNumber(totalCoins)}</div>
            </>
          })}
        </div>}
      </div>

      <div className={["list", currentTab].join(" ")}>
        {list.slice(0,2).map((item:any, index) => {
          return <div className={["item", tokenMap[item.trading_pair]].join(" ")} key={index}>
            <div className="key-value">
              <div className="value">
                {item.coins >= 0 ? `+${formatNumber(item.coins)}` : `${formatNumber(item.coins)}`}
                <div className="ic-coin"></div>
              </div>
              <div className="key">Rewards</div>
            </div>
            { currentTab != 'zen' && <div className="key-value">
                <div className="value">{Math.round(item.rate * 10000) / 100}%</div>
                <div className="key">win rate</div>
              </div>
            }
          </div>
        })}
      </div>
    </div>

    {showShareModule && <div className={"mask profile-share-mask"} id="profile-share-mask" onClick={() => {setShareModuleStatus(false)}}>
      <div className="profile-share-module" id="profile-share-module" onClick={onClick}>
        <div className="share-module-btn share-link" onClick={shareLink}>Share to friends</div>
        <div className="share-module-btn" onClick={copyLink}>Copy link</div>

        {shareUrl && (
          <CopyToClipboard ref={copyToClipboardRef} text={shareUrl} onCopy={copySuccess}>
            <div style={{display: 'none'}}>copy</div>
          </CopyToClipboard>
        )}
        {/* <div className="share-module-btn" onClick={saveImage}>Save as image</div> */}
      </div>
    </div>}
  </div>
};

export default ProfilePage;
