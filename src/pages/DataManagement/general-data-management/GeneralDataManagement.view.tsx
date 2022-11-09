import React, { useCallback, useState, useEffect } from 'react';
import { Box, styled } from '@mui/system';
import { Button, Card, InputBase } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import UploadIcon from '@mui/icons-material/Upload';
import SearchGeneralDataManagement from './search-general-data-management/SearchGeneralDataManagement';
import ListGeneralDataManagement from './list-general-data-management/ListGeneralDataManagement';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddOrEditGeneralDataManagement from './add-general-data-management/AddOrEditGeneralDataManagement';
import * as actionsGeneralDataManagement from './../../../redux/store/sync-task/sync-task.store';
import * as actionsDataSource from '../../../redux/store/data-source/data-source.store';
import { debounce } from 'debounce';
import CloseIcon from '@mui/icons-material/Close';
import { ContentSearch, SyncTaskModel } from 'src/models/sync_task';
import './GeneralDataManagement.scss';
import moment from 'moment';
import { DataSource } from 'src/models/data_source';
import ImportFileImage from './import-file-image/ImportFileImage';
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

const GeneralDataManagement: React.FC = () => {
  const [generalDataManagements, setGeneralDataManagements] = useState([]);
  const [showModalAddorEdit, setShowModalAddorEdit] = useState<boolean>(false);
  const [showModalImportFile, setShowModalImportFile] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<SyncTaskModel | {}>({});
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [dataSearch, setDataSearch] = useState<ContentSearch>({});
  const [searchChildren, setSearchChildren] = useState<ContentSearch>({});
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [totalItemCount, setTotalItemCount] = useState<number>(0);
  const [dataSource, setDataSource] = useState<DataSource[] | []>([]);

  useEffect(() => {
    onResetFilter();
    fetchDataSource();
  }, []);
  const fetchDataSource = () => {
    actionsDataSource.getDataSource().then((res) => {
      console.log(res);
      if (res && res.data) {
        setDataSource(res.data);
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
      name_task: null
    });
    setSearchChildren({
      customer_code: null,
      status: null,
      from_date: null,
      to_date: null,
      data_source: null,
      name_task: null
    });
    onFetchDataCallback(null, null, null, null, null, null, rowsPerPage, 1);
  };
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  const toggleOpenSearch = () => {
    setOpenSearch(!openSearch);
  };
  const onCloseOpenSearch = () => {
    setOpenSearch(!openSearch);
    // setSearchChildren({
    //   customer_code: dataSearch.customer_code,
    //   status: dataSearch.status,
    //   from_date: searchChildren.from_date,
    //   to_date: searchChildren.to_date,
    //   data_source: searchChildren.data_source,
    //   name_task: searchChildren.name_task
    // });
  };
  const onFilter = () => {
    setDataSearch({
      customer_code: searchChildren.customer_code,
      status: searchChildren.status,
      from_date: searchChildren.from_date,
      to_date: searchChildren.to_date,
      data_source: searchChildren.data_source,
      name_task: dataSearch.name_task
    });
    onFetchDataCallback(
      searchChildren.customer_code,
      searchChildren.status,
      searchChildren.from_date,
      searchChildren.to_date,
      searchChildren.data_source?.id,
      dataSearch.name_task,
      rowsPerPage,
      page
    );
  };
  const onRemoveFilterEvent = (name: string) => {
    if (name === 'customer_code') {
      setDataSearch({
        ...dataSearch,
        customer_code: null
      });
      setSearchChildren({
        ...searchChildren,
        customer_code: null
      });
      onFetchDataCallback(
        null,
        searchChildren.status,
        searchChildren.from_date,
        searchChildren.to_date,
        searchChildren.data_source?.id,
        dataSearch.name_task,
        rowsPerPage,
        page
      );
    }
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
        searchChildren.customer_code,
        searchChildren.status,
        searchChildren.from_date,
        searchChildren.to_date,
        null,
        dataSearch.name_task,
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
        searchChildren.customer_code,
        searchChildren.status,
        null,
        null,
        searchChildren.data_source?.id,
        dataSearch.name_task,
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
        dataSearch.name_task,
        rowsPerPage,
        page
      );
    }
    if (name === 'name_task') {
      setDataSearch({
        ...dataSearch,
        name_task: null
      });
      onFetchDataCallback(
        dataSearch.customer_code,
        dataSearch.status,
        searchChildren.from_date,
        searchChildren.to_date,
        searchChildren.data_source?.id,
        null,
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
      name_task: string,
      rowsPerPage: number,
      page: number
    ) => {
      onFetchData(
        customer_code,
        status,
        from_date,
        to_date,
        data_source,
        name_task,
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
    name_task: string,
    rowsPerPage: number,
    page: number
  ) => {
    setPage(page);
    let param = `?page_size=${rowsPerPage}&page=${page}`;
   
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
    if (name_task) {
      param += `&sync_task_name=${name_task}`;
    }
    if (data_source) {
      param += `&data_source=${data_source}`;
    }
    actionsGeneralDataManagement.getSyncTask(param).then((res) => {
      console.log(res);
      if (res && res.data) {
        setGeneralDataManagements(res.data);
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
    if (name === 'customer_code') {
      setSearchChildren({
        ...searchChildren,
        customer_code: value
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
    if (name === 'name_task') {
      setDataSearch({
        ...dataSearch,
        name_task: value
      });
      debounceData(value);
    }
  };
  const onOpenShowModalAdd = () => {
    setShowModalAddorEdit(true);
  };
  const onOpenShowModalEdit = (item: SyncTaskModel) => {
    setShowModalAddorEdit(true);
    setEditItem(item);
  };
  const onHiddenShowModalAddorEdit = () => {
    setShowModalAddorEdit(false);
    setEditItem({});
  };
  const debounceData = useCallback(
    debounce(
      (nextValue) =>
        onFetchDataCallback(
          dataSearch.customer_code,
          dataSearch.status,
          searchChildren.from_date,
          searchChildren.to_date,
          searchChildren.data_source?.id,
          nextValue,
          rowsPerPage,
          page
        ),
      1000
    ),
    []
  );
  return (
    <Container className="container-general-data-management-page">
      <div className="tilte-page">Quản lý dữ liệu tổng hợp</div>
      <Card className="general-data-management-table">
        <div className="e-table-header">
          <div className="d-flex e-header justify-content-between">
            <div className="action-button">
              <Button
                className="outline"
                variant="contained"
                onClick={onOpenShowModalAdd}
              >
                {/* <UploadIcon /> */}
                Thêm mới
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
                      onChangeSearchCallback('name_task', e.target.value)
                    }
                    name="query_contains"
                    value={dataSearch.name_task}
                    className="input-search"
                    placeholder="Tìm kiếm theo task..."
                    startAdornment={<SearchIcon />}
                  />
                  <input type="submit" hidden value="Submit" />
                </Box>
              </form>
              <div className="action-button" onClick={toggleOpenSearch}>
                <FilterAltIcon />
              </div>
            </div>
          </div>

          <div className="item-result">
            {dataSearch.name_task ? (
              <span className="label-result">
                Tên task: {dataSearch.name_task}{' '}
                <span onClick={() => onRemoveFilterEvent('name_task')}>
                  <CloseIcon />
                </span>
              </span>
            ) : (
              ''
            )}
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
            {dataSearch.status ? (
              <span className="label-result">
                Trạng thái: {dataSearch.status.toString()}{' '}
                <span onClick={() => onRemoveFilterEvent('status')}>
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
          <ListGeneralDataManagement
            onFetchData={onFetchDataCallback}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            dataSearch={dataSearch}
            setRowsPerPage={setRowsPerPage}
            totalItemCount={totalItemCount}
            onOpenShowModalEdit={onOpenShowModalEdit}
            generalDataManagements={generalDataManagements}
          />
        </Box>
      </Card>
      <SearchGeneralDataManagement
        openSearch={openSearch}
        onChangeSearch={onChangeSearchCallback}
        toggleOpenSearch={toggleOpenSearch}
        onCloseOpenSearch={onCloseOpenSearch}
        searchChildren={searchChildren}
        onSummitSearch={onFilter}
        onResetFilter={onResetFilter}
        dataSource={dataSource}
      />
      {/* {showModalAddorEdit ? (
        <AddOrEditGeneralDataManagement
          setEditItem={setEditItem}
          editItem={editItem}
          rowsPerPage={rowsPerPage}
          dataSearch={dataSearch}
          onFetchData={onFetchDataCallback}
          show={showModalAddorEdit}
          onHandleClose={onHiddenShowModalAddorEdit}
          dataSource={dataSource}
        ></AddOrEditGeneralDataManagement>
      ) : (
        ''
      )} */}
      {showModalAddorEdit ? (
        <ImportFileImage
          setEditItem={setEditItem}
          editItem={editItem}
          rowsPerPage={rowsPerPage}
          dataSearch={dataSearch}
          onFetchData={onFetchDataCallback}
          show={showModalAddorEdit}
          onHandleClose={onHiddenShowModalAddorEdit}
          dataSource={dataSource}
        ></ImportFileImage>
      ) : (
        ''
      )}
    </Container>
  );
};

export default GeneralDataManagement;
