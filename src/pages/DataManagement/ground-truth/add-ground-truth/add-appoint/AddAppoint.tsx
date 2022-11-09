import React, { useCallback, useState, useEffect, Fragment } from 'react';
import { Box, styled } from '@mui/system';
import {
  Button,
  Card,
  FormControlLabel,
  InputBase,
  MenuItem,
  Radio,
  Select
} from '@mui/material';
import './AddAppoint.scss';
import ListItemAppoint from './ListItemAppoint';
import ItemDateTime from 'src/components/ItemDateTime/ItemDateTime';
import Breadcrumb from 'src/components/Breadcrum/Breadcrumb';
import AddAppointGeneralInfo from './AddAppointGeneralInfo';
import * as actionCustomerDoc from 'src/redux/store/data-management/customer-doc/customer-doc.store';
import * as actionEngine from 'src/redux/store/engine/engine.store';
import * as actionSynctask from 'src/redux/store/sync-task/sync-task.store';
import * as actionGroundtruth from 'src/redux/store/data-management/ground-truth/ground-truth.store';
import * as actionDataSource from 'src/redux/store/data-source/data-source.store';

import moment from 'moment';
import { SyncTaskModel } from 'src/models/sync_task';
import { useLocation, useNavigate } from 'react-router';
import { CustomerDocModel } from 'src/models/customer_doc';
import { GroundTruthTaskModel } from 'src/models/ground_truth_task';

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

interface AddAppointProps {}
interface LocationState {
  item: any;
}

const AddAppoint: React.FC<AddAppointProps> = (props) => {
  const [listSyncTask, setListSyncTask] = useState<Array<SyncTaskModel>>([]);
  const [listCustomerDoc, setListCustomerDoc] = useState<
    Array<CustomerDocModel>
  >([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [engineInfo, setEngineInfo] = useState({
    face: {},
    ekyc: {},
    sign: {}
  });
  const navigate = useNavigate();
  const [totalItemCount, setTotalItemCount] = useState<number>(0);
  const [dataSearch, setDataSearch] = useState();
  const [groundtruthData, setGroundtruthData] = useState({
    name: '',
    task_source: 'BO',
    sync_task_id: null,
    customer_docs_id: null
  });
  const [listDataSource, setListDataSource] = useState([]);
  const location = useLocation();
  const state = location.state as LocationState;
  const editItem = state?.item;

  useEffect(() => {
    fetchSynctaskData();
    fetchListDataSource();
    console.log(editItem);
  }, []);

  useEffect(() => {
    if (editItem) {
      let currentGroundtruthData = { ...groundtruthData };
      currentGroundtruthData.name = editItem.name;
      currentGroundtruthData.sync_task_id = editItem?.sync_task?.id;
      // currentGroundtruthData.task_source = editItem?.
      setGroundtruthData(currentGroundtruthData);
      fetchCustomerDoc({
        ground_truth_id: editItem?.id
      });
    }
  }, [editItem]);

  const fetchCustomerDoc = (data) => {
    let {
      from_date,
      to_date,
      data_source,
      uid,
      customer_code,
      id_sync_task,
      currentpage,
      pageSize,
      ground_truth_id
    } = data;
    if (!currentpage) {
      currentpage = page;
    }
    if (!pageSize) {
      pageSize = rowsPerPage;
    }
    let params = `?page=${currentpage}&page_size=${pageSize}`;

    if (!editItem) {
      params += '&is_selected=false';
    }

    if (from_date) {
      let date = moment(from_date).format(
        moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
      );
      params += `&from_date=${date}`;
    }

    if (to_date) {
      let date = moment(to_date).format(
        moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
      );
      params += `&to_date=${date}`;
    }

    if (data_source) {
      params += `&data_source=${data_source}`;
    }

    if (uid) {
      params += `&uid=${uid}`;
    }

    if (customer_code) {
      params += `&customer_code=${customer_code}`;
    }

    if (id_sync_task) {
      params += `&id_sync_task=${id_sync_task}`;
    }

    if (ground_truth_id) {
      params += `&ground_truth_task_id=${ground_truth_id}`;
    }

    if (Object.keys(data).length === 0 && groundtruthData?.sync_task_id) {
      params += `&id_sync_task=${groundtruthData?.sync_task_id}`;
    }

    setDataSearch(data);
    actionCustomerDoc.getCustomerDoc(params).then((result) => {
      setListCustomerDoc(result.data);
      setTotalItemCount(result.metadata.total_items);
    });
  };

  const fetchEngineData = (data) => {
    let params = '?status=True&verified=approved&env=production';
    let { name, key } = data;
    if (name) {
      params += `&name=${name}`;
    }
    actionEngine.getEngine(params).then((res) => {
      if (res.data.length !== 3) {
        throw new Error('wrong engine data');
      }
      // if (groundtruthData.task_source === 'import' || key !== 'engine1') {
      handleChangeEngineInfo(res.data, key);
      // }
    });
  };

  const fetchListDataSource = () => {
    actionDataSource.getDataSource().then((res) => {
      setListDataSource(res.data);
    });
  };

  const fetchSynctaskData = () => {
    actionSynctask.getSyncTask('?status=success').then((res) => {
      setListSyncTask(res.data);
      if (res.data?.length > 0 && !editItem) {
        handleChangeGroundtruthData('sync_task_id', res.data[0].id);
      }
    });
  };

  const handleChangeEngineInfo = (engineData, key) => {
    let currentEngineInfo = { ...engineInfo };
    for (let i in engineData) {
      // debugger;
      let item = engineData[i];
      currentEngineInfo[item.type][key] = item?.id;
    }
    setEngineInfo({ ...currentEngineInfo });
  };

  const handleChangeGroundtruthData = (name, value) => {
    setGroundtruthData({ ...groundtruthData, [name]: value });
  };

  const handleCreateGroundtruth = () => {
    let data = {};
    let { task_source, name, sync_task_id, customer_docs_id } = groundtruthData;
    if (name === '') {
      throw new Error('name is required');
    }

    if (!sync_task_id && !customer_docs_id) {
      throw new Error('synctask or customerdoc required');
    }

    if (sync_task_id) {
      data['sync_task_id'] = sync_task_id;
    }

    if (customer_docs_id) {
      data['customer_docs_id'] = customer_docs_id;
    }

    data['name'] = name;
    console.log(data, groundtruthData);
    if (!editItem) {
      data['task_source'] = task_source;
      data['engine_info'] = engineInfo;

      actionGroundtruth.createGroundTruth(data).then((res) => {
        navigate('/ground-truth');
      });
    } else {
      actionGroundtruth.patchGroundTruth(editItem.id, data).then((res) => {
        navigate('/ground-truth');
      });
    }
  };

  return (
    <Container className="create-groundtruth-container ">
      <Breadcrumb
        routeSegments={[
          { name: !editItem ? 'THÊM MỚI' : 'CHỈNH SỬA', path: '/ground-truth' }
        ]}
      />
      <div className="row create-groundtruth-content-container ">
        <div className="col-xs-12 col-sm-5 ">
          <AddAppointGeneralInfo
            fetchCustomerDoc={fetchCustomerDoc}
            fetchEngineData={fetchEngineData}
            listSyncTask={listSyncTask}
            groundtruthData={groundtruthData}
            handleChangeGroundtruthData={handleChangeGroundtruthData}
            listDataSource={listDataSource}
            editItem={editItem}
            setListCustomerDoc={setListCustomerDoc}
          />
        </div>
        <div className=" col-xs-12 col-sm-7 ">
          <Card className="info-table data-table">
            <ListItemAppoint
              listCustomerDoc={listCustomerDoc}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              handleCreateGroundtruth={handleCreateGroundtruth}
              totalItemCount={totalItemCount}
              fetchCustomerDoc={fetchCustomerDoc}
              dataSearch={dataSearch}
              groundtruthData={groundtruthData}
              handleChangeGroundtruthData={handleChangeGroundtruthData}
              editItem={editItem}
            />
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default AddAppoint;
