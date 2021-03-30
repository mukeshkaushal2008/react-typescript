const PurchaseOrderReducer = (state = {}, action: any) => {

  switch (action.type) {
    case 'ORDER_DETAIL':
      return {
        ...state,
        payload: action.payload,
        action: "ORDER_DETAIL",
      };
    case 'GET_ORDER_DETAIL':

      return {
        ...state,
        payload: action.payload,
        action: "GET_ORDER_DETAIL",
      };

    case 'PRODUCT_DETAIL':
      return {
        ...state,
        payload: action.payload,
        action: "PRODUCT_DETAIL",
      };
    case 'CREATE_ORDER':
      return {
        ...state,
        payload: action.payload,
        action: "CREATE_ORDER",
      };
    case 'CLINICS_GET':
      return {
        ...state,
        payload: action.payload,
        action: "CLINICS_GET",
      };

    case 'CREATE_SUPPLIER':
      return {
        ...state,
        payload: action.payload,
        action: "CREATE_SUPPLIER",
      };

    case 'GET_ORDERS':
      return {
        ...state,
        payload: action.payload,
        action: "GET_ORDERS",
      };

    default:
      return state;
  }
}
export default PurchaseOrderReducer;

