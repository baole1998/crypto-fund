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
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import './AddOrEditGroundTruth.scss';
import * as actionsGroundTruth from '../../../../../redux/store/data-management/ground-truth/ground-truth.store';
import { ContentSearch, GroundTruthModel } from 'src/models/ground_truth';
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
interface PropAddOrEditGroundTruth {
  show: boolean;
  onFetchData: (
    code: string,
    status: string[],
    to_date: Date,
    from_date: Date,
    data_source: number,
    engine1_id: number,
    engine2_id: number,
    rowsPerPage: number,
    page: number
  ) => void;
  onHandleClose: () => void;
  editItem: GroundTruthModel;
  rowsPerPage: number;
  dataSearch: ContentSearch;
  setEditItem: (row: any) => void;
}
const AddOrEditGroundTruth: React.FC<PropAddOrEditGroundTruth> = (props) => {
  const {
    show,
    onHandleClose,
    onFetchData,
    dataSearch,
    rowsPerPage,
    editItem,
    setEditItem
  } = props;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    if (!editItem) {
      actionsGroundTruth.createGroundTruth(data).then((res) => {
        if (res) {
          onFetchData(
            dataSearch.code,
            dataSearch.status,
            dataSearch.to_date,
            dataSearch.from_date,
            dataSearch.data_source?.id,
            dataSearch.engine1_id?.id,
            dataSearch.engine2_id?.id,
            rowsPerPage,
            1
          );
          onHandleClose();
        }
      });
    } else {
      actionsGroundTruth.updateGroundTruth(data).then((res) => {
        if (res) {
          onFetchData(
            dataSearch.code,
            dataSearch.status,
            dataSearch.to_date,
            dataSearch.from_date,
            dataSearch.data_source?.id,
            dataSearch.engine1_id?.id,
            dataSearch.engine2_id?.id,
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
              <div className="title"> Thêm mới dữ liệu</div>
              <div className="close-icon" onClick={() => onHandleClose()}>
                <CloseIcon />
              </div>
            </div>
            <div className="content-modal">
              <div className="row">
                <div className="col-6 mb-3">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label"
                  >
                    Đơn vị cung cấp 1
                  </label>
                  <Select
                  {...register('name')}
                  style={{ width: '100%' }}
                >
                  <MenuItem value={'FDM'}>FDM</MenuItem>
                  <MenuItem value={'VVN'}>VVN</MenuItem>
                </Select>
                </div>
                <div className="col-6 mb-3">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label"
                  >
                    Version
                  </label>
                  <Select
                  {...register('name')}
                  style={{ width: '100%' }}
                >
                  <MenuItem value={'FDM'}>FDM</MenuItem>
                  <MenuItem value={'VVN'}>VVN</MenuItem>
                </Select>
                </div>
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label"
                  >
                    Đơn vị cung cấp 2
                  </label>
                  <Select
                  {...register('name')}
                  style={{ width: '100%' }}
                >
                  <MenuItem value={'FDM'}>FDM</MenuItem>
                  <MenuItem value={'VVN'}>VVN</MenuItem>
                </Select>
                </div>
                <div className="col-6 mb-3">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label"
                  >
                    Version
                  </label>
                  <Select
                  {...register('name')}
                  style={{ width: '100%' }}
                >
                  <MenuItem value={'FDM'}>FDM</MenuItem>
                  <MenuItem value={'VVN'}>VVN</MenuItem>
                </Select>
                </div>
              </div>
              <div className="row">
                <div className="col-12 mb-3">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label"
                  >
                    Nguồn dữ liệu
                  </label>
                  <Select
                  {...register('name')}
                  style={{ width: '100%' }}
                >
                  <MenuItem value={'FDM'}>FDM</MenuItem>
                  <MenuItem value={'VVN'}>VVN</MenuItem>
                </Select>
                </div>
              </div>
              <div className="row">
                <div className="col-12 mb-3">
                  <label
                    htmlFor="exampleFormControlInput1"
                    className="form-label"
                  >
                    Danh sách batch
                  </label>
                  <Select
                  {...register('name')}
                  style={{ width: '100%' }}
                >
                  <MenuItem value={'FDM'}>FDM</MenuItem>
                  <MenuItem value={'VVN'}>VVN</MenuItem>
                </Select>
                </div>
              </div>
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

export default AddOrEditGroundTruth;
