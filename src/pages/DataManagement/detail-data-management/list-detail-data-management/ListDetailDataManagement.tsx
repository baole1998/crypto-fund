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
} from '@mui/material';
import moment from 'moment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import React, { useState } from 'react';
import { Box, styled } from '@mui/system';
import './ListDetailDataManagement.scss';
import FooterPagination from 'src/components/FooterPagination/FooterPagination';
import * as actionsDetailDataManagement from '../../../../redux/store/data-management/detail-data-management/detail-data-management.store';
import { ContentSearch, CustomerDocModel } from 'src/models/customer_doc';
import ModalCommon from 'src/components/Modal/ModalCommon/ModalCommon';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
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
              textTransform: 'capitalize'
          }
      }
  },
  '& .btn': {
      borderRadius: '5px',
      '&.btn-level-0': {
          width: 150,
          backgroundColor: '#369bc7'
      },
      '&.btn-level-1': {
        width: 150,
          backgroundColor: '#E2A300'
      },
      '&.btn-level-2': {
        width: 150,
          backgroundColor: '#36C76F'
      }
  }
}));

interface PropListDetailDataManagement {
  detailDataManagements: CustomerDocModel[];
  onFetchData: (
    from_date: Date,
    to_date: Date,
    customer_code: string,
    uid: string,
    data_source: number,
    rowsPerPage: number,
    page: number
  ) => void;
  setPage: (page: number) => void;
  page: number;
  rowsPerPage: number;
  dataSearch: ContentSearch;
  setRowsPerPage: (rowPage: number) => void;
  totalItemCount: number;
  onOpenShowModalEdit: (row: any) => void;
  onChangePartialUpdate: (row: any) => void;
}
const ListDetailDataManagement: React.FC<PropListDetailDataManagement> = (
  props
) => {
  const {
    detailDataManagements,
    onFetchData,
    setPage,
    page,
    rowsPerPage,
    dataSearch,
    setRowsPerPage,
    totalItemCount,
    onOpenShowModalEdit,
    onChangePartialUpdate
  } = props;
  const navigate = useNavigate()
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const [showModalConfirmVerified, setShowModalConfirmVerified] =
    useState<boolean>(false);
  const [showModalConfirmStatus, setShowModalConfirmStatus] =
    useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<CustomerDocModel>({});
  const handleChangePage = (event, newPage: number) => {
    setPage(newPage);
    onFetchData(
      dataSearch.from_date,
      dataSearch.to_date,
      dataSearch.customer_code,
      dataSearch.uid,
      dataSearch.data_source?.id,
      rowsPerPage,
      newPage
    );
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    onFetchData(
      dataSearch.from_date,
      dataSearch.to_date,
      dataSearch.customer_code,
      dataSearch.uid,
      dataSearch.data_source?.id,
      rowsPerPage,
      page
    );
  };
  const onChangeVerified = () => {
    setShowModalConfirmVerified(false);
    const newData = {
      verified: 'approved'
    };
    actionsDetailDataManagement
      .patchDetailDataManagement(currentRow.id, newData)
      .then((res) => {
        if (res) {
          onFetchData(
            dataSearch.from_date,
            dataSearch.to_date,
            dataSearch.customer_code,
            dataSearch.uid,
            dataSearch.data_source?.id,
            rowsPerPage,
            1
          );
        }
      });
  };
  const onChangeStatus = () => {
    setShowModalConfirmStatus(false);
    onChangePartialUpdate(currentRow)
  };

  const totalPage = Math.ceil(totalItemCount / rowsPerPage);
  const onRedirct = (id) => {
    navigate('/manage-data-detail/' + id)
  }
  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead style={{ background: 'none' }}>
          <TableRow style={{ background: 'none' }}>
            <TableCell >
              TKCK
            </TableCell>
            <TableCell  align='center'>
              UID/FILENAME
            </TableCell>
            <TableCell align="center">
              NGÀY ĐỒNG BỘ
            </TableCell>
            <TableCell  align="center">
              KÊNH DỮ LIỆU
            </TableCell>
            <TableCell align="center">
              THÔNG TIN GT
            </TableCell>
            <TableCell style={{minWidth: '300px'}} align="center">
              XỬ LÝ THÔNG TIN KHÔNG TRÙNG
            </TableCell>
            <TableCell  align="center">
              HÀNH ĐỘNG 
            </TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {detailDataManagements.length > 0 &&
            detailDataManagements.map((row, index) => (
              <TableRow key={index}>
                <TableCell >{row.customer_code}</TableCell>
                <TableCell >{row?.uid}</TableCell>
                <TableCell align="center">
                  {' '}
                  {moment(new Date(row?.exec_date)).format(
                    'HH:MM - DD/MM/YYYY'
                  )}
                </TableCell>
                <TableCell align="center">
                  {row?.data_source_relate?.name}
                </TableCell>
                <TableCell align="center">
                                    {row.level === 0 ||
                                        (!row.level && (
                                            <Button
                                                variant="contained"
                                                className="btn btn-level-0"
                                                onClick={() => { }}
                                            >
                                                Level 0
                                            </Button>
                                        ))}
                                    {row.level === 1 && (
                                        <Button
                                            variant="contained"
                                            className="btn btn-level-1"
                                            onClick={() => { }}
                                        >
                                            Level 1
                                        </Button>
                                    )}
                                    {row.level === 2 && (
                                        <Button
                                            variant="contained"
                                            className="btn btn-level-2"
                                            onClick={() => { }}
                                        >
                                            Level 2
                                        </Button>
                                    )}
                                </TableCell>
             
                <TableCell align='center' style={{width: '240px'}}>
                  <Checkbox {...label} onClick={()=>{setCurrentRow(row); setShowModalConfirmStatus(true)}} defaultChecked={!row.recheck} />
                </TableCell>
                <TableCell align="center">
                <VisibilityIcon onClick={()=>onRedirct(row.id)} style={{ cursor: 'pointer', margin: '0 5px' }} />
                {/* <EditIcon></EditIcon> */}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </StyledTable>
      {detailDataManagements.length === 0 && (
        <div className="data-empty">
          <div className="content-empty">
            <img
              src={'/static/images/status/empty-engine.svg'}
              alt="log-vps"
            ></img>
            <div className="text-empty-data">
              Không tìm thấy DetailDataManagement nào!!!
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
      )}
    </Box>
  );
};

export default ListDetailDataManagement;
