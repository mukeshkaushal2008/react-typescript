import * as React from 'react';
import { InterfaceUserData, InterfaceUserResponse, InterfaceUserState } from '../Models/Users';

const UserReducer = (state = {}, action: any) => {

  switch (action.type) {
    case 'USER_GET':
      return {
        ...state,
        payload: action.payload,
        action: "USER_GET",
      };

    case 'LOGIN':
      return {
        payload: action.payload,
        action: "LOGIN",
      };
    case 'LOGOUT':
      return {
        payload: action.payload,
        action: "LOGOUT",
      };

    case 'CREATE_USER':
      return {
        payload: action.payload,
        action: "CREATE_USER",
      };
     
    case 'EDIT_USER':
      return {
        payload: action.payload,
        action: "EDIT_USER",
      }; 
      case 'GET_USER_DETAIL':
      return {
        payload: action.payload,
        action: "GET_USER_DETAIL",
      }; 
      
    default:
      return state;
  }
}
export default UserReducer;

