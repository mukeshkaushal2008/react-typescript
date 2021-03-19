import axios from "axios";
import { Dispatch } from "redux";
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
