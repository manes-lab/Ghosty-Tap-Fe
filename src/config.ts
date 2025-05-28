import env from "./env";

export default function getConfig() {
  let e: any = env;
  switch (e) {
    case "mainnet":
      return {
        appId: 'TEGEN_TAP',
        miniAppUrl: "https://t.me/TegenTap_bot/TegenTap",
      };
    case "testnet":
      return {
        appId: 'TEGEN_TAP',
        miniAppUrl: "https://t.me/InFancyAI_referral_bot/infancy_ai_app",
      };
    default:
      throw Error(
        `Unconfigured environment '${env}'. Can be configured in src/config.js.`
      );
  }
}
