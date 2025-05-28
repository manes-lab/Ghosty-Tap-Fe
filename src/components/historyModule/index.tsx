import React, { useState, useEffect, useRef } from 'react';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import './style.scss';
import api from '../../axios';
import { formatTimestamp, formatNumber } from '../../utils/util';
import InfiniteScroll from 'react-infinite-scroll-component';

const Start: React.FC<{
  props: any,
  onClose: () => void,
}> = ({ props, onClose }) => {
  const currentAccount = useCurrentAccount();

  const [list, setList] = useState<any[]>([]);
  const [page, setPage] = useState(0); 
  const [isEnd, setEndStatus] = useState(false); 
  const limit = 20;
  let isInit = true;
  useEffect(() => {
    if(isInit){
      isInit = false;
      (async () => {
        await fetchData();
      })();
    }
    // loadStage("adventure", {instId: 'BTC-USDT'});
  },[])

  const fetchData = async () => {
    try {
      // const tradingPairMap = {
      //   'btc': 'Bitcoin',
      //   'eth': 'Ethererum',
      //   'ton': 'Ton',
      // }
      let arr = [];
      const res:any = await api.get_adventure_history({
        user_id: currentAccount.address,
        page,
        limit: limit,
        trading_pair: props.token
      })
      

      arr = res.data || [];
      setList([...list, ...arr]);
      setPage(page+1);
      setEndStatus(arr.length < limit)
    }catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const close = () => {
    document.getElementById('history-mask')?.classList.add('hide');
    document.getElementById('history-module')?.classList.add('hide');
    setTimeout(()=>{
      onClose()
    }, 600)
  }

  function List(){
    if(list.length>0){
      return <>{list.map((item:any, index) => {
        return (
          <div className="item">
            <div className={["icon win", item.coins < 0 ? 'lose' : (item.consecutive_wins_count > 1 ? 'double-win' : 'win')].join(" ")}>
              {item.coins < 0 ? 'Lose' : (item.consecutive_wins_count > 1 ? `Win×${item.consecutive_wins_count}` : 'Win')}
            </div>
            <div className="coin">
              {item.coins < 0 ? '+0' : (item.consecutive_wins_count > 1 ? `+${formatNumber(100 * item.consecutive_wins_count + Number(item.coins))}` : '+200')}
              <div className="coin-icon"></div>
            </div>
            <div className="time">{formatTimestamp(item.create_at).slice(5, 16)}</div>
          </div>
        )
      })}
      </>
    }else if(isEnd){
      return <div className="no-data">No data</div>;
    }
  }


  
  return <div className="mask history-mask" id="history-mask">
    <div className="history-module" id="history-module" onClick={(event) => {event.stopPropagation();}}>
      <div className="close-btn" onClick={close}></div>
      <div className="module-content">
        <div className="title">Bet History</div>
        <div className="split-line"></div>
        <div className="list-box">
          <div className="list">
            <InfiniteScroll
              height = {'35rem'}
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
        {/* <div className="save-btn" onClick={() => {onSetting(mode)}}>Save</div> */}
      </div>
    </div>
  </div>
};

export default Start;
