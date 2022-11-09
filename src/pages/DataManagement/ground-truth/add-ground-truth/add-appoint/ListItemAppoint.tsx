import {
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Checkbox
} from '@mui/material';
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import React, { useState } from 'react';
import { Box, styled } from '@mui/system';
import FooterPagination from 'src/components/FooterPagination/FooterPagination';
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
          },
          '&.btn-save': {
            backgroundColor: '#36C76F'
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

const ListItemAppoint = (props) => {
  const {
    setPage,
    page,
    rowsPerPage,
    setRowsPerPage,
    totalItemCount,
    listCustomerDoc,
    handleCreateGroundtruth,
    fetchCustomerDoc,
    dataSearch,
    groundtruthData,
    handleChangeGroundtruthData,
    editItem,
  } = props;
  const navigate = useNavigate();
  const totalPage = Math.ceil(totalItemCount / rowsPerPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
    let data = {
      from_date: dataSearch.from_date,
      to_date: dataSearch.to_date,
      data_source: dataSearch.data_source,
      uid: dataSearch.uid,
      customer_code: dataSearch.customer_code,
      pageSize: event.target.value,
      id_sync_task: dataSearch.id_sync_task
    };

    fetchCustomerDoc(data);
  };

  const handleChangePage = (event, newPage: number) => {
    setPage(newPage);
    let data = {
      from_date: dataSearch.from_date,
      to_date: dataSearch.to_date,
      data_source: dataSearch.data_source,
      uid: dataSearch.uid,
      customer_code: dataSearch.customer_code,
      currentpage: newPage,
      id_sync_task: dataSearch.id_sync_task
    };
    fetchCustomerDoc(data);
  };

  const handleChangeListCustomerDoc = (checked, id) => {
    let currentListSelectCustomerDoc = [
      ...(groundtruthData.customer_docs_id || [])
    ];
    if (checked) {
      currentListSelectCustomerDoc.push(id);
    } else {
      currentListSelectCustomerDoc = currentListSelectCustomerDoc.filter(
        (item) => item !== id
      );
    }
    handleChangeGroundtruthData(
      'customer_docs_id',
      currentListSelectCustomerDoc
    );
  };

  const onCreateGroundtruth = () => {
    handleCreateGroundtruth();
  };

  return (
    <Box width="100%" overflow="auto" sx={{ height: '90%' }}>
      <StyledTable>
        <TableHead style={{ background: 'none' }}>
          <TableRow style={{ background: 'none' }}>
            <TableCell sx={{ width: '10%' }} align="center">
              Chọn
            </TableCell>
            <TableCell sx={{ width: '10%' }} align="center">
              TKCK
            </TableCell>
            <TableCell sx={{ width: '5%' }} align="center">
              UID/FILENAME
            </TableCell>
            <TableCell sx={{ width: '10%' }} align="center">
              NGÀY ĐỒNG BỘ
            </TableCell>
            <TableCell sx={{ width: '10%' }} align="center">
              KÊNH DỮ LIỆU
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listCustomerDoc.length > 0 &&
            listCustomerDoc.map((row, index) => (
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                key={index}
              >
                <TableCell align="center">
                  <Checkbox
                    checked={
                      groundtruthData?.customer_docs_id?.includes(row.id) ||
                      !!dataSearch.id_sync_task
                    }
                    onChange={(e) => {
                      handleChangeListCustomerDoc(e.target.checked, row.id);
                    }}
                  />
                </TableCell>

                <TableCell align="center">
                  {row?.customer_code || '---'}
                </TableCell>
                <TableCell align="center">{row?.uid || '---'}</TableCell>
                <TableCell align="center">
                  {moment(new Date(row?.updated_at)).format('DD/MM/YYYY')}
                </TableCell>

                <TableCell align="center">
                  {row?.business_type || '---'}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </StyledTable>
      {listCustomerDoc.length === 0 && (
        <div className="data-empty">
          <div className="content-empty">
            <img
              src={'/static/images/status/empty-engine.svg'}
              alt="log-vps"
            ></img>
            <div className="text-empty-data">
              Không tìm thấy sync task nào!!!
            </div>
          </div>
        </div>
      )}
      {listCustomerDoc.length > 0 && totalItemCount && totalItemCount > 0 ? (
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
      <div className="footer-search">
        {!editItem ? (
          <Button
            variant="contained"
            className="btn button-search"
            onClick={onCreateGroundtruth}
          >
            Tạo mới
          </Button>
        ) : (
          <Button
            variant="contained"
            className="btn button-search"
            onClick={onCreateGroundtruth}
          >
            Lưu Thay Đổi
          </Button>
        )}
      </div>
    </Box>
  );
};

export default ListItemAppoint;
