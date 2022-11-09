import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { styled } from '@mui/styles';
import Checkbox from '@mui/material/Checkbox';
import { Box } from '@mui/system';
import moment from 'moment';
import FooterPagination from 'src/components/FooterPagination/FooterPagination';
import { CustomerDocModel } from 'src/models/customer_doc';
import { CompareTaskModel, CompareTaskResponse } from 'src/models/compare_task';
import { useState } from 'react';
import { GroundTruthModel } from 'src/models/ground_truth';

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
      backgroundColor: '#369bc7'
    },
    '&.btn-level-1': {
      backgroundColor: '#E2A300'
    },
    '&.btn-level-2': {
      backgroundColor: '#36C76F'
    }
  }
}));

interface CustomerDocListPropsType {
  customerdoc: Array<CustomerDocModel>;
  totalItemCount: Number;
  page: Number;
  rowsPerPage: Number;
  handleChangeRowsPerPage: (event: any) => void;
  handleChangePage: (event: any, page: Number) => void;
  totalPage: Number;
  handleCreateCompare: () => void;
  editItem: CompareTaskResponse;
  handleEditCompare: () => void;
  groundtruthType: String;
  compareInfo: CompareTaskModel;
  handleChangeCompareInfo: (name, data) => void;
}

const CustomerDocList: React.FC<CustomerDocListPropsType> = (props) => {
  const {
    customerdoc,
    totalItemCount,
    page,
    rowsPerPage,
    handleChangeRowsPerPage,
    handleChangePage,
    totalPage,
    handleCreateCompare,
    editItem,
    handleEditCompare,
    groundtruthType,
    compareInfo,
    handleChangeCompareInfo
  } = props;

  const handleChangeListCustomerDoc = (checked, id) => {
    let currentListSelectCustomerDoc = [
      ...(compareInfo?.customer_docs_id || [])
    ];
    if (checked) {
      currentListSelectCustomerDoc.push(id);
    } else {
      currentListSelectCustomerDoc = currentListSelectCustomerDoc.filter(
        (item) => item !== id
      );
    }
    handleChangeCompareInfo('customer_docs_id', currentListSelectCustomerDoc);
  };
  return (
    <Box width="100%" overflow="auto" sx={{ height: '90%' }}>
      <StyledTable>
        <TableHead style={{ background: 'none' }}>
          <TableRow style={{ background: 'none' }}>
            <TableCell align="center">Chọn</TableCell>
            <TableCell align="center">STT</TableCell>
            <TableCell align="center">TKCK</TableCell>
            <TableCell align="center">UID/File Name</TableCell>
            <TableCell align="center">Ngày đồng bộ</TableCell>
            <TableCell align="center">Kênh dữ liệu</TableCell>
            <TableCell align="center">Groundtruth</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customerdoc.length > 0 &&
            customerdoc.map((row, index) => (
              <TableRow key={index}>
                <TableCell align="center">
                  <Checkbox
                    checked={
                      compareInfo?.customer_docs_id?.includes(row.id) ||
                      groundtruthType === 'default'
                    }
                    onChange={(e) => {
                      handleChangeListCustomerDoc(e.target.checked, row?.id);
                    }}
                  />
                </TableCell>
                <TableCell align="center">{index}</TableCell>
                <TableCell align="center">{row?.customer_code}</TableCell>
                <TableCell align="center">{row.uid}</TableCell>
                <TableCell align="center">
                  {moment(row.updated_at).format('hh:mm DD/MM/YYYY')}
                </TableCell>
                <TableCell align="center">
                  {row?.data_source?.name || '----'}
                </TableCell>

                <TableCell align="center">
                  {row.level === 0 ||
                    (!row.level && (
                      <Button
                        variant="contained"
                        className="btn btn-level-0"
                        onClick={() => {}}
                      >
                        Level 0
                      </Button>
                    ))}
                  {row.level === 1 && (
                    <Button
                      variant="contained"
                      className="btn btn-level-1"
                      onClick={() => {}}
                    >
                      Level 1
                    </Button>
                  )}
                  {row.level === 2 && (
                    <Button
                      variant="contained"
                      className="btn btn-level-2"
                      onClick={() => {}}
                    >
                      Level 2
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </StyledTable>
      {customerdoc.length === 0 && (
        <div className="data-empty">
          <div className="content-empty">
            <img
              src={'/static/images/status/empty-engine.svg'}
              alt="log-vps"
            ></img>
            <div className="text-empty-data">Không có kết quả tìm kiếm</div>
          </div>
        </div>
      )}
      {customerdoc.length > 0 && totalItemCount && totalItemCount > 0 ? (
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
      {customerdoc.length > 0 &&
        (editItem ? (
          <div className="footer-search">
            <Button
              variant="contained"
              className="btn button-create"
              onClick={handleEditCompare}
            >
              {'Lưu thay đổi'}
            </Button>
          </div>
        ) : (
          <div className="footer-search">
            <Button
              variant="contained"
              className="btn button-create"
              onClick={handleCreateCompare}
            >
              {'Tạo mới'}
            </Button>
          </div>
        ))}
    </Box>
  );
};

export default CustomerDocList;
