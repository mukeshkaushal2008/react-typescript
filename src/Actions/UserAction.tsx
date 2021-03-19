import axios from "axios";
import { Dispatch } from "redux";
import { InterfaceUserData, InterfaceUserResponse, InterfaceUserState } from '../Models/Users';

const apiUrl = `https://test.aestheticrecord.com/backend/api/`;

// Add a request interceptor
axios.interceptors.request.use(
  config => {
    config.headers.common["access-token"] = "a51d615958a0cb4c11c7336ce0809c17";
    config.headers.common["Content-Type"] = "application/json";
    return config;
  },
  error => { }
);

axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    return Promise.reject(error);
  }
);
export const login = (formData: any) => {
  return async (dispatch: Dispatch) => {
    console.log('Hey');
    try {
      const res = await axios.post(`${apiUrl}login`, formData);
      dispatch({ type: "LOGIN", payload: res });
      return res;
    } catch (error) {
      dispatch({ type: "LOGIN", payload: error })
    }
  }
}

export const getUsers = (formData: any) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.get(`${apiUrl}users`, formData);
      dispatch({ type: "LOGIN", payload: res });
      return res;
    } catch (error) {
      dispatch({ type: "LOGIN", payload: error })
    }
  }
}