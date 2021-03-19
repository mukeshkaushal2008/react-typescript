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
    default:
      return state;
  }
}
export default UserReducer;

