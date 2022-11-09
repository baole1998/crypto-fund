import React, { useCallback, useState, useEffect, Fragment } from 'react';
import { Box, styled } from '@mui/system';
import {
  Button,
  Card,
  FormControlLabel,
  InputBase,
  MenuItem,
  Radio,
  Select,
  TextField
} from '@mui/material';
import './AddAppoint.scss';
import ListItemAppoint from './ListItemAppoint';
import ItemDateTime from 'src/components/ItemDateTime/ItemDateTime';
import Breadcrumb from 'src/components/Breadcrum/Breadcrumb';
import { SyncTaskModel } from 'src/models/sync_task';
import { GroundTruthTaskModel } from 'src/models/ground_truth_task';

interface AddAppointGeneralInfoProps {
  fetchCustomerDoc: (params) => void;
  fetchEngineData: (params) => void;
  listSyncTask: Array<SyncTaskModel>;
  groundtruthData: any;
  handleChangeGroundtruthData: (name, value) => void;
  listDataSource: Array<any>;
  editItem: any;
  setListCustomerDoc: (value) => void;
}

interface CustomerDocParams {
  customer_code?: string;
  uid?: string;
  to_date?: Date;
  from_date?: Date;
  data_source?: string;
  id_sync_task?: number;
}

const AddAppointGeneralInfo: React.FC<AddAppointGeneralInfoProps> = ({
  fetchCustomerDoc,
  fetchEngineData,
  listSyncTask,
  groundtruthData,
  handleChangeGroundtruthData,
  listDataSource,
  editItem,
  setListCustomerDoc
}) => {
  const [createType, setCreateType] = useState<'batch' | 'random'>('batch');
  const [customerDocParams, setCustomerDocParams] = useState<CustomerDocParams>(
    {}
  );
  const [engine1, setEngine1] = useState<string>('VVN');
  const [engine2, setEngine2] = useState<string>('FDM');

  useEffect(() => {
    if (editItem) {
      if (editItem.sync_task) {
        setCreateType('batch');
      } else {
        setCreateType('random');
      }
    }
  }, []);

  const handleChangeCreateType = (
    checked: boolean,
    value: 'batch' | 'random'
  ) => {
    if (checked) {
      setCreateType(value);
      setListCustomerDoc([]);
    }
    if (value === 'batch') {
      delete customerDocParams.customer_code;
      delete customerDocParams.data_source;
      delete customerDocParams.from_date;
      delete customerDocParams.to_date;
      delete customerDocParams.uid;
      handleChangeGroundtruthData('customer_docs_id', null);
      setCustomerDocParams({ ...customerDocParams });
      handleChangeGroundtruthData('sync_task_id', listSyncTask[0]?.id);

    } else {
      delete customerDocParams.id_sync_task;
      handleChangeGroundtruthData('sync_task_id', null);
    }
  };

  const handleChangeCustomerDocParams = (key, value) => {
    setCustomerDocParams({ ...customerDocParams, [key]: value });
  };

  const handleChangeDataSrc = (value: string) => {
    handleChangeGroundtruthData('task_source', value);

    if (value === 'BO') {
      setEngine1('VVN');
      setEngine2('FDM');
    }
    if (value === 'Ekyc-Bot') {
      setEngine1('FDM');
      setEngine2('VVN');
    }
  };

  const handleSearch = () => {
    fetchCustomerDoc(customerDocParams);
    fetchEngineData({ name: engine1, key: 'engine1' });
    fetchEngineData({ name: engine2, key: 'engine2' });
    handleChangeGroundtruthData('customer_docs_id', null);
  };

  return (
    <Card className="info-table">
      <div className="row">
        <div className="col-12 mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Nguồn dữ liệu
          </label>
          <Select
            style={{ width: '100%' }}
            value={groundtruthData?.task_source ?? 'BO'}
            onChange={(e) => handleChangeDataSrc(e.target.value)}
            disabled = {editItem}
          >
            <MenuItem value={'BO'}>BO</MenuItem>
            <MenuItem value={'Ekyc-Bot'}>Ekyc-Bot</MenuItem>
            <MenuItem value={'Import'}>import</MenuItem>
          </Select>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Đơn vị cung cấp 1
          </label>
          <Select style={{ width: '100%' }} value={engine1} disabled>
            <MenuItem value={'FDM'}>FDM</MenuItem>
            <MenuItem value={'VVN'}>VVN</MenuItem>
          </Select>
        </div>
      </div>
      <div className="row">
        <div className="col-12 mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Đơn vị cung cấp 2
          </label>
          <Select style={{ width: '100%' }} value={engine2} disabled>
            <MenuItem value={'FDM'}>FDM</MenuItem>
            <MenuItem value={'VVN'}>VVN</MenuItem>
          </Select>
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Mô tả
        </label>
        <div>
          <textarea
            className="txt-description w-100"
            value={groundtruthData?.name}
            onChange={(e) =>
              handleChangeGroundtruthData('name', e.target.value)
            }
          ></textarea>
        </div>
      </div>

      <div className="row">
        <div className="col-6 mb-3">
          <FormControlLabel
            value="female"
            control={
              <Radio
                checked={createType === 'batch'}
                onChange={(e) =>
                  handleChangeCreateType(e.target.checked, 'batch')
                }
              />
            }
            label="Thêm mới batch"
          />
        </div>
        <div className="col-6 mb-3">
          <FormControlLabel
            value="male"
            control={
              <Radio
                checked={createType === 'random'}
                onChange={(e) =>
                  handleChangeCreateType(e.target.checked, 'random')
                }
              />
            }
            label="Thêm mới chỉ định"
          />
        </div>
      </div>
      {createType === 'batch' && (
        <div className="row">
          <div className="col-12 mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Danh sách batch
            </label>
            <Select
              style={{ width: '100%' }}
              value={groundtruthData?.sync_task_id || ''}
              disabled={listSyncTask?.length === 0}
              onChange={(e) => {
                handleChangeCustomerDocParams('id_sync_task', e.target.value);
                handleChangeGroundtruthData('sync_task_id', e.target.value);
              }}
            >
              {listSyncTask?.length > 0 &&
                listSyncTask.map((item) => (
                  <MenuItem key={item?.id} value={item?.id}>
                    {item.name}
                  </MenuItem>
                ))}
            </Select>
          </div>
        </div>
      )}
      {createType === 'random' && (
        <Fragment>
          <div className="mb-3">
            <label className="fs-5">Lựa chọn dữ liệu</label>
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                TKCK
              </label>
              <TextField
                id="demo-helper-text-aligned"
                placeholder="123456"
                onChange={(e) =>
                  handleChangeCustomerDocParams('customer_code', e.target.value)
                }
              />
            </div>
            <div className="col-6 mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                UID/Filename
              </label>
              <TextField
                id="demo-helper-text-aligned"
                placeholder="123456"
                onChange={(e) =>
                  handleChangeCustomerDocParams('uid', e.target.value)
                }
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Dữ liệu từ ngày
              </label>
            </div>
            <div className="col-6 mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                đến ngày
              </label>
            </div>
            <div className="col-12 mb-3">
              <ItemDateTime
                startDate={customerDocParams?.from_date || new Date()}
                endDate={customerDocParams?.to_date || new Date()}
                setStartDate={handleChangeCustomerDocParams}
                setEndDate={handleChangeCustomerDocParams}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12 mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Kênh dữ liệu
              </label>
              <Select
                style={{ width: '100%' }}
                value={customerDocParams?.data_source || ''}
                onChange={(e) =>
                  handleChangeCustomerDocParams('data_source', e.target.value)
                }
              >
                <MenuItem value={''}>{'---'}</MenuItem>
                {listDataSource?.length > 0 &&
                  listDataSource.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            </div>
          </div>
        </Fragment>
      )}
      <div className="footer-search">
        <Button
          variant="contained"
          className="btn button-search"
          onClick={handleSearch}
        >
          Tìm kiếm
        </Button>
      </div>
    </Card>
  );
};
export default AddAppointGeneralInfo;
