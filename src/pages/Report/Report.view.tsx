import React, { useCallback, useState, useEffect } from 'react';
import { Box, styled } from '@mui/system';
import { Button, Card, InputBase } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import './Report.scss';
import SearchReport from './search-report/SearchReport';
import ListReport from './list-report/ListReport';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import * as actionsReport from '../../redux/store/report/report.store';
import { debounce } from 'debounce';
import CloseIcon from '@mui/icons-material/Close';
import { ContentSearch, ReportModel } from 'src/models/report';
import * as actionsDataSource from 'src/redux/store/data-source/data-source.store';
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

const Report: React.FC = () => {
  const [reports, setReports] = useState([]);
  const [showModalAddorEdit, setShowModalAddorEdit] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<ReportModel | {}>({});
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [dataSearch, setDataSearch] = useState<ContentSearch>();
  const [searchChildren, setSearchChildren] = useState<ContentSearch>();
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
      code: null,
      data_source: null,
      from_date: null,
      to_date: null,
    });
    setSearchChildren({
      code: null,
      data_source: null,
      from_date: null,
      to_date: null,
    })
    onFetchDataCallback(null, null, null, null, rowsPerPage, page);
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
      data_source: dataSearch.data_source,
      from_date: dataSearch.from_date,
      to_date: dataSearch.to_date,
    });
  };
  const onFilter = () => {
    setDataSearch({
      code: dataSearch.code,
      data_source: searchChildren.data_source,
      from_date: searchChildren.from_date,
      to_date: searchChildren.to_date,
    })
    onFetchDataCallback(
      dataSearch.code,
      searchChildren.data_source,
      searchChildren.from_date,
      searchChildren.to_date,
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
        '',
        null,
        dataSearch.from_date,
        dataSearch.to_date,
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
        '',
        dataSearch.data_source,
        null,
        null,
        rowsPerPage,
        page
      );
    }
    if (name === 'code') {
      setDataSearch({
        ...dataSearch,
        code: ''
      });
      onFetchDataCallback(
        '',
        dataSearch.data_source,
        dataSearch.from_date,
        dataSearch.to_date,
        rowsPerPage,
        page
      );
    }
  };
  const onFetchDataCallback = useCallback(
    (
      code: string,
      data_source: DataSource,
      from_date: Date,
      to_date: Date,
      rowsPerPage: number,
      page: number
    ) => {
      onFetchData(code, data_source, from_date, to_date, rowsPerPage, page);
    },
    [dataSearch, rowsPerPage, page]
  );
  const onFetchData = (
    code: string,
    data_source: DataSource,
    from_date: Date,
    to_date: Date,
    rowsPerPage: number,
    page: number
  ) => {
    setPage(page);
    let param = `?page_size=${rowsPerPage}&page=${page}`;
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
      param += `&data_source=${data_source.id}`;
    }
    actionsReport.getReport(param).then((res) => {
      console.log(res);
      if (res && res.data) {
        setReports(res.data);
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
    if (name === 'code') {
      setDataSearch({
        ...dataSearch,
        code: value
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
          dataSearch.data_source,
          dataSearch.from_date,
          dataSearch.to_date,
          rowsPerPage,
          page
        ),
      1000
    ),
    []
  );
  return (
    <Container className="container-report-page">
      <div className="tilte-page">Báo cáo</div>
      <Card className="report-table">
        <div className="e-table-header">
          <div className="d-flex e-header justify-content-between">
            <div className="action-button">
            
            </div>
            <div className="d-flex align-items-center">
              <form className="from-search">
                {/* <Box
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
                    value={dataSearch?.code}
                    className="input-search"
                    placeholder="Tìm kiếm theo mã..."
                    startAdornment={<SearchIcon />}
                  />
                  <input type="submit" hidden value="Submit" />
                </Box> */}
              </form>
              <div className="action-button" onClick={toggleOpenSearch}>
                <FilterAltIcon />
              </div>
            </div>
          </div>

          <div className="item-result">
            {dataSearch?.data_source?.id ? (
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
          <ListReport
            onFetchData={onFetchDataCallback}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            dataSearch={dataSearch}
            setRowsPerPage={setRowsPerPage}
            totalItemCount={totalItemCount}
            onOpenShowModalEdit={onOpenShowModalEdit}
            reports={reports}
          />
        </Box>
      </Card>
      <SearchReport
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

export default Report;
