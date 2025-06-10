import * as Pomelo from './pomelo';
import api from '../axios';
// import { useDispatch } from 'react-redux';
import store from '../redux/store';
import { setProfile } from '../redux/slice';
import { registerSW  } from './register-service-worker'


export async function init() {
    registerSW()
}


export async function initUser(account:string, token:string) {
    if (account && token) {
        const res = await Pomelo.enterSquare({
            user_id: account,
            token
        });
        console.log(res, account , token, '----enterSquare----');

        // api.get_user_status({
        //     user_id: account,
        // }).then((res) => {
        //     if(res?.data){
        //         store.dispatch(setProfile(res.data))
        //     }
        // })
    } 
}
