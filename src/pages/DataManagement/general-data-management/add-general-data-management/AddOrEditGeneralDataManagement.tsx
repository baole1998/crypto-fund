import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import './AddOrEditGeneralDataManagement.scss';
import * as actionsDetailGeneralDataManagement from 'src/redux/store/sync-task/sync-task.store';
import { ContentSearch, SyncTaskModel } from 'src/models/sync_task';
import viLocale from 'date-fns/locale/vi';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DataSource } from 'src/models/data_source';
const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 1
};
interface PropAddOrEditGeneralDataManagement {
  show: boolean;
  onFetchData: (
    customer_code: string,
    status: string[],
    from_date: Date,
    to_date: Date,
    data_source: number,
    name_task: string,
    rowsPerPage: number,
    page: number
  ) => void;
  onHandleClose: () => void;
  editItem: SyncTaskModel;
  rowsPerPage: number;
  dataSearch: ContentSearch;
  setEditItem: (row: any) => void;
  dataSource: DataSource[] | [];
}
const AddOrEditGeneralDataManagement: React.FC<
  PropAddOrEditGeneralDataManagement
> = (props) => {
  const {
    show,
    onHandleClose,
    onFetchData,
    dataSearch,
    rowsPerPage,
    editItem,
    setEditItem,
    dataSource
  } = props;
  const [startDate, setStartDate] = useState<any>(new Date());
  const [endDate, setEndDate] = useState<any>(new Date());
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();
  const onSubmit = (data) => {
    const dataNew = {
      ...data,
      from_date: startDate,
      to_date: endDate
    };
    if (!editItem) {
      actionsDetailGeneralDataManagement.createSyncTask(dataNew).then((res) => {
        if (res) {
          onFetchData(
            dataSearch.customer_code,
            dataSearch.status,
            dataSearch.from_date,
            dataSearch.to_date,
            dataSearch.data_source?.id,
            dataSearch.name_task,
            rowsPerPage,
            1
          );
          onHandleClose();
        }
      });
    } else {
      actionsDetailGeneralDataManagement.updateSyncTask(dataNew).then((res) => {
        if (res) {
          onFetchData(
            dataSearch.customer_code,
            dataSearch.status,
            dataSearch.from_date,
            dataSearch.to_date,
            dataSearch.data_source?.id,
            dataSearch.name_task,
            rowsPerPage,
            1
          );
          onHandleClose();
        }
      });
      setEditItem({});
    }
  };
  return (
    <div>
      <Modal
        open={show}
        onClose={() => onHandleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="add-or-edit-modal"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={style} className="content">
            <div className="header-modal d-flex justify-content-between align-items-center">
              <div className="title">
                {' '}
                {editItem?.name ? 'Cập nhật' : ' Thêm'} dữ liệu
              </div>
              <div className="close-icon" onClick={() => onHandleClose()}>
                <CloseIcon />
              </div>
            </div>
            <div className="content-modal">
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Tên task
                </label>
                <TextField
                  {...register('name')}
                  className="form-control"
                  id="exampleFormControlInput1"
                  type="text"
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Thời gian
                </label>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  locale={viLocale}
                >
                  <div className="d-flex align-items-center">
                    <div>
                      <DatePicker
                        mask={'__/__/____'}
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => (
                          <TextField size="small" {...params} />
                        )}
                      />
                    </div>
                    <div style={{ margin: '0px 10px' }}> - </div>
                    <div>
                      <DatePicker
                        mask={'__/__/____'}
                        value={endDate}
                        minDate={startDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        renderInput={(params) => (
                          <TextField size="small" {...params} />
                        )}
                      />
                    </div>
                  </div>
                </LocalizationProvider>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Nguồn dữ liệu
                </label>
                <div>
                  <Select
                    {...register('data_source')}
                    style={{ width: '100%' }}
                  >
                    {dataSource.length > 0 &&
                      dataSource.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </div>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Loại dữ liệu
                </label>
                <div>
                  <Select
                    {...register('task_type')}
                    style={{ width: '100%' }}
                  >
                   <MenuItem value="Batch">
                       Batch
                    </MenuItem>
                   <MenuItem value="Import">
                   Import
                    </MenuItem>
                  </Select>
                </div>
              </div>
              {/* <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Mô tả
                </label>
                <div>
                  <textarea
                    {...register('description')}
                    className="txt-description"
                  ></textarea>
                </div>
              </div> */}
            </div>
            <div className="footer-modal">
              <Button
                variant="contained"
                color="warning"
                style={{ marginRight: 10 }}
                onClick={() => onHandleClose()}
              >
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="success">
                {editItem ? 'Cập nhật' : ' Tạo mới'}
              </Button>
            </div>
          </Box>
        </form>
      </Modal>
    </div>
  );
};

export default AddOrEditGeneralDataManagement;
