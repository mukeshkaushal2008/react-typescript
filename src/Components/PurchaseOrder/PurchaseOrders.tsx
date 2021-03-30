import React, { useEffect, useState } from 'react';
import { Button, Dropdown, Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getOrders } from '../../Actions/PurchaseOrderAction';
import Layout from '../../Layouts/Layout';
import { PoComponentProps, Payload } from '../../Models/PurchaseOrder';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../Store';
import { success, error } from '../../Utils/Toaster';
import {FormInput} from '../CommonComponents/FormInput';
import { useHistory } from 'react-router-dom'
import NoRecordFound from '../CommonComponents/NoRecordFound';


const PurchaseOrders: React.FC<PoComponentProps> = (): JSX.Element => {
  const history = useHistory();

  const dispatch = useDispatch();
  const response: any = useSelector((state: AppState) => state.PurchaseOrderReducer);
  const initialPayloadState = (): Payload => ({
    order_status: '',
    term: ''
  })
  const [payload, setPayload] = useState<Payload>(initialPayloadState());
  const [loading, setLoading] = useState<boolean>(false);

  const [tableData, setTableData] = useState<any>([]);
  const [page, setPage] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [total, setTotal] = useState<number>(0);


  // Set Initial data
  useEffect((): void => {
    let formData = {
      page: 1, pagesize: 20
    }
    setLoading(true);
    dispatch(getOrders(formData));
  }, []);
  // Set Pagination Data
  useEffect((): void => {
    if (response && response.payload && response.payload.status == 200) {
      if (response.action == "GET_ORDERS") {
        const { current_page, data, next_page_url, per_page, total } = response.payload.data;
        setCurrentPage(current_page);
        setNextPageUrl(next_page_url);
        setPerPage(per_page);
        setTotal(total);
        if (current_page == 1) {
          setTableData(data);
        }
        else {
          setTableData([...tableData, ...data]);
        }
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

  const handleSubmit = (e?: any) => {
    if (e) {
      e.preventDefault();
    }

    let formData = {
      page: 1,
      pagesize: 20,
      term: payload.term,
      order_status: payload.order_status
    }
    setLoading(true);
    dispatch(getOrders(formData));
  }
  const handleChange = (e: any) => {
    const { name, value } = e.currentTarget;
    setPayload({
      ...payload,
      [name]: value
    });
  }
  const onSelect = (eventKey: any) => {
    setPayload({
      ...payload,
      ['order_status']: eventKey
    });
  }
  const loadMore = () => {
    let page: any = currentPage + 1;
    setPage(parseInt(page));
  }
  //Get data on when scrolled
  useEffect((): void => {
    if (page && page > 1) {
      console.log('Get next page ', page)
      let formData = {
        page: page,
        pagesize: perPage,
        term: payload.term,
        order_status: payload.order_status
      }
      console.log('Get next page payload ', formData)
      dispatch(getOrders(formData));
    }
  }, [page]);

  //Get data on when scrolled
  useEffect((): void => {
    handleSubmit();
  }, [payload.order_status]);

  const getOrderName = (key: string): string => {
    let value: string = '';
    switch (key) {
      case 'fully_received':
        value = 'Received';
        break;
      case 'not_received':
        value = 'Not Received';
        break;
      case 'partial_received':
        value = 'Partially Received';
        break;
      default:
        value = 'All Purchases';
        break;

    }
    return value;
  }
  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col col-md-2">
            <Dropdown onSelect={onSelect}>
              <Dropdown.Toggle variant="default" id="dropdown-basic">
                {(payload.order_status && payload.order_status !== undefined) ? getOrderName(payload.order_status) : 'All Purchases'}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="">All Purchases</Dropdown.Item>
                <Dropdown.Item eventKey="fully_received">Received</Dropdown.Item>
                <Dropdown.Item eventKey="not_received">Not Received</Dropdown.Item>
                <Dropdown.Item eventKey="partial_received">Partially Received</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="col">
            <FormInput label={false} className="form-control " type="text"
              placeholder="Search..."
              name="term" value={payload.term} onChange={handleChange}
            />
          </div>

          <div className="col text-right">
          {loading && <Spinner animation="border" size="sm" />}
          <Button onClick={() => history.push(`/create-order`)} variant="outline-primary"> Add Purchase Order</Button>{' '}
           
          </div>
        </div>
      </form>

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
                <th scope='col'>Po#</th>
                <th scope='col'>Supplier Name	</th>
                <th scope='col'>Clinic Name	</th>
                <th scope='col'>Order Date & Time	</th>
                <th scope='col'>Status</th>
                <th scope='col'>Action</th>
              </tr>
            </thead>
            <tbody>

              {tableData && tableData.length > 0 ? (
                tableData.map((data: any, index: number): JSX.Element => (

                  <tr
                    key={index + 1}
                    style={{ cursor: 'pointer' }}
                  >
                    <th scope='row'>{data.po_number}</th>
                    <td>{data.supplier.supplier_name}</td>
                    <td>{data.clinic.clinic_name}</td>
                    <td>{data.placed_on}</td>
                    <td>{getOrderName(data.order_status)}</td>
                    <td><Button onClick={() => history.push(`/orders/order-detail/${data.id}`)} variant="outline-primary">View Details</Button>{' '}</td>
                  </tr>
                ))
                
              ) : (
                <NoRecordFound colspan={6}/>
                
              )}



            </tbody>

          </table>
        </InfiniteScroll>
      }

    </Layout>
  );
}

export default PurchaseOrders;
