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
import React, { useEffect, useState } from 'react';
import { Box, styled } from '@mui/system';
import './ListGroundTruth.scss';
import FooterPagination from 'src/components/FooterPagination/FooterPagination';
import * as actionsGroundTruth from './../../../../redux/store/data-management/ground-truth/ground-truth.store';
import { ContentSearch, GroundTruthModel } from 'src/models/ground_truth';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ModalCommon from 'src/components/Modal/ModalCommon/ModalCommon';
import { EngineModel } from 'src/models/engine';
import { UserModel } from 'src/models/user';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalDelete from 'src/components/Modal/ModalDelete/ModalDelete';
import { useNavigate } from 'react-router';

const COLOR_BLUE = '#369BC7';
const COLOR_RED = '#C73636';
const COLOR_YELLOW = '#E2A300';
const COLOR_GREEN = '#36C76F';
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
        },
        '& .icon': {
          cursor: 'pointer',
          '&.view': {
            // color: COLOR_BLUE,
            '&:hover': {
              color: COLOR_BLUE
            }
          },
          '&.delete': {
            // color: COLOR_RED,
            '&:hover': {
              color: COLOR_RED
            }
          },
          '&.edit': {
            // color: COLOR_YELLOW,
            '&:hover': {
              color: COLOR_YELLOW
            }
          },
          '&.run': {
            // color: COLOR_YELLOW,
            '&:hover': {
              color: COLOR_GREEN
            }
          }
        }
      }
    }
  }
}));

const IOSSwitch = styled(
  (props: { checked: boolean }): JSX.Element => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  )
)(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '' : '#65C466',
        opacity: 1,
        border: 0
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5
      }
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff'
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600]
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3
    }
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
    backgroundColor: '#fff !important'
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1
  }
}));
interface PropListGroundTruth {
  groundTruths: GroundTruthModel[];
  onFetchData: (
    code: string,
    status: string[],
    to_date: Date,
    from_date: Date,
    data_source: number,
    engine1_id: EngineModel,
    engine2_id: EngineModel,
    creator: UserModel,
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
const ListGroundTruth: React.FC<PropListGroundTruth> = (props) => {
  const {
    groundTruths,
    onFetchData,
    setPage,
    page,
    rowsPerPage,
    dataSearch,
    setRowsPerPage,
    totalItemCount,
    onOpenShowModalEdit
  } = props;
  const [showModalConfirmVerified, setShowModalConfirmVerified] =
    useState<boolean>(false);
  const [showModalConfirmStatus, setShowModalConfirmStatus] =
    useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<GroundTruthModel>({});
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [deleteItem, setDeleteItem] = useState<GroundTruthModel>({});
  const navigate = useNavigate();
  const handleChangePage = (event, newPage: number) => {
    setPage(newPage);
    onFetchData(
      dataSearch.code,
      dataSearch.status,
      dataSearch.to_date,
      dataSearch.from_date,
      dataSearch.data_source?.id,
      dataSearch.engine1_id,
      dataSearch.engine2_id,
      dataSearch.creator,
      rowsPerPage,
      newPage
    );
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    onFetchData(
      dataSearch.code,
      dataSearch.status,
      dataSearch.to_date,
      dataSearch.from_date,
      dataSearch.data_source?.id,
      dataSearch.engine1_id,
      dataSearch.engine2_id,
      dataSearch.creator,
      event.target.value,
      1
    );
  };
  const onChangeVerified = () => {
    setShowModalConfirmVerified(false);
    const newData = {
      verified: 'approved'
    };
    // actionsGroundTruth.patchGroundTruth(currentRow.id, newData).then((res) => {
    //   if (res) {
    //     onFetchData(
    //       dataSearch.description,
    //       dataSearch.name,
    //       dataSearch.version,
    //       dataSearch.verified,
    //       dataSearch.env,
    //       rowsPerPage,
    //       1
    //     );
    //   }
    // });
  };
  const onChangeStatus = () => {
    setShowModalConfirmStatus(false);
    const newData = {
      status: !currentRow?.status
    };
    // actionsGroundTruth.patchGroundTruth(currentRow?.id, newData).then((res) => {
    //   if (res) {
    //     onFetchData(
    //       dataSearch.description,
    //       dataSearch.name,
    //       dataSearch.version,
    //       dataSearch.verified,
    //       dataSearch.env,
    //       rowsPerPage,
    //       1
    //     );
    //   }
    // });
  };

  const totalPage = Math.ceil(totalItemCount / rowsPerPage);

  const handleDeleteGT = () => {
    setShowModalDelete(false);
    actionsGroundTruth.deleteGroundtruth(deleteItem?.id).then((res) => {
      onFetchData(
        dataSearch.code,
        dataSearch.status,
        dataSearch.to_date,
        dataSearch.from_date,
        dataSearch.data_source?.id,
        dataSearch.engine1_id,
        dataSearch.engine2_id,
        dataSearch.creator,
        rowsPerPage,
        page
      );
    });
  };

  const triggerGroundtruth = (item) => {
    actionsGroundTruth.triggerGroundtruth(item.id).then((res) => {
      onFetchData(
        dataSearch.code,
        dataSearch.status,
        dataSearch.to_date,
        dataSearch.from_date,
        dataSearch.data_source?.id,
        dataSearch.engine1_id,
        dataSearch.engine2_id,
        dataSearch.creator,
        rowsPerPage,
        page
      );
    });
  };
  const onGoback = (id) => {
    navigate('/ground-truth/' + id);
  };
  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead style={{ background: 'none' }}>
          <TableRow style={{ background: 'none' }}>
            <TableCell align="center">MÃ GT</TableCell>
            <TableCell align="center">TÊN</TableCell>
            <TableCell align="center">NGUỒN</TableCell>
            <TableCell align="center">ENGINE 1</TableCell>
            <TableCell align="center">ENGINE 2</TableCell>
            <TableCell align="center">USER</TableCell>
            <TableCell align="center">TRẠNG THÁI</TableCell>
            <TableCell align="center">HÀNH ĐỘNG</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groundTruths.length > 0 &&
            groundTruths.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">GT{row.id}</TableCell>
                <TableCell align="center">{row?.name}</TableCell>
                <TableCell align="center">
                  {row.sync_task?.data_source_relate?.name}
                </TableCell>
                <TableCell align="center">
                  {row?.engine1?.name}-{row?.engine1?.version}
                </TableCell>
                <TableCell align="center">
                  {row?.engine2?.name}-{row?.engine2?.version}
                </TableCell>

                <TableCell align="center">
                  {row.creator_relate?.full_name}
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
                        onClick={() => onGoback(row.id)}
                        style={{ cursor: 'pointer' }}
                        className="icon view"
                      />
                      <EditIcon
                        className="icon edit"
                        style={{ cursor: 'pointer', margin: '0 5px' }}
                        onClick={() =>
                          navigate('/ground-truth/add-appoint', {
                            state: { item: row }
                          })
                        }
                      />
                      <PlayCircleIcon
                        className="icon run"
                        style={{ cursor: 'pointer' }}
                        onClick={() => triggerGroundtruth(row)}
                      />
                      <DeleteIcon
                        onClick={() => {
                          setShowModalDelete(true);
                          setDeleteItem(row);
                        }}
                        style={{ color: '#212943', cursor: 'pointer' }}
                      />
                    </div>
                  )}
                  {row.status === 'success' && (
                    <div>
                      <VisibilityIcon />
                    </div>
                  )}
                  {row.status === 'failed' && (
                    <div>
                      <VisibilityIcon
                        style={{ cursor: 'pointer', margin: '0 5px' }}
                      />
                      <PlayCircleIcon
                        style={{ cursor: 'pointer', color: '#212943' }}
                      />
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </StyledTable>
      {groundTruths.length === 0 && (
        <div className="data-empty">
          <div className="content-empty">
            <img
              src={'/static/images/status/empty-engine.svg'}
              alt="log-vps"
            ></img>
            <div className="text-empty-data">
              Không tìm thấy groundTruth nào!!!
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
      {showModalConfirmVerified ? (
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
      )}
      {showModalDelete && (
        <ModalDelete
          onConfirm={handleDeleteGT}
          onHandleClose={() => setShowModalDelete(false)}
          show={true}
          title="Xác nhận"
          content="Bạn có chắc chắn muốn xóa không?"
        ></ModalDelete>
      )}
    </Box>
  );
};

export default ListGroundTruth;
