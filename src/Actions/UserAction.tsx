import axios from "axios";
import { Dispatch } from "redux";
import { InterfaceUserData, InterfaceUserResponse, InterfaceUserState } from '../Models/Users';
import { setToken, getToken } from '../Middlewares/Auth';
import {objectToQuery} from '../Utils/Common';
const apiUrl = `https://test.aestheticrecord.com/backend/api/`;

// Add a request interceptor
axios.interceptors.request.use(
  config => {
    config.headers.common["access-token"] = getToken();
    config.headers.common["Content-Type"] = "application/json";
    return config;
  },
  error => { }
);

axios.interceptors.response.use(
  response => {
    if(response && response.headers && response.headers.access_token) {
      setToken(response.headers.access_token);
    }
    return response.data;
  },
  error => {
    return error;
  }
);
export const login = (formData: any) => {
  return async (dispatch: Dispatch) => {
    
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
      const res = await axios.get(`${apiUrl}clients?${objectToQuery(formData)}&scopes=cardOnFiles,patientInsurence`);
      dispatch({ type: "USER_GET", payload: res });
      return res;
    } catch (error) {
      dispatch({ type: "USER_GET", payload: error })
    }
  }
}
export const logout = () => {
  return async (dispatch: Dispatch) => {
    
    try {
      const res = await axios.get(`${apiUrl}user/logout`);
      dispatch({ type: "LOGOUT", payload: res });
      return res;
    } catch (error) {
      dispatch({ type: "LOGOUT", payload: error })
    }
  }
}

export const createUser = (formData: any) => {
  return async (dispatch: Dispatch) => {
    
    try {
      const res = await axios.post(`${apiUrl}clients`, formData);
      dispatch({ type: "CREATE_USER", payload: res });
      return res;
    } catch (error) {
      dispatch({ type: "CREATE_USER", payload: error })
    }
  }
}
export const editUser = (formData: any, userId:number) => {
  return async (dispatch: Dispatch) => {
    
    try {
      const res = await axios.patch(`${apiUrl}clients/${userId}`, formData);
      dispatch({ type: "EDIT_USER", payload: res });
      return res;
    } catch (error) {
      dispatch({ type: "EDIT_USER", payload: error })
    }
  }
}

export const getUserDetail = (formData: any) => {
  return async (dispatch: Dispatch) => {
    
    try {
      const res = await axios.get(`${apiUrl}clients/${formData}?scopes=cardOnFiles,patientInsurence`);
      dispatch({ type: "GET_USER_DETAIL", payload: res });
      return res;
    } catch (error) {
      dispatch({ type: "GET_USER_DETAIL", payload: error })
    }
  }
}

export const deleteUser = (userId:number) => {
  return async (dispatch: Dispatch) => {
    
    try {
      const res = await axios.delete(`${apiUrl}clients/${userId}`);
      dispatch({ type: "DELETE_USER", payload: res });
      return res;
    } catch (error) {
      dispatch({ type: "DELETE_USER", payload: error })
    }
  }
}