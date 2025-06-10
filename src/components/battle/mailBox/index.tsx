import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import './style.scss';
import api from '../../../axios/index';
import { formatNumber, formatDate } from '../../../utils/util';
import { show, close, updateModule } from '../../../redux/slice';

import InfiniteScroll from 'react-infinite-scroll-component';

const MailBox: React.FC<{
  props: any,
  onClose: () => void,
  onShowUser: (user:any) => void,
}> = ({ props, onClose,  onShowUser }) => {
  const currentAccount = useCurrentAccount();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState('Inbox');
  const [list, setList] = useState([]);
  const [page, setPage] = useState(0); 
  const [isEnd, setEndStatus] = useState(false); 
  const limit = 20;
  const [hasNewMail, setNewMailStatus] = useState(false);

  const mailStatusMap:any = {
    Accept: 'Battled',
    Decline: 'Declined',
    View: 'Waiting',
    Expired: 'Expired'
    // <>Battled Walting Declined View</>
  }

  const [canClose, setCanClose] = useState(false);
  useEffect(() => {
    fetchData();
    const timer = setTimeout(() => setCanClose(true), 600); 
    return () => clearTimeout(timer);
  },[])

  useEffect(() => {
    (async () => {
      await fetchData();
    })();
  },[currentTab])


  const fetchData = async () => {
    try {
      let arr = [];
      const res = await api.get_mail_list({
        user_id: currentAccount?.address,
        page,
        limit,
        type: currentTab
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

  const changeTab = async (tab:string) => {
    setNewMailStatus(false);
    setList([]);
    setPage(0);
    setEndStatus(false);
    setCurrentTab(tab)
  }

  const viewBattle = (id:string) => {
    dispatch(updateModule({
      module: "battleInvitation", 
      show: true,
      args: {
        invite_id: id,
      }
    }))
    // onClose()
  }

  const onClick = (event:any) => {
    event.stopPropagation();
  }

  const close = () => {
    if (!canClose) return; 

    document.getElementById('mail-box-mask')?.classList.add('hide');
    document.getElementById('mail-box-module')?.classList.add('hide');
    setTimeout(()=>{
      onClose()
    }, 600)
  }


  function List(){
    if(list.length>0){
      return <>{list.map((item:any, index) => {
        return (
          <div className="item" key={index}>
            <div className="user" onClick={() => {onShowUser(item.send_user)}}>
              <div className="avatar" style={{backgroundImage: `url(/img/avatar${item.send_user?.avatar || 1}.png)`}}></div>
              <div className="name txt-wrap">{item.send_user?.user_id?.slice(-6)}</div>
            </div>
            <div className="date">{formatDate(item.create_at).date} {formatDate(item.create_at).time}</div>
            <div className="status">
              {
              (item.status == 'View' &&  currentTab == 'Inbox')? 
                <div className="view-btn" onClick={() => {viewBattle(item.invite_id)}}>View</div> 
                : 
                <>{mailStatusMap[item.status]}</>
                // <>Battled Walting Declined View</>
              }
            </div> 
          </div>
        )
      })}
      </>
    }else if(isEnd){
      return <div className="no-data">No data</div>;
    }
  }

  return <div className={["mask mail-box-mask", props.stage+'-mail-box-mask'].join(" ")} id="mail-box-mask" onClick={close}>
    <div className={["mail-box-module", props.from].join(" ")} id="mail-box-module" onClick={onClick}>
      <div className="head">
        Mailbox
        <div className="head-right">
          <div className={['tab-item inbox', currentTab == 'Inbox' ? 'active' : ''].join(' ')} onClick={() => {changeTab('Inbox')}}>Inbox</div>
          <div className={['tab-item sent', currentTab == 'Sent' ? 'active' : ''].join(' ')}  onClick={() => {changeTab('Sent')}}>Sent</div>
        </div>
      </div>

      <div className="list">
        <InfiniteScroll
          height={'40rem'}
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

export default MailBox;
