import React, { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../Layouts/Layout';
import { Spinner, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { success, error } from '../../Utils/Toaster';
import { login } from '../../Actions/UserAction';
import { LoginModel, AuthModel } from '../../Models/Auth';
import { AppState } from '../../Store';
import { useHistory } from "react-router-dom";
import { setToken, getToken } from '../../Middlewares/Auth';
import { UserContext } from "../../Hooks/UserContext";

const Login: React.FC = (props): JSX.Element => {
  const userContext = useContext(UserContext);

  const userInititalState = (): LoginModel => {
    return {
      email: '',
      password: '',
      is_need: 1
    }
  }
  const dispatch = useDispatch();
  const [loggedinUser, setLoggedinUser] = useState<AuthModel>({
    access_token: ''
  });

  const [user, setUser] = useState(userInititalState());
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<any>({});
  const [canSubmitForm, setCanSubmitForm] = useState<boolean>(false);
  const [formSubmitLoader, setFormSubmitLoader] = useState<boolean>(false);

  const response: any = useSelector((state: AppState) => state.UserReducer);
  let history = useHistory();  // declare here, inside a React component. 

  

  const handleSubmit = (e: any): void => {
    e.preventDefault();
    let err: any = validate(user);
    
    setFormErrors(err.errors);
    setCanSubmitForm(err.canSubmitForm);
    
  }

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.currentTarget.name]: e.currentTarget.value });
  };

  useEffect((): void => {
    if (canSubmitForm == true) {
      setFormSubmitLoader(true);
      dispatch(login(user));
      setCanSubmitForm(false);
      
    }
  }, [canSubmitForm]);
  const validate = (values: LoginModel): {} => {
    let errors: any = {};
    if (!values.email) {
      errors.email = "Please enter email";
    }
    if (!values.password) {
      errors.password = "Please enter password";
    }

    return {
      errors: errors,
      canSubmitForm: Object.keys(errors).length === 0 ? true : false
    };
  };

  useEffect((): void => {
    if (response && response.payload && response.payload.status == 200) {
      if (response.action == "LOGIN") {
        setUser(userInititalState());
        setLoggedinUser(getToken());
        setFormSubmitLoader(false);
        success('You are loggedin successfully');
        history.push("/create-order");
      }
    }
    if (response && response.payload && response.payload.isAxiosError) {
      if (response.payload.response && response.payload.response.data.status != 200) {
        setFormSubmitLoader(false);
        error(response.payload.response.data.message);
      }

    }
  }, [response]);
  return (

    <Layout>
      <ToastContainer />
      <div className="col-lg-8 offset-lg-2">
        <h2>Login</h2>
      
        <form name="form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email</label>
            <input autoComplete="off" type="text" name="email" value={user.email} onChange={handleChange} className={`form-control ${formErrors && formErrors.email && 'input-error'}`} />
            {formErrors && formErrors.email && (
              <span className="error">{formErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input autoComplete="off" type="password" name="password" value={user.password} onChange={handleChange} className={`form-control ${formErrors && formErrors.password && 'input-error'}`} />
            {formErrors && formErrors.email && (
              <span className="error">{formErrors.password}</span>
            )}
          </div>

          <div className="form-group">
            <button disabled={(formSubmitLoader) ? true : false} className="btn btn-primary">
            {formSubmitLoader && <Spinner animation="border" size="sm" />}
            {(formSubmitLoader) ? 'Processing' : 'Login'}
            </button>

          </div>
        </form>
      </div>
    </Layout>
  )
}

export default Login;