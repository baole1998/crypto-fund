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
import './ListEngine.scss';
import FooterPagination from 'src/components/FooterPagination/FooterPagination';
import * as actionsEngine from '../../../redux/store/engine/engine.store';
import { ContentSearch, EngineModel } from 'src/models/engine';
import ModalCommon from 'src/components/Modal/ModalCommon/ModalCommon';
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
        paddingLeft: 0,
        textTransform: 'capitalize'
      }
    }
  }
}));

const IOSSwitch = styled((props: { checked: boolean }): JSX.Element => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
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
    opacity: 1,
  }
}));
interface PropListEngine {
  engines: EngineModel[],
  onFetchData: (description: string, name: string, version:number, verified: string, env: string, rowsPerPage: number, page: number) => void,
  setPage: (page:number) => void,
  page: number,
  rowsPerPage: number,
  dataSearch: ContentSearch,
  setRowsPerPage: (rowPage:number) => void,
  totalItemCount: number,
  onOpenShowModalEdit: (row: any) => void,
}
const ListEngine: React.FC<PropListEngine> = (props) => {
  const {
    engines,
    onFetchData,
    setPage,
    page,
    rowsPerPage,
    dataSearch,
    setRowsPerPage,
    totalItemCount,
    onOpenShowModalEdit
  } = props;
  const [showModalConfirmVerified, setShowModalConfirmVerified] = useState<boolean>(false)
  const [showModalConfirmStatus, setShowModalConfirmStatus] = useState<boolean>(false)
  const [currentRow, setCurrentRow] = useState<EngineModel>({})
  const handleChangePage = (event, newPage:number) => {
    setPage(newPage);
    onFetchData(
      dataSearch.description,
      dataSearch.name,
      dataSearch.version,
      dataSearch.verified,
      dataSearch.env,
      rowsPerPage,
      newPage
    );
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    onFetchData(
      dataSearch.description,
      dataSearch.name,
      dataSearch.version,
      dataSearch.verified,
      dataSearch.env,
      rowsPerPage,
      page
    );
  };
  const onChangeVerified = () => {
    setShowModalConfirmVerified(false)
    const newData = {
      verified: 'approved'
    }
    actionsEngine.patchEngine(currentRow.id, newData).then((res) => {
      if (res) {
        onFetchData(
          dataSearch.description,
          dataSearch.name,
          dataSearch.version,
          dataSearch.verified,
          dataSearch.env,
          rowsPerPage,
          1
        );
      }
    });
  }
  const onChangeStatus = () => {
    setShowModalConfirmStatus(false)
    const newData = {
      status: !currentRow?.status
    }
    actionsEngine.patchEngine(currentRow?.id, newData).then((res) => {
      if (res) {
        onFetchData(
          dataSearch.description,
          dataSearch.name,
          dataSearch.version,
          dataSearch.verified,
          dataSearch.env,
          rowsPerPage,
          1
        );
      }
    });
  }
  
  const totalPage = Math.ceil(totalItemCount / rowsPerPage);

  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead style={{ background: 'none' }}>
          <TableRow style={{ background: 'none' }}>
            <TableCell>Đơn vị cung cấp</TableCell>
            <TableCell>Loại</TableCell>
            <TableCell>Version</TableCell>
            <TableCell>Mô tả</TableCell>
            <TableCell>Môi trường</TableCell>
            <TableCell>Url</TableCell>
            <TableCell>Người thực hiện</TableCell>
            <TableCell>Thời gian</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {engines.length > 0 &&
            engines.map((row, index) => (
              <TableRow key={index}>
                <TableCell >{row.name}</TableCell>
                <TableCell >{row.type}</TableCell>
                <TableCell >{row.version}</TableCell>
                <TableCell >{row.description}</TableCell>
                <TableCell >{row.env}</TableCell>
                <TableCell >{row.url}</TableCell>
                <TableCell >{row?.user?.full_name}</TableCell>
                <TableCell >
                  {moment(new Date(row.created_at))
                    .add(7, 'hour')
                    .format('HH:MM - DD/MM/YYYY')}
                </TableCell>
                <TableCell >
                  <div className={`${row.verified === 'approving' ? 'verified-approving': "verified-approved"}`}>
                   {row.verified === 'approving' ? 'Chờ duyệt' : 'Đã duyệt'}
                  </div>
                  
                </TableCell>
                <TableCell >
                  {row.verified === 'approving' ? (
                    <>
                      <span onClick={() => onOpenShowModalEdit(row)} style={{ cursor: 'pointer'}}>
                        <EditIcon />
                      </span>
                      <span style={{ cursor: 'pointer'}} onClick={()=>{setCurrentRow(row); setShowModalConfirmVerified(true)}}>
                        <CheckCircleIcon />
                      </span>
                    </>
                  ) : (
                    <span style={{ cursor: 'pointer'}} onClick={()=>{setCurrentRow(row); setShowModalConfirmStatus(true)}}>
                      <IOSSwitch checked={row.status}></IOSSwitch>
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </StyledTable>
      {engines.length === 0 && (
        <div className="data-empty">
          <div className="content-empty">
            <img
              src={'/static/images/status/empty-engine.svg'}
              alt="log-vps"
            ></img>
            <div className="text-empty-data">Không tìm thấy Engine nào!!!</div>
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
      {
        showModalConfirmVerified ? <ModalCommon onConfirm={onChangeVerified} onHandleClose={()=>setShowModalConfirmVerified(false)} show={showModalConfirmVerified} title="Xác nhận" content="Bạn có chắc chắn muốn lưu thay đổi không?"></ModalCommon> : ''
      }
       {
        showModalConfirmStatus ? <ModalCommon onConfirm={onChangeStatus} onHandleClose={()=>setShowModalConfirmStatus(false)} show={showModalConfirmStatus} title="Xác nhận" content="Bạn có chắc chắn muốn lưu thay đổi không?"></ModalCommon> : ''
      }
    </Box>
  );
};

export default ListEngine;
