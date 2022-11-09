import React, { useCallback, useState, useEffect } from 'react';
import { Box, styled } from '@mui/system';
import { Button, Card, InputBase } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import UploadIcon from '@mui/icons-material/Upload';
import ListSubDetailDataManagement from './list-sub-detail-data-management/ListSubDetailDataManagement.view';
import SearchIcon from '@mui/icons-material/Search';
import * as actionsDetailDataManagement from 'src/redux/store/data-management/customer-doc/customer-doc.store';
import * as actionsCustomerInfo from 'src/redux/store/data-management/customer-info/customer-info.store';
import * as actionsDataSource from '../../../../redux/store/data-source/data-source.store';
import { debounce } from 'debounce';
import CloseIcon from '@mui/icons-material/Close';
import { CustomerInfoModel } from 'src/models/customer_info';
import './SubDetailDataManagement.scss';
import moment from 'moment';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useParams, useNavigate } from 'react-router-dom';
import { CustomerDocModel } from 'src/models/customer_doc';
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

const SubDetailDataManagement: React.FC = () => {
  const [generalDataManagements, setSubDetailDataManagements] = useState([]);
  const [detail, setDetail] = useState<CustomerDocModel>({});
  const [tmpDetail, setTmpDetail] = useState<CustomerDocModel>({});
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [totalItemCount, setTotalItemCount] = useState<number>(0);
  const [listStateEdit, setListStateEdit] = useState<string[]>([]);
  let { id } = useParams();
  const navigate = useNavigate()
  useEffect(() => {
    onResetFilter();
  }, []);
 
  const onResetFilter = () => {
    onFetchDataCallback(parseInt(id), rowsPerPage, 1);
  };
  
  const onFetchDataCallback = useCallback(
    (
      id: number,
      rowsPerPage: number,
      page: number
    ) => {
      onFetchData(
        id,
        rowsPerPage,
        page
      );
    },
    [rowsPerPage, page]
  );
  const onFetchData = (
    id:number,
    rowsPerPage: number,
    page: number
  ) => {
    setPage(page);
    let param = `${id}?page_size=${rowsPerPage}&page=${page}`;
    actionsDetailDataManagement.getCustomerDocDetail(param).then((res) => {
      console.log(res);
      if (res && res.data) {
        setDetail(res.data);
        setTmpDetail(res.data)
      }
    });
  };
  
  const onGoback = () => {
    navigate('/manage-data-detail')
  }
  const onChangeStateShowEditCustomerInfo = (name: string) => {
    const data = [...listStateEdit]
    if (listStateEdit.length > 0 ) {
      const check = listStateEdit.find((item)=>item === name)
      if(check) {
        const newData = listStateEdit.filter((item) => item !== name);
        setListStateEdit(newData)
      }else{
        data.push(name);
        setListStateEdit(data)
      }
    }else {
      data.push(name);
      setListStateEdit(data)
    }
  }
  const onChangeCustomerInfo = (type: string, name:string, value: any)=>{
    if(name == 'birthday') {
      setTmpDetail({
        ...tmpDetail,
        customer_info: {
          ...tmpDetail.customer_info,
          [type]: {
            ...tmpDetail.customer_info[type],
            birthday: moment(value).format('YYYY-MM-DD') + "T00:00:00.000Z"
          }
        }
      })
    } else if(name == 'issue_date') {
      setTmpDetail({
        ...tmpDetail,
        customer_info: {
          ...tmpDetail.customer_info,
          [type]: {
            ...tmpDetail.customer_info[type],
            issue_date: moment(value).format('YYYY-MM-DD') + "T00:00:00.000Z"
          }
        }
      })
    } else if(name == 'expired_date') {
      setTmpDetail({
        ...tmpDetail,
        customer_info: {
          ...tmpDetail.customer_info,
          [type]: {
            ...tmpDetail.customer_info[type],
            expired_date: moment(value).format('YYYY-MM-DD') + "T00:00:00.000Z"
          }
        }
      })
    } else {
      setTmpDetail({
        ...tmpDetail,
        customer_info: {
          ...tmpDetail.customer_info,
          [type]: {
            ...tmpDetail.customer_info[type],
            [name] : value
          }
        }
      })
    }
  }
  const onSaveCustomerInfo = () => {
    const data ={
      ...tmpDetail?.customer_info?.ground_truth,
      birthday: tmpDetail?.customer_info?.ground_truth.birthday ? moment(new Date(tmpDetail?.customer_info?.ground_truth.birthday)) : '',
      expired_date: tmpDetail?.customer_info?.ground_truth.expired_date ? moment(new Date(tmpDetail?.customer_info?.ground_truth.expired_date)): "",
      issue_date: tmpDetail?.customer_info?.ground_truth.issue_date ? moment(new Date(tmpDetail?.customer_info?.ground_truth.issue_date)): "",
    }
    actionsCustomerInfo.updateCustomerInfo(tmpDetail?.customer_info?.ground_truth?.id, data).then((res) => {
      console.log(res);
      if (res && res.data) {
        setListStateEdit([])
        // onResetFilter();
      }
    });
  }
  
  return (
    <Container className="container-general-data-management-page">
    <div className="go-back" onClick={onGoback}>
       {`<`} <span>Quay lại</span>
    </div>
      <div className='action-header'>
        <div className="action-left">
          <div className='customer-code' style={{fontWeight: 600, fontSize: 18}}>{tmpDetail?.customer_code ? `TKCK : ${tmpDetail?.customer_code}`  : ''} </div>
          {tmpDetail?.level ?  <div className='level-gt'> Groundtruth: {tmpDetail.level}</div>  : ''} 
        </div>
        <div className='action-right'>
          {
            JSON.stringify(detail) != JSON.stringify(tmpDetail) ? <><div className='btn-customer-info-cancel' onClick={()=>{setTmpDetail(detail);  setListStateEdit([])}}>Huỷ</div>
            <div className='btn-customer-info-save' onClick={()=>onSaveCustomerInfo()} >Xác nhận</div> </>: ""
          }
        </div>
      </div>
      <Card className="general-data-management-table">
        <div className="e-table-header">
          </div>
        <Box overflow="auto" padding="15px">
          <ListSubDetailDataManagement
            onFetchData={onFetchDataCallback}
            page={page}
            detail={tmpDetail}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            onChangeStateShowEditCustomerInfo={onChangeStateShowEditCustomerInfo}
            onChangeCustomerInfo={onChangeCustomerInfo}
            listStateEdit={listStateEdit}
            totalItemCount={totalItemCount}
            generalDataManagements={generalDataManagements}
          />
        </Box>
      </Card>
     
      
    </Container>
  );
};

export default SubDetailDataManagement;
