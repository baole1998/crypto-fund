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
import './AddOrEditEngine.scss';
import * as actionsEngine from '../../../redux/store/engine/engine.store';
import { ContentSearch, EngineModel } from 'src/models/engine';
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
interface PropAddOrEditEngine {
  show: boolean,
  onFetchData: (description: string, name: string, version:number, verified: string, env: string, rowsPerPage: number, page: number) => void,
  onHandleClose: () => void,
  editItem: EngineModel,
  rowsPerPage: number,
  dataSearch: ContentSearch,
  setEditItem: (row:any) => void,
}
const AddOrEditEngine:React.FC<PropAddOrEditEngine> = (props) => {
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
      actionsEngine.createEngine(data).then((res) => {
        if (res) {
          onFetchData(
            dataSearch.description,
            dataSearch.name,
            dataSearch.version,
            dataSearch.verified,
            dataSearch.env,
            rowsPerPage,
            1
          );
          onHandleClose();
        }
      });
    } else {
      actionsEngine.updateEngine(data).then((res) => {
        if (res) {
          onFetchData(
            dataSearch.description,
            dataSearch.name,
            dataSearch.version,
            dataSearch.verified,
            dataSearch.env,
            rowsPerPage,
            1
          );
          onHandleClose();
        }
      });
      setEditItem({})
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
                {editItem ? 'Cập nhật' : ' Thêm'} dữ liệu
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
                  Đơn vị cung cấp
                </label>
                <Select
                  {...register('name')}
                  defaultValue={editItem?.name ? editItem?.name : 'FDM'}
                  style={{ width: '100%' }}
                >
                  <MenuItem value={'FDM'}>FDM</MenuItem>
                  <MenuItem value={'VVN'}>VVN</MenuItem>
                </Select>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Loại
                </label>
                <Select
                  {...register('type')}
                  defaultValue={editItem?.type ? editItem?.type : 'ekyc'}
                  style={{ width: '100%' }}
                >
                  <MenuItem value={'ekyc'}>ekyc</MenuItem>
                  <MenuItem value={'face'}>face</MenuItem>
                  <MenuItem value={'sign'}>sign</MenuItem>
                </Select>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Môi trường
                </label>
                <Select
                  {...register('env')}
                  defaultValue={editItem?.env ? editItem?.env : 'test'}
                  style={{ width: '100%' }}
                >
                  <MenuItem value={'test'}>test</MenuItem>
                  <MenuItem value={'production'}>production</MenuItem>
                </Select>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Version
                </label>
                <TextField
                  {...register('version')}
                  defaultValue={editItem ? editItem?.version : ''}
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
                  URL
                </label>
                <TextField
                  {...register('url')}
                  defaultValue={editItem ? editItem?.url : ''}
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
                  Mô tả
                </label>
                <div>
                  <textarea
                    defaultValue={editItem ? editItem?.description : ''}
                    {...register('description')}
                    className="txt-description"
                  ></textarea>
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
}

export default AddOrEditEngine;
