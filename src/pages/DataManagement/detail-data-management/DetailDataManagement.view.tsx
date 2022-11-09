import React, { useCallback, useState, useEffect } from 'react';
import { Box, styled } from '@mui/system';
import { Button, Card, InputBase } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import './DetailDataManagement.scss';
import SearchDetailDataManagement from './search-detail-data-management/SearchDetailDataManagement';
import ListDetailDataManagement from './list-detail-data-management/ListDetailDataManagement';
import SearchIcon from '@mui/icons-material/Search';
import * as actionsDetailDataManagement from './../../../redux/store/data-management/detail-data-management/detail-data-management.store';
import { debounce } from 'debounce';
import CloseIcon from '@mui/icons-material/Close';
import { ContentSearch, CustomerDocModel } from 'src/models/customer_doc';
import * as actionsDataSource from '../../../redux/store/data-source/data-source.store';
import { DataSource } from 'src/models/data_source';
import moment from 'moment';
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

const DetailDataManagement: React.FC = () => {
  const [detailDataManagements, setDetailDataManagements] = useState([]);
  const [showModalAddorEdit, setShowModalAddorEdit] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<CustomerDocModel | {}>({});
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [dataSearch, setDataSearch] = useState<ContentSearch>({});
  const [searchChildren, setSearchChildren] = useState<ContentSearch>({});
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [totalItemCount, setTotalItemCount] = useState<number>(0);
  const [dataSource, setDataSource] = useState<DataSource[] | []>([]);

  useEffect(() => {
    onResetFilter()
    fetchDataSource()
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
      from_date: null,
      to_date: null,
      customer_code: null,
      uid: null,
      data_source: null
    });
    setSearchChildren({
      from_date: null,
      to_date: null,
      customer_code: null,
      uid: null,
      data_source: null
    })
    onFetchDataCallback(null, null, null, null, null, rowsPerPage, page);
  };
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  const toggleOpenSearch = () => {
    setOpenSearch(!openSearch);
  };
  const onCloseOpenSearch = () => {
    setOpenSearch(!openSearch);
    setSearchChildren({
      from_date: dataSearch.from_date,
      to_date: dataSearch.to_date,
      customer_code: dataSearch.customer_code,
      uid: dataSearch.uid,
      data_source: dataSearch.data_source,
    });
  };
  const onFilter = () => {
    setDataSearch({
      from_date: searchChildren.from_date,
      to_date: searchChildren.to_date,
      customer_code: dataSearch.customer_code,
      uid: searchChildren.uid,
      data_source: searchChildren.data_source,
    })
    onFetchDataCallback(
      searchChildren.from_date,
      searchChildren.to_date,
      dataSearch.customer_code,
      searchChildren.uid,
      searchChildren.data_source?.id,
      rowsPerPage,
      page
    );
  };
  const onRemoveFilterEvent = (name: string) => {
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
        null,
        null,
        searchChildren.customer_code,
        searchChildren.uid,
        searchChildren.data_source?.id,
        rowsPerPage,
        page
      );
    }
    if (name === 'uid') {
      setDataSearch({
        ...dataSearch,
        uid: null
      });
      setSearchChildren({
        ...searchChildren,
        uid: null
      });
      onFetchDataCallback(
        searchChildren.from_date,
        searchChildren.to_date,
        searchChildren.customer_code,
        null,
        searchChildren.data_source?.id,
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
        searchChildren.from_date,
        searchChildren.to_date,
        searchChildren.customer_code,
        searchChildren.uid,
        null,
        rowsPerPage,
        page
      );
    }
    if (name === 'customer_code') {
      setDataSearch({
        ...dataSearch,
        customer_code: ''
      });
      onFetchDataCallback(
        searchChildren.from_date,
        searchChildren.to_date,
        null,
        searchChildren.uid,
        searchChildren.data_source?.id,
        rowsPerPage,
        page
      );
    }
  };
  const onFetchDataCallback = useCallback(
    (
      from_date: Date,
      to_date: Date,
      customer_code: string,
      uid: string,
      data_source: number,
      rowsPerPage: number,
      page: number
    ) => {
      onFetchData(from_date, to_date, customer_code, uid, data_source, rowsPerPage, page);
    },
    [dataSearch, rowsPerPage, page]
  );

  const onFetchData = (
    from_date: Date,
    to_date: Date,
    customer_code: string,
    uid: string,
    data_source: number,
    rowsPerPage: number,
    page: number
  ) => {
    setPage(page);
    let param = `?page_size=${rowsPerPage}&page=${page}`;
    if (from_date) {
      param += `&from_date=${from_date}`;
    }
    if (to_date) {
      param += `&to_date=${to_date}`;
    }
    if (customer_code) {
      param += `&customer_code=${customer_code}`;
    }
    if (data_source) {
      param += `&data_source=${data_source}`;
    }
    if (uid) {
      param += `&uid=${uid}`;
    }
    actionsDetailDataManagement.getDetailDataManagement(param).then((res) => {
      console.log(res);
      if (res && res.data) {
        setDetailDataManagements(res.data);
        setTotalItemCount(res.metadata.total_items);
      }
    });
  };
  const onChangeSearchCallback = useCallback(
    (
      name:string, value:any
    ) => {
      onChangeSearch(name, value)
    }, [searchChildren, dataSearch]
  );
  const onChangeSearch = (name: string, value: any) => {
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
    if (name === 'uid') {
      setSearchChildren({
        ...searchChildren,
        uid: value
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
  const onOpenShowModalEdit = (item: CustomerDocModel) => {
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
          dataSearch.from_date,
          dataSearch.to_date,
          nextValue,
          dataSearch.uid,
          dataSearch.data_source?.id,
          rowsPerPage,
          page
        ),
      1000
    ),
    []
  );

  const onChangePartialUpdate = (item) => {
    console.log("item.recheck", item.recheck);
    
    const data = {
      id: item.id,
      recheck: item.recheck ? false : true,
    }
    console.log("data", data.recheck);
    
    actionsDetailDataManagement.updatePartial(item.id, data).then((res) => {
      console.log(res);
      if (res && res.data) {
        onFetchDataCallback(
          searchChildren.from_date,
          searchChildren.to_date,
          searchChildren.customer_code,
          searchChildren.uid,
          searchChildren.data_source?.id,
          rowsPerPage,
          page
        );
      }
    });
  }

  return (
    <Container className="container-detail-data-management-page">
      <div className="tilte-page">Quản lý dữ liệu chi tiết</div>
      <Card className="detail-data-management-table">
        <div className="e-table-header">
          <div className="d-flex e-header justify-content-between">
            <div className="action-button">
             
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
                  <input type="submit" hidden value="Submit" />
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
            {dataSearch.uid ? (
              <span className="label-result">
                UID/file name: {dataSearch.uid}{' '}
                <span onClick={() => onRemoveFilterEvent('uid')}>
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
          <ListDetailDataManagement
            onFetchData={onFetchDataCallback}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            dataSearch={dataSearch}
            setRowsPerPage={setRowsPerPage}
            totalItemCount={totalItemCount}
            onOpenShowModalEdit={onOpenShowModalEdit}
            onChangePartialUpdate={onChangePartialUpdate}
            detailDataManagements={detailDataManagements}
          />
        </Box>
      </Card>
      <SearchDetailDataManagement
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

export default DetailDataManagement;
