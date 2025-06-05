import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import './style.scss';
import api from '../../../axios/index';
import { formatNumber } from '../../../utils/util';
import { message } from 'antd';
import { show, updateModule } from '../../../redux/slice';

const BattleResult: React.FC<{
  props: any,
  onClose: () => void,
}> = ({ props, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentAccount = useCurrentAccount();

  const [result, setResult] = useState(props.result || {});
  const [isLeave, setIsLeave] = useState(false);
  const [battleRecord, setBattleRecord] = useState();
  const [antagonistBattleRecord, setAntagonistBattleRecord] = useState();
  const [score, setScore] = useState(0);
  const [antagonistScore, setAntagonistScore] = useState(0);

  const titleMap = {
    success: "YOU WON!",
    fail: "YOU lOST",
    draw: "IT'S A DRAW"
  }

  useEffect(() => {
    api.get_battle_result({
      user_id: currentAccount?.address,
      battle_id: props.battleId
    }).then(res => {
      if(res.success){
        const battle = res.data.battle;
        setResult(battle);

        setScore(currentAccount?.address == battle.invite_user_id ? battle.invite_user_coins : battle.be_invite_user_coins)
        setAntagonistScore(currentAccount?.address == battle.invite_user_id ? battle.be_invite_user_coins : battle.invite_user_coins)

        setIsLeave(res.data.is_leave);
        setBattleRecord(res.data.record[0]);
        setAntagonistBattleRecord(res.data.record[1]);
      }
    })
  }, [props.battleId]);

  const share = async () => {
    
  }

  const startAnotherRound = async () => {
    onClose();
    
    // dispatch(show({module: "battle-settings", args: {
    //   user: antagonistBattleRecord.user?.user_id,
    //   pair: result.trading_pair,
    //   rewards: Math.abs(result.coin),
    // }}))
    dispatch(updateModule({
      module: "battleSettings", 
      show: true,
      args: {
        user: antagonistBattleRecord.user?.user_id,
        pair: result.trading_pair,
        rewards: Math.abs(result.coins),
      }
    }))
  }

  // const close = () => {
  //   if(/\/battle/.test(window.location.href)){
  //     navigate(-1);
  //   }else{
  //     onClose();
  //   }
  // }


  return <div className="mask" onClick={onClose}>
    {/* battle-result-win */}
    <div className={["battle-result-module", "battle-result-"+result.status].join(" ")} onClick={(event) => {event.stopPropagation();}}>
      <div className="close-btn" onClick={onClose}></div>
      <div className="module-content">
        <div className="battle-result-module-content">
          <div className={["result-title", result.status].join(" ")}>
            {titleMap[result.status]}
          </div>

          <div className="result-rewards">
            {formatNumber(result.coins)}
            <div className="coin"></div>
          </div>


          {(isLeave && result.status == 'success') ? <div className={"leave-game"}>
            <div className="name txt-wrap">{antagonistBattleRecord.user?.user_id?.slice(-6)}</div> left the game, you win
          </div> : <div className={"battle-result"}>
            {battleRecord && <div className="battle-user">
              <div className="avatar" style={{backgroundImage: `url(/img/avatar${battleRecord.user?.avatar}.png)`}}></div>
              <div className="userinfo">
                <div className="name txt-wrap">You</div>
                <div className="score">Score: {formatNumber(score)}</div>
              </div>
              <div className="battle-list">
                {battleRecord.battle_history?.map((item, index) => {
                  return (
                    <div className={["battle-item battle-item-"+item.is_success].join(" ")} key={index}></div>
                  )
                })}
              </div>
            </div>}


            {antagonistBattleRecord && <div className="battle-user">
              <div className="avatar" style={{backgroundImage: `url(/img/avatar${antagonistBattleRecord.user?.avatar}.png)`}}></div>
              <div className="userinfo">
                <div className="name txt-wrap">{antagonistBattleRecord.user?.user_id?.slice(-6)}</div>
                <div className="score">Score: {formatNumber(antagonistScore)}</div>
              </div>
              <div className="battle-list">
                {antagonistBattleRecord.battle_history?.map((item, index) => {
                  return (
                    <div className={["battle-item battle-item-"+item.is_success].join(" ")} key={index}></div>
                  )
                })}
              </div>
            </div>}
          </div>}

          <div className="battle-result-btn share-btn" onClick={() => {navigate("/")}}>Back to Home</div>
          <div className="battle-result-btn start-btn" onClick={startAnotherRound}>Start another round</div>

          <div className={"tip"}>You need to reset the battle settings to start a new round</div>
        </div>
      </div>
    </div>
  </div>
};

export default BattleResult;
