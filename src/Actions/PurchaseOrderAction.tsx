import axios from "axios";
import { Dispatch } from "redux";
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
    return response;
  },
  error => {
    return error;
  }
);
export const getOrderDetail = () => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.get(`${apiUrl}get-purchase-order-details`);
      dispatch({ type: "ORDER_DETAIL", payload: res });
      return res;
    } catch (error) {
      dispatch({ type: "ORDER_DETAIL", payload: error })
    }
  }
}


export const getProductDetail = (term: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.get(`${apiUrl}po/search-product?term=${term}&limit=20`);
      dispatch({ type: "PRODUCT_DETAIL", payload: res });
      return res;
    } catch (error) {
      dispatch({ type: "PRODUCT_DETAIL", payload: error })
    }
  }
}


export const createOrder = (formData: any) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.post(`${apiUrl}add-edit-purchase-order`, formData);
      dispatch({ type: "CREATE_ORDER", payload: res });
      return res;
    } catch (error) {
      dispatch({ type: "CREATE_ORDER", payload: error })
    }
  }
}


export const getClinics = (formData: number) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.get(`${apiUrl}get-supplier-clinics?supplier_id=${formData}`);
      dispatch({ type: "CLINICS_GET", payload: res });
      return res;
    } catch (error) {
      dispatch({ type: "CLINICS_GET", payload: error })
    }
  }
}

export const createSupplier = (formData: any) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.post(`${apiUrl}add-edit-supplier`, formData);
      dispatch({ type: "CREATE_SUPPLIER", payload: res });
      return res;
    } catch (error) {
      dispatch({ type: "CREATE_SUPPLIER", payload: error })
    }
  }
}



export const getOrders = (formData: any) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.get(`${apiUrl}purchase-orders?${objectToQuery(formData)}`);
      dispatch({ type: "GET_ORDERS", payload: res });
      return res;
    } catch (error) {
      dispatch({ type: "GET_ORDERS", payload: error })
    }
  }
}

export const getDetail = (formData: any) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.get(`${apiUrl}get-purchase-order-details/${formData}`);
      dispatch({ type: "GET_ORDER_DETAIL", payload: res });
      return res;
    } catch (error) {
      dispatch({ type: "GET_ORDER_DETAIL", payload: error })
    }
  }
}


export const receiveOrder = (formData: any) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axios.post(`${apiUrl}add-received-items`, formData);
      dispatch({ type: "RECEIVE_ORDER", payload: res });
      return res;
    } catch (error) {
      dispatch({ type: "RECEIVE_ORDER", payload: error })
    }
  }
}
