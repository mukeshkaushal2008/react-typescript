import React, { useState, useEffect, useReducer } from 'react';
import { createUser } from '../../Actions/UserAction';
import { connect, useDispatch, useSelector } from 'react-redux';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import InfiniteScroll from 'react-infinite-scroll-component';
import Layout from '../../Layouts/Layout';
import { ToastContainer, toast } from 'react-toastify';
import { success, error } from '../../Utils/Toaster';
import { AppState } from '../../Store';
import { FormInput } from '../CommonComponents';
import { Modal, Col, Button, Form, Spinner, Card, Accordion, Table } from 'react-bootstrap';

export interface ComponentProps {
  show: boolean;
  onHide: () => void;
}
export interface AddEditUserModel {
  firstname: string;
  lastname: string;
  email: string;
  user_image: string;
  gender: null;
  patient_information: {
    insurance_provider: string;
    policy_id: string;
  }
}
const CreateEditUser = (props: ComponentProps): JSX.Element => {

  const dispatch = useDispatch();
  const initialState = (): AddEditUserModel => {
    return {
      firstname: '',
      lastname: '',
      email: '',
      user_image: '',
      gender: null,
      patient_information: {
        insurance_provider: "",
        policy_id: ""
      }
    }
  }
  const [payload, setPayload] = useState(initialState());

  const [formErrors, setFormErrors] = useState<any>({});
  const [canSubmitForm, setCanSubmitForm] = useState<boolean>(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState<boolean>(false);

  const handleChange = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.currentTarget;
    setPayload((payload: any) => ({ ...payload, [name]: value }));
  }

  const handleSubmit = (e: any): void => {
    e.preventDefault();
    let err: any = validate(payload);
    setFormErrors(err.errors);
    setCanSubmitForm(err.canSubmitForm);
  }

  useEffect((): void => {
    if (canSubmitForm == true) {
      setFormSubmitLoader(true);
      dispatch(createUser(payload));
      setCanSubmitForm(false);
    }
  }, [canSubmitForm]);

  const validate = (values: AddEditUserModel): {} => {
    let errors: any = {};

    if (!values.firstname) {
      errors.firstname = "Please enter first name";
    }

    if (!values.lastname) {
      errors.lastname = "Please enter last name";
    }
    if (!values.email) {
      errors.email = "Please enter email";
    }
    return {
      errors: errors,
      canSubmitForm: Object.keys(errors).length === 0 ? true : false
    };
  };

  const modalLoaded = () => {
   console.log('loadee');
  };
  

  return (

    <React.Fragment>
      <ToastContainer />

      <Modal show={props.show} onEntered={modalLoaded} size="lg"  aria-labelledby="contained-modal-title-vcenter" animation={false}>

        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Create New User
              </Modal.Title>
          </Modal.Header>
          <Modal.Body className="show-grid">
          
            <div className="row">
              <div className="col">
                <FormInput label="First Name" error={formErrors && formErrors.firstname} onChange={handleChange} name="firstname" value={payload.firstname} type="text" className="form-control" />
              </div>
              <div className="col">
                <FormInput label="Last Name" error={formErrors && formErrors.lastname} onChange={handleChange} name="lastname" value={payload.lastname} type="text" className="form-control" />
              </div>

              <div className="col">
                <FormInput label="Email" error={formErrors && formErrors.email} onChange={handleChange} name="email" value={payload.email} type="text" className="form-control" />
              </div>
            </div>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={props.onHide} type="button">
              Cancel
      </Button>

            <Button variant="outline-primary" type="submit" >Save</Button>
          </Modal.Footer>
        </form>
      </Modal>
    </React.Fragment>);
}

export default CreateEditUser;
