import React, { useCallback, useState, useEffect } from 'react';
import { Box, styled } from '@mui/system';
import { Button, Card, InputBase } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import './DetailReport.scss';
import SearchDetailReport from './search-detail-report/SearchDetailReport';
import ListDetailReport from './list-detail-report/ListDetailReport';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import * as actionsDetailReport from '../../redux/store/report/report.store';
import { debounce } from 'debounce';
import CloseIcon from '@mui/icons-material/Close';
import { ContentSearch, ReportModel } from 'src/models/report_detail';
import { useNavigate } from 'react-router-dom';

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

const DetailReport: React.FC = () => {
  const [reports, setDetailReports] = useState([]);
  const [showModalAddorEdit, setShowModalAddorEdit] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<ReportModel | {}>({});
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [dataSearch, setDataSearch] = useState<ContentSearch>({
    description: '',
    name: '',
    version: 0,
    verified: '',
    env: ''
  });
  const [searchChildren, setSearchChildren] = useState<ContentSearch>({
    description: '',
    name: '',
    version: 0,
    verified: '',
    env: ''
  });
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [totalItemCount, setTotalItemCount] = useState<number>(0);

  useEffect(() => {
    setDataSearch({
      description: '',
      name: '',
      version: 0,
      verified: '',
      env: ''
    });
    setSearchChildren({
      description: '',
      name: '',
      version: 0,
      verified: '',
      env: ''
    });
    onFetchDataCallback('', '', 0, '', '', rowsPerPage, 1);
  }, []);

  const onResetFilter = () => {
    setDataSearch({
      description: '',
      name: '',
      version: 0,
      verified: '',
      env: ''
    });
    setSearchChildren({
      description: '',
      name: '',
      version: 0,
      verified: '',
      env: ''
    })
    onFetchDataCallback('', '', 0, '', '', rowsPerPage, page);
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
    });
  };
  const onFilter = () => {
    setDataSearch({
      description: dataSearch.description,
      name: searchChildren.name,
      version: searchChildren.version,
      verified: searchChildren.verified,
      env: searchChildren.env,
    })
    onFetchDataCallback(
      dataSearch.description,
      searchChildren.name,
      searchChildren.version,
      searchChildren.verified,
      searchChildren.env,
      rowsPerPage,
      page
    );
  };
  const onRemoveFilterEvent = (name: string) => {
    if (name === 'name') {
      setDataSearch({
        ...dataSearch,
        name: ''
      });
      setSearchChildren({
        ...searchChildren,
        name: ''
      });
      onFetchDataCallback(
        dataSearch.description,
        '',
        dataSearch.version,
        dataSearch.verified,
        dataSearch.env,
        rowsPerPage,
        page
      );
    }
    if (name === 'version') {
      setDataSearch({
        ...dataSearch,
        version: 0
      });
      setSearchChildren({
        ...searchChildren,
        version: 0
      });
      onFetchDataCallback(
        dataSearch.description,
        dataSearch.name,
        0,
        dataSearch.verified,
        dataSearch.env,
        rowsPerPage,
        page
      );
    }
    if (name === 'verified') {
      setDataSearch({
        ...dataSearch,
        verified: ''
      });
      setSearchChildren({
        ...searchChildren,
        verified: ''
      });
      onFetchDataCallback(
        dataSearch.description,
        dataSearch.name,
        dataSearch.version,
        '',
        dataSearch.env,
        rowsPerPage,
        page
      );
    }
    if (name === 'env') {
      setDataSearch({
        ...dataSearch,
        env: ''
      });
      setSearchChildren({
        ...searchChildren,
        env: ''
      });
      onFetchDataCallback(
        dataSearch.description,
        dataSearch.name,
        dataSearch.version,
        dataSearch.verified,
        '',
        rowsPerPage,
        page
      );
    }
    if (name === 'description') {
      setDataSearch({
        ...dataSearch,
        description: ''
      });
      onFetchDataCallback(
        '',
        dataSearch.name,
        dataSearch.version,
        dataSearch.verified,
        dataSearch.env,
        rowsPerPage,
        page
      );
    }
  };
  const onFetchDataCallback = useCallback(
    (
      description: string,
      name: string,
      version: number,
      verified: string,
      env: string,
      rowsPerPage: number,
      page: number
    ) => {
      onFetchData(description, name, version, verified, env, rowsPerPage, page);
    },
    [dataSearch, rowsPerPage, page]
  );
  const onFetchData = (
    description: string,
    name: string,
    version: number,
    verified: string,
    env: string,
    rowsPerPage: number,
    page: number
  ) => {
    setPage(page);
    let param = `?page_size=${rowsPerPage}&page=${page}`;
    if (description) {
      param += `&description=${description}`;
    }
    if (name) {
      param += `&name=${name}`;
    }
    if (version) {
      param += `&version=${version}`;
    }
    if (verified) {
      param += `&verified=${verified}`;
    }
    if (env) {
      param += `&env=${env}`;
    }
    // actionsDetailReport.getDetailReport(param).then((res) => {
    //   console.log(res);
    //   if (res && res.data) {
    //     setDetailReports(res.data);
    //     setTotalItemCount(res.metadata.total_items);
    //   }
    // });
  };
  const onChangeSearchCallback = useCallback(
    (
      name:string, value:any
    ) => {
      onChangeSearch(name, value)
    }, [searchChildren, dataSearch]
  );
  const navigate = useNavigate()
  const onChangeSearch = (name: string, value: any) => {
    if (name === 'name') {
      if (searchChildren.name === value) {
        setSearchChildren({
          ...searchChildren,
          name: ''
        });
      } else {
        setSearchChildren({
          ...searchChildren,
          name: value
        });
      }
    }
    if (name === 'version') {
      setSearchChildren({
        ...searchChildren,
        version: value
      });
    }
    if (name === 'verified') {
      if (searchChildren.verified === value) {
        setSearchChildren({
          ...searchChildren,
          verified: ''
        });
      } else {
        setSearchChildren({
          ...searchChildren,
          verified: value
        });
      }
    }
    if (name === 'env') {
      if (searchChildren.env === value) {
        setSearchChildren({
          ...searchChildren,
          env: ''
        });
      } else {
        setSearchChildren({
          ...searchChildren,
          env: value
        });
      }
    }
    if (name === 'description') {
      setDataSearch({
        ...dataSearch,
        description: value
      });
      debounceData(value);
    }
  };

  const onOpenShowModalEdit = (item: ReportModel) => {
    setShowModalAddorEdit(true);
    setEditItem(item);
  };


  const debounceData = useCallback(
    debounce(
      (nextValue) =>
      onFetchDataCallback(
          nextValue,
          dataSearch.name,
          dataSearch.version,
          dataSearch.verified,
          dataSearch.env,
          rowsPerPage,
          page
        ),
      1000
    ),
    []
  );
  const onGoback = () => {
    navigate('/report')
  }
  return (
    <Container className="container-report-page">
       <div className="go-back" onClick={onGoback}>
       {`<`} <span>Quay lại</span>
    </div>
      <div className="tilte-page">Chi Tiết Báo Cáo</div>
      <Card className="report-table">
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
                      onChangeSearchCallback('description', e.target.value)
                    }
                    name="query_contains"
                    value={dataSearch.description}
                    className="input-search"
                    placeholder="Tìm kiếm theo mã..."
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
            {dataSearch.description ? (
              <span className="label-result">
                Mô tả: {dataSearch.description}{' '}
                <span onClick={() => onRemoveFilterEvent('description')}>
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
          <ListDetailReport
            onFetchData={onFetchDataCallback}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            // dataSearch={dataSearch}
            setRowsPerPage={setRowsPerPage}
            totalItemCount={totalItemCount}
            // onOpenShowModalEdit={onOpenShowModalEdit}
            detailReports={reports}
          />
        </Box>
      </Card>
      <SearchDetailReport
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

export default DetailReport;
