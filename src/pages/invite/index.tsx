import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import './style.scss';
import api from '../../axios/index';
import { formatNumber,  timestampToUTCString } from '../../utils/util';
import getConfig from '../../config';

import { message } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// import ReferralBounsModule from '../../components/referralBounsModule';
import ProfileModule from '../../components/profileModule';

import btn1 from '../../assets/images/common/btn-1.png';
import btn2 from '../../assets/images/common/btn-2.png';
import copyBtn1 from '../../assets/images/invite/copy-btn-1.png';
import copyBtn2 from '../../assets/images/invite/copy-btn-2.png';


const LeaderboardPage: React.FC = () => {
  const currentAccount = useCurrentAccount();
  const navigate = useNavigate();
  const CONFIG = getConfig();
  const [isLoading, setLoadingStatus] = useState(true);
  // const [showBouns, setBounsStatus] = useState(false);
  const [showProfileModule, setProfileModuleStatus] = useState(false);
  const [curUser, setCurUser] = useState();

  const [inviteUrl, setInviteUrl] = useState('');
  const [list, setList] = useState([]);
  const [page, setPage] = useState(0); 
  const [isEnd, setEndStatus] = useState(false); 
  const limit = 20;

  const btnsRef = useRef(null);
  let init = true;

  useEffect(() => {
    if(init){
      init = false;
      fetchData();
      initInviteUrl();

    }
    
  },[])

  const initInviteUrl = async () => {
    const res = await api.get_invite_code({
      user_id: currentAccount?.address,
    });
    if(res.success){
      const url = `${CONFIG.miniAppUrl}?startapp=${res.data.code}`;
      
      setInviteUrl(url);
    }
  }

  const fetchData = async () => {
    try {
      let arr = [];

      const res = await api.get_invite_list({
        user_id: currentAccount?.address,
        page,
        limit
      });
     

      arr = res?.data || [];
      if(page == 0){
        setList(arr);
      }else{
        setList([...list, ...arr]);
      }
      setPage(page+1);
      setEndStatus(arr.length < limit)
    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const invite = () => {
    const link = `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=Hey there! Ever tapped into Tegen Tap? Price tracking with tap2earn, predict the market to earn more! 💸 Join me and get 3000 free Tegen Coins to start! 💰`
    window.open(link, '_blank');
  }

  const copySuccess = () => {
    message.open({
      type: 'info',
      content: 'Copied to clipboard',
      className: 'q-toast-message',
      duration: 5,
    });
  }

  const showUser = (user:any) => {
    setCurUser(user);
    setProfileModuleStatus(true);
  }

  function Items(){
    if(list.length>0){
      return <>{list.map((item:any, index) => {
        return (
          <div className="item" key={index} onClick={() => {showUser(item.user)}}>
            <div className="user">
              <div className="avatar" style={item.user.avatar ? {backgroundImage: `url(/img/avatar${item.user.avatar}.png)`} : {}}></div>
              <div className="name txt-wrap">{item.user?.user_id?.slice(-6)}</div>
            </div>
            <div className="date">{ timestampToUTCString(item.create_at)}</div>
            <div className="coins">{formatNumber(item.invite_user_coins)}</div>
          </div>
        )
      })}
      </>
    }else if(isEnd){
      return <div className="no-data">No data</div>;
    }
  }

  return <div className="invite-page">
    <InfiniteScroll
      height = '99.99vh'
      dataLength={list.length}
      next={fetchData}
      hasMore={!isEnd}
      loader={<div className="scroll-loading">
        <div className="icon"></div>
        Loading...
      </div>}
      endMessage={list.length>limit && <p className="no-more">No more</p>}
    >
      <div className="invite-page-banner">
        <div className="invite-page-banner-content">
          <div className="banner-title">Invite friends!</div>
          <div className="banner-intro">You and your frens will both receive<br/> Tegen Coins</div>
          {/* <div className="banner-bouns">
            <div className="banner-bouns-text" onClick={() => {setBounsStatus(true)}}>More bonuses</div>
          </div> */}
        </div>
      </div>
      <div className="head">List of your frens</div>
      <div className="list">
        <div className="list-head">
          <div>Your frens</div>
          <div>Joined date</div>
          <div>Your earn</div>
        </div>
        <Items/>
      </div>
    </InfiniteScroll>

    {inviteUrl && <div className="btns" ref={btnsRef}>
      <div className="invite-btn" onClick={invite}>
        Invite friends
        <div className="icon"></div>
      </div>

      <CopyToClipboard text={inviteUrl} onCopy={copySuccess}>
        <div className="copy-btn adventure-mode">
          <div className="icon"></div>
        </div>
      </CopyToClipboard>
      
    </div>}

    {/* {showBouns && <ReferralBounsModule onClose={() => {setBounsStatus(false)}}/>} */}
    {showProfileModule && <ProfileModule props={{user: curUser}} onClose={() => {setProfileModuleStatus(false);}}/>}

    <div className="img-loader">
      <img src={btn1}/>
      <img src={btn2}/>
      <img src={copyBtn1}/>
      <img src={copyBtn2}/>
    </div>
   
  </div>
};

export default LeaderboardPage;
