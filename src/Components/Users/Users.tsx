import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector, connect } from 'react-redux';
import Layout from '../../Layouts/Layout';
import { InterfaceUserData, InterfaceUserResponse, InterfaceUserState } from '../../Models/Users';
import { getUsers } from '../../Actions/UserAction';
import { AppState } from '../../Store';
import { bindActionCreators, Dispatch } from 'redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import InfiniteScroll from 'react-infinite-scroll-component';
// https://www.freecodecamp.org/news/redux-thunk-explained-with-examples/
// https://github.com/piotrwitek/react-redux-typescript-guide

const Users: React.FC = (): JSX.Element => {
  const dispatch = useDispatch();
  const response: any = useSelector((state: AppState) => state.UserReducer);
  const [state, setState] = useState<InterfaceUserData[]>([]);
  const [payload, setPayload] = useState<any>({
    term: '',
    role_id: null
  });

  const [page, setPage] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Active');
  const [roleId, setRoleId] = useState<string>('');

  useEffect((): void => {
    let formData: InterfaceUserState = {
      page: 1,
      pagesize: 10
    }
    dispatch(getUsers(formData));
  }, [])

  useEffect((): void => {

    if (response && response.payload && response.payload.status == 200) {
      console.log('State is ', response)
      setState(response.payload.data.data);
      setCurrentPage(response.payload.data.current_page);
      setNextPageUrl(response.payload.data.next_page_url);
      setPerPage(response.payload.data.per_page);
    }
    if (response && response.payload && (!response.payload.status || response.payload.status != 200)) {
      console.log('Compoent error', response.payload.status, response.payload.message)
    }
  }, [response.payload])

  const handleChange = (e: React.FormEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.currentTarget;
    setPayload((payload: any) => ({ ...payload, [name]: value }));
  }
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    let formData: InterfaceUserState = {
      page: 1,
      pagesize: 10,
      sortby: 'firstname',
      sortorder: 'ASC',
      term: (payload.term != undefined) ? payload.term : '',
      status: status,
    }
    if (payload.role_id && payload.role_id != undefined) {
      formData.role_id = (payload.role_id != undefined) ? payload.role_id : '';
    }
    dispatch(getUsers(formData));
  }
  const handleClick = (status: string): void => {
    let formData: InterfaceUserState = {
      page: 1,
      pagesize: 10,
      sortby: 'firstname',
      sortorder: 'ASC',
      status: status,

    }
    if (payload.role_id && payload.role_id != undefined) {
      formData.role_id = (payload.role_id != undefined) ? payload.role_id : '';
    }
    setStatus(status);
    dispatch(getUsers(formData));
  }
  return (
    <Layout>
      {JSON.stringify(status)}
      <div className="setting-setion">
        <form className="form-inline" onSubmit={handleSubmit}>
          <div className="form-group mb-2">
            <label onClick={() => handleClick('Active')} className={`btn btn-${status == 'Active' ? 'primary' : 'default'}`}>Active</label>
            <label onClick={() => handleClick('Inactive')} className={`mr-2 btn btn-${status == 'Inactive' ? 'primary' : 'default'}`}>Inactive</label>
          </div>
          <div className="form-group mx-sm-3 mb-2">
            <label className="sr-only">Search</label>
            <input type="text" name="term" value={payload.term} onChange={handleChange} className="form-control" id="inputPassword2" placeholder="Search" />
          </div>
          <div className="form-group mx-sm-3 mb-2">
            <select className="form-control" name="role_id" onChange={handleChange}>
              <option value="">All roles</option>
              <option value="1">Admin</option>
              <option value="2">Provider</option>
              <option value="3">Front Desk</option>
              <option value="4">Medical Director</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary mb-2">Submit</button>
        </form>


        {/* {perPage} {currentPage} {nextPageUrl} */}
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Email</th>
            </tr>
          </thead>
          <tbody>
            {state.length > 0 ? state.map((user, index) => (
              <tr key={index}>
                <th scope="row">{user.id}</th>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.email_id}</td>

              </tr>
            )) : <React.Fragment><tr><th colSpan={4}>No data found</th></tr></React.Fragment>}


          </tbody>
        </table>

        <div>
          <ul>


          </ul>
        </div>
      </div>
    </Layout>

  )
}

/*const mapStateToProps = (state: any) => {
  const response = {};
  console.log('State is', state);

  return response;
}
const mapDispatchToProps = (dispatch: Dispatch) => ({
        ...bindActionCreators(
          {
            getUsers
          },
          dispatch,
        )
      })

export default connect(mapStateToProps, mapDispatchToProps)(Users);*/

export default Users;
