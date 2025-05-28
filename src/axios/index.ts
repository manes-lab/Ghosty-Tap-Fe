import {  post, get } from "./config";
const proxy = {

  register(data: any) {
    return post("user/register", data);
  },
  get_user_status(data: any) {
    return get("user/status", data);
  },
  get_invite_code(data: any) {
    return get("user/getInviteCode", data);
  },
  get_user_info_by_code(data: any) {
    return get("user/getUserForCode", data);
  },


  //home
  get_home_page_data(data: any) {
    return get("rank/day/top3andTotalCoins", data);
  },


  //game
  create_game(data: any) {
    return post("game/adventure/createGame", data)
  },
  get_online_players(data: any) {
    return get("rank/roomRank", data);
  },

  //adventure
  get_adventure_history(data: any) {
    return get("game/adventure/gameHistory", data);
  },

  //battle
  get_battle_bars(data: any) {
    return get("battle/getBars", data);
  },
  get_user_current_status(data: any) {
    return get("squares/userStatus", data);
  },
  get_invitation_for_battle(data: any) {
    return get("squares/getInvitationForBattle", data);
  },
  get_battle_invitation_info(data: any) {
    return get("squares/viewInvitation", data);
  },
  get_battle_result(data: any) {
    return get("battle/settlement", data);
  },
  get_battle_history(data: any) {
    return get("battle/history", data);
  },
  //battle invitation notice
  set_battle_invitation_notice(data: any) {
    return post("setting/setNotice", data)
  },
  get_battle_invitation_notice_settings(data: any) {
    return get("setting/getSetNotice", data)
  },
  block_user_battle_invitation(data: any) {
    return post("squares/setBlock", data)
  },
  create_battle_invitation(data: any) {
    return post("squares/urlInvitationForBattle", data)
  },


  //leaderboard
  get_leaderboard_rank_day(data: any) {
    return get("rank/day", data);
  },
  get_leaderboard_rank_week(data: any) {
    return get("rank/week", data);
  },
  get_leaderboard_rank_total(data: any) {
    return get("rank/total", data);
  },


  //profile
  get_profile_data(data: any) {
    return get("game/gameData/info", data);
  },

  //invite
  be_invited(data: any) {
    return post("invitation/invite", data);
  },
  get_invite_list(data: any) {
    return get("invitation/inviteList", data);
  },

  //mailbox
  get_mail_list(data: any) {
    return get("squares/mailList", data);
  },





  get_user_token(data: any) {
    return post("user/registerOrLogin", data);
  },

  
};

export default proxy;
