import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import './style.scss';
import api from '../../../axios/index';
import { formatNumber, formatDate } from '../../../utils/util';

import InfiniteScroll from 'react-infinite-scroll-component';

const BattleHistory: React.FC<{
  props: any,
  onClose: () => void,
  onShowResult: (item:any) => void,
}> = ({ props, onClose,  onShowResult }) => {
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();

  const [list, setList] = useState([]);
  const [page, setPage] = useState(0); 
  const [isEnd, setEndStatus] = useState(false); 
  const limit = 20;

  useEffect(() => {
    fetchData();
  },[])


  const fetchData = async () => {
    try {
      let arr = [];
      const res = await api.get_battle_history({
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

  const onClick = (event:any) => {
    event.stopPropagation();
  }

  const close = () => {
    document.getElementById('battle-history-mask')?.classList.add('hide');
    document.getElementById('battle-history-module')?.classList.add('hide');
    setTimeout(()=>{
      onClose()
    }, 600)
  }


  function List(){
    // return (
    //   <div className="item">
    //     <div className="user">
    //       <img className="avatar" src="/img/avatar.png"></img>
    //       <div className="name">hhhhhh</div>
    //     </div>
    //     <div className="date">Jul 16 20:00</div>
    //     <div className="coins">-1000</div>
    //   </div>
    // )
    if(list.length>0){
      return <>{list.map((item:any, index) => {
        return (
          <div className="item" key={index} onClick={() => {onShowResult(item)}}>
            <div className="user">
              <div className="avatar" style={{backgroundImage: `url(/img/avatar${item.battle_user?.avatar || 1}.png)`}}></div>
              <div className="name txt-wrap">{item.battle_user?.user_id?.slice(-6)}</div>
            </div>
            <div className="date">{formatDate(item.update_at).date} {formatDate(item.update_at).time}</div>
            <div className="coins">{formatNumber(item.coins)}</div>
          </div>
        )
      })}</>
    }else if(isEnd){
      return <div className="no-data">No data</div>;
    }
  }

  return <div className={["mask battle-history-mask", props.stage+'-battle-history-mask'].join(" ")} id="battle-history-mask" onClick={close}>
    <div className={["battle-history-module", props.from].join(" ")} id="battle-history-module" onClick={onClick}>
      <div className="head">Battle History</div>

      <div className="list">
        <div className="list-head">
          <div>Tegens</div>
          <div>Time</div>
          <div>Result</div>
        </div>
        <InfiniteScroll
          height={'27.5rem'}
          dataLength={list.length}
          next={fetchData}
          hasMore={!isEnd}
          loader={<div className="scroll-loading">
            <div className="icon"></div>
            Loading...
          </div>}
          endMessage={list.length>limit && <p className="no-more">No more</p>}
        >
          <List/>
        </InfiniteScroll>
      </div>

    </div>
  </div>
};

export default BattleHistory;
