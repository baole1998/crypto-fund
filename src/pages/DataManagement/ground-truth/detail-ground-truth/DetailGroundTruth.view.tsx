import React, { useCallback, useState, useEffect } from 'react';
import { Box, styled } from '@mui/system';
import { Button, Card, InputBase } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import UploadIcon from '@mui/icons-material/Upload';
import SearchDetailGroundTruth from './search-detail-ground-truth/SearchDetailGroundTruth';
import ListDetailGroundTruth from './list-detail-ground-truth/ListDetailGroundTruth';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import * as actionsDetailGroundTruth from 'src/redux/store/data-management/customer-doc/customer-doc.store';
import * as actionsGeneralDataManagement from 'src/redux/store/data-management/ground-truth/ground-truth.store';
import * as actionsDataSource from 'src/redux/store/data-source/data-source.store';
import { debounce } from 'debounce';
import CloseIcon from '@mui/icons-material/Close';
import { ContentSearch, CustomerDocModel } from 'src/models/customer_doc';
import './DetailGroundTruth.scss';
import moment from 'moment';
import { DataSource } from 'src/models/data_source';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useNavigate, useParams } from 'react-router-dom';
import { SyncTaskModel } from 'src/models/sync_task';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { GroundTruthDetailModel } from 'src/models/ground_truth';
import * as actionsCustomerInfo from 'src/redux/store/data-management/customer-info/customer-info.store';
const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: {
    margin: '16px'
  },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '16px'
    }
  }
}));

const DetailGroundTruth: React.FC = () => {
  const [generalDataManagements, setDetailGroundTruths] = useState([]);
  const [showModalAddorEdit, setShowModalAddorEdit] = useState<boolean>(false);
  const [showModalImportFile, setShowModalImportFile] =
    useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<CustomerDocModel | {}>({});
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [dataSearch, setDataSearch] = useState<ContentSearch>({});
  const [searchChildren, setSearchChildren] = useState<ContentSearch>({});
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [totalItemCount, setTotalItemCount] = useState<number>(0);
  const [dataSource, setDataSource] = useState<DataSource[] | []>([]);
  const [detailGroundrTruth, setDetailGroundrTruth] = useState<
    GroundTruthDetailModel[] | []
  >([]);
  const navigate = useNavigate();
  const [listStateEdit, setListStateEdit] = useState<string[]>([]);
  const [tmpDetail, setTmpDetail] = useState<GroundTruthDetailModel[]>([]);
  const { id } = useParams();
  useEffect(() => {
    onResetFilter();
    fetchDataSource();
    if (id) {
      fetchSyncTaskDetail();
    }
  }, []);
  const fetchDataSource = () => {
    actionsDataSource.getDataSource().then((res) => {
      console.log(res);
      if (res && res.data) {
        setDataSource(res.data);
      }
    });
  };
  const fetchSyncTaskDetail = () => {
    actionsGeneralDataManagement.getGroundTruthDetail(id).then((res) => {
      console.log(res);
      if (res && res.data) {
        setDetailGroundrTruth(res.data);
        setTmpDetail(res.data);
      }
    });
  };
  const onChangeStateShowEditCustomerInfo = (name: string) => {
    const data = [...listStateEdit];
    if (listStateEdit.length > 0) {
      const check = listStateEdit.find((item) => item === name);
      if (check) {
        const newData = listStateEdit.filter((item) => item !== name);
        setListStateEdit(newData);
      } else {
        data.push(name);
        setListStateEdit(data);
      }
    } else {
      data.push(name);
      setListStateEdit(data);
    }
  };
  const onChangeCustomerInfo = (
    id: number,
    type: string,
    name: string,
    value: any
  ) => {
    if (name == 'birthday') {
      setTmpDetail((prevState) => {
        const newState = prevState.map((obj) => {
          if (obj.id === id) {
            console.log("zooô");
            console.log("value", value);
            
            return {
              ...obj,
              ground_truth_result: {
                ...obj.ground_truth_result,
                birthday: moment(value).format('YYYY-MM-DD') + 'T00:00:00.000Z'
              }
            };
          }
          // 👇️ otherwise return object as is
          return obj;
        });

        return newState;
      });
    } else if (name == 'issue_date') {
      setTmpDetail((prevState) => {
        const newState = prevState.map((obj) => {
          if (obj.id === id) {
            console.log("zooô");
            console.log("value", value);
            
            return {
              ...obj,
              ground_truth_result: {
                ...obj.ground_truth_result,
                issue_date: moment(value).format('YYYY-MM-DD') + 'T00:00:00.000Z'
              }
            };
          }
          // 👇️ otherwise return object as is
          return obj;
        });

        return newState;
      });
    } else if (name == 'expired_date') {
      setTmpDetail((prevState) => {
        const newState = prevState.map((obj) => {
          if (obj.id === id) {
            return {
              ...obj,
              ground_truth_result: {
                ...obj.ground_truth_result,
                expired_date: moment(value).format('YYYY-MM-DD') + 'T00:00:00.000Z'
              }
            };
          }
          // 👇️ otherwise return object as is
          return obj;
        });

        return newState;
      });
    } else {
      setTmpDetail((prevState) => {
        const newState = prevState.map((obj) => {
          if (obj.id === id) {
            return {
              ...obj,
              [type]: {
                ...obj[type],
                [name]: value
              }
            };
          }
          // 👇️ otherwise return object as is
          return obj;
        });

        return newState;
      });
    }
  };
  const onResetFilter = () => {
    setDataSearch({
      customer_code: null,
      status: null,
      from_date: null,
      to_date: null,
      data_source: null
    });
    setSearchChildren({
      customer_code: null,
      status: null,
      from_date: null,
      to_date: null,
      data_source: null
    });
    onFetchDataCallback(null, null, null, null, null, rowsPerPage, 1);
  };
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  const toggleOpenSearch = () => {
    setOpenSearch(!openSearch);
  };
  const onCloseOpenSearch = () => {
    setOpenSearch(!openSearch);
    setSearchChildren({
      customer_code: dataSearch.customer_code,
      status: dataSearch.status,
      from_date: searchChildren.from_date,
      to_date: searchChildren.to_date,
      data_source: searchChildren.data_source
    });
  };
  const onFilter = () => {
    setDataSearch({
      status: searchChildren.status,
      from_date: searchChildren.from_date,
      to_date: searchChildren.to_date,
      data_source: searchChildren.data_source
    });
    onFetchDataCallback(
      dataSearch.customer_code,
      searchChildren.status,
      searchChildren.from_date,
      searchChildren.to_date,
      searchChildren.data_source?.id,
      rowsPerPage,
      page
    );
  };
  const onRemoveFilterEvent = (name: string) => {
    if (name === 'data_source') {
      setDataSearch({
        ...dataSearch,
        data_source: null
      });
      setSearchChildren({
        ...searchChildren,
        data_source: null
      });
      onFetchDataCallback(
        dataSearch.customer_code,
        searchChildren.status,
        searchChildren.from_date,
        searchChildren.to_date,
        null,
        rowsPerPage,
        page
      );
    }
    if (name === 'date_time') {
      setDataSearch({
        ...dataSearch,
        from_date: null,
        to_date: null
      });
      setSearchChildren({
        ...searchChildren,
        from_date: null,
        to_date: null
      });
      onFetchDataCallback(
        dataSearch.customer_code,
        searchChildren.status,
        null,
        null,
        searchChildren.data_source?.id,
        rowsPerPage,
        page
      );
    }

    if (name === 'status') {
      setDataSearch({
        ...dataSearch,
        status: null
      });
      setSearchChildren({
        ...searchChildren,
        status: null
      });
      onFetchDataCallback(
        searchChildren.customer_code,
        null,
        searchChildren.from_date,
        searchChildren.to_date,
        searchChildren.data_source?.id,
        rowsPerPage,
        page
      );
    }
    if (name === 'customer_code') {
      setDataSearch({
        ...dataSearch,
        customer_code: null
      });
      onFetchDataCallback(
        dataSearch.customer_code,
        dataSearch.status,
        searchChildren.from_date,
        searchChildren.to_date,
        searchChildren.data_source?.id,
        rowsPerPage,
        page
      );
    }
  };
  const onFetchDataCallback = useCallback(
    (
      customer_code: string,
      status: string[],
      from_date: Date,
      to_date: Date,
      data_source: number,
      rowsPerPage: number,
      page: number
    ) => {
      onFetchData(
        customer_code,
        status,
        from_date,
        to_date,
        data_source,
        rowsPerPage,
        page
      );
    },
    [dataSearch, rowsPerPage, page]
  );
  const onFetchData = (
    customer_code: string,
    status: string[],
    from_date: Date,
    to_date: Date,
    data_source: number,
    rowsPerPage: number,
    page: number
  ) => {
    setPage(page);
    let param = `?page_size=${rowsPerPage}&page=${page}`;
    if (id) {
      param += `&id_sync_task=${id}`;
    }
    if (customer_code) {
      param += `&customer_code=${customer_code}`;
    }
    if (status) {
      param += `&status=${status.toString()}`;
    }
    if (from_date) {
      param += `&from_date=${moment(new Date(from_date)).format(
        'YYYY-MM-DD 00:00:00'
      )}`;
    }
    if (to_date) {
      param += `&to_date=${moment(new Date(to_date)).format(
        'YYYY-MM-DD 23:59:59'
      )}`;
    }
    if (data_source) {
      param += `&data_source=${data_source}`;
    }
    actionsDetailGroundTruth.getCustomerDoc(param).then((res) => {
      console.log(res);
      if (res && res.data) {
        setDetailGroundTruths(res.data);
        setTotalItemCount(res.metadata.total_items);
      }
    });
  };
  const onChangeSearchCallback = useCallback(
    (name: string, value: any) => {
      onChangeSearch(name, value);
    },
    [searchChildren, dataSearch]
  );
  const onCheckStatus = (value: string) => {
    let dataStatusNew: string[] = searchChildren.status || [];
    const dataStatusOld = searchChildren.status || [];
    if (dataStatusOld && dataStatusOld.length > 0) {
      const status = dataStatusOld.find((item) => item === value);
      if (status) {
        dataStatusNew = dataStatusOld.filter((item) => item != status);
      } else {
        dataStatusNew.push(value);
      }
    } else {
      dataStatusNew.push(value);
    }
    if (dataStatusOld.length === 4) {
      dataStatusNew = [];
    }
    return dataStatusNew;
  };
  const onChangeSearch = (name: string, value: any) => {
    if (name === 'status') {
      setSearchChildren({
        ...searchChildren,
        status: onCheckStatus(value)
      });
    }

    if (name === 'from_date') {
      setSearchChildren({
        ...searchChildren,
        from_date: value
      });
    }
    if (name === 'to_date') {
      setSearchChildren({
        ...searchChildren,
        to_date: value
      });
    }
    if (name === 'data_source') {
      setSearchChildren({
        ...searchChildren,
        data_source: value
      });
    }
    if (name === 'customer_code') {
      setDataSearch({
        ...dataSearch,
        customer_code: value
      });
      debounceData(value);
    }
  };
  const onOpenShowModalAdd = () => {
    setShowModalAddorEdit(true);
  };
  const onOpenShowModalImportFile = () => {
    setShowModalImportFile(true);
  };
  const onOpenShowModalEdit = (item: CustomerDocModel) => {
    setShowModalAddorEdit(true);
    setEditItem(item);
  };
  const onHiddenShowModalAddorEdit = () => {
    setShowModalAddorEdit(false);
    setEditItem({});
  };
  const onHiddenShowModalImportFile = () => {
    setShowModalImportFile(false);
    setEditItem({});
  };

  const debounceData = useCallback(
    debounce(
      (nextValue) =>
        onFetchDataCallback(
          nextValue,
          dataSearch.status,
          searchChildren.from_date,
          searchChildren.to_date,
          searchChildren.data_source?.id,
          rowsPerPage,
          page
        ),
      1000
    ),
    []
  );

  const onGoback = () => {
    navigate('/ground-truth');
  };
  const onSaveCustomerInfo = (data: any) => {
    const dataUpdate = {
      ...data,
      birthday: data?.birthday ? moment(new Date(data.birthday)) : '',
      expired_date: data.expired_date
        ? moment(new Date(data.expired_date))
        : '',
      issue_date: data.issue_date ? moment(new Date(data.issue_date)) : ''
    };
    actionsCustomerInfo
      .updateCustomerInfo(dataUpdate.id, dataUpdate)
      .then((res) => {
        console.log(res);
        if (res && res.data) {
          setListStateEdit([]);
          // onResetFilter();
        }
      });
  };
  const onSaveCustomerInfoStatus = (data: any, name:string) => {
    const dataUpdate = {
      ...data,
      [name]: !data[name]
    };
    actionsCustomerInfo
      .updateCustomerInfo(dataUpdate.id, dataUpdate)
      .then((res) => {
        console.log(res);
        if (res && res.data) {
          setListStateEdit([]);
          // onResetFilter();
        }
      });
  };
  const onSaveCustomerInfoTime = (data: any, name:string, value: any) => {
    const dataUpdate = {
      ...data,
      [name]: value
    };
    actionsCustomerInfo
      .updateCustomerInfo(dataUpdate.id, dataUpdate)
      .then((res) => {
        console.log(res);
        if (res && res.data) {
          setListStateEdit([]);
          // onResetFilter();
        }
      });
  };
  return (
    <Container className="container-general-data-management-page">
      <div className="go-back" onClick={onGoback}>
        <ArrowBackIosIcon fontSize="small" />
        <span>Quay lại</span>
      </div>
      <div className="tilte-page">Màn hình kết quả GroundTruth</div>
      <Card className="general-data-management-table">
        <div className="e-table-header">
          <div className="d-flex e-header justify-content-between">
            <div className="action-button"></div>
            <div className="action-left">
              {/* <Button
                    style={{ color: '#fff', background: '#212943' }}
                    variant="contained"
                  >
                    Duyệt tất cả lên level 2
                  </Button> */}
            </div>
            {/* <div className='action-right'>
                {
                  JSON.stringify(generalDataManagements) != JSON.stringify(tmpDetail) ? <><div className='btn-customer-info-cancel' onClick={()=>{setTmpDetail(generalDataManagements);  setListStateEdit([])}}>Huỷ</div>
                  <div className='btn-customer-info-save' onClick={()=>onSaveCustomerInfo()} >Xác nhận</div> </>: ""
                }
         </div> */}
            {/* <div className="d-flex align-items-center">
              <form className="from-search">
                <Box
                  className={`d-flex box-input-search ${
                    focused ? 'input-focused' : ''
                  }`}
                >
                  <InputBase
                    type="text"
                    onFocus={onFocus}
                    onBlur={onBlur}
                    onChange={(e) =>
                      onChangeSearchCallback('customer_code', e.target.value)
                    }
                    name="query_contains"
                    value={dataSearch.customer_code}
                    className="input-search"
                    placeholder="Tìm kiếm theo TKCK..."
                    startAdornment={<SearchIcon />}
                  />
                </Box>
              </form>
              <div className="action-button" onClick={toggleOpenSearch}>
                <FilterAltIcon />
              </div>
            </div> */}
          </div>

          <div className="item-result">
            {dataSearch.customer_code ? (
              <span className="label-result">
                TKCK: {dataSearch.customer_code}{' '}
                <span onClick={() => onRemoveFilterEvent('customer_code')}>
                  <CloseIcon />
                </span>
              </span>
            ) : (
              ''
            )}
            {dataSearch.data_source ? (
              <span className="label-result">
                Kênh dữ liệu: {dataSearch.data_source?.name}{' '}
                <span onClick={() => onRemoveFilterEvent('data_source')}>
                  <CloseIcon />
                </span>
              </span>
            ) : (
              ''
            )}
            {dataSearch?.from_date || dataSearch?.to_date ? (
              <span className="label-result">
                Khoảng thời gian:{' '}
                {dataSearch?.from_date
                  ? moment(new Date(dataSearch?.from_date)).format('DD/MM/YYYY')
                  : '---'}{' '}
                {' - '}{' '}
                {dataSearch?.to_date
                  ? moment(new Date(dataSearch?.to_date)).format('DD/MM/YYYY')
                  : '---'}
                <span onClick={() => onRemoveFilterEvent('date_time')}>
                  <CloseIcon />
                </span>
              </span>
            ) : (
              ''
            )}
          </div>
        </div>

        <Box overflow="auto" padding="15px">
          <ListDetailGroundTruth
            onFetchData={onFetchDataCallback}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            dataSearch={dataSearch}
            setRowsPerPage={setRowsPerPage}
            totalItemCount={totalItemCount}
            onChangeStateShowEditCustomerInfo={
              onChangeStateShowEditCustomerInfo
            }
            onChangeCustomerInfo={onChangeCustomerInfo}
            generalDataManagements={tmpDetail}
            listStateEdit={listStateEdit}
            onSaveCustomerInfo={onSaveCustomerInfo}
            onSaveCustomerInfoStatus={onSaveCustomerInfoStatus}
            onSaveCustomerInfoTime={onSaveCustomerInfoTime}
          />
        </Box>
      </Card>
      <SearchDetailGroundTruth
        openSearch={openSearch}
        onChangeSearch={onChangeSearchCallback}
        toggleOpenSearch={toggleOpenSearch}
        onCloseOpenSearch={onCloseOpenSearch}
        searchChildren={searchChildren}
        onSummitSearch={onFilter}
        onResetFilter={onResetFilter}
        dataSource={dataSource}
      />
    </Container>
  );
};

export default DetailGroundTruth;
