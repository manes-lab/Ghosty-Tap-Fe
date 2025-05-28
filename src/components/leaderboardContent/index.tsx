import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import './style.scss';
import api from '../../axios/index';
import { formatNumber } from '../../utils/util';

import InfiniteScroll from 'react-infinite-scroll-component';
import { message, Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';

const LeaderboardContent: React.FC<{
  props: any,
  onShowUser: (user:any) => void,
}> = ({ props, onShowUser }) => {
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();

  const containerRef = useRef(null);
  const [currentTab, setCurrentTab] = useState(props.from == 'page' ? 'total' : 'day');
  const [self, setSelf] = useState();
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
  },[currentTab, refreshFlag])

  const menuItems: MenuProps['items']  = [
    {
      key: 'day',
      label: (
        <div className={["leaderboard-menu-item", currentTab == 'day' ? 'active' : ''].join(" ")} onClick={() => {changeTab('day')}}>
          Day
        </div>
      ),
    },
    {
      key: 'week',
      label: (
        <div className={["leaderboard-menu-item", currentTab == 'week' ? 'active' : ''].join(" ")}  onClick={() => {changeTab('week')}}>
          Week
        </div>
      ),
    },
    {
      key: 'total',
      label: (
        <div className={["leaderboard-menu-item", currentTab == 'total' ? 'active' : ''].join(" ")}  onClick={() => {changeTab('total')}}>
          Total
        </div>
      ),
    },
  ];


  const tip = async () => {
    message.open({
      type: 'info',
      content: `Total coins earned in both Zen Mode and Adventure Mode`,
      className: 'q-toast-message',
      duration: 3,
    });
  }


  const changeTab = async (tab:string) => {
    setList([]);
    setPage(0);
    setEndStatus(false);
    setCurrentTab(tab)
  }

  const refresh = () => {
    setList([]);
    setPage(0);
    setEndStatus(false);
    setRefreshFlag(-refreshFlag);
  }

  const fetchData = async () => {
    try {
      let arr = [];
      let res;
      if(currentTab == 'day'){
        res = await api.get_leaderboard_rank_day({
          user_id: currentAccount?.address,
          page,
          limit
        });
      }else if(currentTab == 'week'){
        res = await api.get_leaderboard_rank_week({
          user_id: currentAccount?.address,
          page,
          limit
        });
      }else if(currentTab == 'total'){
        res = await api.get_leaderboard_rank_total({
          user_id: currentAccount?.address,
          page,
          limit
        });
      }

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


  function Items(){
    if(list.length>0){
      return <>{list.map((item:any, index) => {
        if(item.user){
          return (
            <div className="item" key={index} onClick={() => {onShowUser(item.user)}}>
              <div className={["num", "num"+(index+1)].join(" ")}>{index + 1}</div>
              <div className="user">
                {/* <img className="avatar" src={`/images/avatar${item.user.avatar}.png`}></img> */}
                <div className="avatar" style={item.user.avatar ? {backgroundImage: `url(/images/avatar${item.user.avatar}.png)`} : {}}></div>
                <div className="name txt-wrap">{item.user?.user_id?.slice(-6)}</div>
              </div>
              <div className="points">{formatNumber(item.coins)}</div>
            </div>
          )
        }else{
          return ''
        }
        
      })}
      </>
    }else if(isEnd){
      return <div className="no-data">No data</div>;
    }
  }

  function Content(){
    return <>
      <div className="head">
        <div className="head-left">
          LEADERBOARD
          <div className="tip-btn" onClick={tip}></div>
        </div>
        <div className="head-right">
          <Dropdown overlayClassName={["leaderboard-munu-list", "leaderboard-munu-list-"+props.from].join(" ")} menu={{ items: menuItems }} placement="bottom" arrow>
            <div className={["current-tab", "current-tab-"+props.from].join(" ")}>{currentTab.slice(0, 1).toUpperCase()}{currentTab.slice(1)}</div>
          </Dropdown>
          {/* <div className="tabs">
            <div className={['tab-item', currentTab == 'day' ? 'active' : ''].join(' ')} onClick={() => {changeTab('day')}}>Day</div>
            <div className={['tab-item', currentTab == 'week' ? 'active' : ''].join(' ')}  onClick={() => {changeTab('week')}}>Week</div>
          </div> */}
          <div className="refresh-btn" onClick={refresh}></div>
        </div>
      </div>
      

      <div className="list">
        <div className="list-head">
          <div>Tegens</div>
          <div>Total</div>
        </div>
        {props.from == 'page' ? (<Items/>) : (<InfiniteScroll
          height = {props.from == 'page' ? 'none' : '24rem'}
          dataLength={list.length}
          next={fetchData}
          hasMore={!isEnd}
          loader={<div className="scroll-loading">
            <div className="icon"></div>
            Loading...
          </div>}
          endMessage={list.length>limit && <p className="no-more">No more</p>}
        >
          <Items/>
        </InfiniteScroll>)}

        {self && <div className="self" onClick={() => {onShowUser(self)}}>
          <div className="num">{self.position || '99+'}</div>
          <div className="user">
            {/* <img className="avatar" src={`/images/avatar${self.avatar}.png`}></img> */}
            <div className="avatar" style={self.avatar ? {backgroundImage: `url(/images/avatar${self.avatar}.png)`} : {}}></div>

            <div className="name txt-wrap">{self.user_id?.slice(-6)}</div>
          </div>
          <div className="points">{formatNumber(self.coins)}</div>
        </div>}
      </div>
    </>
  }

  if(props.from == 'page'){
    return <div className="leaderboard-page-content">
      <InfiniteScroll
      height = '99vh'
      dataLength={list.length}
      next={fetchData}
      hasMore={!isEnd}
      loader={<div className="scroll-loading">
        <div className="icon"></div>
        Loading...
      </div>}
      endMessage={list.length>limit && <p className="no-more">No more</p>}
    >
      <div className="leaderboard-page-banner"></div>
      <div className={["leaderboard", props.from].join(" ")} id="leaderboard" onClick={onClick}>
        <Content/>
      </div>
    </InfiniteScroll>
    </div>
  }else{
    return <div className={["leaderboard", props.from].join(" ")} id="leaderboard" onClick={onClick}>
      <Content/>
    </div>
  }
  

 
};

export default LeaderboardContent;
