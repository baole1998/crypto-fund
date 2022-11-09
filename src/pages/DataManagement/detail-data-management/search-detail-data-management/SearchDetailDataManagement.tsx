import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import './SearchDetailDataManagement.scss';
import { Icon, MenuItem, Select, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import { ContentSearch } from 'src/models/customer_info';
import ItemDateTime from '../../ItemDateTime/ItemDateTime';
import { getDataSource } from 'src/redux/store/data-source/data-source.store';
import { DataSource } from 'src/models/data_source';

interface PropSearchDetailDataManagement {
  openSearch: boolean;
  toggleOpenSearch: () => void;
  searchChildren: ContentSearch;
  onSummitSearch: () => void;
  onChangeSearch: (name: string, value: any) => void;
  onResetFilter: () => void;
  onCloseOpenSearch: () => void;
  dataSource: DataSource[] | [];
}

const SearchDetailDataManagement: React.FC<PropSearchDetailDataManagement> = (
  props
) => {
  const {
    openSearch,
    toggleOpenSearch,
    searchChildren,
    onSummitSearch,
    onChangeSearch,
    onResetFilter,
    onCloseOpenSearch,
    dataSource
  } = props;

  
  const list = () => (
    <Box
      sx={{ width: 350 }}
      role="presentation"
      className="search-page"
      //   onKeyDown={()=>toggleOpenSearch()}
    >
      <div className="header-search">
        <div className="title-search">Bộ lọc tìm kiếm</div>
        <div className="close-search" onClick={() => onCloseOpenSearch()}>
          <CloseIcon />
        </div>
      </div>
      <Divider />
      <div className="content-search">
        <div className="item-search">
          <div className="title">UID/file name </div>
          <div className="d-flex content-item-search">
            <TextField
              value={searchChildren.uid}
              onChange={(e) => onChangeSearch('uid', e.target.value)}
              fullWidth
              id="fullWidth"
              placeholder="Nhập UID/file name..."
            />
          </div>
        </div>
        <div className="item-search">
          <div className="title">Thời gian</div>
          <div className="d-flex content-item-search">
            <ItemDateTime
              startDate={searchChildren.from_date}
              setStartDate={onChangeSearch}
              endDate={searchChildren.to_date}
              setEndDate={onChangeSearch}
            />
          </div>
        </div>
        <div className="item-search">
          <div className="title">Kênh dữ liệu</div>
          <div className="d-flex content-item-search">
            <Select
              onChange={(e) => onChangeSearch('data_source', e.target.value)}
              value={searchChildren.data_source}
              style={{ width: '100%' }}
            >
              <MenuItem key={0} value={0}>
                Tất cả
              </MenuItem>
              {dataSource.length > 0 &&
                dataSource.map((item) => (
                  <MenuItem key={item.id} value={item}>
                    {item.name}
                  </MenuItem>
                ))}
            </Select>
          </div>
        </div>
      </div>

      <Divider />
      <div className="footer-search">
        <Button
          color="error"
          variant="outlined"
          className="button-delete"
          onClick={() => {
            toggleOpenSearch();
            onResetFilter();
          }}
        >
          Xóa bộ lọc
        </Button>
        <Button
          color="success"
          variant="contained"
          className="button-filter"
          onClick={() => {
            toggleOpenSearch();
            onSummitSearch();
          }}
        >
          Áp dụng
        </Button>
      </div>
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        <Drawer anchor="right" open={openSearch}>
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
};
export default SearchDetailDataManagement;
