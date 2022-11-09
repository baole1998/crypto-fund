import {
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Icon,
  TablePagination,
  Button,
  Switch,
  FormControlLabel,
  TextField
} from '@mui/material';
import moment from 'moment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import React, { useState } from 'react';
import { Box, styled } from '@mui/system';
import './ListSubDetailDataManagement.scss';
import FooterPagination from 'src/components/FooterPagination/FooterPagination';
import * as actionsSubDetailDataManagement from '../../../../../redux/store/data-management/customer-doc/customer-doc.store';
import { CustomerInfoModel } from 'src/models/customer_info';
import ModalCommon from 'src/components/Modal/ModalCommon/ModalCommon';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import viLocale from 'date-fns/locale/vi'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: 'pre',
  '& thead': {
    '& tr': {
      '& th': {
        paddingLeft: 16,
        paddingRight: 0
      }
    }
  },
  '& tbody': {
    '& tr': {
      '& td': {
        // paddingLeft: 0,
        textTransform: 'capitalize',
        // '& button': {
        //   borderRadius: '5px',
        //   minWidth: '180px',
        //   maxWidth: '250px',
        //   color: '#fff !important',
        //   '&.btn-success': {
        //     backgroundColor: '#36C76F'
        //   },
        //   '&.btn-fail': {
        //     backgroundColor: '#C73636'
        //   },
        //   '&.btn-initial': {
        //     backgroundColor: '#369BC7'
        //   },
        //   '&.btn-processing': {
        //     backgroundColor: '#E2A300'
        //   }
        // },
        // '& svg': {
        //   height: '1em',
        //   width: 'auto'
        // }
      }
    }
  }
}));

interface PropListSubDetailDataManagement {
  generalDataManagements: CustomerInfoModel[];
  onFetchData: (id: number, rowsPerPage: number, page: number) => void;
  setPage: (page: number) => void;
  page: number;
  detail: any;
  rowsPerPage: number;
  setRowsPerPage: (rowPage: number) => void;
  totalItemCount: number;
  onChangeStateShowEditCustomerInfo: (name: string) => void;
  onChangeCustomerInfo: (type: string, name:string, value: any) => void;
  listStateEdit: string[];
}
const ListSubDetailDataManagement: React.FC<PropListSubDetailDataManagement> = (
  props
) => {
  const {
    generalDataManagements,
    onFetchData,
    setPage,
    page,
    rowsPerPage,
    setRowsPerPage,
    detail,
    onChangeStateShowEditCustomerInfo,
    listStateEdit,
    totalItemCount,
    onChangeCustomerInfo
  } = props;
  const [showModalConfirmVerified, setShowModalConfirmVerified] =
    useState<boolean>(false);
  const [showModalConfirmStatus, setShowModalConfirmStatus] =
    useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<CustomerInfoModel>({});
  const [startDate, setStartDate] = useState(new Date());
  const handleChangePage = (event, newPage: number) => {
    setPage(newPage);
    onFetchData(1, rowsPerPage, newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    onFetchData(1, rowsPerPage, page);
  };

  const totalPage = Math.ceil(totalItemCount / rowsPerPage);
  const onCheckEdit = (name: string) => {
    let check = false;
    const objectEdit = listStateEdit.find((item) => item === name)
    if (objectEdit) {
      check = true
    }
    return check
  }
  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead style={{ background: 'none' }}>
          <TableRow style={{ background: 'none' }}>
            <TableCell sx={{ width: '10%' }} style={{ position: 'sticky', left: 0,  backgroundColor: '#fff'}} >
              NÔI DUNG
            </TableCell>
            <TableCell sx={{ width: '5%' }} >
              THÔNG TIN ĐỒNG BỘ
            </TableCell>
            <TableCell sx={{ width: '10%' }} >
              THÔNG TIN GROUND TRUTH
            </TableCell>
            <TableCell sx={{ width: '10%' }} >
              HÀNH ĐỘNG
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell style={{ position: 'sticky', left: 0, backgroundColor: '#fff'}}>Mặc trước</TableCell>
            <TableCell>{detail?.front_path}</TableCell>
            <TableCell>{detail?.front_path}</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ position: 'sticky', left: 0,  backgroundColor: '#fff'}}>Mặt sau</TableCell>
            <TableCell>{detail?.back_path}</TableCell>
            <TableCell>{detail?.back_path}</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ position: 'sticky', left: 0,  backgroundColor: '#fff'}}>Face</TableCell>
            <TableCell>{detail?.face_path}</TableCell>
            <TableCell>{detail?.face_path}</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ position: 'sticky', left: 0,  backgroundColor: '#fff'}}>Chữ Ký</TableCell>
            <TableCell>{detail?.sign_path}</TableCell>
            <TableCell>{detail?.sign_path}</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ position: 'sticky', left: 0,  backgroundColor: '#fff'}}>UID</TableCell>
            <TableCell>{detail?.uid}</TableCell>
            <TableCell>{detail?.uid}</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ position: 'sticky', left: 0,  backgroundColor: '#fff'}}>Ngày phát sinh </TableCell>
            <TableCell>{detail?.exec_date}</TableCell>
            <TableCell>{detail?.exec_date}</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ position: 'sticky', left: 0,  backgroundColor: '#fff'}}>Số CMT/CCCD</TableCell>
            <TableCell>
              {
                detail?.customer_info?.sync_data?.card_number
              }
            </TableCell>
            <TableCell>
              {
                onCheckEdit('card_number') ? <TextField  onChange={(e)=>onChangeCustomerInfo('ground_truth', 'card_number', e.target.value)} id="outlined-basic" value={detail?.customer_info?.ground_truth?.card_number} label="" variant="outlined" /> : detail?.customer_info?.ground_truth?.card_number
              }
            </TableCell>
            <TableCell>
            {detail?.customer_info?.ground_truth ? <EditIcon style={{ cursor: 'pointer'}} onClick={() => onChangeStateShowEditCustomerInfo('card_number')}></EditIcon>:""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ position: 'sticky', left: 0,  backgroundColor: '#fff'}}>Họ và Tên</TableCell>
            <TableCell>
              {
                detail?.customer_info?.sync_data?.full_name
              }
            </TableCell>
            <TableCell>
              {
                onCheckEdit('full_name') ? <TextField onChange={(e)=>onChangeCustomerInfo('ground_truth', 'full_name', e.target.value)} id="outlined-basic" value={detail?.customer_info?.ground_truth?.full_name} label="" variant="outlined" /> : detail?.customer_info?.ground_truth?.full_name
              }</TableCell>

            <TableCell>
            {detail?.customer_info?.ground_truth ? <EditIcon style={{ cursor: 'pointer'}} onClick={() => onChangeStateShowEditCustomerInfo('full_name')}></EditIcon> :""}
              
              </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ position: 'sticky', left: 0,  backgroundColor: '#fff'}}>Giới tính </TableCell>
            <TableCell>
              {
                 detail?.customer_info?.sync_data?.gender
              }
            </TableCell>
            <TableCell>
              {
                onCheckEdit('gender') ? <TextField id="outlined-basic" value={detail?.customer_info?.ground_truth?.gender} label="" variant="outlined" /> : detail?.customer_info?.ground_truth?.gender
              }
            </TableCell>
            <TableCell>{detail?.customer_info?.ground_truth ? <EditIcon style={{ cursor: 'pointer'}} onClick={() => onChangeStateShowEditCustomerInfo('gender')}></EditIcon>:""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ position: 'sticky', left: 0,  backgroundColor: '#fff'}}>Địa chỉ  </TableCell>
            <TableCell>
              {
                 detail?.customer_info?.sync_data?.address
              }
            </TableCell>
            <TableCell>
              {
                onCheckEdit('address') ? <TextField id="outlined-basic" value={detail?.customer_info?.ground_truth?.address} label="" variant="outlined" /> : detail?.customer_info?.ground_truth?.address
              }

            </TableCell>
            <TableCell>{detail?.customer_info?.ground_truth ? <EditIcon style={{ cursor: 'pointer'}} onClick={() => onChangeStateShowEditCustomerInfo('address')}></EditIcon> :""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ position: 'sticky', left: 0,  backgroundColor: '#fff'}}>Ngày Sinh </TableCell>
            <TableCell>
              {
                 detail?.customer_info?.sync_data?.birthday
              }
            </TableCell>
            <TableCell>
              
              {
                onCheckEdit('birthday') ? <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>
                <DatePicker
                  value={detail?.customer_info?.ground_truth?.birthday ? moment(new Date(detail?.customer_info?.ground_truth?.birthday)) : new Date()}
                  renderInput={(params) => <TextField size="small" {...params} />}
                  onChange={(e) => onChangeCustomerInfo('ground_truth', 'birthday', e)}
                />
              </LocalizationProvider> : detail?.customer_info?.ground_truth ? moment(new Date(detail?.customer_info?.ground_truth?.birthday)).format('DD-MM-YYYY') : ''
              }
            </TableCell>
            <TableCell> {detail?.customer_info?.ground_truth ?<EditIcon style={{ cursor: 'pointer'}} onClick={() => onChangeStateShowEditCustomerInfo('birthday')}></EditIcon> :""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ position: 'sticky', left: 0,  backgroundColor: '#fff'}}>Quê Quán </TableCell>
            <TableCell>
              {
                detail?.customer_info?.sync_data?.home_town
              }

            </TableCell>
            <TableCell>
              {
                onCheckEdit('home_town') ? <TextField id="outlined-basic" value={detail?.customer_info?.ground_truth?.home_town} label="" variant="outlined" /> : detail?.customer_info?.ground_truth?.home_town
              }
            </TableCell>
            <TableCell>{detail?.customer_info?.ground_truth ? <EditIcon style={{ cursor: 'pointer'}} onClick={() => onChangeStateShowEditCustomerInfo('home_town')}></EditIcon> : "" }</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ position: 'sticky', left: 0,  backgroundColor: '#fff'}}>Ngày cấp </TableCell>
            <TableCell>
              {
                detail?.customer_info?.sync_data?.issue_date
              }
            </TableCell>
            <TableCell>
              
              {
                onCheckEdit('issue_date') ? <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>
                <DatePicker
                  mask={'__/__/____'}
                  value={detail?.customer_info?.ground_truth?.issue_date ? (new Date(detail?.customer_info?.ground_truth?.issue_date)): new Date()}
                  renderInput={(params) => <TextField size="small" {...params} />}
                  onChange={(e) => onChangeCustomerInfo('ground_truth', 'issue_date',e)}
                />
              </LocalizationProvider> : detail?.customer_info?.ground_truth ? moment(new Date(detail?.customer_info?.ground_truth?.issue_date)).format('DD-MM-YYYY') : ''
              }
            </TableCell>
            <TableCell>{detail?.customer_info?.ground_truth ? <EditIcon style={{ cursor: 'pointer'}} onClick={() => onChangeStateShowEditCustomerInfo('issue_date')}></EditIcon> : ""} </TableCell>
          </TableRow>

          <TableRow>
            <TableCell style={{ position: 'sticky', left: 0,  backgroundColor: '#fff'}}>Ngày hết hạn </TableCell>
            <TableCell>

              {
                detail?.customer_info?.sync_data?.expired_date
              }
            </TableCell>
            <TableCell>
              {
                onCheckEdit('expired_date') ? <div>
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>
                  <DatePicker
                    mask={'__/__/____'}
                    value={detail?.customer_info?.ground_truth?.expired_date ? (new Date(detail?.customer_info?.ground_truth?.expired_date)): new Date()}
                    renderInput={(params) => <TextField size="small" {...params} />}
                    onChange={(e) => onChangeCustomerInfo('ground_truth', 'expired_date', e)}
                  />
                </LocalizationProvider> 
                </div>:detail?.customer_info?.ground_truth ?  moment(new Date(detail?.customer_info?.ground_truth?.expired_date)).format('DD-MM-YYYY') : ''
              }
            </TableCell>
            <TableCell> {detail?.customer_info?.ground_truth ?<EditIcon style={{ cursor: 'pointer'}} onClick={() => onChangeStateShowEditCustomerInfo('expired_date')}></EditIcon> : "" }</TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ position: 'sticky', left: 0,  backgroundColor: '#fff',}}>Kết quả so khớp khuôn mặt  </TableCell>
            <TableCell>{detail?.uid}</TableCell>
            <TableCell>{detail?.uid}</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ position: 'sticky', left: 0, backgroundColor: '#fff'}}>% tương đồng khi so khớp  </TableCell>
            <TableCell>{detail?.uid}</TableCell>
            <TableCell>{detail?.uid}</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ position: 'sticky', left: 0, backgroundColor: '#fff'}}>Kênh Dữ Liệu   </TableCell>
            <TableCell>{detail?.uid}</TableCell>
            <TableCell>{detail?.uid}</TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ position: 'sticky', left: 0,  backgroundColor: '#fff'}}>Xử lý thông tin không trùng khớp   </TableCell>
            <TableCell>{detail?.uid}</TableCell>
            <TableCell>{detail?.uid}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </StyledTable>
      
      {/* {totalItemCount && totalItemCount > 0 ? (
        <FooterPagination
          currentPage={page}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleChangePage={handleChangePage}
          totalPage={totalPage}
        />
      ) : (
        ''
      )} */}
    </Box>
  );
};

export default ListSubDetailDataManagement;
