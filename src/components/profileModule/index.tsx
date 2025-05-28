import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import './style.scss';
import api from '../../axios';
import { formatNumber } from '../../utils/util';
import { message } from 'antd';
import { show, updateModule } from '../../redux/slice';

const Profile: React.FC<{
  props: any,
  onClose: () => void,
}> = ({ props, onClose }) => {
  const currentAccount = useCurrentAccount();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [curUser, setCurUser] = useState(props.user);
  const [currentTab, setCurrentTab] = useState(['square', 'battle'].indexOf(props.mode) > -1 ? 'battle' : (props.mode || 'zen'));
  const [list, setList] = useState([]);

  const isSelf = props.user?.user_id == currentAccount?.address;
  const tokenMap = {
    'Bitcoin': 'btc',
    'Ethererum': 'eth',
    'Ton': 'ton'
  };


  useEffect(() => {
    api.get_user_status({
      user_id: props.user?.user_id
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
        user_id: props.user?.user_id,
        type: currentTab == 'battle' ? 'pk' : currentTab
      });
      if(res.success){
        setList(res.data);
      }
    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const close = () => {
    document.getElementById('profile-mask')?.classList.add('hide');
    document.getElementById('profile-module')?.classList.add('hide');
    setTimeout(()=>{
      onClose()
    }, 600)
  }

  const toProfilePage = () => {
    navigate(`/user/${curUser.user_id}`);
  }

  const toBattle = async () => {
    const res = await api.get_user_current_status({
      user_id: currentAccount?.address,
      battle_user_id: props.user?.user_id,
    })
    if(res?.success){
      if(res.data.status == 'Available'){
        onClose();
        // dispatch(show({module: "battle-settings", args: {
        //   user: props.user?.user_id
        // }}))
        dispatch(updateModule({
          module: "battleSettings", 
          show: true,
          args: {
            user: props.user?.user_id
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

  return <>
    <div className="mask profile-mask" id="profile-mask">
      <div className="module profile-module" id="profile-module">
        <div className="close-btn" onClick={close}></div>
        <div className="module-content">
          {curUser && <div className="user">
            <div className="avatar" style={{backgroundImage: `url(/images/avatar${curUser.avatar || 1}.png)`}}>
              <div className={["user-status", curUser.status?.toLowerCase()].join(" ")}></div>
            </div>
            <div className="name">{curUser.user_id?.slice(-6)}</div>
            <div className="coins">
              <div className="coins-value">{formatNumber(curUser.coins)}</div>
            </div>
            <div className="coins-tip">Available Tegen coins</div>
            {/* <div className="info ">Total Games Played: {user.total_count}</div>
            <div className="info ">Longest winning streak: {user.consecutive_wins_count}</div> */}
          </div>}
          <div className="content">
            <div className="tabs">
              <div className={['tab-item', currentTab == 'zen' ? 'active' : ''].join(' ')}  onClick={() => {changeTab('zen')}}>ZEN</div>
              <div className={['tab-item', currentTab == 'adventure' ? 'active' : ''].join(' ')} onClick={() => {changeTab('adventure')}}>Adventure</div>
              <div className={['tab-item', currentTab == 'battle' ? 'active' : ''].join(' ')}  onClick={() => {changeTab('battle')}}>PK</div>
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

          <div className={["profile-btns", isSelf ? 'self' : 'other'].join(" ")}>
            <div className="operate-btn profile-btn" onClick={toProfilePage}>Profile</div>


            {!isSelf && <div className="operate-btn battle-btn" onClick={toBattle}>Battle</div>}
          </div>
        </div>
      </div>
    </div>
  </>
};

export default Profile;
