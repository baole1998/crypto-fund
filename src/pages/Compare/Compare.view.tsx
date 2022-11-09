import React, { useCallback, useState, useEffect } from 'react';
import { Box, styled } from '@mui/system';
import { Button, Card, InputBase } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import './Compare.scss';
import SearchCompare from './search-compare/SearchCompare';
import ListCompare from './list-compare/ListCompare';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddOrEditCompare from './add-compare/AddOrEditCompare';
import * as actionsCompare from '../../redux/store/compare/compare.store';
import { debounce } from 'debounce';
import CloseIcon from '@mui/icons-material/Close';
import { ContentSearch, CompareTaskModel } from 'src/models/compare_task';
import { useNavigate } from 'react-router';
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

const Compare: React.FC = () => {
  const [compares, setCompares] = useState([]);
  const [showModalAddorEdit, setShowModalAddorEdit] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<CompareTaskModel | {}>({});
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [dataSearch, setDataSearch] = useState<any>({});
  const [searchChildren, setSearchChildren] = useState<any>({
    from_date: new Date(),
    to_date: new Date()
  });
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalItemCount, setTotalItemCount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    let data = {
      rowsPerPage: rowsPerPage,
      page: 1
    };
    onFetchDataCallback(data);
  }, []);

  const onResetFilter = () => {
    setDataSearch({
      description: '',
      name: '',
      version: 0,
      verified: '',
      env: '',
      from_date: '',
      to_date: ''
    });
    setSearchChildren({
      description: '',
      name: '',
      version: 0,
      verified: '',
      env: '',
      from_date: new Date(),
      to_date: new Date()
    });
    let data = {
      rowsPerPage,
      page
    };
    onFetchDataCallback(data);
  };
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  const toggleOpenSearch = () => {
    setOpenSearch(!openSearch);
  };
  const onCloseOpenSearch = () => {
    setOpenSearch(!openSearch);
    setSearchChildren({
      description: dataSearch.description,
      name: dataSearch.name,
      version: dataSearch.version,
      verified: dataSearch.verified,
      env: dataSearch.env,
      from_date: dataSearch.from_date,
      to_date: dataSearch.to_date
    });
  };
  const onFilter = () => {
    setDataSearch({
      description: dataSearch.description,
      name: searchChildren.name,
      version: searchChildren.version,
      verified: searchChildren.verified,
      env: searchChildren.env,
      from_date: searchChildren.from_date,
      to_date: searchChildren.to_date
    });
    let data = {
      from_date: searchChildren.from_date,
      to_date: searchChildren.to_date,
      rowsPerPage,
      page
    };
    onFetchDataCallback(data);
  };
  const onRemoveFilterEvent = (name: string) => {
    if (name === 'from_date') {
      setDataSearch({
        ...dataSearch,
        from_date: '',
        to_date: ''
      });
      setSearchChildren({
        ...searchChildren,
        from_date: new Date(),
        to_date: new Date()
      });
    }
    onFetchDataCallback({
      rowsPerPage: rowsPerPage,
      page: 1
    });
  };
  const onFetchDataCallback = useCallback(
    (propsData) => {
      let data = {
        rowsPerPage: propsData.rowsPerPage,
        page: propsData.page,
        from_date: propsData.from_date,
        to_date: propsData.to_date
      };
      onFetchData(data);
    },
    [dataSearch, rowsPerPage, page]
  );
  const onFetchData = (data) => {
    const { from_date, to_date, rowsPerPage, page } = data;
    setPage(page);
    let param = `?page_size=${rowsPerPage}&page=${page}`;
    if (from_date) {
      let date = moment(from_date).format(
        moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
      );
      param += `&from_date=${date}`;
    }
    if (to_date) {
      let date = moment(to_date).format(
        moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
      );
      param += `&to_date=${date}`;
    }

    actionsCompare.getCompare(param).then((res) => {
      if (res && res.data) {
        setCompares(res.data);
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

    if (name === 'name') {
      setSearchChildren({ ...searchChildren, name: value });
    }
  };
  const onOpenShowModalAdd = () => {
    setShowModalAddorEdit(true);
    navigate('/compare/create');
  };
  const onEditItem = (item: CompareTaskModel) => {
    setEditItem(item);
    navigate('/compare/edit', { state: { item: item } });
  };

  const handleTriggerCompare = (id) => {
    actionsCompare.triggerCompare(id).then(() => {
      let data = {
        rowsPerPage: rowsPerPage,
        page: 1
      };
      onFetchData(data);
    });
  };
  return (
    <Container className="container-compare-page">
      <div className="tilte-page">Kiểm nghiệm Engine</div>
      <Card className="compare-table">
        <div className="e-table-header">
          <div className="d-flex e-header justify-content-between">
            <div className="action-button">
              <Button
                style={{ color: '#fff', background: '#212943' }}
                variant="contained"
                onClick={onOpenShowModalAdd}
              >
                <AddCircleOutlineIcon />
                Thêm mới
              </Button>
            </div>
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
                      onChangeSearchCallback('description', e.target.value)
                    }
                    name="query_contains"
                    value={dataSearch.description}
                    className="input-search"
                    placeholder="Tìm kiếm theo mô tả..."
                    startAdornment={<SearchIcon />}
                  />
                  <input type="submit" hidden value="Submit" />
                </Box>
              </form>
              <div className="action-button" onClick={toggleOpenSearch}>
                <FilterAltIcon />
              </div>
            </div> */}
          </div>

          <div className="item-result">
            {dataSearch.from_date ? (
              <span className="label-result">
                Từ ngày: {moment(dataSearch.from_date).format('DD/MM/YYYY')} đến
                ngày: {moment(dataSearch.to_date).format('DD/MM/YYYY')}
                <span onClick={() => onRemoveFilterEvent('from_date')}>
                  <CloseIcon />
                </span>
              </span>
            ) : (
              ''
            )}
            {dataSearch.name ? (
              <span className="label-result">
                Đơn vị: {dataSearch.name}{' '}
                <span onClick={() => onRemoveFilterEvent('name')}>
                  <CloseIcon />
                </span>
              </span>
            ) : (
              ''
            )}
            {dataSearch.version ? (
              <span className="label-result">
                Version: {dataSearch.version}{' '}
                <span onClick={() => onRemoveFilterEvent('version')}>
                  <CloseIcon />
                </span>
              </span>
            ) : (
              ''
            )}
            {dataSearch.verified ? (
              <span className="label-result">
                Trạng thái:{' '}
                {dataSearch.verified === 'approving' ? 'Chờ duyệt' : 'Đã duyệt'}{' '}
                <span onClick={() => onRemoveFilterEvent('verified')}>
                  <CloseIcon />
                </span>
              </span>
            ) : (
              ''
            )}
            {dataSearch.env ? (
              <span className="label-result">
                Môi trường: {dataSearch.env}{' '}
                <span onClick={() => onRemoveFilterEvent('env')}>
                  <CloseIcon />
                </span>
              </span>
            ) : (
              ''
            )}
          </div>
        </div>

        <Box overflow="auto" padding="15px">
          <ListCompare
            onFetchData={onFetchDataCallback}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            dataSearch={dataSearch}
            setRowsPerPage={setRowsPerPage}
            totalItemCount={totalItemCount}
            onEditItem={onEditItem}
            compares={compares}
            handleTriggerCompare={handleTriggerCompare}
          />
        </Box>
      </Card>
      <SearchCompare
        openSearch={openSearch}
        onChangeSearch={onChangeSearchCallback}
        toggleOpenSearch={toggleOpenSearch}
        onCloseOpenSearch={onCloseOpenSearch}
        searchChildren={searchChildren}
        onSummitSearch={onFilter}
        onResetFilter={onResetFilter}
      />
    </Container>
  );
};

export default Compare;
