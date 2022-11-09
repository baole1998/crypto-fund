import React, { useCallback, useState, useEffect } from 'react';
import { Box, styled } from '@mui/system';
import { Button, Card, InputBase } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import UploadIcon from '@mui/icons-material/Upload';
import SearchDetailGeneralDataManagement from './search-detail-general-data-management/SearchDetailGeneralDataManagement';
import ListDetailGeneralDataManagement from './list-detail-general-data-management/ListDetailGeneralDataManagement';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import * as actionsDetailGeneralDataManagement from 'src/redux/store/data-management/customer-doc/customer-doc.store';
import * as actionsGeneralDataManagement from 'src/redux/store/sync-task/sync-task.store';
import * as actionsDataSource from 'src/redux/store/data-source/data-source.store';
import { debounce } from 'debounce';
import CloseIcon from '@mui/icons-material/Close';
import { ContentSearch, CustomerDocModel } from 'src/models/customer_doc';
import './DetailGeneralDataManagement.scss';
import moment from 'moment';
import { DataSource } from 'src/models/data_source';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ImportFileImage from '../import-file-image/ImportFileImage';
import { useNavigate, useParams } from 'react-router-dom';
import { SyncTaskModel } from 'src/models/sync_task';
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

const DetailDetailGeneralDataManagement: React.FC = () => {
  const [generalDataManagements, setDetailGeneralDataManagements] = useState([]);
  const [showModalAddorEdit, setShowModalAddorEdit] = useState<boolean>(false);
  const [showModalImportFile, setShowModalImportFile] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<CustomerDocModel | {}>({});
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [dataSearch, setDataSearch] = useState<ContentSearch>({});
  const [searchChildren, setSearchChildren] = useState<ContentSearch>({});
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [totalItemCount, setTotalItemCount] = useState<number>(0);
  const [dataSource, setDataSource] = useState<DataSource[] | []>([]);
  const [detailSyncTask, setDetailSyncTask] = useState<SyncTaskModel>({});
  const navigate = useNavigate()
  const { id } = useParams()
  useEffect(() => {
    onResetFilter();
    fetchDataSource();
    if(id) {
      fetchSyncTaskDetail()
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
    actionsGeneralDataManagement.detailSyncTask(id).then((res) => {
      console.log(res);
      if (res && res.data) {
        setDetailSyncTask(res.data);
      }
    });
  };
  const onResetFilter = () => {
    setDataSearch({
      customer_code: null,
      status: null,
      from_date: null,
      to_date: null,
      data_source: null,
    });
    setSearchChildren({
      customer_code: null,
      status: null,
      from_date: null,
      to_date: null,
      data_source: null,
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
      data_source: searchChildren.data_source,
    });
  };
  const onFilter = () => {
    setDataSearch({
      status: searchChildren.status,
      from_date: searchChildren.from_date,
      to_date: searchChildren.to_date,
      data_source: searchChildren.data_source,
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
    if(id) {
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
    actionsDetailGeneralDataManagement.getCustomerDoc(param).then((res) => {
      console.log(res);
      if (res && res.data) {
        setDetailGeneralDataManagements(res.data);
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
    if(dataStatusOld.length === 4) {
      dataStatusNew = []
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
  const onChangeTaskTrigger = () => {
    actionsGeneralDataManagement
      .updateTaskTrigger(id)
      .then((res) => {
        if (res) {
          onFetchData(
            dataSearch.customer_code,
            dataSearch.status,
            dataSearch.from_date,
            dataSearch.to_date,
            dataSearch.data_source?.id,
            rowsPerPage,
            1
          );
        }
      });
  };
  const onGoback = () => {
    navigate('/general-data-management')
  }
  return (
    <Container className="container-general-data-management-page">
      <div className="go-back" onClick={onGoback}>
       {`<`} <span>Quay lại</span>
    </div>
      <div className="tilte-page">{detailSyncTask?.name}</div>
      <Card className="general-data-management-table">
        <div className="e-table-header">
          <div className="d-flex e-header justify-content-between">
            <div className="action-button">
               <Button
                style={{ color: '#fff', background: '#212943' }}
                variant="contained"
                onClick={onChangeTaskTrigger}
              >
                <PlayCircleIcon />
                Chạy tất cả
              </Button>
            </div>
            <div className="d-flex align-items-center">
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
                  {/* <input type="submit" hidden value="Submit" /> */}
                </Box>
              </form>
              <div className="action-button" onClick={toggleOpenSearch}>
                <FilterAltIcon />
              </div>
            </div>
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
          <ListDetailGeneralDataManagement
            onFetchData={onFetchDataCallback}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            dataSearch={dataSearch}
            setRowsPerPage={setRowsPerPage}
            totalItemCount={totalItemCount}
            // onOpenShowModalEdit={onOpenShowModalEdit}
            generalDataManagements={generalDataManagements}
          />
        </Box>
      </Card>
      <SearchDetailGeneralDataManagement
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

export default DetailDetailGeneralDataManagement;
