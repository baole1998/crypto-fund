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
import './ListReport.scss';
import FooterPagination from 'src/components/FooterPagination/FooterPagination';
import * as actionsReport from '../../../redux/store/report/report.store';
import { ContentSearch, ReportModel } from 'src/models/report';
import ModalCommon from 'src/components/Modal/ModalCommon/ModalCommon';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { DataSource } from 'src/models/data_source';
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

interface PropListReport {
  reports: ReportModel[];
  onFetchData: (
    code: string,
    data_source: DataSource,
    from_date: Date,
    to_date: Date,
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
const ListReport: React.FC<PropListReport> = (props) => {
  const {
    reports,
    onFetchData,
    setPage,
    page,
    rowsPerPage,
    dataSearch,
    setRowsPerPage,
    totalItemCount,
    onOpenShowModalEdit
  } = props;
  const navigate = useNavigate()
  const [showModalConfirmVerified, setShowModalConfirmVerified] =
    useState<boolean>(false);
  const [showModalConfirmStatus, setShowModalConfirmStatus] =
    useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ReportModel>({});
  const handleChangePage = (event, newPage: number) => {
    setPage(newPage);
    onFetchData(
      dataSearch.code,
      dataSearch.data_source,
      dataSearch.from_date,
      dataSearch.to_date,
      rowsPerPage,
      newPage
    );
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    onFetchData(
      dataSearch.code,
      dataSearch.data_source,
      dataSearch.from_date,
      dataSearch.to_date,
      rowsPerPage,
      page
    );
  };
  const onChangeVerified = () => {
    setShowModalConfirmVerified(false);
    const newData = {
      verified: 'approved'
    };
  };
  const onChangeStatus = () => {
    setShowModalConfirmStatus(false);
  };

  const totalPage = Math.ceil(totalItemCount / rowsPerPage);
  const onRedirct = () => {
    navigate('/report/' + 1)
  }
  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead style={{ background: 'none' }}>
          <TableRow style={{ background: 'none' }}>
            <TableCell style={{minWidth: 150}}>Ngày đồng bộ</TableCell>
            <TableCell style={{minWidth: 150}}>Kênh mở tài khoản</TableCell>
            <TableCell style={{minWidth: 150}}>Engine VVN</TableCell>
            <TableCell style={{minWidth: 150}}>Engine FDM</TableCell>
            <TableCell style={{minWidth: 200}}>SL MTK thành công </TableCell>
            <TableCell style={{minWidth: 150}}>KQ(Trùng khớp)</TableCell>
            <TableCell style={{minWidth: 150}}>KQ(Không khớp)</TableCell>
            <TableCell style={{minWidth: 150}}>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.length > 0 &&
            reports.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{moment(new Date(row.sync_date))
                    .format('HH:MM - DD/MM/YYYY')}</TableCell>
                <TableCell>{row.data_source_info.name}</TableCell>
                <TableCell>{row.engine1.name}</TableCell>
                <TableCell>{row.engine2.name}</TableCell>
                <TableCell>{row.acc_success}</TableCell>
                <TableCell>{row.matched_comparison}</TableCell>
                <TableCell>{row.failed_comparison}</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </StyledTable>
      {reports.length === 0 && (
        <div className="data-empty">
          <div className="content-empty">
            <img
              src={'/static/images/status/empty-engine.svg'}
              alt="log-vps"
            ></img>
            <div className="text-empty-data">Không tìm thấy Report nào!!!</div>
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
    </Box>
  );
};

export default ListReport;
