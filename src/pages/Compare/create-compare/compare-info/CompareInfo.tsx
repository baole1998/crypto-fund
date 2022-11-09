import { Fragment, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Breadcrumb from 'src/components/Breadcrum/Breadcrumb';
import Radio from '@mui/material/Radio';
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  MenuItem,
  RadioGroup,
  Select,
  Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import Checkbox from '@mui/material/Checkbox';
import { GroundTruthModel } from 'src/models/ground_truth';
import ItemDateTime from 'src/components/ItemDateTime/ItemDateTime';
import { EngineModel } from 'src/models/engine';
import { CompareTaskModel, CompareTaskResponse } from 'src/models/compare_task';
import CancelIcon from '@mui/icons-material/Cancel';

const useStyles = makeStyles({
  infoContainer: {
    '& .css-m9a1j-MuiGrid-root': {
      marginTop: '5px !important'
    },
    '& .css-16aq49t-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input':
      {
        padding: '10px'
      },
    '& .css-eh79eo-MuiInputBase-root-MuiOutlinedInput-root-MuiSelect-root': {
      borderRadius: '5px !important'
    },
    '& .css-kdmod8-MuiButtonBase-root-MuiRadio-root': {
      // padding: 0
    }
  }
});

interface CompareInfoProps {
  onFetchDataCallback: () => void;
  listGroundtruth: Array<GroundTruthModel>;
  groundtruthType: string;
  handleChangeGroundtruthType: (e) => void;
  groundtruthTime: {
    from_date: Date;
    to_date: Date;
  };
  handleChangeGroundtruthTime: (name: string, value: any) => void;
  listEngine: Array<EngineModel>;
  handleChangeCompareInfo: (name: string, value: any) => void;
  editItem: CompareTaskResponse;
  compareInfo: CompareTaskModel;
}

const CompareInfo: React.FC<CompareInfoProps> = (props) => {
  const {
    onFetchDataCallback,
    listGroundtruth,
    groundtruthType,
    handleChangeGroundtruthType,
    groundtruthTime,
    handleChangeGroundtruthTime,
    listEngine,
    handleChangeCompareInfo,
    editItem,
    compareInfo
  } = props;
  const styles = useStyles();
  const [numberOfEngines, setNumberOfEngines] = useState({
    face: 1,
    ekyc: 1,
    sign: 1
  });
  const [groundtruth, setGroundtruth] = useState<string | Number>();
  let testType = compareInfo?.type || {}
  let engineInfo = compareInfo?.engine_info || {}

  useEffect(() => {
    if (editItem && listGroundtruth && listEngine) {
      setGroundtruth(editItem.ground_truth_task?.id);
      handleChangeCompareInfo(
        'ground_truth_id',
        editItem.ground_truth_task?.id
      );
      getEditItem(editItem);
    } else {
      setGroundtruth(listGroundtruth[0]?.id);
      handleChangeCompareInfo('ground_truth_id', listGroundtruth[0]?.id);
    }
  }, [editItem, listGroundtruth, listEngine]);

  const getEditItem = (editItem: CompareTaskResponse) => {
    Object.keys(editItem?.type).forEach(function (key, index) {
      // debugger;

      let converttype = key === 'front' || key === 'back' ? 'ekyc' : key;
      if (editItem.compare_engine[converttype]?.engine2) {
        setNumberOfEngines((numberOfEngines) => ({
          ...numberOfEngines,
          [converttype]: 2
        }));
      }

      // if (
      //   (key === 'front' || key === 'back') &&
      //   !compareType.includes(converttype)
      // ) {
      //   compareType.push('ekyc');
      // }
      // if (!compareType.includes(key)) {
      //   compareType.push(key);
      // }
      // setCompareType(compareType);
      // setEngineInfo(compareInfo?.engine_info);
    });
  };

  const handleCompareType = (checked, type: string) => {
    // let currentCompareType = testType;
    let currentEngineInfo = engineInfo;
    let converttype = type === 'front' || type === 'back' ? 'ekyc' : type;

    if (checked) {
      // currentCompareType.push(type);
      handleChangeCompareInfo('compare-type', { [type]: type });
      if (type !== 'ekyc') {
        let sampleEngine = filterEngineByCompareType(converttype)[0];
        if (sampleEngine) {
          currentEngineInfo[converttype] = {
            engine1: sampleEngine.id
          };
          handleChangeEngines(converttype, 'engine1', sampleEngine.id);

          if (numberOfEngines[converttype] === 2) {
            currentEngineInfo[converttype]['engine2'] = sampleEngine.id;
            handleChangeEngines(converttype, 'engine2', sampleEngine.id);
          }
        }
      }
    } else {
      // currentCompareType = currentCompareType.filter((item) => {
      //   return item !== type;
      // });
      handleChangeCompareInfo('compare-type', { [type]: null });
      if (type === 'ekyc') {
        handleChangeCompareInfo('compare-type', { front: null });
        handleChangeCompareInfo('compare-type', { back: null });

        // currentCompareType = currentCompareType.filter((item) => {
        //   return item !== 'front' && item !== 'back';
        // });
      }

      // if (type !== 'ekyc') {
      if (
        (type !== 'front' && type !== 'back') ||
        (!Object.keys(testType).includes('front') &&
          !Object.keys(testType).includes('back'))
      ) {
        handleChangeEngines(converttype, 'del_all_engine', null);
        currentEngineInfo[converttype] = {};
      }
      // }
    }

    // setCompareType(currentCompareType);
    // setEngineInfo(currentEngineInfo);
  };

  const filterEngineByCompareType = (type) => {
    return listEngine?.filter((e) => {
      return type === e.type;
    });
  };

  const changeNumberOfCompareEngine = (compareType, type: 'add' | 'del') => {
    if (type === 'add') {
      setNumberOfEngines({ ...numberOfEngines, [compareType]: 2 });
      let sampleEngine = filterEngineByCompareType(compareType)[0];
      let currentEngineInfo = engineInfo;

      if (sampleEngine) {
        currentEngineInfo[compareType]['engine2'] = sampleEngine.id;
        handleChangeEngines(compareType, 'engine2', sampleEngine.id);
      }
      // setEngineInfo(currentEngineInfo);
    }
    if (type === 'del') {
      setNumberOfEngines({ ...numberOfEngines, [compareType]: 1 });
      handleChangeEngines(compareType, 'engine2', null);
    }
  };

  const handleChangeEngines = (type, name, value) => {
    //example: type:face, name:engine1, value: 1
    let currentEngineInfo = engineInfo;

    if (value) currentEngineInfo[type][name] = parseInt(value);
    else delete currentEngineInfo[type][name];

    if (name === 'del_all_engine') delete currentEngineInfo[type];

    // setEngineInfo(currentEngineInfo);
    handleChangeCompareInfo('engine_info', currentEngineInfo);
  };

  const Engines = (props) => {
    let { type, activeSelect } = props;
    let engine1 = engineInfo[type]?.['engine1'];
    let engine2 = engineInfo[type]?.['engine2'];
    let listEngineByCompareType = filterEngineByCompareType(type);
    let nOfEngine = numberOfEngines[type];
    // console.log(type, listEngineByCompareType, engine1, engine2, nOfEngine);
    return (
      <Box>
        {listEngineByCompareType?.length === 0 && (
          <p>Chưa có engines tương ứng</p>
        )}
        {listEngineByCompareType?.length > 0 && activeSelect && (
          <Box>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <p>Đơn vị cung cấp 1</p>

                {Object.keys(testType).length > 0 && (
                  <Select
                    labelId="select-engine-1"
                    value={engine1 ?? ''}
                    label="Choose an engine"
                    style={{ width: '100%' }}
                    onChange={(e) => {
                      handleChangeEngines(type, 'engine1', e.target.value);
                    }}
                  >
                    {listEngineByCompareType?.length > 0 &&
                      listEngineByCompareType.map((item) => {
                        return (
                          <MenuItem key={item.id} value={item.id.toString()}>
                            {'[' +
                              item.env +
                              ' - ' +
                              item.url +
                              ' - ver.' +
                              item.version +
                              '] ' +
                              item.name +
                              ' - ' +
                              item.type}
                          </MenuItem>
                        );
                      })}
                  </Select>
                )}
              </Grid>
              {nOfEngine !== 2 && (
                <Grid className="d-flex justify-content-center" item xs={12}>
                  <Button
                    variant="contained"
                    className="rounded-1 w-100"
                    onClick={() => changeNumberOfCompareEngine(type, 'add')}
                  >
                    + Add more engine
                  </Button>
                </Grid>
              )}
            </Grid>

            {nOfEngine === 2 && (
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <p className="d-flex justify-content-between">
                    <span>Đơn vị cung cấp 2</span>
                    <span>
                      <CancelIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() => changeNumberOfCompareEngine(type, 'del')}
                      />
                    </span>
                  </p>
                  <Select
                    label="Choose an engine"
                    labelId="select-engine-2"
                    value={engine2 ?? ''}
                    style={{ width: '100%' }}
                    onChange={(e) => {
                      handleChangeEngines(type, 'engine2', e.target.value);
                    }}
                  >
                    {listEngineByCompareType?.length > 0 &&
                      listEngineByCompareType.map((item) => {
                        return (
                          <MenuItem key={item.id} value={item.id.toString()}>
                            {'[' +
                              item.env +
                              ' - ' +
                              item.url +
                              ' - ver.' +
                              item.version +
                              '] ' +
                              item.name +
                              ' - ' +
                              item.type}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </Grid>
              </Grid>
            )}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <div className={styles.infoContainer}>
      <Box sx={{ height: '45rem', overflow: 'auto', paddingBottom: '1rem' }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            Thông tin so sánh
          </Grid>

          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleCompareType(e.target.checked, 'ekyc')
                    }
                    checked={Object.keys(testType).includes('ekyc')}
                    name="ekyc"
                  />
                }
                label="Nhận diện CCCD/CMND"
              />
              {Object.keys(testType).includes('ekyc') && (
                <Grid container>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={11}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) =>
                            handleCompareType(e.target.checked, 'front')
                          }
                          checked={Object.keys(testType).includes('front')}
                          name="front"
                        />
                      }
                      label="Nhận diện mặt trước"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={(e) =>
                            handleCompareType(e.target.checked, 'back')
                          }
                          checked={Object.keys(testType).includes('back')}
                        />
                      }
                      label="Nhận diện mặt sau"
                    />

                    <Engines
                      type="ekyc"
                      activeSelect={
                        Object.keys(testType).includes('front') ||
                        Object.keys(testType).includes('back')
                      }
                    />
                  </Grid>
                </Grid>
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleCompareType(e.target.checked, 'face')
                    }
                    checked={Object.keys(testType).includes('face')}
                  />
                }
                label="So khớp khuôn mặt"
              />
              {Object.keys(testType).includes('face') && (
                <Grid container>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={11}>
                    <Engines type="face" activeSelect={true} />
                  </Grid>
                </Grid>
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      handleCompareType(e.target.checked, 'sign')
                    }
                    checked={Object.keys(testType).includes('sign')}
                  />
                }
                label="Nhận diện chữ ký"
              />
              {Object.keys(testType).includes('sign') && (
                <Grid container>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={11}>
                    <Engines type="sign" activeSelect={true} />
                  </Grid>
                </Grid>
              )}
            </FormGroup>
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          <Grid item xs={12}>
            Chọn dữ liệu
          </Grid>
          <Grid item xs={12}>
            <FormGroup>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                value={groundtruthType}
                onChange={handleChangeGroundtruthType}
                name="radio-buttons-group"
                row
              >
                <Grid item xs={6}>
                  <FormControlLabel
                    value="default"
                    control={<Radio />}
                    label="Dữ liệu chuẩn"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    value="random"
                    control={<Radio />}
                    label="Dữ liệu chuẩn bất kỳ"
                  />
                </Grid>
              </RadioGroup>
            </FormGroup>
          </Grid>
        </Grid>

        {groundtruthType === 'default' && (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              Nguồn dữ liệu
            </Grid>
            <Grid item xs={12}>
              {
                <Select
                  value={groundtruth ?? ''}
                  style={{ width: '100%' }}
                  onChange={(e) => {
                    setGroundtruth(e.target.value);
                    handleChangeCompareInfo('ground_truth_id', e.target.value);
                  }}
                  disabled={listGroundtruth?.length === 0}
                >
                  {listGroundtruth.length > 0 &&
                    listGroundtruth.map((item: GroundTruthModel) => {
                      return (
                        <MenuItem key={item.id} value={item.id.toString()}>
                          {item.id + ' ' + item.name}
                        </MenuItem>
                      );
                    })}
                </Select>
              }
            </Grid>
          </Grid>
        )}

        {groundtruthType === 'random' && (
          <Fragment>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <p>Dữ liệu từ ngày</p>
              </Grid>
              <Grid item xs={6}>
                <p> Đến ngày</p>
              </Grid>
              <ItemDateTime
                startDate={groundtruthTime.from_date}
                endDate={groundtruthTime.to_date}
                setStartDate={handleChangeGroundtruthTime}
                setEndDate={handleChangeGroundtruthTime}
              />
            </Grid>
            <Grid>
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Mô tả
              </label>
              <div>
                <textarea
                  className="txt-description w-100"
                  value={compareInfo.name}
                  onChange={(e) => {
                    handleChangeCompareInfo('name', e.target.value);
                  }}
                ></textarea>
              </div>
            </Grid>
          </Fragment>
        )}
      </Box>

      <div className="footer-search">
        <Button
          variant="contained"
          className="btn button-search"
          onClick={onFetchDataCallback}
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};

export default CompareInfo;
