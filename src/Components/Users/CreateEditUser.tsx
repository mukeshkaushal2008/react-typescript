import React, { useState, useEffect, useReducer } from 'react';
import { createUser, editUser, getUserDetail } from '../../Actions/UserAction';
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
import { CustomLoader } from '../CommonComponents/CustomLoader';

export interface ComponentProps {
  show: boolean;
  onHide: () => void;
  onAdd: () => void;
  id?: number;
}
export interface AddEditUserModel {
  firstname: string;
  lastname: string;
  email: string;
  user_image: string;
  gender: null;
  patient_information: AddEditPatientModel
}

export interface AddEditPatientModel {
  insurance_provider: string;
  policy_id: string;
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
  const response: any = useSelector((state: AppState) => state.UserReducer);
  const [formType, setFormType] = useState<string>('add');
  const [userId, setUserId] = useState<number>(0);

  const handleChange = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.currentTarget;
    setPayload((payload: AddEditUserModel) => ({ ...payload, [name]: value }));
  }
  const handlePatientInfoChange = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.currentTarget;
    setPayload((payload: AddEditUserModel) => ({
      ...payload,
      patient_information: {
        ...payload.patient_information,
        [name]: value
      }
    }));
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
      if (formType === 'add') {
        dispatch(createUser(payload));
      }
      if (formType === 'edit') {
        dispatch(editUser(payload, userId));
      }

      setCanSubmitForm(false);
    }
  }, [canSubmitForm]);

  useEffect((): void => {

    if (response && response.payload && response.payload.status == 200) {
      if (response.action == "CREATE_USER") {
        setPayload(initialState());
        setFormSubmitLoader(false);
        success('User Created Successfully');
        props.onAdd();
      }
      if (response.action == "EDIT_USER") {
        setFormSubmitLoader(false);
        success('User Edited Successfully');
        props.onAdd();
      }

      if (response.action == "GET_USER_DETAIL") {

        const { data }: any = response.payload;
        let formData: AddEditUserModel = {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          user_image: '',
          gender: data.gender,
          patient_information: {
            insurance_provider: (data.patient_insurence && data.patient_insurence.insurance_provider !== undefined) ? data.patient_insurence.insurance_provider : '',
            policy_id: (data.patient_insurence && data.patient_insurence.policy_id !== undefined) ? data.patient_insurence.policy_id : '',
          }
        }
        setPayload(formData);
        setFormSubmitLoader(false);
      }

    }
    if (response && response.payload && response.payload.isAxiosError) {
      setFormSubmitLoader(false);
      if (response.payload.response && response.payload.response.data.status != 200) {
        error(response.payload.response.data.message);
      }
    }
  }, [response]);

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

    if (!values.patient_information.insurance_provider) {
      errors.insurance_provider = "Please enter insurance provider";
    }
    if (!values.patient_information.policy_id) {
      errors.policy_id = "Please enter policy id";
    }

    return {
      errors: errors,
      canSubmitForm: Object.keys(errors).length === 0 ? true : false
    };
  };

  useEffect((): void => {
    if (props.show == false) {
      setFormType('');
      setFormErrors({});
      setPayload(initialState());
    }
  }, [props.show]);



  useEffect((): void => {
    if (props.id) {
      setFormType('edit');
      setUserId(props.id);
      setFormSubmitLoader(true);
      dispatch(getUserDetail(props.id));
    }
  }, [props.id]);
  return (

    <React.Fragment>


      <Modal show={props.show} size="lg" aria-labelledby="contained-modal-title-vcenter" animation={false}>

        <form onSubmit={handleSubmit}>
          <Modal.Header >
            <Modal.Title id="contained-modal-title-vcenter">
              {formType == 'edit' ? 'Edit': 'Create New' } User
              </Modal.Title>
          </Modal.Header>
          <Modal.Body className="show-grid">
            <div className="row">
              <div className="col col-md-12">
                <CustomLoader loading={formSubmitLoader} />
              </div>

            </div>


            {!formSubmitLoader &&
              <>
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
                <div className="form-check form-check-inline">
                  <FormInput checked={payload.gender == "1" ? true : false} label="Gender" error={formErrors && formErrors.gender} onChange={handleChange} name="gender" value={1} type="radio" className="form-check-input" />Male
            <FormInput checked={payload.gender == "2" ? true : false} error={formErrors && formErrors.gender} onChange={handleChange} name="gender" value={2} type="radio" className="form-check-input" />Female
            </div>


                <div className="row">
                  <div className="col col-md-6">
                    <FormInput label="Insurance provider" error={formErrors && formErrors.insurance_provider} onChange={handlePatientInfoChange} name="insurance_provider" value={payload.patient_information.insurance_provider} type="text" className="form-control" />
                  </div>
                  <div className="col col-md-6">
                    <FormInput label="Policy Id" error={formErrors && formErrors.policy_id} onChange={handlePatientInfoChange} name="policy_id" value={payload.patient_information.policy_id} type="text" className="form-control" />
                  </div>
                </div>
              </>
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
    </React.Fragment>);
}

export default CreateEditUser;
