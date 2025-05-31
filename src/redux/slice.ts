import { createSlice } from '@reduxjs/toolkit';
import BattleSettings from '../components/battle/battleSettingsModule';
import BattleInvitation from '../components/battle/battleInvitationModule';
import RejectBattle from '../components/battle/rejectBattleModule';

// 定义初始状态
const initialState = {
  showConnectModal: false,
  address: "",
  token: "",
  profile: {},
  curModule: '',
  moduleData: null,
  battleSettings: {
    show: false,
    data: null,
  },
  battleInvitation: {
    show: false,
    data: null,
  },
  rejectBattle: {
    show: false,
    data: null,
  },
  hasNewInvitation: false,
};

// 创建切片
const slice = createSlice({
  name: 'module',
  initialState,
  reducers: {
    toggleConnectModal: (state, action) => {
      state.showConnectModal = !state.showConnectModal;
    },
    updateAddress: (state, action) => {
      state.address = action.payload;
    },

    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateModule: (state, action) => {
      const data =  action.payload;
      state[data.module]['show'] = data.show;
      state[data.module]['data'] = data.args;
      // {
      //   show: data.show,
      //   data: data.args
      // }
    },
    show: (state, action) => {
        state.curModule = action.payload.module;
        state.moduleData = action.payload.args;
    },
    close: (state) => {
        state.curModule = '';
        state.moduleData = null;
    },
    updateNewInvitation: (state, action) => {
      state.hasNewInvitation = action.payload;
    },

    
  },
});

// 导出操作创建函数
export const { toggleConnectModal, updateAddress, setProfile, updateModule, show, close, updateNewInvitation } = slice.actions;

// 导出 reducer 函数
export default slice.reducer;
