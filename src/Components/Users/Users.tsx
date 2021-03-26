import React, { useState, useEffect, useReducer } from 'react';
import { getUsers , deleteUser} from '../../Actions/UserAction';
import { connect, useDispatch, useSelector } from 'react-redux';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import InfiniteScroll from 'react-infinite-scroll-component';
import Layout from '../../Layouts/Layout';
import { ToastContainer, toast } from 'react-toastify';
import { success, error } from '../../Utils/Toaster';
import { AppState } from '../../Store';
import { Spinner } from 'react-bootstrap';
import CreateEditUser from './CreateEditUser';
import { Facebook } from 'react-content-loader'

// import CreateUser from './CreateUser';
const Users = (props: any): JSX.Element => {
  const dispatch = useDispatch();
  const response: any = useSelector((state: AppState) => state.UserReducer);
  const userInititalState = {
    term: '',
    letter_key: ''
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [payload, setPayload] = useState(userInititalState);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allLetters, setAllLetters] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>(0);
  
  // Set Initial data
  useEffect(() => {
    let formData = {
      page: 1, pagesize: 20
    }
    setLoading(true);
    dispatch(getUsers(formData));
  }, []);

  // Set Pagination Data
  useEffect((): void => {
    if (response && response.payload && response.payload.status == 200) {
      if (response.action == "USER_GET") {
        const { current_page, data, next_page_url, per_page, total, active_letters } = response.payload.data;
        setAllLetters(active_letters);
        setCurrentPage(current_page);
        setNextPageUrl(next_page_url);
        setPerPage(per_page);
        //setTotal(total);
        if (current_page == 1) {
          setAllUsers(data);
        }
        else {
          setAllUsers([...allUsers, ...data]);
        }
      }
      if (response.action == "DELETE_USER") {
        success('User Deleted Successfully');
        onAdd();
      }

      setLoading(false);
    }
    if (response && response.payload && response.payload.isAxiosError) {
      setLoading(false);
      if (response.payload.response && response.payload.response.data.status != 200) {
        error(response.payload.response.data.message);
      }
    }
  }, [response]);

  // Submit Form
  const handleSubmit = (e: any) => {
    e.preventDefault();
    let formData = {
      page: 1,
      pagesize: 20,
      term: payload.term,
      letter_key: payload.letter_key
    }
    setLoading(true);
    dispatch(getUsers(formData));
  }

  // Set payload on change of inputs
  const handleChange = (e: any) => {
    console.log('onchange applied')
    const { name, value } = e.target;
    setPayload(payload => ({ ...payload, [name]: value }));
  }

  //Load more scrolled
  const loadMore = () => {
    let page: any = currentPage + 1;
    setPage(parseInt(page));
  }

  //Get data on when scrolled
  useEffect(() => {
    if (page && page > 1) {
      console.log('Get next page ', page)
      let formData = {
        page: page,
        pagesize: perPage,
        term: payload.term,
        letter_key: payload.letter_key
      }
      console.log('Get next page payload ', formData)
      dispatch(getUsers(formData));
    }
  }, [page]);

  const onAdd = () => {
    setModalShow(false);
    let formData = {
      page: 1, pagesize: 20
    }
    setLoading(true);
    dispatch(getUsers(formData));
  }

  const editUser = (id: number) => {
    setUserId(id);
    setModalShow(true);
  }
  const deleteUserById = (id: number): void => {
    if(window.confirm("Are you sue want to delete this user?")){
      console.log('Yes');
      dispatch(deleteUser(id));
    }
    else{
      console.log('No');
    }
  }
  return (
    <Layout>
     
      {loading && <Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}
            timeout={1000} //3 secs
          />}
     
      <CreateEditUser id={userId}  onAdd={onAdd} show={modalShow} onHide={() => setModalShow(false)} />

      <ToastContainer />
      <div >
        {/* <h3>Users: <CreateUser/></h3> */}
        <>
         
        
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col">
                <input className="form-control " type="text"
                  placeholder="Search..."
                  name="term" value={payload.term} onChange={handleChange}
                />
              </div>
              <div className="col">
                <select name="letter_key" onChange={handleChange} className={'form-control'}>
                  <option value="">Select Alphabat</option>
                  {
                    allLetters && allLetters.map((val, index) => (
                      <option key={index} value={val}>{val}</option>
                    ))
                  }

                </select>
              </div>
              <div className="col text-right">
                <button disabled={(loading) ? true : false} type="submit" className="btn btn-secondary btn-search mr-3" >
                  {loading && <Spinner animation="border" size="sm" />}
                  {(loading) ? 'Processing' : 'Submit'}
                </button>
                <button type="button" className="btn btn-primary"
                  onClick={(event): void => {
                    setModalShow(true)
                  }}
                >
                  Create User
                </button>
              </div>
            </div>
          </form>


        </>
       
        {
          <InfiniteScroll
            dataLength={currentPage}
            next={loadMore}
            hasMore={(nextPageUrl == null) ? false : true}
            loader={loading && <h4>Loading...</h4>}
            scrollThreshold={0.9}
          >
            <table className='table table-bordered'>
              <thead>
                <tr>
                  <th scope='col'>#</th>
                  <th scope='col'>Id</th>
                  <th scope='col'>First Name</th>
                  <th scope='col'>Last Name</th>
                  <th scope='col'>Email</th>
                  <th scope='col'>Action</th>
                </tr>
              </thead>
              <tbody>

             
                {allUsers && allUsers.length > 0 ? (
                  allUsers.map((user, index) => (

                    <tr
                      key={index + 1}
                      style={{ cursor: 'pointer' }}
                    >
                      <th scope='row'>{index}</th>
                      <td>{user.id}</td>
                      <td>{user.firstname}</td>
                      <td>{user.lastname}</td>
                      <td>{user.email}</td>
                      <td className="text-right">
                        <button onClick={() => editUser(user.id)} type="button" className="btn btn-primary mr-3" >
                          Edit
                      </button>

                        <button onClick={() => deleteUserById(user.id)} type="button" className="btn btn-danger" >
                          Delete
                      </button>
                      </td>


                    </tr>
                  ))

                ) : (
                 <tr>
                    <td colSpan={6} style={{ textAlign: 'center' }}>
                      No tasks found
                    </td>
                  </tr>
                )}



              </tbody>

            </table>
          </InfiniteScroll>
        }

      </div>
    </Layout>
  );
}

export default Users;
