import React, { useCallback, useState, useEffect } from 'react';
import { Box, styled } from '@mui/system';
import { Button, Card, InputBase } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import './GroundTruth.scss';
import SearchGroundTruth from './search-ground-truth/SearchGroundTruth';
import ListGroundTruth from './list-ground-truth/ListGroundTruth';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddOrEditGroundTruth from './add-ground-truth/add-batch/AddOrEditGroundTruth';
import * as actionsGroundTruth from '../../../redux/store/data-management/ground-truth/ground-truth.store';
import { debounce } from 'debounce';
import CloseIcon from '@mui/icons-material/Close';
import { ContentSearch, GroundTruthModel } from 'src/models/ground_truth';
import useComponentVisible from 'src/hooks/checkOutSideDiv';
import { useNavigate } from 'react-router';
import * as actionsDataSource from '../../../redux/store/data-source/data-source.store';
import { DataSource } from 'src/models/data_source';
import { EngineModel } from 'src/models/engine';
import * as actionsEngine from 'src/redux/store/engine/engine.store';
import * as actionsUser from 'src/redux/store/user/user.store';
import { UserModel } from 'src/models/user';
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

const GroundTruth: React.FC = () => {
  const [groundTruths, setGroundTruths] = useState([]);
  const [dataSource, setDataSource] = useState<DataSource[] | []>([]);
  const [engine, setEngine] = useState<EngineModel[] | []>([]);
  const [user, setUser] = useState<UserModel[] | []>([]);
  const [showModalAddorEdit, setShowModalAddorEdit] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<GroundTruthModel | {}>({});
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [dropdownMenu, setDropdownMenu] = useState<boolean>(false);
  const [dataSearch, setDataSearch] = useState<ContentSearch>({});
  const [searchChildren, setSearchChildren] = useState<ContentSearch>({});
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [totalItemCount, setTotalItemCount] = useState<number>(0);
  const { ref, isComponentVisible, setIsComponentVisible } =
    useComponentVisible(false);
  const navigate = useNavigate();
  useEffect(() => {
    onResetFilter();
    fetchDataSource();
    fetchEngine();
    fetchCreator();
  }, []);

  const fetchDataSource = () => {
    actionsDataSource.getDataSource().then((res) => {
      if (res && res.data) {
        setDataSource(res.data);
      }
    });
  };
  const fetchEngine = () => {
    actionsEngine.getEngine().then((res) => {
      console.log(res);
      if (res && res.data) {
        setEngine(res.data);
      }
    });
  };
  const fetchCreator = () => {
    actionsUser.getUser().then((res) => {
      console.log(res);
      if (res && res.data) {
        setUser(res.data);
      }
    });
  };
  const onResetFilter = () => {
    setDataSearch({
      code: null,
      status: null,
      to_date: null,
      from_date: null,
      data_source: null,
      engine1_id: null,
      engine2_id: null,
      creator: null
    });
    setSearchChildren({
      code: null,
      status: null,
      to_date: null,
      from_date: null,
      data_source: null,
      engine1_id: null,
      engine2_id: null,
      creator: null
    });
    onFetchDataCallback(
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      rowsPerPage,
      page
    );
  };
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  const toggleOpenSearch = () => {
    setOpenSearch(!openSearch);
  };
  const onCloseOpenSearch = () => {
    setOpenSearch(!openSearch);
    setSearchChildren({
      code: dataSearch.code,
      status: dataSearch.status,
      to_date: dataSearch.to_date,
      from_date: dataSearch.from_date,
      data_source: dataSearch.data_source,
      engine1_id: dataSearch.engine1_id,
      engine2_id: dataSearch.engine2_id,
      creator: dataSearch.creator
    });
  };
  const onFilter = () => {
    setDataSearch({
      code: dataSearch.code,
      status: searchChildren.status,
      to_date: searchChildren.to_date,
      from_date: searchChildren.from_date,
      data_source: searchChildren.data_source,
      engine1_id: searchChildren.engine1_id,
      engine2_id: searchChildren.engine2_id,
      creator: searchChildren.creator
    });
    onFetchDataCallback(
      dataSearch.code,
      searchChildren.status,
      searchChildren.to_date,
      searchChildren.from_date,
      searchChildren.data_source?.id,
      searchChildren.engine1_id,
      searchChildren.engine2_id,
      searchChildren.creator,
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
        dataSearch.status,
        null,
        null,
        dataSearch.data_source?.id,
        dataSearch.engine1_id,
        dataSearch.engine2_id,
        dataSearch.creator,
        rowsPerPage,
        page
      );
    }
    if (name === 'creator') {
      setDataSearch({
        ...dataSearch,
        creator: null
      });
      setSearchChildren({
        ...searchChildren,
        creator: null
      });
      onFetchDataCallback(
        dataSearch.code,
        dataSearch.status,
        dataSearch.to_date,
        dataSearch.from_date,
        dataSearch.data_source?.id,
        dataSearch.engine1_id,
        dataSearch.engine2_id,
        null,
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
        dataSearch.code,
        dataSearch.status,
        dataSearch.to_date,
        dataSearch.from_date,
        null,
        dataSearch.engine1_id,
        dataSearch.engine2_id,
        dataSearch.creator,
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
        dataSearch.code,
        null,
        dataSearch.to_date,
        dataSearch.from_date,
        dataSearch.data_source?.id,
        dataSearch.engine1_id,
        dataSearch.engine2_id,
        dataSearch.creator,
        rowsPerPage,
        page
      );
    }
    if (name === 'engine2_id') {
      setDataSearch({
        ...dataSearch,
        engine2_id: null
      });
      setSearchChildren({
        ...searchChildren,
        engine2_id: null
      });
      onFetchDataCallback(
        dataSearch.code,
        dataSearch.status,
        dataSearch.to_date,
        dataSearch.from_date,
        dataSearch.data_source?.id,
        dataSearch.engine1_id,
        null,
        dataSearch.creator,
        rowsPerPage,
        page
      );
    }
    if (name === 'engine1_id') {
      setDataSearch({
        ...dataSearch,
        engine1_id: null
      });
      setSearchChildren({
        ...searchChildren,
        engine1_id: null
      });
      onFetchDataCallback(
        dataSearch.code,
        dataSearch.status,
        dataSearch.to_date,
        dataSearch.from_date,
        dataSearch.data_source?.id,
        null,
        dataSearch.engine2_id,
        dataSearch.creator,
        rowsPerPage,
        page
      );
    }
    if (name === 'code') {
      setDataSearch({
        ...dataSearch,
        code: null
      });
      onFetchDataCallback(
        null,
        dataSearch.status,
        dataSearch.to_date,
        dataSearch.from_date,
        dataSearch.data_source?.id,
        dataSearch.engine1_id,
        dataSearch.engine2_id,
        dataSearch.creator,
        rowsPerPage,
        page
      );
    }
  };
  const onFetchDataCallback = useCallback(
    (
      code: string,
      status: string[],
      to_date: Date,
      from_date: Date,
      data_source: number,
      engine1_id: EngineModel,
      engine2_id: EngineModel,
      creator: UserModel,
      rowsPerPage: number,
      page: number
    ) => {
      onFetchData(
        code,
        status,
        to_date,
        from_date,
        data_source,
        engine1_id,
        engine2_id,
        creator,
        rowsPerPage,
        page
      );
    },
    [dataSearch, rowsPerPage, page]
  );
  const onFetchData = (
    code: string,
    status: string[],
    to_date: Date,
    from_date: Date,
    data_source: number,
    engine1_id: EngineModel,
    engine2_id: EngineModel,
    creator: UserModel,
    pageSize: number,
    propsPage: number
  ) => {
    let currentPage = propsPage ?? page;
    let currentPageSize = pageSize ?? rowsPerPage;
    let param = `?page_size=${currentPageSize}&page=${currentPage}`;
    setPage(currentPage);

    if (code) {
      param += `&code=${code}`;
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
    if (engine1_id) {
      param += `&engine1_id=${engine1_id.id}`;
    }
    if (engine2_id) {
      param += `&engine2_id=${engine2_id.id}`;
    }
    if (creator) {
      param += `&user_id=${creator.id}`;
    }
    if (data_source) {
      param += `&data_source=${data_source}`;
    }

    actionsGroundTruth.getGroundTruth(param).then((res) => {
      console.log(res);
      if (res && res.data) {
        setGroundTruths(res.data);
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
    if (name === 'to_date') {
      setSearchChildren({
        ...searchChildren,
        to_date: value
      });
    }
    if (name === 'status') {
      setSearchChildren({
        ...searchChildren,
        status: onCheckStatus(value)
      });
    }
    if (name === 'data_source') {
      setSearchChildren({
        ...searchChildren,
        data_source: value
      });
    }
    if (name === 'engine1_id') {
      setSearchChildren({
        ...searchChildren,
        engine1_id: value
      });
    }
    if (name === 'engine2_id') {
      setSearchChildren({
        ...searchChildren,
        engine2_id: value
      });
    }
    if (name === 'code') {
      setDataSearch({
        ...dataSearch,
        code: value
      });
      debounceData(value);
    }
  };
  const onOpenShowModalAdd = () => {
    setShowModalAddorEdit(true);
    setIsComponentVisible(false);
  };
  const onOpenShowModalEdit = (item: GroundTruthModel) => {
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
          nextValue,
          dataSearch.status,
          dataSearch.to_date,
          dataSearch.from_date,
          dataSearch.data_source?.id,
          dataSearch.engine1_id,
          dataSearch.engine2_id,
          dataSearch.creator,
          rowsPerPage,
          page
        ),
      1000
    ),
    []
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
  return (
    <Container className="container-ground-truth-page">
      <div className="tilte-page">Tạo dữ liệu chuẩn</div>
      <Card className="ground-truth-table">
        <div className="e-table-header">
          <div className="d-flex e-header justify-content-between">
            <div className="action-button">
              <Button
                style={{ color: '#fff', background: '#212943' }}
                variant="contained"
                onClick={() => navigate('/ground-truth/add-appoint')}
              >
                <AddCircleOutlineIcon />
                Thêm mới
              </Button>
              {/* {
                isComponentVisible ? <div className="dropdown-menu-add" ref={ref}>
                <div className="menu-item"  onClick={onOpenShowModalAdd}>Thêm mới Batch</div>
                <div className="menu-item" onClick={()=>navigate('/ground-truth/add-appoint')}>Thêm mới Chỉ định</div>
              </div> : ""
              } */}
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
                      onChangeSearchCallback('code', e.target.value)
                    }
                    name="query_contains"
                    value={dataSearch.code}
                    className="input-search"
                    placeholder="Tìm kiếm theo mã GT..."
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
            {dataSearch.code ? (
              <span className="label-result">
                Mã GT: {dataSearch.code}{' '}
                <span onClick={() => onRemoveFilterEvent('code')}>
                  <CloseIcon />
                </span>
              </span>
            ) : (
              ''
            )}
            {dataSearch.creator ? (
              <span className="label-result">
                Người tạo: {dataSearch.creator.full_name}{' '}
                <span onClick={() => onRemoveFilterEvent('creator')}>
                  <CloseIcon />
                </span>
              </span>
            ) : (
              ''
            )}
            {dataSearch.engine1_id ? (
              <span className="label-result">
                Engine1: {dataSearch.engine1_id.name}{' '}
                <span onClick={() => onRemoveFilterEvent('engine1_id')}>
                  <CloseIcon />
                </span>
              </span>
            ) : (
              ''
            )}
            {dataSearch.engine2_id ? (
              <span className="label-result">
                Engine2: {dataSearch.engine2_id.name}{' '}
                <span onClick={() => onRemoveFilterEvent('engine2_id')}>
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
          <ListGroundTruth
            onFetchData={onFetchDataCallback}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            dataSearch={dataSearch}
            setRowsPerPage={setRowsPerPage}
            totalItemCount={totalItemCount}
            onOpenShowModalEdit={onOpenShowModalEdit}
            groundTruths={groundTruths}
          />
        </Box>
      </Card>
      <SearchGroundTruth
        openSearch={openSearch}
        onChangeSearch={onChangeSearchCallback}
        toggleOpenSearch={toggleOpenSearch}
        onCloseOpenSearch={onCloseOpenSearch}
        searchChildren={searchChildren}
        onSummitSearch={onFilter}
        onResetFilter={onResetFilter}
        dataSource={dataSource}
        engine={engine}
        user={user}
      />
      {/* {showModalAddorEdit ? (
        <AddOrEditGroundTruth
          setEditItem={setEditItem}
          editItem={editItem}
          rowsPerPage={rowsPerPage}
          dataSearch={dataSearch}
          onFetchData={onFetchDataCallback}
          show={showModalAddorEdit}
          onHandleClose={onHiddenShowModalAddorEdit}
        ></AddOrEditGroundTruth>
      ) : (
        ''
      )} */}
    </Container>
  );
};

export default GroundTruth;
