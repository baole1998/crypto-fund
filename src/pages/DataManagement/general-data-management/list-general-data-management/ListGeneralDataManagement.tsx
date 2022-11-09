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
import './ListGeneralDataManagement.scss';
import FooterPagination from 'src/components/FooterPagination/FooterPagination';
import * as actionsGeneralDataManagement from 'src/redux/store/sync-task/sync-task.store';
import { ContentSearch, SyncTaskModel } from 'src/models/sync_task';
import ModalCommon from 'src/components/Modal/ModalCommon/ModalCommon';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
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
  generalDataManagements: SyncTaskModel[];
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
  setPage: (page: number) => void;
  page: number;
  rowsPerPage: number;
  dataSearch: ContentSearch;
  setRowsPerPage: (rowPage: number) => void;
  totalItemCount: number;
  onOpenShowModalEdit: (row: any) => void;
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
    dataSearch,
    setRowsPerPage,
    totalItemCount,
    onOpenShowModalEdit
  } = props;
  const navigate = useNavigate();
  const [showModalConfirmTaskTrigger, setShowModalConfirmTaskTrigger] =
    useState<boolean>(false);
  const [showModalConfirmStatus, setShowModalConfirmStatus] =
    useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<SyncTaskModel>({});
  const handleChangePage = (event, newPage: number) => {
    setPage(newPage);
    onFetchData(
      dataSearch.customer_code,
      dataSearch.status,
      dataSearch.from_date,
      dataSearch.to_date,
      dataSearch.data_source?.id,
      dataSearch.name_task,
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
      dataSearch.name_task,
      rowsPerPage,
      page
    );
  };

  const onChangeTaskTrigger = () => {
    setShowModalConfirmTaskTrigger(false);
    actionsGeneralDataManagement
      .updateTaskTrigger(currentRow.id)
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
        }
      });
  };

  const totalPage = Math.ceil(totalItemCount / rowsPerPage);
  const onRedirct = (id) => {
    navigate('/general-data-management/' + id);
  };
  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead style={{ background: 'none' }}>
          <TableRow style={{ background: 'none' }}>
            <TableCell sx={{ width: '10%' }} align="center">
              TASK
            </TableCell>
            <TableCell sx={{ width: '5%' }} align="center">
              NGUỒN
            </TableCell>
            <TableCell sx={{ width: '10%' }} align="center">
              KÊNH
            </TableCell>
            <TableCell sx={{ width: '5%' }} align="center">
              USER
            </TableCell>
            <TableCell sx={{ width: '10%' }} align="center">
              NGÀY THỰC HIỆN
            </TableCell>
            <TableCell sx={{ width: '10%' }} align="center">
              KHOẢNG THỜI GIAN
            </TableCell>
            <TableCell sx={{ width: '10%' }} align="center">
              TRẠNG THÁI
            </TableCell>
            <TableCell sx={{ width: '10%' }} align="center">
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
                <TableCell align="center">{row?.name}</TableCell>
                <TableCell sx={{ width: '5%' }} align="center">
                  {row?.data_source_relate?.name}
                </TableCell>
                <TableCell align="center">{row.task_type}</TableCell>
                <TableCell align="center">
                  {row?.creator_relate?.full_name}
                </TableCell>
                <TableCell align="center">
                  {row?.created_at &&
                    moment(new Date(row?.created_at)).format('DD/MM/YYYY')}
                </TableCell>

                <TableCell align="center">
                  {row?.from_date &&
                    moment(new Date(row?.from_date)).format('DD/MM/YYYY')}{' '}
                  -{' '}
                  {row?.to_date &&
                    moment(new Date(row.to_date)).format('DD/MM/YYYY')}
                </TableCell>
                <TableCell align="center">
                  {row.status === 'created' && (
                    <Button
                      className="btn-initial"
                      variant="contained"
                      disabled
                    >
                      Khởi tạo
                    </Button>
                  )}
                  {row.status === 'success' && (
                    <Button
                      className="btn-success"
                      variant="contained"
                      disabled
                    >
                      Thành công
                    </Button>
                  )}
                  {row.status === 'failed' && (
                    <Button className="btn-fail" variant="contained" disabled>
                      Không Thành Công
                    </Button>
                  )}
                  {row.status === 'processing' && (
                    <Button
                      className="btn-processing"
                      variant="contained"
                      disabled
                    >
                      Đang xử lý
                    </Button>
                  )}
                </TableCell>

                <TableCell align="center">
                  {row.status === 'created' && (
                    <div>
                      <VisibilityIcon
                        onClick={() => onRedirct(row.id)}
                        style={{ cursor: 'pointer' }}
                      />
                      <EditIcon
                        style={{ cursor: 'pointer', margin: '0 5px' }}
                        onClick={() => onOpenShowModalEdit(row)}
                      />
                      {row.task_type !== 'import' && (
                        <PlayCircleIcon
                          style={{ color: '#212943', cursor: 'pointer' }}
                          onClick={() => {
                            setCurrentRow(row);
                            setShowModalConfirmTaskTrigger(true);
                          }}
                        />
                      )}
                    </div>
                  )}
                  {row.status === 'success' && (
                    <div>
                      <VisibilityIcon
                        onClick={() => onRedirct(row.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  )}
                  {row.status === 'failed' && (
                    <div>
                      <VisibilityIcon
                        onClick={() => onRedirct(row.id)}
                        style={{ cursor: 'pointer', margin: '0 5px' }}
                      />
                      {row.task_type !== 'import' && (
                        <PlayCircleIcon
                          style={{ cursor: 'pointer', color: '#212943' }}
                          onClick={() => {
                            setCurrentRow(row);
                            setShowModalConfirmTaskTrigger(true);
                          }}
                        />
                      )}
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
      {showModalConfirmTaskTrigger ? (
        <ModalCommon
          onConfirm={onChangeTaskTrigger}
          onHandleClose={() => setShowModalConfirmTaskTrigger(false)}
          show={showModalConfirmTaskTrigger}
          title="Xác nhận"
          content="Bạn có chắc chắn muốn thay đổi không?"
        ></ModalCommon>
      ) : (
        ''
      )}
      {/* {showModalConfirmStatus ? (
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
