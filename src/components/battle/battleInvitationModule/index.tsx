import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import './style.scss';
import api from '../../../axios/index';
import { formatNumber } from '../../../utils/util';
import * as Pomelo from '../../../utils/pomelo';
import { message } from 'antd';

const BattleInvitation: React.FC<{
  props: any,
  onClose: () => void,
}> = ({ props, onClose }) => {
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  const [battleUser, setBattleUser] = useState({});
  const [inviteInfo, setInviteInfo] = useState({});
  const [currentTab, setCurrentTab] = useState('battle');
  const [block, setBlockStatus] = useState(false);
  const [leftTime, setLeftTime] = useState(30);

  const tokenMap:any = {
    'Bitcoin': 'btc',
    'Ethererum': 'eth',
    'Ton': 'ton'
  };


  useEffect(() => {
    api.get_invitation_for_battle({
      user_id: currentAccount?.address,
      invite_id: props.data.invite_id,
    }).then((res) => {
      if(res?.data){
        setInviteInfo(res.data.invitation);
        const {battle_user, coins, status, pvp_rate, pve_rate} = res.data;
        setBattleUser({...battle_user, coins, status, pvp_rate, pve_rate});
      }
    })
  },[])

  useEffect(() => {
    if(props.data.type == 'push' && leftTime > 0){
      let interval:any = null;
      let leftSeconds = 30;
      interval = setInterval(() => {
        setLeftTime(leftSeconds--);

        if(leftSeconds < 0){
          clearInterval(interval);
          onClose();
        }
      }, 1000);
      return () => {
          if (interval) {
              clearInterval(interval);
          }
      };
    }
  }, []);

  const changeTab = (tab: string) => {
    setCurrentTab(tab)
  }



  const deal = async (choice:string) => {
    if(choice == 'Accept'){
      const res = await api.get_user_current_status({
        user_id: currentAccount?.address,
        battle_user_id: inviteInfo.invite_user_id,
        invite_id: props.data.invite_id,
      })
      if(res?.success){
        if(res.data.status == 'Available' && res.data.is_sate){
          const msg: any = await Pomelo.dealBattleInvitation(props.data.invite_id, choice)
          navigate('/battle', { 
            state: {
                mode: "battle", 
                token: tokenMap[inviteInfo.trading_pair],
                options : msg.data
            } 
          })
          onClose();
        }else{
          let status = res.data.status;
          !res.data.is_sate && (status = 'InsufficientBalance');
          res.data.is_timeout && (status = 'Expired');
          const messageMap:any = {
            InsufficientBalance: "The Tegen's balance does not meet the required amount for the prize pool",
            Expired: 'The battle invitation expired',
            OffLine: 'The Tegen has left the game, you cannot start the battle immediately',
            Playing: 'The Tegen is busy playing, you cannot start the battle immediately'
          }
          message.open({
            type: 'info',
            content: messageMap[status],
            className: 'q-toast-message',
            duration: 5,
          });
        }
      }
    }else{
      const msg: any = await Pomelo.dealBattleInvitation(props.data.invite_id, choice)
      onClose();
    }
  }


  const blockPlayer = async () => {
    setBlockStatus(!block);
    const res = await api.block_user_battle_invitation({
      is_block: block,
      battle_user_id: inviteInfo.invite_user_id
    })
    if(res.success){

    }
  }

  const showRule = async () => {
    message.open({
      type: 'info',
      content: 'The loser is required to pay the winner Bet amount of coins',
      className: 'q-toast-message',
      duration: 5,
    });
  }


  return <>
    <div className="mask battle-invitation-mask">
      <div className="module battle-invitation-module">
        <div className="close-btn" onClick={onClose}></div>
        <div className="title">
          Battle Invitation
          <div className="rule-btn" onClick={showRule}></div>
        </div>
        <div className="module-content">
          <div className="invite-user">
            <div className="avatar" style={{backgroundImage: `url(/images/avatar${battleUser?.avatar || 1}.png)`}}>
              <div className={["user-status", battleUser?.status].join(" ")}></div>
            </div>
            <div className="name txt-wrap">{battleUser?.user_id?.slice(-6)}</div>
            <div className="battle-rewards">
              {formatNumber(battleUser?.coins)}
              <div className="coin"></div>
            </div>
          </div>

          <div className="content">
            <div className="tabs">
              <div className={['tab-item', currentTab == 'battle' ? 'active' : ''].join(' ')} onClick={() => {changeTab('battle')}}>Battle Info</div>
              <div className={['tab-item', currentTab == 'tegen' ? 'active' : ''].join(' ')}  onClick={() => {changeTab('tegen')}}>Tegen Info</div>
            </div>
            {
              currentTab == 'battle' ? <div className={"info battle-info"}>
                <div className={"item"}>
                  <div className="key-value">
                    <div className="key">Trading pair:</div>
                    <div className="value">{inviteInfo.trading_pair} {tokenMap[inviteInfo.trading_pair]?.toUpperCase()}/USDT</div>
                  </div>
                  <div className="key-value">
                    <div className="key">You can win:</div>
                    <div className="value">{formatNumber(inviteInfo.coins)}<div className="ic-coin"></div></div>
                  </div>
                </div>
              </div> : <div className={"info tegen-info"}>
                <div className="key-value">
                  <div className="value">{Math.round(battleUser.pve_rate * 10000) / 100}%</div>
                  <div className="key">Adventure mode<br/> win rate</div>
                </div>
                <div className="key-value">
                  <div className="value">{Math.round(battleUser.pvp_rate * 10000) / 100}%</div>
                  <div className="key">PVP mode win<br/> rate</div>
                </div>
              </div>
            }
          </div>

          <div className="battle-btns">
            <div className="battle-btn decline-btn" onClick={() => {deal('Decline')}}>Decline{props.data.type == 'push' && <>({leftTime}s)</>}</div>
            <div className="battle-btn accept-btn" onClick={() => {deal('Accept')}}>Accept</div>
          </div>

          {props.data.type == 'push' && <div className={["block-invitation", block ? 'active' : ''].join(" ")} onClick={blockPlayer}>I don't want to receive this player's invitation within 24 hours</div>}
        </div>
      </div>
    </div>
  </>
};

export default BattleInvitation;
