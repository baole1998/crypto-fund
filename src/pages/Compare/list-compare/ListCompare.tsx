import {
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button
} from '@mui/material';
import React, { Fragment, useState } from 'react';
import { Box, styled } from '@mui/system';
import './ListCompare.scss';
import FooterPagination from 'src/components/FooterPagination/FooterPagination';
import * as actionsCompare from '../../../redux/store/compare/compare.store';
import { ContentSearch, CompareTaskModel } from 'src/models/compare_task';
import ModalCommon from 'src/components/Modal/ModalCommon/ModalCommon';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalDelete from 'src/components/Modal/ModalDelete/ModalDelete';
import AddOrEditCompare from '../add-compare/AddOrEditCompare';
import moment from 'moment';
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
          },
          '&.btn-processing': {
            backgroundColor: '#E2A300'
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
interface PropListCompare {
  compares: Array<any>;
  onFetchData: (
    // description: string,
    // name: string,
    // version: number,
    // verified: string,
    // env: string,
    // rowsPerPage: number,
    // page: number
    data: object
  ) => void;
  setPage: (page: number) => void;
  page: number;
  rowsPerPage: number;
  dataSearch: ContentSearch;
  setRowsPerPage: (rowPage: number) => void;
  totalItemCount: number;
  onEditItem: (row: any) => void;
  handleTriggerCompare: (id) => void;
}
const ListCompare: React.FC<PropListCompare> = (props) => {
  const {
    compares,
    onFetchData,
    setPage,
    page,
    rowsPerPage,
    setRowsPerPage,
    totalItemCount,
    onEditItem,
    handleTriggerCompare
  } = props;
  // const [showModalConfirmVerified, setShowModalConfirmVerified] =
  //   useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<CompareTaskModel>({});
  const [showModalDelete, setShowModalDelete] = useState<Boolean>(false);
  const [deletedItem, setDeletedItem] = useState<CompareTaskModel>();
  const [showModalAddorEdit, setshowModalAddorEdit] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<CompareTaskModel>();

  const handleChangePage = (event, newPage: number) => {
    setPage(newPage);
    let data = {
      rowsPerPage: rowsPerPage,
      page: newPage
    };
    onFetchData(data);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(1);
    onFetchData({ rowsPerPage: event.target.value, page: 1 });
  };

  const onDeleteCompare = () => {
    actionsCompare.deleteCompare(deletedItem?.id).then((res) => {
      onFetchData({ rowsPerPage: rowsPerPage, page: 1 });
    });
    setShowModalDelete(false);
  };

  const totalPage = Math.ceil(totalItemCount / rowsPerPage);
  const navigate = useNavigate();

  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead style={{ background: 'none' }}>
          <TableRow style={{ background: 'none' }}>
            <TableCell align="center">Ngày thực hiện</TableCell>
            <TableCell align="center">Thông tin so sánh</TableCell>
            <TableCell align="center">Đơn vị cung cấp</TableCell>
            <TableCell align="center">Version</TableCell>
            <TableCell align="center">Dữ liệu chuẩn</TableCell>
            <TableCell align="center">Người thực hiện</TableCell>
            <TableCell align="center">Kết quả</TableCell>
            <TableCell align="center">Trạng thái</TableCell>

            <TableCell align="center">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {compares.length > 0 &&
            compares.map((row, index) => {
              let { compare_engine } = row;
              let compare_key = Object.keys(compare_engine);
              let compare_value = Object.values(compare_engine);
              if (compare_value.length <= 0) {
                return;
              }
              let rowspan_sign = compare_engine.sign
                ? compare_engine.sign?.engine1 && compare_engine.sign?.engine2
                  ? 2
                  : 1
                : 0;
              let rowspan_ekyc = compare_engine.ekyc
                ? compare_engine.ekyc?.engine1 && compare_engine.ekyc?.engine2
                  ? 2
                  : 1
                : 0;
              let rowspan_face = compare_engine.face
                ? compare_engine.face?.engine1 && compare_engine.face?.engine2
                  ? 2
                  : 1
                : 0;
              let rowspan = rowspan_sign + rowspan_ekyc + rowspan_face;

              return (
                <Fragment key={index}>
                  <TableRow>
                    <TableCell align="center" rowSpan={rowspan}>
                      {moment(row.created_at).format('hh:mm DD/MM/YYYY')}
                    </TableCell>

                    <Fragment>
                      <TableCell
                        align="center"
                        rowSpan={
                          compare_value[0]['engine1'] &&
                          compare_value[0]['engine2']
                            ? 2
                            : 1
                        }
                      >
                        {compare_key[0]}
                      </TableCell>
                      <TableCell align="center">
                        {compare_value[0]['engine1'].name}
                      </TableCell>
                      <TableCell align="center">
                        {compare_value[0]['engine1'].version}
                      </TableCell>
                    </Fragment>

                    <TableCell align="center" rowSpan={rowspan}>
                      {row?.ground_truth_task?.name}
                    </TableCell>
                    <TableCell align="center" rowSpan={rowspan}>
                      {row.creator_info?.username || '---'}
                    </TableCell>
                    <TableCell align="center">
                      {compare_value[0]['engine1_result'] === null && (
                        <Button variant="contained" className="btn btn-init">
                          Khởi tạo
                        </Button>
                      )}
                      {compare_value[0]['engine1_result'] === 'processing' && (
                        <Button
                          className="btn-processing"
                          variant="contained"
                          disabled
                        >
                          Đang xử lý
                        </Button>
                      )}
                      {compare_value[0]['engine1_result'] && (
                        <Button variant="contained" className="btn btn-pass">
                          Pass
                        </Button>
                      )}
                      {compare_value[0]['engine1_result'] === false && (
                        <Button variant="contained" className="btn btn-fail">
                          Fail
                        </Button>
                      )}
                    </TableCell>
                    <TableCell align="center" rowSpan={rowspan}>
                      {row.status === null ||
                        (row.status === 'created' && (
                          <Button variant="contained" className="btn btn-init">
                            Khởi tạo
                          </Button>
                        ))}
                      {row.status === 'processing' && (
                        <Button
                          className="btn btn-processing"
                          variant="contained"
                        >
                          Đang xử lý
                        </Button>
                      )}
                      {row.status === 'success' && (
                        <Button variant="contained" className="btn btn-pass">
                          Thành công
                        </Button>
                      )}
                      {row.status === 'fail' && (
                        <Button variant="contained" className="btn btn-fail">
                          Fail
                        </Button>
                      )}
                    </TableCell>

                    {row.status === null ||
                      (row.status === 'created' && (
                        <TableCell align="center" rowSpan={rowspan}>
                          <VisibilityIcon
                            className="icon view"
                            onClick={() => navigate('/compare/' + row.id)}
                          />
                          <EditIcon
                            className="icon edit"
                            onClick={() => onEditItem(row)}
                          />
                          <PlayCircleIcon
                            className="icon run"
                            onClick={() => handleTriggerCompare(row.id)}
                          />
                          <DeleteIcon
                            className="icon delete"
                            onClick={() => {
                              setShowModalDelete(true);
                              setDeletedItem(row);
                            }}
                          />
                        </TableCell>
                      ))}
                  </TableRow>
                  {compare_value[0]['engine2'] && (
                    <TableRow>
                      <Fragment>
                        <TableCell align="center">
                          {compare_value[0]['engine2']?.name}
                        </TableCell>
                        <TableCell align="center">
                          {compare_value[0]['engine2']?.version}
                        </TableCell>
                        <TableCell align="center">
                          {compare_value[0]['engine2_result'] === null && (
                            <Button
                              variant="contained"
                              className="btn btn-init"
                            >
                              Khởi tạo
                            </Button>
                          )}
                          {compare_value[0]['engine2_result'] && (
                            <Button
                              variant="contained"
                              className="btn btn-pass"
                            >
                              Pass
                            </Button>
                          )}
                          {compare_value[0]['engine2_result'] ===
                            'processing' && (
                            <Button
                              className="btn-processing"
                              variant="contained"
                              disabled
                            >
                              Đang xử lý
                            </Button>
                          )}
                          {compare_value[0]['engine2_result'] === false && (
                            <Button
                              variant="contained"
                              className="btn btn-fail"
                            >
                              Fail
                            </Button>
                          )}
                        </TableCell>
                      </Fragment>
                    </TableRow>
                  )}
                  {compare_value[1] && (
                    <Fragment>
                      <TableRow>
                        <Fragment>
                          <TableCell
                            align="center"
                            rowSpan={
                              compare_value[1]['engine1'] &&
                              compare_value[1]['engine2']
                                ? 2
                                : 1
                            }
                          >
                            {compare_key[1]}
                          </TableCell>
                          <TableCell align="center">
                            {compare_value[1]['engine1']?.name}
                          </TableCell>
                          <TableCell align="center">
                            {compare_value[1]['engine1']?.version}
                          </TableCell>
                        </Fragment>
                        <TableCell align="center">
                          {compare_value[1]['engine1_result'] === null && (
                            <Button
                              variant="contained"
                              className="btn btn-init"
                            >
                              Khởi tạo
                            </Button>
                          )}
                          {compare_value[1]['engine1_result'] && (
                            <Button
                              variant="contained"
                              className="btn btn-pass"
                            >
                              Pass
                            </Button>
                          )}
                          {compare_value[1]['engine1_result'] ===
                            'processing' && (
                            <Button
                              className="btn-processing"
                              variant="contained"
                              disabled
                            >
                              Đang xử lý
                            </Button>
                          )}
                          {compare_value[1]['engine1_result'] === false && (
                            <Button
                              variant="contained"
                              className="btn btn-fail"
                            >
                              Fail
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                      {compare_value[1]['engine2'] && (
                        <TableRow>
                          <Fragment>
                            <TableCell align="center">
                              {compare_value[1]['engine2']?.name}
                            </TableCell>
                            <TableCell align="center">
                              {compare_value[1]['engine2']?.version}
                            </TableCell>
                            <TableCell align="center">
                              {compare_value[1]['engine2_result'] === null && (
                                <Button
                                  variant="contained"
                                  className="btn btn-init"
                                >
                                  Khởi tạo
                                </Button>
                              )}
                              {compare_value[1]['engine2_result'] && (
                                <Button
                                  variant="contained"
                                  className="btn btn-pass"
                                >
                                  Pass
                                </Button>
                              )}
                              {compare_value[1]['engine2_result'] ===
                                'processing' && (
                                <Button
                                  className="btn-processing"
                                  variant="contained"
                                  disabled
                                >
                                  Đang xử lý
                                </Button>
                              )}
                              {compare_value[1]['engine2_result'] === false && (
                                <Button
                                  variant="contained"
                                  className="btn btn-fail"
                                >
                                  Fail
                                </Button>
                              )}
                            </TableCell>
                          </Fragment>
                        </TableRow>
                      )}
                    </Fragment>
                  )}
                  {compare_value[2] && (
                    <Fragment>
                      <TableRow>
                        <Fragment>
                          <TableCell
                            align="center"
                            rowSpan={
                              compare_value[2]['engine1'] &&
                              compare_value[2]['engine2']
                                ? 2
                                : 1
                            }
                          >
                            {compare_key[2]}
                          </TableCell>
                          <TableCell align="center">
                            {compare_value[2]['engine1']?.name}
                          </TableCell>
                          <TableCell align="center">
                            {compare_value[2]['engine1']?.version}
                          </TableCell>
                        </Fragment>
                        <TableCell align="center">
                          {compare_value[2]['engine1_result'] === null && (
                            <Button
                              variant="contained"
                              className="btn btn-init"
                            >
                              Khởi tạo
                            </Button>
                          )}
                          {compare_value[2]['engine1_result'] && (
                            <Button
                              variant="contained"
                              className="btn btn-pass"
                            >
                              Pass
                            </Button>
                          )}
                          {compare_value[2]['engine1_result'] ===
                            'processing' && (
                            <Button
                              className="btn-processing"
                              variant="contained"
                              disabled
                            >
                              Đang xử lý
                            </Button>
                          )}
                          {compare_value[2]['engine1_result'] === false && (
                            <Button
                              variant="contained"
                              className="btn btn-fail"
                            >
                              Fail
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                      {compare_value[2]['engine2'] && (
                        <TableRow>
                          <Fragment>
                            <TableCell align="center">
                              {compare_value[2]['engine2'].name}
                            </TableCell>
                            <TableCell align="center">
                              {compare_value[2]['engine2'].version}
                            </TableCell>
                            <TableCell align="center">
                              {compare_value[2]['engine2_result'] === null && (
                                <Button
                                  variant="contained"
                                  className="btn btn-init"
                                >
                                  Khởi tạo
                                </Button>
                              )}
                              {compare_value[2]['engine2_result'] && (
                                <Button
                                  variant="contained"
                                  className="btn btn-pass"
                                >
                                  Pass
                                </Button>
                              )}
                              {compare_value[2]['engine2_result'] ===
                                'processing' && (
                                <Button
                                  className="btn-processing"
                                  variant="contained"
                                  disabled
                                >
                                  Đang xử lý
                                </Button>
                              )}
                              {compare_value[2]['engine2_result'] === false && (
                                <Button
                                  variant="contained"
                                  className="btn btn-fail"
                                >
                                  Fail
                                </Button>
                              )}
                            </TableCell>
                          </Fragment>
                        </TableRow>
                      )}
                    </Fragment>
                  )}
                </Fragment>
              );
            })}
        </TableBody>
      </StyledTable>
      {compares.length === 0 && (
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

      {/* {showModalAddorEdit ? (
        <AddOrEditCompare
          setEditItem={setEditItem}
          editItem={editItem}
          rowsPerPage={rowsPerPage}
          dataSearch={dataSearch}
          onFetchData={onFetchData}
          show={showModalAddorEdit}
          onHandleClose={() => setshowModalAddorEdit(false)}
        // dataSource={dataSource}
        ></AddOrEditCompare>
      ) : (
        ''
      )} */}
      {showModalDelete && (
        <ModalDelete
          onConfirm={onDeleteCompare}
          onHandleClose={() => setShowModalDelete(false)}
          show={true}
          title="Xác nhận"
          content="Bạn có chắc chắn muốn xóa không?"
        ></ModalDelete>
      )}
    </Box>
  );
};

export default ListCompare;
