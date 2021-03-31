import React, { useEffect, useState } from 'react';
import { getDetail } from '../../Actions/PurchaseOrderAction';
import Layout from '../../Layouts/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../Store';
import { success, error } from '../../Utils/Toaster';
import { useHistory, useParams } from 'react-router-dom'
import { NoRecordFound } from '../CommonComponents/NoRecordFound';
import { CustomLoader } from '../CommonComponents/CustomLoader';
import ReceiveOrderModal from '../PurchaseOrder/ReceiveOrderModal';
const PurchaseOrderDetail: React.FC = (props): JSX.Element => {
  let params: any = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const response: any = useSelector((state: AppState) => state.PurchaseOrderReducer);
  const [loading, setLoading] = useState<boolean>(false);
  const [orderDetail, setOrderDetail] = useState<any>({});
  const [clinicOrderDetail, setClinicOrderDetail] = useState<any>({});
  const [receiveOrderModalShow, setReceiveOrderModalShow] = useState<boolean>(false);
  const [receiveOrderData, setReceiveOrderData] = useState<any>({});
  const [clinicId, setClinicId] = useState<number>(0);

  useEffect((): void => {
    setLoading(true);
    dispatch(getDetail(params.id));
  }, []);

  // Set Pagination Data
  useEffect((): void => {

    if (response && response.payload && response.payload.status == 200) {
      if (response.action == "GET_ORDER_DETAIL") {
        let { PurchaseOrders, ReceivedPurchaseOrders } = response.payload.data;
        setOrderDetail(PurchaseOrders);
        setClinicOrderDetail(ReceivedPurchaseOrders);
        setLoading(false);
      }
    }
    if (response && response.payload && response.payload.isAxiosError) {
      setLoading(false);
      if (response.payload.response && response.payload.response.data.status != 200) {
        error(response.payload.response.data.message);
      }
    }
  }, [response]);

  const setModalData = (data: any, clinic_id: number) => {
    setReceiveOrderData(data);
    setReceiveOrderModalShow(true);
    setClinicId(clinic_id);
  }

  const onAdd = (response: any) => {
    let { PurchaseOrders, ReceivedPurchaseOrders } = response.payload.data;
    setOrderDetail(PurchaseOrders);
    setClinicOrderDetail(ReceivedPurchaseOrders);
  }
  return (<Layout>
    <ReceiveOrderModal onAdd={onAdd} clinic_id={clinicId} data={receiveOrderData} show={receiveOrderModalShow} onHide={() => setReceiveOrderModalShow(false)} />
    <div className="container float-left">


      <div className="setting-setion mb-3">

        <div className="form-group col-md-12">
          <h6 className="text-left">Purchase Order  PO#{orderDetail.po_number}</h6>
          <button type="button" className="btn btn-success btn-sm text-right" onClick={() => history.push('/orders')}>Back</button>
        </div>

      </div>
      <div className="setting-setion">

        <div className="row">
          <div className="col col-md-12">
            Order Info for {(orderDetail.clinic && orderDetail.clinic !== undefined) ? orderDetail.clinic.clinic_name : ''} Placed by {(orderDetail.order_placed_by && orderDetail.order_placed_by !== undefined) ? orderDetail.order_placed_by.full_name : ''} on {(orderDetail.placed_on && orderDetail.placed_on !== undefined) ? orderDetail.placed_on : ''}
          </div>
        </div>

        <table className="table table-striped table-borderless">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Qty</th>
              <th scope="col">Received</th>
              <th scope="col">Damaged</th>
              <th scope="col">Pending</th>
              <th scope="col"> Price per qty</th>
              <th scope="col"> Tax%</th>
              <th scope="col">Total</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <CustomLoader type="table" loading={loading} span={9} />

            {(orderDetail.purchase_order_items && orderDetail.purchase_order_items.length > 0) ? (
              orderDetail.purchase_order_items.map((val: any, key: number) => (
                <tr key={key}>
                  <td scope="row" style={{ wordBreak: 'break-word' }}>{(val.products && val.products !== undefined) ? val.products.product_name : ''}</td>
                  <td>{(val.units && val.units !== undefined) ? val.units : '0'}</td>
                  <td>{(val.units_receivied && val.units_receivied !== undefined) ? val.units_receivied : '0'}</td>
                  <td>{(val.damage_units && val.damage_units !== undefined) ? val.damage_units : '0'}</td>
                  <td>{(val.units_receivied && val.units_receivied !== undefined) ? (val.units - val.units_receivied) : '0'}</td>
                  <td>{(val.price_per_unit && val.price_per_unit !== undefined) ? val.price_per_unit : '0'}</td>
                  <td>{(val.tax_percentage && val.tax_percentage !== undefined) ? val.tax_percentage : '0'}</td>
                  <td>{(val.total && val.total !== undefined) ? val.total : ''}</td>
                  <td className="text-right">

                    {(val.receiving_status && val.receiving_status == "full") ? 'Received' : (
                      <>
                        <button onClick={() => setModalData(val, orderDetail.clinic_id)} type="button" className="btn btn-primary btn-sm mb-3" >
                          Receive
                   </button>

                        <button type="button" className="btn btn-danger btn-sm" >
                          Edit
                   </button>
                      </>
                    )}
                  </td>
                </tr>
              ))

            ) : !loading && <NoRecordFound colspan={9} />
            }

          </tbody>
        </table>

        <div className="row">
          <div className="col-md-8 text-left">


            <p><strong>Supplier Name: {(orderDetail.supplier && orderDetail.supplier !== undefined) ? orderDetail.supplier.supplier_name : ''}</strong></p>
            <p><strong>Sold-To Account Number: {(orderDetail.supplier && orderDetail.supplier.account_number !== undefined) ? orderDetail.supplier.account_number.address : ''}</strong></p>
            <p><strong>Supplier Address: {(orderDetail.supplier && orderDetail.supplier !== undefined) ? orderDetail.supplier.address_1 : ''}</strong></p>
            <p><strong>Clinic Address: {(orderDetail.clinic && orderDetail.clinic !== undefined) ? orderDetail.clinic.address : ''}</strong></p>
            <p><strong>Medical Director: {(orderDetail.md_name && orderDetail.md_name !== undefined) ? orderDetail.md_name : ''}</strong></p>
            <p><strong>Last 4 Digits Of CC: {(orderDetail.last_4_digits_of_cc && orderDetail.last_4_digits_of_cc !== undefined) ? orderDetail.last_4_digits_of_cc : ''}</strong></p>


          </div>

          <div className="col-md-4 text-right">
            <p><strong>Total Qty: {(orderDetail.supplier && orderDetail.supplier !== undefined) ? orderDetail.supplier.supplier_name : ''}</strong></p>
            <p><strong>Sub Total: {(orderDetail.subtotal && orderDetail.subtotal !== undefined) ? orderDetail.subtotal : ''}</strong></p>

            <p><strong>Total Tax : {(orderDetail.tax && orderDetail.tax !== undefined) ? orderDetail.tax : ''}</strong></p>
            <p><strong>Grand Total: {(orderDetail.total && orderDetail.total !== undefined) ? orderDetail.total : '0'}</strong></p>

          </div>
        </div>

      </div>

      <div className="setting-setion">

        <div className="row">
          <div className="col col-md-12">
            Received in {(orderDetail.clinic && orderDetail.clinic !== undefined) ? orderDetail.clinic.clinic_name : ''}
          </div>
        </div>

        <table className="table table-borderless">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Invoice#</th>
              <th scope="col">Batch#</th>
              <th scope="col">Quantity</th>
              <th scope="col">Units</th>
              <th scope="col">Damaged</th>
              <th scope="col">Expiry</th>
              <th scope="col">Date & Time of receiving</th>
              <th scope="col">Received By</th>
            </tr>
          </thead>
          <tbody>
            <CustomLoader type="table" loading={loading} span={9} />
            {(clinicOrderDetail && clinicOrderDetail.length > 0) ? (
              clinicOrderDetail.map((val: any, key: number) => (
                <tr key={key}>
                  <td scope="row">{(val.products && val.products !== undefined) ? val.products.product_name : '-'}</td>
                  <td>{(val.invoice_number && val.invoice_number !== undefined) ? val.invoice_number : '-'}</td>
                  <td>{(val.batch_id && val.batch_id !== undefined) ? val.batch_id : '-'}</td>
                  <td>{(val.units && val.units !== undefined) ? val.units : '0'}</td>
                  <td>{(val.actual_unit_received && val.actual_unit_received !== undefined) ? val.actual_unit_received : ''}</td>
                  <td>{(val.damage_units && val.damage_units !== undefined) ? val.damage_units : '0'}</td>
                  <td>{(val.expiry_date && val.expiry_date !== undefined) ? val.expiry_date : '-'}</td>
                  <td>{(val.receivied_on && val.receivied_on !== undefined) ? val.receivied_on : '-'}</td>
                  <td>{(val.users && val.users !== undefined) ? val.users.full_name : ''}</td>
                </tr>
              ))
            ) : !loading && <NoRecordFound colspan={9} />
            }

          </tbody>
        </table>
      </div>
    </div>
  </Layout>);
}

export default PurchaseOrderDetail;