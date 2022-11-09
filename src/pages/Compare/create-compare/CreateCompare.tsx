import { Fragment, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Breadcrumb from 'src/components/Breadcrum/Breadcrumb';
import { Card } from '@mui/material';
import './CreateCompare.scss';
import { Box } from '@mui/system';
import * as actionCustomerdoc from './../../../redux/store/data-management/customer-doc/customer-doc.store';
import * as actionGroundtruth from './../../../redux/store/data-management/ground-truth/ground-truth.store';
import * as actionGroundtruthRecord from './../../../redux/store/data-management/ground-truth/ground-truth-record.store';
import * as actionEngine from './../../../redux/store/engine/engine.store';
import * as actionCompare from './../../../redux/store/compare/compare.store';
import { CustomerDocModel } from 'src/models/customer_doc';
import CustomerDocList from './customer-doc/CustomerDocList';
import CompareInfo from './compare-info/CompareInfo';
import { GroundTruthModel } from 'src/models/ground_truth';
import moment from 'moment';
import { EngineModel } from 'src/models/engine';
import { CompareTaskModel, CompareTaskResponse } from 'src/models/compare_task';
import { useLocation, useNavigate } from 'react-router';

interface CustomerDocQueryParams {
  page_size?: Number;
  page?: Number;
  sort_by?: string;
  order?: string;
  id?: Number;
  uid?: Number;
  status?: string;
  from_date?: Date;
  to_date?: Date;
  data_source?: Number;
  name_task?: string;
  id_sync_task?: Number;
  ground_truth_id?: Number;
}

type GroundtruthType = 'default' | 'random';

interface DateTime {
  from_date: Date;
  to_date: Date;
}

interface LocationState {
  item: CompareTaskResponse;
}

const CreateCompare: React.FC = () => {
  const [customerdoc, setCustomerdoc] = useState<Array<CustomerDocModel>>([]);
  const [totalItemCount, setTotalItemCount] = useState<Number>(0);
  const [page, setPage] = useState<Number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<Number>(10);
  const [totalPage, setTotalPage] = useState<Number>(0);
  const [listGroundtruth, setListGroundtruth] = useState<
    Array<GroundTruthModel>
  >([]);
  const [groundtruthType, setGroundtruthType] =
    useState<GroundtruthType>('default');
  const [groundtruthTime, setGroundtruthTime] = useState<DateTime>({
    from_date: new Date(),
    to_date: new Date()
  });
  const [listEngine, setListEngine] = useState<Array<EngineModel>>();
  const [compareInfo, setCompareInfo] = useState<CompareTaskModel>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const editItem = state?.item;

  useEffect(() => {
    fetchEngineData();
    fetchGroundtruthData();
    if (editItem) {
      console.log('EDIT ITEM', editItem);
      getEditItem();
    }
  }, [editItem]);

  const getEditItem = () => {
    let currentCompareInfo = {
      type: editItem.type,
      engine_info: {},
      ground_truth_id: editItem?.ground_truth_task?.id,
      name: editItem?.name
    };

    if (
      Object.keys(currentCompareInfo.type).includes('front') ||
      Object.keys(currentCompareInfo.type).includes('front')
    ) {
      currentCompareInfo.type['ekyc'] = 'ekyc';
    }

    for (let i in Object.keys(editItem.compare_engine)) {
      let key = Object.keys(editItem.compare_engine)[i];
      if (editItem.compare_engine[key]?.engine1) {
        currentCompareInfo.engine_info[key] = {};
        currentCompareInfo.engine_info[key]['engine1'] =
          editItem.compare_engine[key]?.engine1?.id;
      }
      if (editItem.compare_engine[key]?.engine2) {
        currentCompareInfo.engine_info[key]['engine2'] =
          editItem.compare_engine[key]?.engine2?.id;
      }
    }
    if (currentCompareInfo?.ground_truth_id) {
      setGroundtruthType('default');
      fetchGroundtruthRecord({
        ground_truth_id: currentCompareInfo?.ground_truth_id,
        page_size: rowsPerPage,
        page: page
      });
    } else {
      setGroundtruthType('random');
      handleChangeCompareInfo('name', currentCompareInfo?.name);
    }
    setCompareInfo(currentCompareInfo);
  };

  const onFetchDataCallback = () => {
    const data = {
      page_size: rowsPerPage,
      page: page
    };
    if (groundtruthType === 'random') {
      delete compareInfo?.ground_truth_id;
      data['from_date'] = moment(groundtruthTime.from_date).format(
        moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
      );
      data['to_date'] = moment(groundtruthTime.to_date).format(
        moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
      );
    } else {
      delete compareInfo?.customer_docs_id;
    }
    setCompareInfo({ ...compareInfo });

    fetchGroundtruthRecord(data);
  };

  const fetchGroundtruthRecord = (queryParams: CustomerDocQueryParams) => {
    let {
      page_size,
      page,
      sort_by,
      order,
      from_date,
      to_date,
      ground_truth_id
    } = queryParams;
    let id = ground_truth_id || compareInfo?.ground_truth_id;
    let data = `?page_size=${page_size}&page=${page}&is_compare=true`;
    if (sort_by) {
      data += `&sort_by=${sort_by}`;
    }

    if (order) {
      data += `&order=${order}`;
    }

    if (id) {
      data += `&id=${id}`;
    }

    if (from_date) {
      let date = moment(from_date).format(
        moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
      );
      data += `&from_date=${date}`;
    }
    if (to_date) {
      let date = moment(to_date).format(
        moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
      );
      delete data['id'];
      data += `&to_date=${date}`;
    }

    actionGroundtruthRecord.getGroundTruthRecord(data).then((res) => {
      setCustomerdoc(res?.data);
      setPage(parseInt(res.metadata.current_page));
      setTotalPage(
        Math.round(res.metadata.total_items / res.metadata.page_size)
      );
      setTotalItemCount(res.metadata.total_items);
    });
  };

  const fetchGroundtruthData = () => {
    actionGroundtruth.getGroundTruth('').then((res) => {
      setListGroundtruth(res.data);
      if (!editItem) {
        setCompareInfo((prevState) => ({
          ...prevState,
          ground_truth_id: res.data[0].id
        }));
      }
    });
  };

  const fetchEngineData = () => {
    actionEngine.getEngine('').then((res) => {
      setListEngine(res.data.filter((e) => e.verified === 'approved'));
    });
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(e.target.value);
    fetchGroundtruthRecord({
      page_size: e.target.value,
      page: page
    });
  };

  const handleChangePage = (event, newPage: Number) => {
    setPage(newPage);
    let data = { page_size: rowsPerPage, page: newPage };
    data['from_date'] = moment(groundtruthTime.from_date).format(
      moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
    );
    data['to_date'] = moment(groundtruthTime.to_date).format(
      moment.HTML5_FMT.DATETIME_LOCAL_SECONDS
    );
    fetchGroundtruthRecord(data);
  };

  const handleChangeGroundtruthTime = (name, value: Date) => {
    if (name === 'from_date') {
      setGroundtruthTime({
        ...groundtruthTime,
        from_date: value
      });
    }
    if (name === 'to_date') {
      setGroundtruthTime({
        ...groundtruthTime,
        to_date: value
      });
    }
  };

  const handleChangeCompareInfo = (name, data) => {
    if (name === 'engine_info') {
      setCompareInfo((prevState) => ({
        ...prevState,
        engine_info: data
      }));
    }
    if (name === 'ground_truth_id') {
      setCompareInfo({ ...compareInfo, ground_truth_id: parseInt(data) });
    }
    if (name === 'compare-type') {
      let type = compareInfo?.type || {};
      let val = Object.values(data)[0];
      let key = Object.keys(data)[0];

      if (val) type[key] = val;
      else delete type[key];
      setCompareInfo({ ...compareInfo, type: type });
    }

    if (name === 'customer_docs_id') {
      console.log(name, data);
      setCompareInfo({ ...compareInfo, customer_docs_id: data });
    }

    if (name === 'name') {
      setCompareInfo({ ...compareInfo, name: data });
    }
  };

  const handleCreateCompare = () => {
    let data = {
      engine_info: {},
      type: {}
    };
    let { engine_info, ground_truth_id, type, customer_docs_id, name } =
      compareInfo;
    if (engine_info) {
      if (Object.keys(engine_info['ekyc'] ?? {}).length === 0) {
        engine_info['ekyc'] = null;
        delete engine_info['ekyc'];
      }
      if (Object.keys(engine_info['face'] ?? {}).length === 0) {
        engine_info['face'] = null;
        delete engine_info['face'];
      }
      if (Object.keys(engine_info['sign'] ?? {}).length === 0) {
        engine_info['sign'] = null;
        delete engine_info['sign'];
      }
      data['engine_info'] = engine_info;
    }
    if (ground_truth_id) {
      data['ground_truth_id'] = ground_truth_id;
    }
    if (customer_docs_id) {
      data['customer_docs_id'] = customer_docs_id;
    }
    if (name) {
      data['name'] = name;
    }
    if (type) {
      if (type['ekyc']) {
        delete type['ekyc'];
      }
      data['type'] = type;
    }

    console.log(data, compareInfo);

    if (
      (data['ground_truth_id'] || data['customer_docs_id']) &&
      Object.keys(data.type).length > 0 &&
      Object.keys(data.engine_info).length > 0
    ) {
      actionCompare.createCompare(data).then((res) => {
        navigate('/compare');
      });
    } else {
      throw Error('not enough info');
    }
  };

  const handleEditCompare = () => {
    let data = {
      engine_info: {},
      ground_truth_id: null,
      type: {}
    };
    let { engine_info, ground_truth_id, type, customer_docs_id, name } =
      compareInfo;
    if (engine_info) {
      if (Object.keys(engine_info['ekyc'] ?? {}).length === 0) {
        engine_info['ekyc'] = null;
        delete engine_info['ekyc'];
      }
      if (Object.keys(engine_info['face'] ?? {}).length === 0) {
        engine_info['face'] = null;
        delete engine_info['face'];
      }
      if (Object.keys(engine_info['sign'] ?? {}).length === 0) {
        engine_info['sign'] = null;
        delete engine_info['sign'];
      }
      data['engine_info'] = engine_info;
    }
    if (ground_truth_id) {
      data['ground_truth_id'] = ground_truth_id;
    }
    if (customer_docs_id) {
      data['customer_docs_id'] = customer_docs_id;
    }
    if (name) {
      data['name'] = name;
    }
    if (type) {
      if (type['ekyc']) {
        delete type['ekyc'];
      }
      data['type'] = type;
    }
    console.log(data);

    if (
      (data['ground_truth_id'] || data['customer_docs_id']) &&
      Object.keys(data.type).length > 0 &&
      Object.keys(data.engine_info).length > 0
    ) {
      actionCompare.putCompare(editItem.id, data).then((res) => {
        navigate('/compare');
      });
    } else {
      throw Error('not enough info');
    }
  };

  const handleChangeGroundtruthType = (e) => {
    setGroundtruthType(e.target.value);
    if (e.target.value === 'default') {
      setCompareInfo({
        ...compareInfo,
        ground_truth_id: listGroundtruth[0].id
      });
    } else {
      delete compareInfo.ground_truth_id;
      setCompareInfo({ ...compareInfo });
    }
    setPage(1);
    setRowsPerPage(10);
    setCustomerdoc([]);
  };

  return (
    <Box className="create-compare-container">
      <Breadcrumb
        routeSegments={[
          { name: editItem ? 'CHỈNH SỬA' : 'THÊM MỚI', path: '/compare' }
        ]}
      />
      <Grid container spacing={1} className="create-compare-content-container">
        <Grid item xs={12} sm={4}>
          <Card className="info-table">
            {/* <InfoTable /> */}
            <CompareInfo
              onFetchDataCallback={onFetchDataCallback}
              listGroundtruth={listGroundtruth}
              groundtruthType={groundtruthType}
              handleChangeGroundtruthType={handleChangeGroundtruthType}
              groundtruthTime={groundtruthTime}
              handleChangeGroundtruthTime={handleChangeGroundtruthTime}
              listEngine={listEngine}
              handleChangeCompareInfo={handleChangeCompareInfo}
              editItem={editItem}
              compareInfo={compareInfo}
            />
          </Card>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Card className="info-table data-table">
            <CustomerDocList
              customerdoc={customerdoc}
              totalItemCount={totalItemCount}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              handleChangePage={handleChangePage}
              totalPage={totalPage}
              handleCreateCompare={handleCreateCompare}
              handleEditCompare={handleEditCompare}
              editItem={editItem}
              groundtruthType={groundtruthType}
              compareInfo={compareInfo}
              handleChangeCompareInfo={handleChangeCompareInfo}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default CreateCompare;
