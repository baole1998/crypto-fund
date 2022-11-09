import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import './SearchGroundTruth.scss';
import { Icon, MenuItem, Select, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import { ContentSearch } from 'src/models/ground_truth';
import ItemDateTime from '../../ItemDateTime/ItemDateTime';
import { getDataSource } from 'src/redux/store/data-source/data-source.store';
import { DataSource } from 'src/models/data_source';
import { EngineModel } from 'src/models/engine';
import { UserModel } from 'src/models/user';

interface PropSearchGeneralDataManagement {
  openSearch: boolean;
  toggleOpenSearch: () => void;
  searchChildren: ContentSearch;
  onSummitSearch: () => void;
  onChangeSearch: (name: string, value: any) => void;
  onResetFilter: () => void;
  onCloseOpenSearch: () => void;
  dataSource: DataSource[] | [];
  engine: EngineModel[] | [];
  user: UserModel[] | [];
}

const SearchGroundTruth: React.FC<PropSearchGeneralDataManagement> = (
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
    dataSource,
    engine,
    user
  } = props;
  const onCheckStatus = (value: string) => {
    let check:boolean = false;
    const dataStatus = searchChildren?.status || [];
    if (dataStatus && dataStatus.length > 0) {
      const status = dataStatus.find((item) => item === value);
      if (status) {
        check = true;
      } else {
        check = false
      }
    }else {
      check = false
    }
    return check;
  };
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
          <div className="title">Trạng thái</div>
          <div className="d-flex content-item-search mb-3">
            <div
              onClick={() => onChangeSearch('status', 'created')}
              className={`select-item ${
                onCheckStatus('created') === true ? 'selected' : ''
              }`}
            >
              <img
                src={'/static/images/status/checked.svg'}
                alt="log-vps"
              ></img>
              Khởi tạo
            </div>
            <div
              onClick={() => onChangeSearch('status', 'success')}
              className={`select-item ${
                onCheckStatus('success') === true ? 'selected' : ''
              }`}
            >
              <img
                src={'/static/images/status/checked.svg'}
                alt="log-vps"
              ></img>
              Thành công
            </div>
          </div>
          <div className="d-flex content-item-search">
            <div
              onClick={() => onChangeSearch('status', 'processing')}
              className={`select-item ${
                onCheckStatus('processing') === true ? 'selected' : ''
              }`}
            >
              <img
                src={'/static/images/status/checked.svg'}
                alt="log-vps"
              ></img>
              Đang xử lý
            </div>
            <div
              onClick={() => onChangeSearch('status', 'failed')}
              className={`select-item ${
                onCheckStatus('failed') === true ? 'selected' : ''
              }`}
            >
              <img
                src={'/static/images/status/checked.svg'}
                alt="log-vps"
              ></img>
              Không thành công
            </div>
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
        <div className="item-search">
          <div className="title">Engine1</div>
          <div className="d-flex content-item-search">
            <Select
              onChange={(e) => onChangeSearch('engine1_id', e.target.value)}
              value={searchChildren.engine1_id}
              style={{ width: '100%' }}
            >
              <MenuItem key={0} value={0}>
                Tất cả
              </MenuItem>
              {engine.length > 0 &&
                engine.map((item) => (
                  <MenuItem key={item.id} value={item}>
                    {item.name} - {item.version}
                  </MenuItem>
                ))}
            </Select>
          </div>
        </div>
        <div className="item-search">
          <div className="title">Engine2</div>
          <div className="d-flex content-item-search">
            <Select
              onChange={(e) => onChangeSearch('engine2_id', e.target.value)}
              value={searchChildren.engine2_id}
              style={{ width: '100%' }}
            >
              <MenuItem key={0} value={0}>
                Tất cả
              </MenuItem>
              {engine.length > 0 &&
                engine.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name} - {item.version}
                  </MenuItem>
                ))}
            </Select>
          </div>
        </div>
        <div className="item-search">
          <div className="title">Người tạo</div>
          <div className="d-flex content-item-search">
            <Select
              onChange={(e) => onChangeSearch('user', e.target.value)}
              value={searchChildren.creator}
              style={{ width: '100%' }}
            >
              <MenuItem key={0} value={0}>
                Tất cả
              </MenuItem>
              {user.length > 0 &&
                user.map((item) => (
                  <MenuItem key={item.id} value={item}>
                    {item.name} - {item.version}
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
export default SearchGroundTruth;
