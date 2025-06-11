import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useWallets, ConnectButton, useCurrentAccount, useDisconnectWallet, useSignPersonalMessage } from '@mysten/dapp-kit';
import './style.scss';
import { useNavigate } from 'react-router-dom';
import { toggleConnectModal, show, updateModule } from '../../redux/slice';
import { message } from 'antd';
import api from '../../axios';
import { Base64 } from 'js-base64';
import { formatNumber, isMobile } from '../../utils/util';
import { initUser } from '../../utils/init.ts';
import LoadingModule from '../../components/loadingModule';
// import InviteSuccessModule from '../../components/inviteSuccessModule';



const Home: React.FC = () => {
  const wallets = useWallets();
  const currentAccount = useCurrentAccount();
  const signPersonalMessage = useSignPersonalMessage();
  const { mutate: disconnect } = useDisconnectWallet({
    onSuccess: () => {
      console.log('disconnect success');
    },
    onError: (err) => {
      console.error('disconnect error:', err);
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // const videoRef = useRef(null);
  const entryRef = useRef(null);
  const btnsRef = useRef(null);
  const [isLoading, setLoadingStatus] = useState(true);

  // const [showInviteSuccess, setInviteSuccessStatus] = useState(false);
  // const [inviteRewards, setInviteRewards] = useState(0);
  // const [inviteUserInfo, setInviteUserInfo] = useState({});

  const [list, setList] = useState([]);
  const [userToken, setUserToken] = useState(localStorage.getItem("ghosty-tap-"+currentAccount?.address) || "");
  const [totalCoin, setTotalCoin] = useState(0);
  let init = true;

  const token = useMemo(() => {
    return userToken || localStorage.getItem("ghosty-tap-"+currentAccount?.address) || "";
  }, [currentAccount, userToken]);
  

  useEffect(() => {
    (async () => {
      if(init){
        init = false;
        initRankData();
        setLoadingStatus(false);
        // if(WebApp?.initDataUnsafe?.start_param){
        //   await initInviteInfo(WebApp?.initDataUnsafe?.start_param);
        // }
        // register();
      }
    })()
  },[])

  // useEffect(() => {
  //   if (videoRef.current) {
  //     videoRef.current.addEventListener('playing', () => {
  //       setLoadingStatus(false);
  //     });
  //     videoRef.current.play();
  //   }
  // },[videoRef.current])



  const initRankData = async () => {
    const res = await api.get_home_page_data({});
    if(res.success){
      setList(res.data.rank);
      setTotalCoin(res.data.total_coin_mined);
    }
  }


  // const register = async () => {
  //   const res = await api.register({
  //     user_id: currentAccount?.address,
  //   });
  //   if(res.success){
  //   }
  // }

  // const enterSquare = async () => {

  // }

  // const startBattle = async () => {
  //   // dispatch(show({module: "battle-settings", args: {}}))
  //   dispatch(updateModule({
  //     module: "battleSettings", 
  //     show: true,
  //     args: {}
  //   }))
  // }


  // const initInviteInfo = async (code:string) => {
  //   const res = await api.be_invited({
  //     user_id: currentAccount?.address,
  //     code
  //   });
  //   if(res.success && res.data.invite_user?.user_id != currentAccount?.address){
  //     setInviteRewards(res.data.be_invite_coins);
  //     setInviteUserInfo(res.data.invite_user);
  //     setInviteSuccessStatus(true);
  //   }
  // }

  const onStart = (mode:string) => {
    navigate('/' + mode, { state: {mode} })
  }

  const jumpPage = (path:string) => {
      message.open({
        type: 'info',
        content: 'Coming soon ',
        className: 'q-toast-message',
        duration: 5,
      });
      return;
    // navigate(path)
  }

  const login = () => {
    const slush = wallets.find(w => w.name === 'Slush');
    if(slush){
      dispatch(toggleConnectModal(null))
    }else{
      const payload = {
        "version": "1",
        "requestId": crypto.randomUUID(),
        "appUrl": window.location.href,
        "appName": "Ghosty Tap",
        "payload": {
          "type": "connect"
        },
        "metadata": {
          "originUrl": window.location.href,
          "userAgent": navigator.userAgent,
          "screenResolution": `${window.screen.width}x${window.screen.height}`,
          "language": navigator.language,
          "platform": navigator.platform,
          "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
          "timestamp": Date.now(),
        }
      }

      const slushUrl = `https://my.slush.app/approve-connection?requestId=${payload.requestId}&appUrl=${encodeURIComponent(payload.appUrl)}&appName=${encodeURIComponent(payload.appName)}&hash=${Base64.encode(JSON.stringify(payload))}`;

      window.open(slushUrl, '_blank');
    }
  };

  const logout = () => {
    localStorage.removeItem("ghosty-tap-"+currentAccount.address);
    setUserToken('');
    disconnect();
  }

  const sign =  async () => {
    if(!currentAccount?.address){
      login();
      return;
    }
    const account = currentAccount?.address || "";
    let uToken = '';

    const message = `Sign in with Sui Wallet`;
    const rawMessageBytes = new TextEncoder().encode(message);
    console.log(rawMessageBytes, '----rawMessageBytes----');
    const signedResult = await signPersonalMessage.mutateAsync({
        message: rawMessageBytes,
    });

    console.log(signedResult, '-----signedResult----');

    const res = await api.get_user_token({
        address: account,
        signature: signedResult.signature,
        message: message,
        publicKey: currentAccount?.publicKey
    })
    if(res?.success){
      uToken = res.data?.token || '';
      localStorage.setItem("ghosty-tap-"+account, userToken);
      setUserToken(uToken);
    }

    await initUser(account, uToken);
  }


  return <div className="index-page">
    {/* <video ref={videoRef} disablePictureInPicture playsInline  webkit-playsinline="true" autoPlay muted loop controls={false} className="animation" src="/images/home.mp4"></video> */}
    <img className="animation" src="/img/home.jpg"/>

    <div className="banner-box">
      <div className="banner">
        <div className="leaderboard-banner">
          <div className="leaderboard-title">
            <div className="icon"></div>
            Daily Top 3 Leaderboard
          </div>
          {list.map((item:any, index) => {
            return (
              <div className="item" key={index}>
                <div className={["num", "num"+(index+1)].join(" ")}></div>
                <div className="user">
                  {/* <img className="avatar" src={`/img/avatar${item.user?.avatar}.png`}></img> */}
                  <div className="name txt-wrap">{item.user?.user_id?.slice(-6)}</div>
                </div>
                <div className="points">{formatNumber(item.coins)}</div>
              </div>
            )
          })}
        </div>
        <div className="total-coins">
          <div className="coins">{formatNumber(totalCoin)}</div>
          Total coin mined
        </div>
      </div>
    </div>

    <div className="page-entry" ref={entryRef}>
      <div className="entry entry-leaderboard" onClick={() => {jumpPage('/leaderboard')}}>Ranking</div>
      <div className="entry entry-battle"  onClick={() => {onStart('square')}}>Battle</div>
      <div className="entry entry-battle"  onClick={() => {test()}}>Battle2</div>
      {/* onClick={() => {onStart('square')}} */}
      <div className="entry entry-profile" onClick={() => {jumpPage(`/user/${currentAccount?.address}`)}}>Profile</div>
      <div className="entry entry-invite" onClick={() => {jumpPage('/invite')}}>Invite</div>

      {currentAccount?.address && <div className="entry entry-sign-out" onClick={logout}>Sign out</div>}
    </div>

    

    <div className="btns" ref={btnsRef}>
      {
        currentAccount?.address && token ? <>
          <div className="start-btn zen-mode" onClick={() => {onStart('zen')}}></div>
          <div className="start-btn adventure-mode" onClick={() => {onStart('adventure')}}></div>
        </> : <>
          {currentAccount?.address ? <div className="login-btn" onClick={sign}>Sign</div> : <div className="login-btn" onClick={login}></div>}
        </>
      }
    </div>

    {isLoading && <LoadingModule  onClose={() => {}}/>}
    {/* {showInviteSuccess && <InviteSuccessModule props={{rewards:inviteRewards, inviteUserInfo}} onClose={() => {setInviteSuccessStatus(false);initRankData()}}/>} */}

    
  </div>
};

export default Home;
