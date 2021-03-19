import  UserReducer from './UserReducer'
import  PurchaseOrderReducer from './PurchaseOrderReducer'

import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";


export default  combineReducers({
  UserReducer,
  PurchaseOrderReducer,
  routing: routerReducer
});

