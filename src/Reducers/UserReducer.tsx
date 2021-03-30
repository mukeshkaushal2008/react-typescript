import {getToken} from '../../src/Middlewares/Auth';

const user = getToken();

const initialState = user
  ? { isLoggedIn: true, user,  payload: null  }
  : { isLoggedIn: false, payload: null };


const UserReducer = (state = initialState, action: any) => {

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
        isLoggedIn: true,
      };
    case 'LOGOUT':
      return {
        payload: action.payload,
        action: "LOGOUT",
        isLoggedIn: false,
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

    case 'DELETE_USER':
      return {
        payload: action.payload,
        action: "DELETE_USER",
      };

    default:
      return state;
  }
}
export default UserReducer;

