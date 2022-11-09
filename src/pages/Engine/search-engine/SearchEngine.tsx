import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import './SearchEngine.scss';
import { Icon, MenuItem, Select, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import { ContentSearch } from 'src/models/engine';


interface PropSearchEngine {
  openSearch: boolean,
  toggleOpenSearch: () => void,
  searchChildren: ContentSearch,
  onSummitSearch: () => void,
  onChangeSearch: (name:string, value:any) => void,
  onResetFilter: () => void,
  onCloseOpenSearch: () => void,
}

 const SearchEngine: React.FC<PropSearchEngine> = (props) => {
  const {
    openSearch,
    toggleOpenSearch,
    searchChildren,
    onSummitSearch,
    onChangeSearch,
    onResetFilter,
    onCloseOpenSearch,
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
            <TextField
              onChange={(e) => onChangeSearch('version', e.target.value)}
              className="form-control"
              defaultValue={searchChildren.version}
              placeholder="Nhập version..."
              id="exampleFormControlInput1"
              type="number"
            />
          </div>
        </div>
        <div className="item-search">
          <div className="title">Trạng thái</div>
          <div className="d-flex content-item-search">
            <div
              onClick={() => onChangeSearch('verified', 'approved')}
              className={`select-item ${
                searchChildren.verified === 'approved' ? 'selected' : ''
              }`}
            >
              <img
                src={'/static/images/status/checked.svg'}
                alt="log-vps"
              ></img>
              Đã duyệt
            </div>
            <div
              onClick={() => onChangeSearch('verified', 'approving')}
              className={`select-item ${
                searchChildren.verified === 'approving' ? 'selected' : ''
              }`}
            >
              <img
                src={'/static/images/status/checked.svg'}
                alt="log-vps"
              ></img>
              Chờ duyệt
            </div>
          </div>
        </div>

        <div className="item-search">
          <div className="title">Môi trường</div>
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
              Test
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
              Production
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
        <Drawer
          anchor="right"
          open={openSearch}
        >
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
export default SearchEngine;