import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import './SearchCompare.scss';
import { Icon, MenuItem, Select, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import { ContentSearch } from 'src/models/compare_task';
import ItemDateTime from 'src/components/ItemDateTime/ItemDateTime';
import * as SearchCompareStyles from './SearchCompare.module.scss';

interface PropSearchCompare {
  openSearch: boolean;
  toggleOpenSearch: () => void;
  searchChildren: ContentSearch;
  onSummitSearch: () => void;
  onChangeSearch: (name: string, value: any) => void;
  onResetFilter: () => void;
  onCloseOpenSearch: () => void;
}

const SearchCompare: React.FC<PropSearchCompare> = (props) => {
  const {
    openSearch,
    toggleOpenSearch,
    searchChildren,
    onSummitSearch,
    onChangeSearch,
    onResetFilter,
    onCloseOpenSearch
  } = props;

  const list = () => (
    <Box
      sx={{ width: 400 }}
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
          <div className="title">Đơn vị cung cấp</div>
          <div className="d-flex content-item-search">
            <div
              onClick={() => onChangeSearch('name', 'FDM')}
              className={`select-item ${
                searchChildren.name === 'FDM' ? 'selected' : ''
              }`}
            >
              <img
                src={'/static/images/status/checked.svg'}
                alt="log-vps"
              ></img>
              FDM
            </div>
            <div
              onClick={() => onChangeSearch('name', 'VVN')}
              className={`select-item ${
                searchChildren.name === 'VVN' ? 'selected' : ''
              }`}
            >
              <img
                src={'/static/images/status/checked.svg'}
                alt="log-vps"
              ></img>
              VVN
            </div>
          </div>
        </div>

        <div className="item-search">
          <div className="title">Version</div>
          <div className="d-flex content-item-search">
            <Select
              onChange={(e) => onChangeSearch('version', e.target.value)}
              value={''}
              style={{ width: '100%' }}
            >
              <MenuItem key={0} value={0}>
                Tất cả
              </MenuItem>
              {[].length > 0 &&
                [].map((item) => (
                  <MenuItem key={item.id} value={item}>
                    {item.name}
                  </MenuItem>
                ))}
            </Select>
          </div>
        </div>

        <div className="item-search">
          <div className="title">Kết quả</div>
          <div className="d-flex content-item-search">
            <div
              onClick={() => onChangeSearch('env', 'test')}
              className={`select-item ${
                searchChildren.env === 'test' ? 'selected' : ''
              }`}
            >
              <img
                src={'/static/images/status/checked.svg'}
                alt="log-vps"
              ></img>
              Pass
            </div>
            <div
              onClick={() => onChangeSearch('env', 'production')}
              className={`select-item ${
                searchChildren.env === 'production' ? 'selected' : ''
              }`}
            >
              <img
                src={'/static/images/status/checked.svg'}
                alt="log-vps"
              ></img>
              Failed
            </div>
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
export default SearchCompare;
