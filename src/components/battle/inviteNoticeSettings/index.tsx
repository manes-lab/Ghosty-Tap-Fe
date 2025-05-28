import React, { useState, useEffect, useRef } from 'react';
import { useCurrentAccount  } from '@mysten/dapp-kit';
import './style.scss';
import api from '../../../axios';

const Settings: React.FC<{
  props: any,
  onClose: () => void,
}> = ({ props, onClose }) => {
  const currentAccount = useCurrentAccount();

  const [advAllowNotice, setAdvAllowNotice] = useState(true);
  const [batAllowNotice, setBatAllowNotice] = useState(true);

  let isInit = true;
  useEffect(() => {
    if(isInit){
      isInit = false;
      api.get_battle_invitation_notice_settings({
        user_id: currentAccount?.address,
      }).then((res:any) => {
        if(res.data){
          setAdvAllowNotice(!res.data.adventure_refuse);
          setBatAllowNotice(!res.data.pk_refuse);
        }
      })
    }
  },[])


  const close = () => {
    document.getElementById('settings-mask')?.classList.add('hide');
    document.getElementById('settings-modsule')?.classList.add('hide');
    onClose()
    // setTimeout(()=>{
    //   onClose()
    // }, 600)
  }

  const save = async () => {
    const res:any = await api.set_battle_invitation_notice({
      adventure_refuse: !advAllowNotice,
      pk_refuse: !batAllowNotice
    });
    if(res.success){
      close();
    }
  }


  return <div className="mask settings-mask" id="settings-mask" onClick={close}>
    <div className="module settings-module" id="settings-module" onClick={(event) => {event.stopPropagation();}}>
      <div className="close-btn" onClick={close}></div>
      <div className="title">Settings</div>
      <div className="module-content">
        <div className="mini-title">Receive battle invitations when playing in the adventure mode</div>
        <div className="btn-group">
          <div className={["btn", advAllowNotice ? 'active': ''].join(' ')} onClick={ () => {setAdvAllowNotice(true)} }>Allow</div>
          <div className={["btn", !advAllowNotice ? 'active': ''].join(' ')} onClick={ () => {setAdvAllowNotice(false)} }>Deny</div>
        </div>

        <div className="mini-title">Receive battle invitations during a battle session</div>
        <div className="btn-group">
          <div className={["btn", batAllowNotice ? 'active': ''].join(' ')} onClick={ () => {setBatAllowNotice(true)} }>Allow</div>
          <div className={["btn", !batAllowNotice ? 'active': ''].join(' ')} onClick={ () => {setBatAllowNotice(false)} }>Deny</div>
        </div>
        <div className="save-btn" onClick={save}>Save</div>
      </div>
    </div>
  </div>
};

export default Settings;
