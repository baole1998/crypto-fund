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
import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from 'react-hook-form';
import './ImportFileImage.scss';
import * as actionsGeneralDataManagement from 'src/redux/store/sync-task/sync-task.store';
import { ContentSearch, SyncTaskModel } from 'src/models/sync_task';
import { DataSource } from 'src/models/data_source';
import { v4 as uuidv4 } from 'uuid';
import UploadIcon from '@mui/icons-material/Upload';
import viLocale from 'date-fns/locale/vi';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
const style = {
  position: 'absolute',
  top: 'calc((100% - 75px)/2)',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 1
};
interface PropImportFileImage {
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
const imageTypeRegex = /image\/(png|jpg|jpeg)/gm;
const ImportFileImage: React.FC<PropImportFileImage> = (props) => {
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
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm();
  const inputFile = React.useRef(null);
  const [startDate, setStartDate] = useState<any>(
    editItem.from_date ? new Date(editItem.from_date) : new Date()
  );
  const [endDate, setEndDate] = useState<any>(
    editItem.to_date ? new Date(editItem.to_date) : new Date()
  );
  const [imageFiles, setImageFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesTest, setImagesTest] = useState({});
  const [taskType, setTaskType] = useState(
    editItem.task_type ? editItem.task_type : null
  );

  useEffect(() => {
    if (editItem?.id) {
      setTaskType(editItem.task_type);
      setImages(images);
      actionsGeneralDataManagement.getListImage(editItem?.id).then((res) => {
        if (res) {
          setImages(res?.data);
        }
      });
    }
  }, [editItem]);

  const validateForm = (name, value, message?) => {
    let error = [];

    if (!value) {
      error.push({
        type: 'manual',
        name: name,
        message: message ?? 'Field required'
      });

      error.forEach(({ name, type, message }) =>
        setError(name, { type, message })
      );
    } else {
      clearErrors(name);
    }
  };

  const onSubmit = (data) => {
    if (!editItem?.id) {
      if (!data?.name) {
        validateForm('name', data.name);
      }
      if (taskType === 'batch') {
        let newData = {
          ...data,
          task_type: taskType,
          from_date: startDate,
          to_date: endDate
        };

        if (!data?.data_source) {
          validateForm('data_source', data.data_source);
          return;
        }
        actionsGeneralDataManagement.createSyncTask(newData).then((res) => {
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
        const dataTmp = {};
        images.forEach(function (a: any) {
          dataTmp[splitNameFileImage(a.uid)] =
            dataTmp[splitNameFileImage(a.uid)] || [];
          dataTmp[splitNameFileImage(a.uid)].push(a);
        });
        let newData = {
          ...data,
          images: Object.values(dataTmp)
        };
        if (images.length === 0) {
          validateForm('images', null);
          return;
        }
        actionsGeneralDataManagement
          .createSyncTaskImport(newData)
          .then((res) => {
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
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      if (taskType === 'batch') {
        const newDataUpdate = {
          ...editItem,
          ...data,
          task_type: taskType,
          from_date: startDate,
          to_date: endDate
        };
        actionsGeneralDataManagement
          .updateSyncTask(editItem.id, newDataUpdate)
          .then((res) => {
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
        const newData = images.filter((item) => !item?.id);
        const dataTmp = {};
        newData.forEach(function (a: any) {
          dataTmp[splitNameFileImage(a.uid)] =
            dataTmp[splitNameFileImage(a.uid)] || [];
          dataTmp[splitNameFileImage(a.uid)].push(a);
        });
        const newDataUpdate = {
          ...editItem,
          ...data,
          images: Object.values(dataTmp)
        };
        actionsGeneralDataManagement
          .updateSyncTaskImport(editItem.id, newDataUpdate)
          .then((res) => {
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
      }
      setEditItem({});
    }
  };
  const openImportFile = () => {
    inputFile.current.click();
  };
  const changeHandler = (e) => {
    const { files } = e.target;
    const validImageFiles = [];
    validateForm('images', 'images');
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.match(imageTypeRegex) && reCheckNameFileImage(file.name)) {
        validImageFiles.push(file);
      }
    }
    if (validImageFiles.length) {
      setImageFiles(validImageFiles);
      return;
    }
  };
  const reCheckNameFileImage = (name: string) => {
    let check = false;
    if (
      name.substring(0, name.length - 4).endsWith('_sign') ||
      name.substring(0, name.length - 4).endsWith('_back') ||
      name.substring(0, name.length - 4).endsWith('_front') ||
      name.substring(0, name.length - 4).endsWith('_face')
    ) {
      check = true;
    } else {
      validateForm(
        'images',
        null,
        'Vui lòng tải lên file đúng định dạng, chính tả, viết hoa viết thường như quy định!'
      );
    }

    return check;
  };
  const splitNameFileImage = (name: string) => {
    let nameImage = '';
    nameImage = name.substring(0, name.length - 9);
    return nameImage;
  };

  const returnNameFileImage = (name: string) => {
    if (name.substring(0, name.length - 4).endsWith('_front')) {
      let tmp = name.split('.');
      let newName = tmp[0].substr(tmp[0].length - 5, tmp[0].length) || '';
      return newName;
    } else {
      let tmp = name.split('.');
      let newName = tmp[0].substr(tmp[0].length - 4, tmp[0].length) || '';
      return newName;
    }
  };
  const returnBase64 = (name: string) => {
    let tmp = name.split('.');
    let newName = '';
    newName = tmp[0].split(',')[1] || '';

    return newName;
  };

  React.useEffect(() => {
    const fileReaders = [];
    let isCancel = false;
    if (imageFiles.length) {
      const promises = imageFiles.map((file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReaders.push(fileReader);
          fileReader.onload = (e) => {
            const { result } = e.target;
            if (result) {
              const object = {
                file: file,
                image: result
              };
              resolve(object);
            }
          };
          fileReader.onabort = () => {
            reject(new Error('File reading aborted'));
          };
          fileReader.onerror = () => {
            reject(new Error('Failed to read file'));
          };
          fileReader.readAsDataURL(file);
        });
      });
      Promise.all(promises)
        .then((listImages) => {
          const dataNew = {};
          const data = [...images];
          if (!isCancel) {
            listImages.forEach(function (a: any) {
              dataNew[splitNameFileImage(a.file.name)] =
                dataNew[splitNameFileImage(a.file.name)] || [];
              dataNew[splitNameFileImage(a.file.name)].push(a);
            });
            const tmp = Object.values(dataNew);
            if (tmp.length > 0) {
              for (let index = 0; index < tmp.length; index++) {
                const element: any = tmp[index];
                const uid = uuidv4();
                for (let index = 0; index < element.length; index++) {
                  const item = element[index];
                  data.push({
                    uid: uid,
                    type: returnNameFileImage(item.file.name),
                    image_base64: returnBase64(item.image)
                  });
                }
              }
            }
            setImages(data);
          }
        })
        .catch((reason) => {
          console.log(reason);
        });
    }
    return () => {
      isCancel = true;
      fileReaders.forEach((fileReader) => {
        if (fileReader.readyState === 1) {
          fileReader.abort();
        }
      });
    };
  }, [imageFiles]);
  const onRemoveImage = (i, id, type) => {
    const data = [...images];
    const newData = data.filter((item, index) => index !== i);
    console.log('editItem', editItem);

    setImages(newData);
    if (editItem?.id) {
      const dataDelete = {
        id: editItem?.id,
        customer_doc_id: id,
        type: type
      };
      actionsGeneralDataManagement.deleteImportImage(dataDelete).then((res) => {
        if (res) {
        }
      });
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
              <div className="title">{editItem?.id ? 'Chỉnh sửa dữ liệu' :' Thêm mới Dữ Liệu'}</div>
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
                  defaultValue={editItem ? editItem?.name : ''}
                  className="form-control"
                  id="exampleFormControlInput1"
                  type="text"
                  onChange={(e) => validateForm(e.target.name, e.target.value)}
                />
                {errors.name && (
                  <p className="text-danger">*{errors.name.message}</p>
                )}
              </div>
              {taskType === 'batch' ? (
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
              ) : (
                ''
              )}

              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Loại dữ liệu
                </label>
                <div>
                  <Select
                    value={taskType}
                    defaultValue={taskType}
                    onChange={(e) => setTaskType(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <MenuItem value="batch">Batch</MenuItem>
                    <MenuItem value="import">Import</MenuItem>
                  </Select>
                </div>
              </div>
              <div className="mb-3">
                {taskType === 'batch' ? (
                  <>
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      Nguồn dữ liệu
                    </label>
                    <div>
                      <Select
                        {...register('data_source')}
                        defaultValue={
                          editItem ? editItem?.data_source_relate?.id : ''
                        }
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
                  </>
                ) : (
                  ''
                )}
              </div>
              {taskType === 'import' ? (
                <>
                  <div className="action-image" onClick={openImportFile}>
                    <div className="title">
                      {' '}
                      <UploadIcon /> Import file
                    </div>
                  </div>
                  <div className="content-file">
                    {images.length > 0 ? (
                      <div className="list-image">
                        {images.map((item, index) => (
                          <div className="item-image" key={index}>
                            <img
                              src={'/static/images/icon_close.svg'}
                              alt="log-vps"
                              className="icon-close"
                              onClick={() =>
                                onRemoveImage(index, item?.id, item?.type)
                              }
                            ></img>
                            <img
                              className="img-image"
                              src={
                                editItem?.id
                                  ? 'data:image/jpg;base64,' + item.image_base64
                                  : item.image_base64
                              }
                            ></img>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul className="content-note">
                        <li>
                          Lưu ý: Để upload dữ liệu thành công, tên cần đặt theo
                          cấu trúc: [text]_front, [text]_back, [text]_face,
                          [text]_signature
                        </li>

                        <li>
                          Ví dụ
                          <ul>
                            <li>
                              Dữ liệu eKYC 1: eKYC1_front, eKYC1_back,
                              eKYC1_face, eKYC1_signature
                            </li>
                          </ul>
                        </li>
                      </ul>
                    )}

                    <input
                      multiple
                      onChange={changeHandler}
                      accept="image/png, image/jpg, image/jpeg"
                      type="file"
                      id="file"
                      ref={inputFile}
                      style={{ display: 'none' }}
                    />
                  </div>
                  {errors.images && (
                    <p className="text-danger">*{errors.images.message}</p>
                  )}
                </>
              ) : (
                ''
              )}
              {errors.data_source && (
                <p className="text-danger">*{errors.data_source.message}</p>
              )}
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
                {editItem?.id ? 'Cập nhật' : ' Tạo mới'}
              </Button>
            </div>
          </Box>
        </form>
      </Modal>
    </div>
  );
};

export default ImportFileImage;
