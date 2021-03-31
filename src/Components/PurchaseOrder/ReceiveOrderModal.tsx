
import React, { useState, useEffect, useReducer } from 'react';
import { receiveOrder } from '../../Actions/PurchaseOrderAction';
import { connect, useDispatch, useSelector } from 'react-redux';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Layout from '../../Layouts/Layout';
import { success, error } from '../../Utils/Toaster';
import { AppState } from '../../Store';
import { FormInput, FormSingleSelect } from '../CommonComponents';
import { Modal, Col, Button, Form, Spinner, Card, Accordion, Table } from 'react-bootstrap';
import { CustomLoader } from '../CommonComponents/CustomLoader';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';


export interface ReceiveOrderModalProps {
  show: boolean;
  onAdd: (data: any) => void;
  onHide: () => void;
  data: any;
  clinic_id: number;
}
export interface OrderModel {
  received_status?: string;
  invoice_number?: string;
  batch_id?: string;
  units?: number | string;
  actual_units?: number | string;
  expiry_date?: any;
  damage_units?: number | string;
  mark_as_reason?: string | null;
  purchase_order_id?: string |number;
  purchase_order_item_id?: string |number;
  product_id?: string |number;
  clinic_id?: string | number;
  actual_unit_received?: string | number;
}
const ReceiveOrderModal: React.FC<ReceiveOrderModalProps> = (props): JSX.Element => {
  const dispatch = useDispatch();
  const today = new Date();//moment().format('YYYY-MM-DD');
  const initialState = (): OrderModel => {
    return {
      received_status: 'received',
      invoice_number: '',
      batch_id: '',
      units: '',
      actual_units: '',
      expiry_date: today,
      damage_units: '',
      mark_as_reason: null,
      purchase_order_id: '',
      purchase_order_item_id: '',
      product_id: '',
      clinic_id: '',
      actual_unit_received: ''
    }
  }
  const [payload, setPayload] = useState(initialState());
  const [formErrors, setFormErrors] = useState<any>({});
  const [canSubmitForm, setCanSubmitForm] = useState<boolean>(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState<boolean>(false);
  const [data, setData] = useState<any>({});
  const response: any = useSelector((state: AppState) => state.PurchaseOrderReducer);

  const [purchaseOrderId, setPurchaseOrderId] = useState<number>(0);
  const [purchaseOrderItemId, setPurchaseOrderItemId] = useState<number>(0);
  const [productId, setProductId] = useState<number>(0);
  const [clinicId, setClinicId] = useState<number>(0);
  
  const handleSubmit = (e: any): void => {
    e.preventDefault();
    let err: any = validate(payload);
    setFormErrors(err.errors);
    setCanSubmitForm(err.canSubmitForm);
  }
  useEffect((): any => {
    if (response && response.payload && response.payload.status == 200) {
      if (response.action == "RECEIVE_ORDER") {
         setFormSubmitLoader(false);
         success('Order Received Successfully');
         props.onHide();
         props.onAdd(response);
      }
    }
    if (response && response.payload && response.payload.isAxiosError) {
      setFormSubmitLoader(false);
      if (response.payload.response && response.payload.response.data.status != 200) {
        console.log(response.payload.response.data.message)
        error(response.payload.response.data.message);
        return;
      }
    }
  }, [response]);

  useEffect((): void => {
    if (props.data !== undefined) {
      setData(props.data);
      let {id, purchase_order_id, product_id} = props.data;
       setPurchaseOrderId(purchase_order_id);
       setPurchaseOrderItemId(id);
       setProductId(product_id);
       setClinicId(props.clinic_id);
    }
  }, [props.data]);

  const handleChange = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.currentTarget;
    setPayload((payload: OrderModel) => ({ ...payload, [name]: value }));
  }
  const validate = (values: OrderModel) => {
    let errors: any = {};
    
    if (!values.received_status && payload.received_status && payload.received_status === 'received' ) {
      errors.received_status = "Please select one option as receive type";
    }

    if (!values.invoice_number && payload.received_status && payload.received_status === 'received' ) {
      errors.invoice_number = "Please enter invoice number";
    }
    if (!values.batch_id && payload.received_status && payload.received_status === 'received' ) {
      errors.batch_id = "Please enter batch";
    }

    if (!values.units && payload.received_status && payload.received_status === 'received' ) {
      errors.units = "Please enter quantity received";
    }
    if (!values.actual_units && payload.received_status && payload.received_status === 'received' ) {
      errors.actual_units = "Please enter units received";
    }

    if (!values.expiry_date && payload.received_status && payload.received_status === 'received' ) {
      errors.expiry_date = "Please select expiration date";
    }

    if (!values.damage_units && payload.received_status && payload.received_status === 'markas' ) {
      errors.damage_units = "Please enter damaged quantity";
    }

    if (!values.mark_as_reason && payload.received_status && payload.received_status === 'markas' ) {
      errors.mark_as_reason = "Please select reason";
    }

    return {
      errors: errors,
      canSubmitForm: Object.keys(errors).length === 0 ? true : false
    };
  }

  useEffect((): void => {
    if (canSubmitForm == true) {
      setFormSubmitLoader(true);
      let formData = {...payload};
      formData.purchase_order_id = purchaseOrderId;
      formData.purchase_order_item_id = purchaseOrderItemId;
      formData.product_id = productId;
      formData.expiry_date = moment(payload.expiry_date).format('YYYY-MM-DD');
      formData.clinic_id = clinicId;
      formData.actual_unit_received = formData.actual_units;
      dispatch(receiveOrder(formData));
      setCanSubmitForm(false);
    }
  }, [canSubmitForm]);

  const handleDate = (date: any) => {
    setPayload((payload: OrderModel) => ({ ...payload, 'expiry_date': date }));
  }

  useEffect((): void => {
    if (props.show == false) {
      setFormErrors({});
      setPayload(initialState());
    }
  }, [props.show]);
  return (

    <React.Fragment>


      <Modal show={props.show} size="lg" aria-labelledby="contained-modal-title-vcenter" animation={false}>
   
        <form onSubmit={handleSubmit}>
          <Modal.Header >
            <Modal.Title id="contained-modal-title-vcenter">
              Receive {data.products && data.products.product_name}
              </Modal.Title>
          </Modal.Header>
          <Modal.Body className="show-grid">
            <div className="row">
              <div className="col col-md-12">
                {/* <CustomLoader loading={formSubmitLoader} /> */}
              </div>

            </div>
         

            <div className="row">
              <div className="col">
                <div className="form-check form-check-inline">
                  <input onChange={handleChange} checked={ (payload.received_status && payload.received_status === 'received') ? true : false } className="form-check-input" type="radio" name="received_status" id="inlineRadio1" value="received" />
                  <label className="form-check-label" >Receive</label>
                </div>

                <div className="form-check form-check-inline">
                  <input onChange={handleChange} checked={ (payload.received_status && payload.received_status === 'markas') ? true : false } className="form-check-input" type="radio" name="received_status" id="inlineRadio2" value="markas" />
                  <label className="form-check-label" >Mark as damage
</label>
                </div>
              </div>


            </div>

          {
            (payload.received_status && payload.received_status === 'received') ? 
            
           
            (
              <React.Fragment>
              <div className="row">
              <div className="col">
              {data.products && data.products.product_name}
              </div>

              <div className="col">
                <FormInput error={formErrors && formErrors.invoice_number} label="Invoice number" name="invoice_number" value={payload.invoice_number} onChange={handleChange} type="text" className="form-control" placeholder="Invoice #" />
              </div>
              <div className="col">
                <FormInput error={formErrors && formErrors.batch_id} label="Batch Id"  name="batch_id" value={payload.batch_id} onChange={handleChange} type="text" className="form-control" placeholder="Batch Id" />
              </div>

           
            </div>

            <div className="row">
            <div className="col">
                <FormInput error={formErrors && formErrors.units} label="Quantity Received" name="units" value={payload.units} onChange={handleChange} type="text" className="form-control" placeholder="Quantity Received" />
              </div>

              <div className="col">
                <FormInput error={formErrors && formErrors.actual_units} label="Units Received" name="actual_units" value={payload.actual_units} onChange={handleChange} type="text" className="form-control" placeholder="Units Received" />
              </div>

              <div className="col">
                <label>Expiration Date</label>
              <DatePicker 
 className="form-control" dateFormat="yyyy-MM-dd" selected={payload.expiry_date} onChange={date => handleDate(date)} /> 

{formErrors &&  formErrors.expiry_date && (
        <span className="error">{formErrors.expiry_date}</span>
      )}

              </div>
            </div>
              </React.Fragment>
            )

            : (
              <React.Fragment>
               <div className="row">
              <div className="col">
                <FormInput error={formErrors && formErrors.damage_units} label="Damaged Quantity" name="damage_units" value={payload.damage_units} onChange={handleChange} type="text" className="form-control" placeholder="Damaged Quantity" />
              </div>
              <div className="col">
                <FormSingleSelect error={formErrors && formErrors.mark_as_reason} label="Reason"  onChange={handleChange} name="mark_as_reason" className="form-control" value={payload.mark_as_reason} options={[{key:'damage', value: 'Damage'},{key:'sample', value: 'Sample'},{key:'others', value: 'Others'}]}/>
              </div>

             
            </div> 
              </React.Fragment>

            )
          }
            

          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={props.onHide} type="button">
              Cancel
             </Button>

            <button disabled={(formSubmitLoader) ? true : false} type="submit" className="btn btn-primary" >
              {formSubmitLoader && <Spinner animation="border" size="sm" />}
              {(formSubmitLoader) ? 'Processing' : 'Save'}
            </button>


          </Modal.Footer>
        </form>
      </Modal>
    </React.Fragment>
  );
}

export default ReceiveOrderModal;