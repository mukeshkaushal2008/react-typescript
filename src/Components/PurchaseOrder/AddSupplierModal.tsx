import React, { useState, useEffect } from 'react';
import { Modal, Col, Button, Form, Spinner, Card, Accordion, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../Store';
import { SupplierModel, SupplierClinicModel, CountryList,AllClinicModel } from '../../Models/PurchaseOrder';

import { createSupplier } from '../../Actions/PurchaseOrderAction';
import * as _ from 'lodash';
import "@pathofdev/react-tag-input/build/index.css";
import ReactTagInput from "@pathofdev/react-tag-input";
import { values } from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import {success, error} from  '../../Utils/Toaster';

const AddSupplierModal = (props: any): JSX.Element => {
  const dispatch = useDispatch();

  
  const payloadState = ():any => {
    return {
      supplier_name: '',
      supplier_email: [],
      supplier_phone: '',
      address_1: '',
      city: '',
      state: '',
      country: '',
      zipcode: '',
      contact_person_firstname: '',
      contact_person_lastname: '',
      contact_person_phone: '',
      contact_person_email: '',
      distributor_name: '',
      ordering_phone: '',
      ordering_url: '',
      account_number: '',
      clinics: []
    };
  }
  const [countries, setCountries] = useState<CountryList[]>([]);
  const [allclinics, setAllClinics] = useState<any[]>([]);
  const [localClinicState, setLocalClinicState] = useState<any[]>([]);
  const response: any = useSelector((state: AppState) => state.PurchaseOrderReducer);
  const [payload, setPayload] = useState<SupplierModel | any>(payloadState());
  const [tags, setTags] = React.useState<any[]>([])

  const handleChange = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.currentTarget;
    setPayload((payload: any) => ({ ...payload, [name]: value }));
  }

  const handleClinicChange = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, index: number,value:any): void => {
      let val = [...allclinics];
      val[index]['account_number'] = e.currentTarget.value;
      val[index]['clinic_id'] = value.id;
     
      setPayload({ ...payload, clinics: val });
      setAllClinics( val );
 
  }

  useEffect((): void => {
    if (props.countries) {
      setCountries(props.countries);
    }
    if (props.clinics && props.clinics.length > 0) {
      setAllClinics(props.clinics);
    }
  }, [props]);


  const handleSubmit = (e: any): void => {
    e.preventDefault();
    if(payload.clinics.length > 0){
      let payloadData = _.map(payload.clinics, o => _.pick(o, ['clinic_id', 'account_number']));
      if(payloadData){
        payload.clinics = payloadData;
      }
      
    }
    payload.supplier_email = tags;
    dispatch(createSupplier(payload));
  }

  useEffect((): void => {
    //console.log('Payload From Server', response );
    if (response && response.payload && response.payload.status == 200) {
      if (response.action == "CREATE_SUPPLIER") {
        setPayload(payloadState());
        props.onAdd();
        success('Supplier Created Successfully');
      }
    }
    if (response && response.payload && response.payload.isAxiosError) {
      if (response.payload.response && response.payload.response.data.status != 200) {
        if (response.action == "CREATE_SUPPLIER") {
          error(response.payload.response.data.message);
        }
        console.log('Compoent error', response.payload.response.data.status, response.payload.response.data.message)
      }

    }
  }, [response]);
  return (
    <React.Fragment>
     
    
    <Modal size="lg" {...props} aria-labelledby="contained-modal-title-vcenter" animation={false}>
      
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Add Supplier
           
        </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">

          <Form.Row>

            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Supplier Name</Form.Label>
              <Form.Control value={payload.supplier_name} name="supplier_name" onChange={handleChange} type="text" placeholder="Enter email" />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Sold-To Account Number</Form.Label>
              <Form.Control value={payload.account_number} name="account_number" onChange={handleChange} type="text" placeholder="Sold-To Account Number" />
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="formGridAddress1">
            <Form.Label>Email</Form.Label>
            <ReactTagInput 
            tags={tags}
            onChange={(newTags) => setTags(newTags)}
          />
           
          </Form.Group>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Phone</Form.Label>
              <Form.Control value={payload.supplier_phone} name="supplier_phone" onChange={handleChange} type="text" />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Address</Form.Label>
              <Form.Control value={payload.address_1} name="address_1" onChange={handleChange} type="text" />
            </Form.Group>
          </Form.Row>


          <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>City</Form.Label>
              <Form.Control type="text" value={payload.city} name="city" onChange={handleChange} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>State</Form.Label>
              <Form.Control type="text" value={payload.state} name="state" onChange={handleChange} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridZip">
              <Form.Label>Zip</Form.Label>
              <Form.Control type="text" value={payload.zipcode} name="zipcode" onChange={handleChange} />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group id="formGridCheckbox" as={Col} md="4">
              <Form.Label>Country</Form.Label>
              <Form.Control as="select" value={payload.country} name="country" onChange={handleChange} >
                <option value="">Select Country</option>
                {
                  countries && countries.length > 0 && countries.map((val, index) => (
                    <option key={index} value={val.country_code}>{val.country_name}</option>
                  ))
                }


              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Row className="draw_line">Contact Person *</Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" value={payload.contact_person_firstname} name="contact_person_firstname" onChange={handleChange} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" value={payload.contact_person_lastname} name="contact_person_lastname" onChange={handleChange} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridZip">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" value={payload.contact_person_email} name="contact_person_email" onChange={handleChange} />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridZip" md="4">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" value={payload.contact_person_phone} name="contact_person_phone" onChange={handleChange} />
            </Form.Group>
          </Form.Row>



          <Form.Row className="draw_line">Order Information</Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>Distributor Name</Form.Label>
              <Form.Control type="text" value={payload.distributor_name} name="distributor_name" onChange={handleChange} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridState">
              <Form.Label>Ordering Phone*</Form.Label>
              <Form.Control type="text" value={payload.ordering_phone} name="ordering_phone" onChange={handleChange} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridZip">
              <Form.Label>Ordering URL</Form.Label>
              <Form.Control type="text" value={payload.ordering_url} name="ordering_url" onChange={handleChange} />
            </Form.Group>
          </Form.Row>


          <Accordion defaultActiveKey="0">
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                +Ship-To Account Number
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Clinic</th>
                        <th>Account Number</th>
                      </tr>
                    </thead>
                    <tbody>

                      {
                        allclinics && allclinics.length > 0 && allclinics.map((val, index) => (

                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{val.clinic_name}</td>
                            <td><Form.Control type="text" value={val.account_number} name="account_number" onChange={(e) => handleClinicChange(e,index,val)} /></td>
                          </tr>

                        ))
                      }



                    </tbody>
                  </Table>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={props.onHide} type="button">
            Cancel
      </Button>

          <Button variant="outline-primary" type="submit" >Save</Button>
        </Modal.Footer>
      </form>
    </Modal>
    </React.Fragment>
  );
}

export default AddSupplierModal;