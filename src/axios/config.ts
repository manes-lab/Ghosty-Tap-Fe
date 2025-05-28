import axios, { AxiosResponse } from "axios";
import getConfig from '../config';
import store from '../redux/store';

const config = getConfig();

// axios.defaults.crossDomain = true;

axios.defaults.withCredentials = true;

axios.defaults.timeout = 1e3 * 60 * 5; 

export interface Response extends AxiosResponse {
  code: number,
  success: boolean,
  data: any,
}


axios.interceptors.response.use(
  (response) => {
    return Promise.resolve(response.data);
  },
  (error) => {
    console.log("[interceptors] - [response] - error", error);
    if (error.response) {
      const _status = String(error.response.status);
      if (["200", "304", "400"].includes(_status)) {
        // @ts-expect-error TS(2339): Property 'response' does not exist on type 'Promis... Remove this comment to see the full error message
        return Promise.response(error.response);
      }
    }
    return Promise.reject(error);
  }
);


export async function get(method: any, data: any) {
  try {
    return axios.get("/api/v1/" + method, { 
      params: data, 
    }) as Promise<Response>
  } catch (e) {
    return {
      success: false,
      data: null,
      error: e
    }
  }
  
}

export async function post(method: string, data: any) {
  const state = store.getState().moduleSlice;
  console.log(state, '----state------');
  try {
    return axios.post(
      "/api/v1/" + method, 
      {
        ...data,
      },
      {
        headers : { 
          "user-id": state.address,
          "token": localStorage.getItem("ghosty-tap-"+state.address)
        }
      }
    ) as Promise<Response>;
  } catch (e) {
    return {
      success: false,
      data: null,
      error: e
    }
  }
}

