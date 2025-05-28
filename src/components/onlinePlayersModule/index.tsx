import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import './style.scss';
import api from '../../axios/index';
import { formatNumber } from '../../utils/util';

import InfiniteScroll from 'react-infinite-scroll-component';
import { message } from 'antd';

const LeaderboardContent: React.FC<{
  props: any,
  onClose: () => void,
  onShowUser: (user:any) => void,
}> = ({ props, onClose,  onShowUser }) => {
  const currentAccount = useCurrentAccount();
  const navigate = useNavigate();

  const [self, setSelf] = useState();
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(0); 
  const [isEnd, setEndStatus] = useState(false); 
  const limit = 20;
  const [refreshFlag, setRefreshFlag] = useState(1); 

  useEffect(() => {
  },[])

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  },[refreshFlag])

  const refresh = () => {
    setList([]);
    setPage(0);
    setEndStatus(false);
    setRefreshFlag(-refreshFlag);
  }


  const tip = async (tab:string) => {
    message.open({
      type: 'info',
      content: props.stage == 'zen' ? `Total coins earned in Zen mode` : `Current players rewards`,
      className: 'q-toast-message',
      duration: 3,
    });
  }

  const fetchData = async () => {
    try {
      let arr = [];
      const res = await api.get_online_players({
        user_id: currentAccount?.address,
        page,
        limit,
        type: ['square', 'battle'].indexOf(props.stage) > -1 ? 'pk' : props.stage
      });
      
      setTotal(res?.data?.count || 0);
      arr = res?.data?.rank || [];
      if(page == 0){
        setList(arr);
        setSelf({
          ...res?.data?.user,
          position: res?.data?.position
        });
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
    document.getElementById('online-players-mask')?.classList.add('hide');
    document.getElementById('online-players-module')?.classList.add('hide');
    setTimeout(()=>{
      onClose()
    }, 600)
  }


  function List(){
    // return (
    //   <div className="item">
    //     <div className="num num1">1</div>
    //     <div className="user">
    //       <img className="avatar" src="/img/avatar.png"></img>
    //       <div className="name">hhhhhh</div>
    //     </div>
    //     <div className="points">67</div>
    //   </div>
    // )
    if(list.length>0){
      return <>{list.map((item:any, index) => {
        return (
          <div className="item" key={index} onClick={() => {onShowUser(item)}}>
            <div className={["num", "num"+(index+1)].join(" ")}>{index + 1}</div>
            <div className="user">
              {/* <img className="avatar" src={`/img/avatar${item.avatar}.png`}></img> */}
              <div className="avatar" style={item.avatar ? {backgroundImage: `url(/img/avatar${item.avatar}.png)`} : {}}></div>
              <div className="name txt-wrap">{item.user_id?.slice(-6)} </div>
            </div>
            <div className="points">{formatNumber(item.coins)}</div>
          </div>
        )
      })}
      </>
    }else if(isEnd){
      return <div className="no-data">No data</div>;
    }
  }

  return <div className={["mask online-players-mask", props.stage+'-online-players-mask'].join(" ")} id="online-players-mask" onClick={close}>
    <div className={["online-players-module", props.from].join(" ")} id="online-players-module" onClick={onClick}>
      <div className="head">
        <div className="head-left">
          Ghosts({total})
          <div className="tip-btn" onClick={tip}></div>
        </div>
        <div className="head-right">
          <div className="refresh-btn" onClick={refresh}></div>
        </div>
      </div>

      <div className="list">
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

          {/* <div className="item">
            <div className={["num", "num1"].join(" ")}>1</div>
            <div className="user">
              <div className="avatar"></div>
              <div className="name txt-wrap">hhhhhhhhh</div>
            </div>
            <div className="points">{formatNumber(1000)}</div>
          </div> */}
          <List/>
        </InfiniteScroll>

        {self && <div className="self" onClick={() => {onShowUser(self)}}>
          <div className="num">{self.position || '99+'}</div>
          <div className="user">
            {/* <img className="avatar" src={`/img/avatar${self.avatar}.png`}></img> */}
            <div className="avatar" style={self.avatar ? {backgroundImage: `url(/img/avatar${self.avatar}.png)`} : {}}></div>
            <div className="name txt-wrap">{self.user_id?.slice(-6)}</div>
          </div>
          <div className="points">{formatNumber(self.coins)}</div>
        </div>}
      </div>

    </div>
  </div>
};

export default LeaderboardContent;
