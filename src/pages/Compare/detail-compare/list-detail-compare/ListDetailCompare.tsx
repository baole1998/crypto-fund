import {
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button
} from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { Box, styled } from '@mui/system';
import FooterPagination from 'src/components/FooterPagination/FooterPagination';
import DetailCompare from '../DetailCompare';
import moment from 'moment';
import * as actionCompare from 'src/redux/store/compare/compare.store';

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
        '& .btn': {
          borderRadius: '5px',
          minWidth: '100px',
          pointerEvents: 'none',
          '&.btn-pass': {
            backgroundColor: COLOR_GREEN
          },
          '&.btn-fail': {
            backgroundColor: COLOR_RED
          },
          '&.btn-init': {
            backgroundColor: COLOR_BLUE
          }
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

interface ListDetailCompareProps {
  detailCompares: any;
  page: Number;
  setPage: (page) => void;
  rowsPerPage: Number;
  setRowsPerPage: (rowsperpage) => void;
  totalItemCount: Number;
}

const ListDetailCompare: React.FC<ListDetailCompareProps> = (props) => {
  const { detailCompares } = props;
  const [listImage, setListImage] = useState([]);

  useEffect(() => {
    if (detailCompares) {
      Promise.all(
        detailCompares.map((item) => {
          return getCustomerImage(item?.ground_truth_result?.customer_docs_id);
        })
      ).then((res) => setListImage(res));
    }
  }, [detailCompares]);

  const getCustomerImage = async (customerdocId) => {
    let res = await actionCompare.getCustomerImg(customerdocId).then((res) => {
      return res.data;
    });
    return res;
  };
  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead style={{ background: 'none' }}>
          <TableRow style={{ background: 'none' }}>
            <TableCell align="center">STT</TableCell>
            <TableCell align="center">TKCK</TableCell>
            <TableCell align="center">UID</TableCell>
            <TableCell align="center">Thông tin</TableCell>
            <TableCell align="center">Ảnh</TableCell>
            {/* <TableCell align="center">CMT mặt sau</TableCell>
            <TableCell align="center">Ảnh face</TableCell> */}
            <TableCell align="center">Engine VVN</TableCell>
            <TableCell align="center">Engine FDM</TableCell>
            <TableCell align="center">Groundtruth</TableCell>
            <TableCell align="center">KQ VVN</TableCell>
            <TableCell align="center">KQ FDM</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {detailCompares?.map((item, index) => {
            let { ground_truth_result, VVN, FDM } = item;
            let { customer_doc } = ground_truth_result;
            let result_vvn = true;
            let result_fdm = true;
            const compare = (engine, comparekey, comparevalue) => {
              if (
                engine === 'vvn' &&
                comparevalue !== ground_truth_result[comparekey]
              ) {
                result_vvn = false;
              }
              if (
                engine === 'fdm' &&
                comparevalue !== ground_truth_result[comparekey]
              ) {
                result_fdm = false;
              }
              return comparevalue !== ground_truth_result[comparekey];
            };
            let wrongTextStyle = {
              color: 'red'
            };
            let imgData = listImage[index];

            return (
              <Fragment key={item?.id}>
                <TableRow style={{ background: 'none' }}>
                  <TableCell align="center" rowSpan={7}>
                    {index + 1}
                  </TableCell>
                  <TableCell align="center" rowSpan={7}>
                    {customer_doc?.customer_code}
                  </TableCell>
                  <TableCell
                    align="center"
                    rowSpan={7}
                    style={{
                      whiteSpace: 'normal',
                      wordWrap: 'break-word'
                    }}
                  >
                    {customer_doc?.uid}
                  </TableCell>
                  <TableCell align="left">Số CMT</TableCell>
                  <TableCell
                    align="center"
                    rowSpan={2}
                    style={{
                      whiteSpace: 'normal',
                      wordWrap: 'break-word'
                    }}
                  >
                    {/* {ground_truth_result.customer_doc.front_path} */}
                    <img
                      style={{ width: '350px', height: 'auto' }}
                      src={`data:image/jpeg;base64,${imgData?.front_img}`}
                    />
                  </TableCell>

                  <TableCell
                    align="left"
                    style={
                      compare('vvn', 'card_number', VVN?.card_number)
                        ? wrongTextStyle
                        : {}
                    }
                  >
                    {VVN?.card_number || '----'}
                  </TableCell>
                  <TableCell
                    align="left"
                    style={
                      compare('fdm', 'card_number', FDM?.card_number)
                        ? wrongTextStyle
                        : {}
                    }
                  >
                    {FDM?.card_number || '----'}
                  </TableCell>
                  <TableCell align="left" rowSpan={1}>
                    {ground_truth_result?.card_number || '----'}
                  </TableCell>
                  <TableCell align="center" rowSpan={7}>
                    {result_vvn ? 'Đúng' : 'Sai'}
                  </TableCell>
                  <TableCell align="center" rowSpan={7}>
                    {result_fdm ? 'Đúng' : 'Sai'}
                  </TableCell>
                </TableRow>
                <Fragment>
                  <TableRow style={{ background: 'none' }}>
                    <TableCell align="left">Họ tên</TableCell>
                    <TableCell
                      align="left"
                      style={
                        compare('vvn', 'full_name', VVN?.full_name)
                          ? wrongTextStyle
                          : {}
                      }
                    >
                      {VVN?.full_name}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={
                        compare('fdm', 'full_name', FDM?.full_name)
                          ? wrongTextStyle
                          : {}
                      }
                    >
                      {FDM?.full_name}
                    </TableCell>
                    <TableCell align="left">
                      {ground_truth_result?.full_name}
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ background: 'none' }}>
                    <TableCell align="left">Ngày sinh</TableCell>
                    <TableCell
                      align="center"
                      rowSpan={2}
                      style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word'
                      }}
                    >
                      {/* {ground_truth_result.customer_doc.back_path} */}
                      <img
                      style={{ width: '350px', height: 'auto' }}
                      src={`data:image/jpeg;base64,${imgData?.back_img}`}
                    />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={
                        compare('vvn', 'birthday', VVN?.birthday)
                          ? wrongTextStyle
                          : {}
                      }
                    >
                      {moment(VVN?.birthday).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={
                        compare('fdm', 'birthday', FDM?.birthday)
                          ? wrongTextStyle
                          : {}
                      }
                    >
                      {moment(FDM?.birthday).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell align="left">
                      {moment(ground_truth_result?.birthday).format(
                        'DD/MM/YYYY'
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ background: 'none' }}>
                    <TableCell align="left">Địa chỉ thường trú</TableCell>
                    <TableCell
                      align="left"
                      style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        color: compare(
                          'vvn',
                          'address',
                          VVN?.address
                        )
                          ? 'red'
                          : ''
                      }}
                    >
                      {VVN?.address}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        color: compare(
                          'fdm',
                          'address',
                          FDM?.address
                        )
                          ? 'red'
                          : ''
                      }}
                    >
                      {FDM?.address}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word'
                      }}
                    >
                      {ground_truth_result?.address}
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ background: 'none' }}>
                    <TableCell align="left">Ngày cấp</TableCell>
                    <TableCell
                      align="center"
                      rowSpan={3}
                      style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word'
                      }}
                    >
                      {/* {ground_truth_result.customer_doc.face_path} */}
                      <img
                      style={{ width: '350px', height: 'auto' }}
                      src={`data:image/jpeg;base64,${imgData?.face_img}`}
                    />
                    </TableCell>
                    <TableCell
                      align="left"
                      style={
                        compare('vvn', 'issue_date', VVN?.issue_date)
                          ? wrongTextStyle
                          : {}
                      }
                    >
                      {moment(VVN?.issue_date).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={
                        compare('fdm', 'issue_date', FDM?.issue_date)
                          ? wrongTextStyle
                          : {}
                      }
                    >
                      {moment(FDM?.issue_date).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell align="left">
                      {moment(ground_truth_result?.issue_date).format(
                        'DD/MM/YYYY'
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ background: 'none' }}>
                    <TableCell align="left">Nơi cấp</TableCell>
                    <TableCell
                      align="left"
                      style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        color: compare(
                          'vvn',
                          'issue_by',
                          VVN?.issue_by
                        )
                          ? 'red'
                          : ''
                      }}
                    >
                      {VVN?.issue_by}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        color: compare(
                          'fdm',
                          'issue_by',
                          FDM?.issue_by
                        )
                          ? 'red'
                          : ''
                      }}
                    >
                      {FDM?.issue_by}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word'
                      }}
                    >
                      {ground_truth_result?.issue_by}
                    </TableCell>
                  </TableRow>
                  <TableRow style={{ background: 'none' }}>
                    <TableCell align="left">Ngày hết hạn</TableCell>
                    <TableCell
                      align="left"
                      style={
                        compare(
                          'vvn',
                          'expired_date',
                          VVN?.expired_date
                        )
                          ? wrongTextStyle
                          : {}
                      }
                    >
                      {moment(VVN?.expired_date).format(
                        'DD/MM/YYYY'
                      )}
                    </TableCell>
                    <TableCell
                      align="left"
                      style={
                        compare(
                          'fdm',
                          'expired_date',
                          FDM?.expired_date
                        )
                          ? wrongTextStyle
                          : {}
                      }
                    >
                      {moment(FDM?.expired_date).format(
                        'DD/MM/YYYY'
                      )}
                    </TableCell>
                    <TableCell align="left">
                      {moment(ground_truth_result?.expired_date).format(
                        'DD/MM/YYYY'
                      )}
                    </TableCell>
                  </TableRow>
                </Fragment>
              </Fragment>
            );
          })}
        </TableBody>
      </StyledTable>
      {detailCompares.length === 0 && (
        <div className="data-empty">
          <div className="content-empty">
            <img
              src={'/static/images/status/empty-engine.svg'}
              alt="log-vps"
            ></img>
            <div className="text-empty-data">Không tìm thấy Compare nào!!!</div>
          </div>
        </div>
      )}
      {/*
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
    )} */}
    </Box>
  );
};

export default ListDetailCompare;
