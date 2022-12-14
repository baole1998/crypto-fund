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
import './ListDetailReport.scss';
import FooterPagination from 'src/components/FooterPagination/FooterPagination';
// import * as actionsDetailReport from '../../../../../redux/store/data-management/general-data-management/general-data-management.store';
import { ReportModel } from 'src/models/report';
import ModalCommon from 'src/components/Modal/ModalCommon/ModalCommon';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
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

interface PropListDetailReport {
  detailReports: ReportModel[];
  onFetchData: ( description: string,
    name: string,
    version: number,
    verified: string,
    env: string,
    rowsPerPage: number,
    page: number) => void;
  setPage: (page: number) => void;
  page: number;
  rowsPerPage: number;
  setRowsPerPage: (rowPage: number) => void;
  totalItemCount: number;
}
const ListDetailReport: React.FC<PropListDetailReport> = (
  props
) => {
  const {
    detailReports,
    onFetchData,
    setPage,
    page,
    rowsPerPage,
    setRowsPerPage,
    totalItemCount
  } = props;
  const [showModalConfirmVerified, setShowModalConfirmVerified] =
    useState<boolean>(false);
  const [showModalConfirmStatus, setShowModalConfirmStatus] =
    useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ReportModel>({});
  const handleChangePage = (event, newPage: number) => {
    setPage(newPage);
    // onFetchData(1, rowsPerPage, newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    // onFetchData(1, rowsPerPage, page);
  };
  const onChangeVerified = () => {
    setShowModalConfirmVerified(false);
    const newData = {
      verified: 'approved'
    };
    // actionsDetailReport
    //   .patchDetailReport(currentRow.id, newData)
    //   .then((res) => {
    //     if (res) {
    //       onFetchData(1, rowsPerPage, 1);
    //     }
    //   });
  };
  const onChangeStatus = () => {
    setShowModalConfirmStatus(false);
    // const newData = {
    //   status: !currentRow?.status
    // };
    // actionsDetailReport
    //   .patchDetailReport(currentRow?.id, newData)
    //   .then((res) => {
    //     if (res) {
    //       onFetchData(1, rowsPerPage, 1);
    //     }
    //   });
  };

  const totalPage = Math.ceil(totalItemCount / rowsPerPage);

  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead style={{ background: 'none' }}>
          <TableRow style={{ background: 'none' }}>
            <TableCell sx={{ width: '10%' }} >
              Ng??y upload
            </TableCell>
            <TableCell sx={{ width: '5%' }} >
              UID
            </TableCell>
            <TableCell sx={{ width: '10%' }} >
             TKCK
            </TableCell>
            <TableCell sx={{ width: '5%' }} >
             Th??? lo???i
            </TableCell>
            <TableCell sx={{ width: '10%' }} >
              ???nh
            </TableCell>
            <TableCell sx={{ width: '10%' }} >
              Th??ng tin VVN
            </TableCell>
            <TableCell sx={{ width: '5%' }} >
              Th??ng tin FDM
            </TableCell>
            <TableCell sx={{ width: '10%' }} >
              K???t qu???
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        <TableRow style={{ background: 'none' }}>
            <TableCell sx={{ width: '10%' }} >
              01/09/1998
            </TableCell>
            <TableCell sx={{ width: '5%' }} >
              224906
            </TableCell>
            <TableCell sx={{ width: '10%' }} >
             12321312
            </TableCell>
            <TableCell sx={{ width: '5%' }} >
             M???t tr?????c
            </TableCell>
            <TableCell sx={{ width: '10%' }} >
              ???nh
            </TableCell>
            <TableCell sx={{ width: '10%' }} >
             Nguy???n V??n A
            </TableCell>
            <TableCell sx={{ width: '5%' }} >
            Nguy???n V??n A
            </TableCell>
            <TableCell sx={{ width: '10%' }} >
              Kh??ng tr??ng
            </TableCell>
          </TableRow>
          <TableRow style={{ background: 'none' }}>
            <TableCell sx={{ width: '10%' }} >
              01/09/1999
            </TableCell>
            <TableCell sx={{ width: '5%' }} >
              2222
            </TableCell>
            <TableCell sx={{ width: '10%' }} >
             9999
            </TableCell>
            <TableCell sx={{ width: '5%' }} >
             M???t tr?????c
            </TableCell>
            <TableCell sx={{ width: '10%' }} >
              ???nh
            </TableCell>
            <TableCell sx={{ width: '10%' }} >
             Nguy???n V??n B
            </TableCell>
            <TableCell sx={{ width: '5%' }} >
            Nguy???n V??n B
            </TableCell>
            <TableCell sx={{ width: '10%' }} >
              Tr??ng
            </TableCell>
          </TableRow>
        </TableBody>
      </StyledTable>
      {/* {detailReports.length === 0 && (
        <div className="data-empty">
          <div className="content-empty">
            <img
              src={'/static/images/status/empty-detailReport.svg'}
              alt="log-vps"
            ></img>
            <div className="text-empty-data">
              Kh??ng t??m th???y DetailReport n??o!!!
            </div>
          </div>
        </div>
      )} */}
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
          title="X??c nh???n"
          content="B???n c?? ch???c ch???n mu???n l??u thay ?????i kh??ng?"
        ></ModalCommon>
      ) : (
        ''
      )}
      {showModalConfirmStatus ? (
        <ModalCommon
          onConfirm={onChangeStatus}
          onHandleClose={() => setShowModalConfirmStatus(false)}
          show={showModalConfirmStatus}
          title="X??c nh???n"
          content="B???n c?? ch???c ch???n mu???n l??u thay ?????i kh??ng?"
        ></ModalCommon>
      ) : (
        ''
      )}
    </Box>
  );
};

export default ListDetailReport;
