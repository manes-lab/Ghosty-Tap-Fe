import { ConnectModal, useCurrentAccount, useConnectWallet, useSignPersonalMessage  } from '@mysten/dapp-kit';
import { verifyPersonalMessageSignature, verifySignature, verifyTransactionSignature, publicKeyFromRawBytes, publicKeyFromSuiBytes } from '@mysten/sui/verify';


import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom'

import { toggleConnectModal, show, close, updateModule, updateNewInvitation, updateAddress } from '../redux/slice';
import { initUser } from '../utils/init.ts';
import * as Pomelo from '../utils/pomelo';
import { isMobile } from '../utils/util.ts';
import api from '../axios';
import axios from 'axios';
import BattleSettings from "../components/battle/battleSettingsModule";
import BattleInvitation from "../components/battle/battleInvitationModule";
import RejectBattleModule from "../components/battle/rejectBattleModule";
import InviteSuccessModule from '../components/inviteSuccessModule';

import largeBtn1 from '../assets/images/common/large-btn-1.png';
import largeBtn2 from '../assets/images/common/large-btn-2.png';
import btn1 from '../assets/images/common/btn-1.png';
import btn2 from '../assets/images/common/btn-2.png';
import greenBtn1 from '../assets/images/common/green-btn-1.png';
import greenBtn2 from '../assets/images/common/green-btn-2.png';
import smallWhiteBtn1 from '../assets/images/common/small-white-btn-1.png';
import smallWhiteBtn2 from '../assets/images/common/small-white-btn-2.png';
import smallGreenBtn1 from '../assets/images/common/small-green-btn-1.png';
import smallGreenBtn2 from '../assets/images/common/small-green-btn-2.png';
 
interface  propsType{
    children: React.ReactNode  
}
 
export const MainLayout : React.FC<propsType> = (props) => {
    const currentAccount = useCurrentAccount();
    const signPersonalMessage = useSignPersonalMessage();
    // const connectWalletMutation = useConnectWallet();
    const { mutate: connectWallet } = useConnectWallet({
        onSuccess: (result) => {
            dispatch(toggleConnectModal(null));
        },
        onError: (err) => {
            console.error('connect error:', err);
        },
    });

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()
    const state = useSelector((state:any) => state.moduleSlice);


    const [showInviteSuccess, setInviteSuccessStatus] = useState(false);
    const [inviteRewards, setInviteRewards] = useState(0);
    const [inviteUserInfo, setInviteUserInfo] = useState({});

    const tokenMap:any = {
        'Bitcoin': 'btc',
        'Ethererum': 'eth',
        'Ton': 'ton'
    };

    useEffect(() => {
        (async () => {
            if (!currentAccount?.address) {
                return
            }
            Pomelo.addListener("acceptBattle", (msg: any) => {
                dispatch(updateModule({
                    module: "battleSettings", 
                    show: false,
                    args: null
                }))
                navigate('/battle', { 
                    state: {
                        mode: "battle", 
                        token: tokenMap[msg.trading_pair],
                        options : msg
                    },
                    replace: true
                })
            })

            Pomelo.addListener("declineBattle", (msg: any) => {
                dispatch(updateModule({
                    module: "rejectBattle", 
                    show: true,
                    args: msg
                }))
            })

            Pomelo.addListener("inviteBattle", async (msg: any) => {
                if(/\/battle|\/adventure/.test(window.location.href)){
                    dispatch(updateNewInvitation(true))
                }else{
                    dispatch(updateModule({
                        module: "battleInvitation", 
                        show: true,
                        args: {
                            // ...info.data,
                            invite_id: msg.invite_id,
                            type: 'push'
                        }
                    }))
                }
                
                
            })

            // if(WebApp?.initDataUnsafe?.start_param){
            //     const start_param = WebApp?.initDataUnsafe?.start_param;
            //     const inviteCode = start_param.split("_")[0];

            //     const params:any = {};
            //     const paramsArr = start_param.split("_").slice(1);
            //     paramsArr.forEach(item => {
            //         if(item.startsWith("t=")){
            //             params['user'] = item.slice(2);
            //         }else if(item.startsWith("i=")){
            //             params['invitation_id'] = item.slice(2);
            //         }
            //     })

            //     await initInviteInfo(WebApp?.initDataUnsafe?.start_param);
            //     register();
            //     params.invitation_id && (await getUserIdByCode(inviteCode) != currentAccount?.address) && dispatch(updateModule({
            //         module: "battleInvitation", 
            //         show: true,
            //         args: {
            //             invite_id: params.invitation_id,
            //         }
            //     }))
            //     params.user && toProfile(params.user)
            // }

            if (location.pathname != "/") {
                navigate("/")
            }
        })()
        return () => {
            Pomelo.leaveSquare(currentAccount?.address || '')
        }
    },[])


    useEffect(() => {
        
        const account = currentAccount?.address || "";
        dispatch(updateAddress(account));

        let token = localStorage.getItem("ghosty-tap-"+account) || "";

        if(account && !token){
            (async () => {
                const message = `Sign in with Sui Wallet`;
                const signedResult = await signPersonalMessage.mutateAsync({
                    message: new TextEncoder().encode(message),
                });
                const isValid = await verifyPersonalMessageSignature(new TextEncoder().encode(message), signedResult.signature, {
                    address:  account
                });

                const res = await api.get_user_token({
                    address: account,
                    signature: signedResult.signature,
                    message: message,
                    publicKey:isValid
                })
                if(res?.success){
                    token = res.data?.token || ''
                    localStorage.setItem("ghosty-tap-"+account, token);
                }
            })()
        }

        initUser(account, token);
    },[currentAccount])




    const initInviteInfo = async (code:string) => {
        const res = await api.be_invited({
          user_id: currentAccount?.address,
          code
        });
        if(res.success && res.data.invite_user?.user_id != currentAccount?.address){
          setInviteRewards(res.data.be_invite_coins);
          setInviteUserInfo(res.data.invite_user);
          setInviteSuccessStatus(true);
        }
    }

    const register = async () => {
        const res = await api.register({
          user_id: currentAccount?.address,
        });
        if(res.success){
        }
      }

    const getUserIdByCode = async (code: string) => {
        const res = await api.get_user_info_by_code({
            code
        });
        if(res.success){
            return res.data.user_id;
        }
        return '';
    }


    const toProfile = async (code: string) => {
        const userId = await getUserIdByCode(code);
        userId && navigate(`/user/${userId}`)
    }

    const closeModule = (module: string) => {
        dispatch(updateModule({
            module, 
            show: false,
            args: null
        }))
    }


    return (
        <div className={['ghosty-page', isMobile() ? 'mobile-ghosty-page' : ''].join(" ")} id="ghosty-page">
            <div>
                {props.children}
            </div>
            {state.battleSettings.show &&  <BattleSettings props={{data: state.battleSettings.data}} onClose={() => {closeModule('battleSettings')}}/>}

            {state.battleInvitation.show &&  <BattleInvitation props={{data: state.battleInvitation.data}} onClose={() => {closeModule('battleInvitation')}}/>}

            {state.rejectBattle.show &&  <RejectBattleModule props={{data: state.rejectBattle.data}} onClose={() => {closeModule('rejectBattle')}}/>}

            {showInviteSuccess && <InviteSuccessModule props={{rewards:inviteRewards, inviteUserInfo}} onClose={() => {setInviteSuccessStatus(false);}}/>}

            <div className="img-loader">
                <img src={largeBtn1}/>
                <img src={largeBtn2}/>
                <img src={btn1}/>
                <img src={btn2}/>
                <img src={greenBtn1}/>
                <img src={greenBtn2}/>
                <img src={smallGreenBtn1}/>
                <img src={smallGreenBtn2}/>
                <img src={smallWhiteBtn1}/>
                <img src={smallWhiteBtn2}/>
            </div>
            <ConnectModal
                open={state.showConnectModal}
                onOpenChange={() => {dispatch(toggleConnectModal(null));}}
                trigger={null} 
            />
        </div>
    )
}