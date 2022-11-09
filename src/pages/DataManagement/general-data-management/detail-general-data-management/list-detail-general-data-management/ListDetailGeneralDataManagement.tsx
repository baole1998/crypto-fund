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
  FormControlLabel
} from '@mui/material';
import moment from 'moment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import React, { useState } from 'react';
import { Box, styled } from '@mui/system';
import './ListDetailGeneralDataManagement.scss';
import FooterPagination from 'src/components/FooterPagination/FooterPagination';
import * as actionsGeneralDataManagement from '../../../../../redux/store/data-management/customer-doc/customer-doc.store';
import { CustomerDocModel, ContentSearch } from 'src/models/customer_doc';
import ModalCommon from 'src/components/Modal/ModalCommon/ModalCommon';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: 'pre',
  '& thead': {
    '& tr': {
      '& th': {
        paddingLeft: 0,
        paddingRight: 0
      }
    }
  },
  '& tbody': {
    '& tr': {
      '& td': {
        // paddingLeft: 0,
        textTransform: 'capitalize',
        '& button': {

          borderRadius: '5px',
          minWidth: '180px',
          maxWidth: '250px',
          color: '#fff !important',
          '&.btn-success': {
            backgroundColor: '#36C76F'
          },
          '&.btn-fail': {
            backgroundColor: '#C73636'
          },
          '&.btn-initial': {
            backgroundColor: '#369BC7'
          },
          '&.btn-processing': {
            backgroundColor: '#E2A300'
          }
        },
        '& svg': {
          height: '1em',
          width: 'auto'
        }
      }
    }
  }
}));

interface PropListGeneralDataManagement {
  generalDataManagements: CustomerDocModel[];
  onFetchData: (customer_code: string,
    status: string[],
    from_date: Date,
    to_date: Date,
    data_source: number,
    rowsPerPage: number,
    page: number) => void;
  setPage: (page: number) => void;
  page: number;
  rowsPerPage: number;
  dataSearch: ContentSearch;
  setRowsPerPage: (rowPage: number) => void;
  totalItemCount: number;
}
const ListGeneralDataManagement: React.FC<PropListGeneralDataManagement> = (
  props
) => {
  const {
    generalDataManagements,
    onFetchData,
    setPage,
    page,
    rowsPerPage,
    setRowsPerPage,
    totalItemCount,
    dataSearch
  } = props;
  const [showModalConfirmVerified, setShowModalConfirmVerified] =
    useState<boolean>(false);
  const [showModalConfirmStatus, setShowModalConfirmStatus] =
    useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<CustomerDocModel>({});
  const handleChangePage = (event, newPage: number) => {
    setPage(newPage);
    onFetchData(
      dataSearch.customer_code,
      dataSearch.status,
      dataSearch.from_date,
      dataSearch.to_date,
      dataSearch.data_source?.id,
      rowsPerPage,
      newPage
    );
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    onFetchData(
      dataSearch.customer_code,
      dataSearch.status,
      dataSearch.from_date,
      dataSearch.to_date,
      dataSearch.data_source?.id,
      rowsPerPage,
      page
    );
  };
  const onChangeDetailCustomerDocTrigger = (id: number) => {
    actionsGeneralDataManagement
      .updateCustomerDocTrigger(id)
      .then((res) => {
        if (res) {
          onFetchData(
            dataSearch.customer_code,
            dataSearch.status,
            dataSearch.from_date,
            dataSearch.to_date,
            dataSearch.data_source?.id,
            rowsPerPage,
            1
          );
        }
      });
  };
  const totalPage = Math.ceil(totalItemCount / rowsPerPage);

  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead style={{ background: 'none' }}>
          <TableRow style={{ background: 'none' }}>
            <TableCell align="center">
              TKCK
            </TableCell>
            <TableCell  align="center">
              UUID/FILENAME
            </TableCell>
            <TableCell  align="center">
              CMT MẶC TRƯỚC
            </TableCell>
            <TableCell  align="center">
              CMT MẶT SAU
            </TableCell>
            <TableCell  align="center">
              FACE
            </TableCell>
            <TableCell  align="center">
              THỜI GIAN
            </TableCell>
            <TableCell  align="center">
              KÊNH DỮ LIỆU
            </TableCell>
            <TableCell  align="center">
              TRẠNG THÁI
            </TableCell>
            {/* <TableCell sx={{ width: '10%' }} align="center">
              USER CHẠY
            </TableCell> */}
            <TableCell  align="center">
              LÝ DO
            </TableCell>
            <TableCell align="center">
              HÀNH ĐỘNG
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {generalDataManagements.length > 0 &&
            generalDataManagements.map((row, index) => (
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                key={index}
              >
                <TableCell align="center">{row.customer_code}</TableCell>
                <TableCell sx={{ width: '5%' }} align="center">
                  {row?.uid}
                </TableCell>
                <TableCell align="center">
                {
                  row.front_path ? <CheckCircleOutlineOutlinedIcon fontSize='large' style={{ color: '#36C76F'}} /> : <CancelOutlinedIcon fontSize='large' style={{ color: '#C73636'}}/>
                }
                </TableCell>
                <TableCell align="center">
                {
                  row.back_path ? <CheckCircleOutlineOutlinedIcon fontSize='large' style={{ color: '#36C76F'}}/> : <CancelOutlinedIcon fontSize='large' style={{ color: '#C73636'}}/>
                }
                </TableCell>
                <TableCell align="center">
                {
                  row.face_path ? <CheckCircleOutlineOutlinedIcon fontSize='large' style={{ color: '#36C76F'}}/> : <CancelOutlinedIcon fontSize='large' style={{ color: '#C73636'}}/>
                }
                </TableCell>
                <TableCell align="center">
                {moment(new Date(row?.created_at)).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell align="center">
                 {row?.data_source_relate?.name}
                </TableCell>
              
                <TableCell align="center">
                  {row.front_path && row.back_path && row.face_path  ? (
                    <Button
                      className="btn-success"
                      variant="contained"
                      disabled
                    >
                      Thành công
                    </Button>
                  ) : <Button className="btn-fail" variant="contained" disabled>
                  Không Thành Công
                </Button>}
                 
                </TableCell>
                <TableCell align="center">
                ---
                </TableCell>
                <TableCell align="center">
                  {!(row.front_path && row.back_path && row.face_path) && (
                    <div onClick={()=>onChangeDetailCustomerDocTrigger(row.id)}>
                      <PlayCircleIcon style={{  cursor: 'pointer', color: '#212943' }} />
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </StyledTable>
      {generalDataManagements.length === 0 && (
        <div className="data-empty">
          <div className="content-empty">
            <img
              src={'/static/images/status/empty-engine.svg'}
              alt="log-vps"
            ></img>
            <div className="text-empty-data">
              Không tìm thấy GeneralDataManagement nào!!!
            </div>
          </div>
        </div>
      )}
      {totalItemCount && totalItemCount > 0 ? (
        <FooterPagination
          currentPage={page}
          rowsPerPage={rowsPerPage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleChangePage={handleChangePage}
          totalPage={totalPage}
        />
      ) : (
        ''
      )}
      {/* {showModalConfirmVerified ? ( 
        <ModalCommon
          onConfirm={onChangeVerified}
          onHandleClose={() => setShowModalConfirmVerified(false)}
          show={showModalConfirmVerified}
          title="Xác nhận"
          content="Bạn có chắc chắn muốn lưu thay đổi không?"
        ></ModalCommon>
      ) : (
        ''
      )}
      {showModalConfirmStatus ? (
        <ModalCommon
          onConfirm={onChangeStatus}
          onHandleClose={() => setShowModalConfirmStatus(false)}
          show={showModalConfirmStatus}
          title="Xác nhận"
          content="Bạn có chắc chắn muốn lưu thay đổi không?"
        ></ModalCommon>
      ) : (
        ''
      )} */}
    </Box>
  );
};

export default ListGeneralDataManagement;
