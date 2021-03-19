import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector, connect } from 'react-redux';
import Layout from '../../Layouts/Layout';
import { getOrderDetail, getProductDetail, createOrder, getClinics } from '../../Actions/PurchaseOrderAction';
import { AppState } from '../../Store';
import { SupplierList, ClinicList, CreatedByList, MdList, RequestPayload, ProductInterface, ProductInfo, CountryList } from '../../Models/PurchaseOrder';
import AddSupplierModal from './AddSupplierModal';
import { Spinner, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { success, error } from '../../Utils/Toaster';

const AddPurchaseOrder: React.FC = (): JSX.Element => {
  const payloadState = (): any => {
    return {
      supplier_id: '',
      clinic_id: '',
      order_placed_by: '',
      note: '',
      md_id: '',
      payment_term_type: '',
      last_4_digits_of_cc: '',
      purchase_order_items: [productItemState]
    }
  }
  const productItemState: ProductInterface = {
    product_id: '',
    product_name: '',
    units: '',
    price_per_unit: '',
    tax: '',
    show: false,
    isSearching: false,
    total: 0,
    error: {
      product_id: '',
      units: '',
      price_per_unit: '',
      tax: '',
    }
  };

  const [payload, setPayload] = useState<RequestPayload | any>(payloadState());

  const response: any = useSelector((state: AppState) => state.PurchaseOrderReducer);

  const [supplierList, setSupplierList] = useState<SupplierList[]>([]);
  const [clinicList, setClinicList] = useState<ClinicList[]>([]);
  const [createdByList, setCreatedByList] = useState<CreatedByList[]>([]);
  const [mdList, setMdList] = useState<MdList[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState([]);
  const [currentSelectedIndex, setCurrentSelectedIndex] = useState<number | null>(null);
  const intervalRef: any = useRef(null);
  const [countries, setCountries] = useState<CountryList[]>([]);

  const dispatch = useDispatch();

  const [totalQty, setTotalQty] = useState<number>(0);
  const [subTotal, setSubTotal] = useState<number | string>(0);
  const [totalTax, setTotalTax] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<any>({});
  const [canSubmitForm, setCanSubmitForm] = useState<boolean>(false);
  const [totalGroupAdded, setTotalGroupAdded] = useState<number>(1);
  
  
  useEffect(() => {
    dispatch(getOrderDetail());
  }, [])

  useEffect((): void => {
    //console.log('Payload From Server', response );
    if (response && response.payload && response.payload.status == 200) {

      if (response.action == "ORDER_DETAIL") {
        const { clinic_list, supplier_list, users, md_list, countries } = response.payload.data;
        setSupplierList(supplier_list);
        setClinicList(clinic_list);
        setCreatedByList(users);
        setMdList(md_list);
        setCountries(countries);
      }

      if (response.action == "PRODUCT_DETAIL") {
        const { products } = response.payload.data;
        setResults(products);//Set Search Result To UI

        if (currentSelectedIndex != null) {
          // Hide Search Loader If Data 
          updateInternalState('isSearching', false, currentSelectedIndex);

          //If Product Found In Search Then Show Them In Drop Down For Respective Input
          if (products.length > 0) {
            updateInternalState('show', true, currentSelectedIndex);
          }
          else {
            // If NO Data Then Hide the drop down
            updateInternalState('show', false, currentSelectedIndex);
          }
        }
      }
      if (response.action == "CREATE_ORDER") {
        setPayload(payloadState());
        setFormSubmitLoader(false);
        success('Order Created Successfully');
      }

      if (response.action == "CLINICS_GET") {
        setClinicList(response.payload.data);
        setLoader(false);
      }
    }
    if (response && response.payload && response.payload.isAxiosError) {
      if (response.payload.response && response.payload.response.data.status != 200) {
        setFormSubmitLoader(false);
        error(response.payload.response.data.message);
        console.log('Compoent error', response)
      }

    }
  }, [response]);

  const handleChange = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.currentTarget;
    if (name == "supplier_id" && value == "add_new_supplier") {
      setModalShow(true);
    }
    else {
      setPayload((payload: any) => ({ ...payload, [name]: value }));
    }
  }
  const addNewProductGroup = async () => {
     setPayload((prevState: RequestPayload): { purchase_order_items: ProductInterface[]; } => ({
      ...prevState,
      purchase_order_items: [
        ...prevState.purchase_order_items,
        productItemState
      ]
    }));
   
  }

  // Set Data For Table
  const handleProductChange = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, index: number): void => {
    let val = [...payload.purchase_order_items];
    val[index][e.currentTarget.name] = e.currentTarget.value;

    // Update Subtotal,tax,qty for each unit
    if (e.currentTarget.name && (e.currentTarget.name == 'units' || e.currentTarget.name == 'price_per_unit' || e.currentTarget.name == 'tax')) {
      let { units, price_per_unit, tax } = val[index];

      let total: any = (parseFloat(units) * parseFloat(price_per_unit) || 0);
      val[index].total = total;
      val[index].sub_total = total;
      val[index].sub_tax = 0.00;
      if (tax) {
        let taxAmount: any = (parseFloat(total) * parseFloat(tax)) / 100;
        let finalAmt = parseFloat(total) + parseFloat(taxAmount);
        val[index].sub_tax = taxAmount;
        val[index].total = finalAmt;
      }
    }
    setPayload({ ...payload, purchase_order_items: val });

    // Update Searched String And Set To Which Index Search Is Performed
    if (e.currentTarget.name && e.currentTarget.name == 'product_name') {
      setSearchTerm(e.currentTarget.value);
      setCurrentSelectedIndex(index);
    }
  }

  //Delete Product Group
  const deleteProductGroup = (index: number): void => {
    let val = [...payload.purchase_order_items];
    val.splice(index, 1);
    setPayload({ ...payload, purchase_order_items: val });
  }

  // Update Total If There Is Any Change In qty,price,tax or delete
  useEffect((): void => {
    if (payload.purchase_order_items) {
      updateTotal();
      let total:number =  [...payload.purchase_order_items].length;
      setTotalGroupAdded(total);
    }
  }, [payload.purchase_order_items])

  // Update Total
  const updateTotal = (): void => {
    let allData = [...payload.purchase_order_items];
    let grandTotal, tax, units, subTotal = 0;
    grandTotal = allData.reduce((accumulator, current) => parseFloat(accumulator) + parseFloat(current.total), 0);
    tax = allData.reduce((accumulator, current) => parseFloat(accumulator) + parseFloat(current.sub_tax), 0);
    units = allData.reduce((accumulator, current) => parseFloat(accumulator) + parseFloat(current.units), 0);
    subTotal = allData.reduce((accumulator, current) => parseFloat(accumulator) + parseFloat(current.sub_total), 0);

    setTotalQty(units.toFixed(1));
    setSubTotal(subTotal.toFixed(2));
    setTotalTax(tax.toFixed(2));
    setGrandTotal(grandTotal.toFixed(2));
  }
  // Search Product From Input
  useEffect(
    () => {
      if (searchTerm) {
        if (currentSelectedIndex != null) {
          updateInternalState('isSearching', true, currentSelectedIndex);
        }

        intervalRef.current = setTimeout((): void => {
          dispatch(getProductDetail(searchTerm));
        }, 500);
      } else {
        setResults([]);
        if (currentSelectedIndex != null) {
          updateInternalState('isSearching', false, currentSelectedIndex);
        }
        clearTimeout(intervalRef.current);
      }

      return () => clearTimeout(intervalRef.current);
    },
    [searchTerm] // Only call effect if debounced search term changes
  );

  const updateInternalState = (key: string, value: any, index: number): void => {
    let val = [...payload.purchase_order_items];
    if (key) {
      val[index][key] = value;
      setPayload({ ...payload, purchase_order_items: val });
    }
  }


  // Select Product From Autosuggestion And Append Name to UI
  const selectProduct = (data: ProductInfo, index: number): void => {
    let val = [...payload.purchase_order_items];
    val[index]['product_id'] = data.id;// Set Current Select Product Id
    val[index]['product_name'] = data.product_name;// Set Current Select Product Name
    val[index]['show'] = false;// Hide Drop Down When Product Is selected
    val[index]['isSearching'] = false;// Hide Drop Down When Product Is selected
    setPayload({ ...payload, purchase_order_items: val });
    setCurrentSelectedIndex(null);
  }


  const handleSubmit = (): void => {
    if (payload && payload.purchase_order_items.length > 0) {
      let err:any = validate(payload);
      setFormErrors(err.errors);
      setCanSubmitForm(err.canSubmitForm);
    }
  }
  useEffect(() => {
    if (canSubmitForm == true) {
      setFormSubmitLoader(true);
      dispatch(createOrder(payload));
      setCanSubmitForm(false);
    }
  }, [canSubmitForm]);

  const validate = (values: RequestPayload): {} => {
    let errors: any = {};
    if (!values.supplier_id) {
      errors.supplier_id = "Please select supplier";
    }
    if (!values.clinic_id) {
      errors.clinic_id = "Please select clinic";
    }
    if (!values.order_placed_by) {
      errors.order_placed_by = "Please select PO";
    }
    if (!values.md_id) {
      errors.md_id = "Please select MD";
    }

    if (!values.note) {
      errors.note = "Please enter note";
    }

    if (!values.payment_term_type) {
      errors.payment_term_type = "Please select term type";
    }

    if (!values.last_4_digits_of_cc) {
      errors.last_4_digits_of_cc = "Please enter last 4";
    }

    let all_order_items = [...payload.purchase_order_items];
    let total_row:number=0;
    let canSubmitForm=false;
    all_order_items.forEach((element: any, index: number) => {
      all_order_items[index]['error']['product_id'] = '';
      all_order_items[index]['error']['units'] = '';
      all_order_items[index]['error']['tax'] = '';
      all_order_items[index]['error']['price_per_unit'] = '';
      if (element && element.product_id == "") {
        all_order_items[index]['error']['product_id'] = 'Please select product';
      }

      if (element && element.units == "") {
        all_order_items[index]['error']['units'] = 'Please enter units';
      }

      if (element && element.tax == "") {
        all_order_items[index]['error']['tax'] = 'Please enter tax';
      }

      if (element && element.price_per_unit == "") {
        all_order_items[index]['error']['price_per_unit'] = 'Please enter price per unit';
      }
      if(element.price_per_unit !="" && element.tax != "" && element.units != "" && element.product_id != ""){
        total_row++;
      }
    });
    setPayload({ ...payload, purchase_order_items: all_order_items });
    
    if(Object.keys(formErrors).length === 0 && total_row == all_order_items.length){
      canSubmitForm = true;
    }
    else{
      canSubmitForm = false;
    }
    return {
      errors: errors,
      canSubmitForm: canSubmitForm
    };
  };

  useEffect((): void => {
    if (payload.supplier_id) {
      setLoader(true);
      dispatch(getClinics(payload.supplier_id));
    }
  }, [payload.supplier_id])

  const onSupplierAdd = (): void => {
    setModalShow(true);
    dispatch(getOrderDetail());
  }
  return (
    <div>
      <Layout>
        <ToastContainer />
       
        <AddSupplierModal onAdd={onSupplierAdd} countries={countries} clinics={clinicList} show={modalShow} onHide={() => setModalShow(false)} />
        <div className="container float-left">
          <div className="setting-setion">

            <div className="form-group col-md-12">
              <label ><h5>Purchase Order</h5></label>

              <button disabled={(formSubmitLoader) ? true : false} className="btn btn-primary float-right" onClick={handleSubmit}>

                {formSubmitLoader && <Spinner animation="border" size="sm" />}
                {(formSubmitLoader) ? 'Saving' : 'Save'}
              </button>
            </div>
          </div>

          <div className="setting-setion">
            <div className="form-row">
              <div className="form-group col-md-3">
                <label >Supplier name</label>
                <select value={payload.supplier_id} className={`form-control ${formErrors && formErrors.supplier_id && 'input-error'}`} name="supplier_id" onChange={handleChange} >
                  <option value="">Select supplier</option>
                  <option value="add_new_supplier" >+Add New Supplier</option>
                  {
                    supplierList && supplierList.length > 0 && supplierList.map((val, index) => (
                      <option key={index} value={val.id}>{val.supplier_name}</option>
                    ))
                  }

                </select>
                {formErrors && formErrors.supplier_id && (
                  <span className="error">{formErrors.supplier_id}</span>
                )}

              </div>


              <div className="form-group col-md-3">
                <label >Clinic Name</label>
                <select value={payload.clinic_id} className={`form-control ${formErrors && formErrors.clinic_id && 'input-error'}`} name="clinic_id" onChange={handleChange}>
                  <option value="">Select Clinic</option>
                  {
                    clinicList && clinicList.length > 0 && clinicList.map((val, index) => (
                      <option key={index} value={val.id}>{val.clinic_name}</option>
                    ))
                  }
                </select>
                {loader && <Spinner animation="border" size="sm" />}
                {formErrors && formErrors.clinic_id && (
                  <span className="error">{formErrors.clinic_id}</span>
                )}
              </div>

              <div className="form-group col-md-3">
                <label >PO Created By</label>
                <select value={payload.order_placed_by} className={`form-control ${formErrors && formErrors.order_placed_by && 'input-error'}`} name="order_placed_by" onChange={handleChange} >
                  <option value="">Select Po Created By</option>
                  {
                    createdByList && createdByList.length > 0 && createdByList.map((val, index) => (
                      <option key={index} value={val.id}>{val.firstname}{val.lastname}</option>
                    ))
                  }
                </select>
                {formErrors && formErrors.order_placed_by && (
                  <span className="error">{formErrors.order_placed_by}</span>
                )}
              </div>
              <div className="form-group col-md-3">
                <label >Medical Director</label>
                <select value={payload.md_id} className={`form-control ${formErrors && formErrors.md_id && 'input-error'}`} name="md_id" onChange={handleChange}>
                  <option value="">Select MD</option>
                  {
                    mdList && mdList.length > 0 && mdList.map((val, index) => (
                      <option key={index} value={val.id}>{val.firstname}{val.lastname}</option>
                    ))
                  }
                </select>
                {formErrors && formErrors.md_id && (
                  <span className="error">{formErrors.md_id}</span>
                )}
              </div>

            </div>

            <div className="form-group">
              <label >Note</label>
              <input autoComplete="off" type="text" value={payload.note} className={`form-control ${formErrors && formErrors.note && 'input-error'}`} name="note" onChange={handleChange} placeholder="" />
              {formErrors && formErrors.note && (
                <span className="error">{formErrors.note}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label >Payment Terms Type</label>
                <select value={payload.payment_term_type} className={`form-control ${formErrors && formErrors.payment_term_type && 'input-error'}`} name="payment_term_type" onChange={handleChange} >
                  <option value="">Select Term</option>
                  <option value="last_4_digits_of_cc">Last 4 digits of CC</option>
                  <option value="payment_term_text">Payment terms</option>
                  <option value="both">Both</option>
                </select>
                {formErrors && formErrors.payment_term_type && (
                  <span className="error">{formErrors.payment_term_type}</span>
                )}
              </div>
              <div className="form-group col-md-6">
                <label >Last 4 digits Of CC</label>
                <input autoComplete="off" value={payload.last_4_digits_of_cc} type="text" className={`form-control ${formErrors && formErrors.last_4_digits_of_cc && 'input-error'}`} onChange={handleChange} name="last_4_digits_of_cc" />
                {formErrors && formErrors.last_4_digits_of_cc && (
                  <span className="error">{formErrors.last_4_digits_of_cc}</span>
                )}
              </div>


            </div>
            <div className="form-group">
              <label ></label>

              <button type="button" className="btn btn-primary float-right mb-3" onClick={addNewProductGroup}>
                Add+
              </button>
            </div>

            <table className="table table-responsive">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price per Quantity</th>
                  <th scope="col">Tax (in %)</th>
                  <th scope="col">Total</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  payload && payload.purchase_order_items.length > 0 && payload.purchase_order_items.map((value: ProductInterface, index: number): JSX.Element => (

                    <tr key={index}>
                      <td>
                        <input className={`form-control ${value.error && value.error.product_id && 'input-error'}`} autoComplete="off" type="text" onChange={(e) => handleProductChange(e, index)} value={value.product_name} name="product_name" />
                        {value.isSearching && <Spinner animation="border" size="sm" />}
                        <ul className="list-group">
                          {value.show && results && results.length > 0 && results.map((result: ProductInfo) => (

                            <li onClick={() => selectProduct(result, index)} key={result.id} className="list-group-item">{result.product_name}</li>

                          ))}
                        </ul>
                        {value.error && value.error.product_id && (
                          <span className="error">{value.error.product_id}</span>
                        )}
                      </td>
                      <td>
                        <input className={`form-control ${value.error && value.error.units && 'input-error'}`} autoComplete="off" value={value.units} type="text" onChange={(e) => handleProductChange(e, index)} name="units" />
                        {value.error && value.error.units && (
                          <span className="error">{value.error.units}</span>
                        )}
                    </td>
                      <td>
                        <input className={`form-control ${value.error && value.error.price_per_unit && 'input-error'}`} value={value.price_per_unit} type="text"  onChange={(e) => handleProductChange(e, index)} name="price_per_unit" />
                        {value.error && value.error.price_per_unit && (
                          <span className="error">{value.error.price_per_unit}</span>
                        )}
                      </td>
                      <td>
                        <input className={`form-control ${value.error && value.error.tax && 'input-error'}`} autoComplete="off" value={value.tax} type="text" onChange={(e) => handleProductChange(e, index)} name="tax" />
                        {value.error && value.error.tax && (
                          <span className="error">{value.error.tax}</span>
                        )}
                      </td>
                      <td>
                        {value.total}
                      </td>

                      <td>
                        <button disabled={( index == 0 && totalGroupAdded == 1) ? true : false} onClick={() => deleteProductGroup(index)} className="btn btn-danger">-</button>
                      </td>

                    </tr>
                  ))
                }

              </tbody>
            </table>
            
            <div className="row">
              <div className="col-md-8"></div>
              <div className="col-6 col-md-4 text-right">
                <strong>Total Qty: {(totalQty && totalQty > 0) ? totalQty : 0}</strong><br />
                <strong>Sub Total ($):{(subTotal && subTotal > 0) ? subTotal : 0}</strong><br />
                <strong>Total Tax ($):{(totalTax && totalTax > 0) ? totalTax : 0}</strong><br />
                <strong>Grand Total ($):{(grandTotal && grandTotal > 0) ? grandTotal : 0}</strong><br />

              </div>
            </div>
            {/* {JSON.stringify(payload)} */}
          </div>

        </div>
      </Layout>

    </div>
  )
}

export default AddPurchaseOrder;