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
  FormControlLabel,
  TextField,
  Checkbox
} from '@mui/material';
import moment from 'moment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import React, { useState } from 'react';
import { Box, styled } from '@mui/system';
import './ListDetailGroundTruth.scss';
import FooterPagination from 'src/components/FooterPagination/FooterPagination';
import * as actionsGeneralDataManagement from '../../../../../redux/store/data-management/customer-doc/customer-doc.store';
import { CustomerDocModel, ContentSearch } from 'src/models/customer_doc';
import ModalCommon from 'src/components/Modal/ModalCommon/ModalCommon';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { GroundTruthDetailModel } from 'src/models/ground_truth';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import viLocale from 'date-fns/locale/vi';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: 'pre',
  '& thead': {
    '& tr': {
      '& th': {
        // paddingLeft: 0,
        // paddingRight: 0
      }
    }
  },
  '& tbody': {
    '& tr': {
      '& td': {
        // paddingLeft: 0,
        textTransform: 'capitalize'
        // '& button': {
        //   borderRadius: '5px',
        //   minWidth: '180px',
        //   maxWidth: '250px',
        //   color: '#fff !important',
        //   '&.btn-success': {
        //     backgroundColor: '#36C76F'
        //   },
        //   '&.btn-fail': {
        //     backgroundColor: '#C73636'
        //   },
        //   '&.btn-initial': {
        //     backgroundColor: '#369BC7'
        //   },
        //   '&.btn-processing': {
        //     backgroundColor: '#E2A300'
        //   }
        // },
        // '& svg': {
        //   height: '1em',
        //   width: 'auto'
        // }
      }
    }
  }
}));

interface PropListGeneralDataManagement {
  generalDataManagements: GroundTruthDetailModel[];
  onFetchData: (
    customer_code: string,
    status: string[],
    from_date: Date,
    to_date: Date,
    data_source: number,
    rowsPerPage: number,
    page: number
  ) => void;
  setPage: (page: number) => void;
  onSaveCustomerInfo: (data: any) => void;
  onSaveCustomerInfoStatus: (data: any, name:string) => void;
  onSaveCustomerInfoTime: (data: any, name:string, value: any) => void;
  page: number;
  rowsPerPage: number;
  dataSearch: ContentSearch;
  setRowsPerPage: (rowPage: number) => void;
  onChangeStateShowEditCustomerInfo: (name: string) => void;
  onChangeCustomerInfo: (
    id: number,
    type: string,
    name: string,
    value: any
  ) => void;
  totalItemCount: number;
  listStateEdit: string[];
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
    setRowsPerPage,
    totalItemCount,
    dataSearch,
    listStateEdit,
    onChangeStateShowEditCustomerInfo,
    onChangeCustomerInfo,
    onSaveCustomerInfo,
    onSaveCustomerInfoStatus,
    onSaveCustomerInfoTime,
  } = props;
  const [showModalConfirmVerified, setShowModalConfirmVerified] =
    useState<boolean>(false);
  const [showModalConfirmStatus, setShowModalConfirmStatus] =
    useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<CustomerDocModel>({});
  const handleChangePage = (event, newPage: number) => {
    setPage(newPage);
    onFetchData(
      dataSearch.customer_code,
      dataSearch.status,
      dataSearch.from_date,
      dataSearch.to_date,
      dataSearch.data_source?.id,
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
      rowsPerPage,
      page
    );
  };
  const onChangeDetailCustomerDocTrigger = (id: number) => {
    actionsGeneralDataManagement.updateCustomerDocTrigger(id).then((res) => {
      if (res) {
        onFetchData(
          dataSearch.customer_code,
          dataSearch.status,
          dataSearch.from_date,
          dataSearch.to_date,
          dataSearch.data_source?.id,
          rowsPerPage,
          1
        );
      }
    });
  };
  const totalPage = Math.ceil(totalItemCount / rowsPerPage);
  const onCheckEdit = (name: string) => {
    let check = false;
    const objectEdit = listStateEdit.find((item) => item === name);
    if (objectEdit) {
      check = true;
    }
    return check;
  };
  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead style={{ background: 'none' }}>
          <TableRow style={{ background: 'none' }}>
            <TableCell>UID</TableCell>
            <TableCell>Thông tin</TableCell>
            <TableCell>Ảnh</TableCell>
            <TableCell>VVN</TableCell>
            <TableCell>FDM</TableCell>
            <TableCell>GROUNDTRUTH</TableCell>
            <TableCell>KẾT QUẢ</TableCell>
            <TableCell>LEVEL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {generalDataManagements.length > 0 &&
            generalDataManagements.map((row, index) => (
              <>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell rowSpan={12}>{row.customer_docs?.uid}</TableCell>
                </TableRow>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>Họ và tên</TableCell>
                  <TableCell rowSpan={5}>Mặt trước</TableCell>
                  <TableCell>{row.VVN.full_name}</TableCell>
                  <TableCell>{row.FDM.full_name}</TableCell>
                  <TableCell>
                    {onCheckEdit('full_name') ? (
                      <TextField
                        onChange={(e) =>
                          onChangeCustomerInfo(
                            row.id,
                            'ground_truth_result',
                            'full_name',
                            e.target.value
                          )
                        }
                        onBlur={() =>
                          onSaveCustomerInfo(row.ground_truth_result)
                        }
                        autoFocus
                        id="outlined-basic"
                        value={row.ground_truth_result.full_name}
                        label=""
                        variant="outlined"
                      />
                    ) : (
                      <>
                        {row.ground_truth_result.full_name}
                        <EditIcon
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            onChangeStateShowEditCustomerInfo('full_name')
                          }
                        ></EditIcon>
                      </>
                    )}
                  </TableCell>
                  <TableCell rowSpan={5}>{row.front_verified_level ? 'Trùng khớp': 'Không trùng khớp'}</TableCell>
                  <TableCell rowSpan={5}>{row.front_verified_level}</TableCell>
                </TableRow>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>Ngày sinh</TableCell>
                  <TableCell>
                    {row.VVN.birthday
                      ? moment(new Date(row.VVN.birthday)).format('DD-MM-YYYY')
                      : ''}{' '}
                  </TableCell>
                  <TableCell>
                    {row.FDM.birthday
                      ? moment(new Date(row.FDM.birthday)).format('DD-MM-YYYY')
                      : ''}{' '}
                  </TableCell>
                  <TableCell>
                    {onCheckEdit('birthday') ? (
                      <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        locale={viLocale}
                      >
                        <DatePicker
                          value={
                            row.ground_truth_result.birthday
                              ? moment(
                                  new Date(row.ground_truth_result.birthday)
                                )
                              : new Date()
                          }
                          renderInput={(params) => (
                            <TextField size="small" {...params} />
                          )}
                          onChange={(e) => {
                            onChangeCustomerInfo(
                              row.id,
                              'ground_truth',
                              'birthday',
                              e
                            )
                            onSaveCustomerInfoTime(row.ground_truth_result, 'birthday', e) 
                          }
                            
                          }
                        />
                      </LocalizationProvider>
                    ) : (
                      <>
                        {row.ground_truth_result.birthday
                          ? moment(
                              new Date(row.ground_truth_result.birthday)
                            ).format('DD-MM-YYYY')
                          : ''}
                        <EditIcon
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            onChangeStateShowEditCustomerInfo('birthday')
                          }
                        ></EditIcon>
                      </>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>Số CCCD</TableCell>
                  <TableCell>{row.VVN.card_number}</TableCell>
                  <TableCell>{row.FDM.card_number}</TableCell>
                  <TableCell>
                    {onCheckEdit('card_number') ? (
                      <TextField
                        onChange={(e) =>
                          onChangeCustomerInfo(
                            row.id,
                            'ground_truth_result',
                            'card_number',
                            e.target.value
                          )
                        }
                        onBlur={() =>
                          onSaveCustomerInfo(row.ground_truth_result)
                        }
                        autoFocus
                        id="outlined-basic"
                        value={row.ground_truth_result.card_number}
                        label=""
                        variant="outlined"
                      />
                    ) : (
                      <>
                        {row.ground_truth_result.card_number}
                        <EditIcon
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            onChangeStateShowEditCustomerInfo('card_number')
                          }
                        ></EditIcon>
                      </>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>Địa chỉ</TableCell>
                  <TableCell>{row.VVN.address}</TableCell>
                  <TableCell>{row.FDM.address}</TableCell>
                  <TableCell>
                    {onCheckEdit('address') ? (
                      <TextField
                        onChange={(e) =>
                          onChangeCustomerInfo(
                            row.id,
                            'ground_truth_result',
                            'address',
                            e.target.value
                          )
                        }
                        onBlur={() =>
                          onSaveCustomerInfo(row.ground_truth_result)
                        }
                        autoFocus
                        id="outlined-basic"
                        value={row.ground_truth_result.address}
                        label=""
                        variant="outlined"
                      />
                    ) : (
                      <>
                        {row.ground_truth_result.address}
                        <EditIcon
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            onChangeStateShowEditCustomerInfo('address')
                          }
                        ></EditIcon>
                      </>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>Ngày hết hạn</TableCell>
                  <TableCell>
                    {row.VVN.expired_date
                      ? moment(new Date(row.VVN.expired_date)).format(
                          'DD-MM-YYYY'
                        )
                      : ''}
                  </TableCell>
                  <TableCell>
                    {row.FDM.expired_date
                      ? moment(new Date(row.FDM.expired_date)).format(
                          'DD-MM-YYYY'
                        )
                      : ''}
                  </TableCell>
                  <TableCell>
                    {onCheckEdit('expired_date') ? (
                      <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        locale={viLocale}
                      >
                        <DatePicker
                          value={
                            row.ground_truth_result.expired_date
                              ? moment(
                                  new Date(row.ground_truth_result.expired_date)
                                )
                              : new Date()
                          }
                          renderInput={(params) => (
                            <TextField
                              size="small"
                              {...params}
                            />
                          )}
                          onChange={(e) =>{
                            onChangeCustomerInfo(
                              row.id,
                              'ground_truth',
                              'expired_date',
                              e
                            )
                            onSaveCustomerInfoTime(row.ground_truth_result, 'expired_date', e) 
                          }
                            
                          }
                        />
                      </LocalizationProvider>
                    ) : (
                      <>
                        {row.ground_truth_result.expired_date
                          ? moment(
                              new Date(row.ground_truth_result.expired_date)
                            ).format('DD-MM-YYYY')
                          : ''}
                        <EditIcon
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            onChangeStateShowEditCustomerInfo('expired_date')
                          }
                        ></EditIcon>
                      </>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                ></TableRow>

                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>Nơi cấp</TableCell>
                  <TableCell rowSpan={2}>Mặt sau</TableCell>
                  <TableCell>{row.VVN.issue_by}</TableCell>
                  <TableCell>{row.FDM.issue_by}</TableCell>
                  <TableCell>
                    {onCheckEdit('issue_by') ? (
                      <TextField
                        onChange={(e) =>
                          onChangeCustomerInfo(
                            row.id,
                            'ground_truth_result',
                            'issue_by',
                            e.target.value
                          )
                        }
                        onBlur={() =>
                          onSaveCustomerInfo(row.ground_truth_result)
                        }
                        autoFocus
                        id="outlined-basic"
                        value={row.ground_truth_result.issue_by}
                        label=""
                        variant="outlined"
                      />
                    ) : (
                      <>
                        {row.ground_truth_result.issue_by}
                        <EditIcon
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            onChangeStateShowEditCustomerInfo('issue_by')
                          }
                        ></EditIcon>
                      </>
                    )}
                  </TableCell>
                  <TableCell rowSpan={2}>{row.back_verified_level ? 'Trùng khớp': 'Không trùng khớp'}</TableCell>
                  <TableCell rowSpan={2}>{row.back_verified_level}</TableCell>
                </TableRow>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>Ngày cấp</TableCell>
                  <TableCell>
                    {row.VVN.issue_date
                      ? moment(new Date(row.VVN.issue_date)).format(
                          'DD-MM-YYYY'
                        )
                      : ''}
                  </TableCell>
                  <TableCell>
                    {row.FDM.issue_date
                      ? moment(new Date(row.FDM.issue_date)).format(
                          'DD-MM-YYYY'
                        )
                      : ''}
                  </TableCell>
                  <TableCell>
                    {onCheckEdit('issue_date') ? (
                      <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        locale={viLocale}
                      >
                        <DatePicker
                          value={
                            row.ground_truth_result.issue_date
                              ? moment(
                                  new Date(row.ground_truth_result.issue_date)
                                )
                              : new Date()
                          }
                          renderInput={(params) => (
                            <TextField
                              onBlur={() =>
                                onSaveCustomerInfo(row.ground_truth_result)
                              }
                              autoFocus
                              size="small"
                              {...params}
                            />
                          )}
                          onChange={(e) =>{
                            onChangeCustomerInfo(
                              row.id,
                              'ground_truth',
                              'issue_date',
                              e
                            )
                            onSaveCustomerInfoTime(row.ground_truth_result, 'issue_date', e) 
                          }
                          }
                        />
                      </LocalizationProvider>
                    ) : (
                      <>
                        {row.ground_truth_result.issue_date
                          ? moment(
                              new Date(row.ground_truth_result.issue_date)
                            ).format('DD-MM-YYYY')
                          : ''}
                        <EditIcon
                          style={{ cursor: 'pointer' }}
                          onClick={() =>
                            onChangeStateShowEditCustomerInfo('issue_date')
                          }
                        ></EditIcon>
                      </>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>Tỷ lệ tương đồng</TableCell>
                  <TableCell rowSpan={2}>Face</TableCell>
                  <TableCell>{row.VVN.face_validation || '---'}</TableCell>
                  <TableCell>{row.FDM.face_similarity || '---'}</TableCell>
                  <TableCell>
                    {onCheckEdit('face_similarity') ? (
                      <TextField
                        onChange={(e) =>
                          onChangeCustomerInfo(
                            row.id,
                            'ground_truth_result',
                            'face_similarity',
                            e.target.value
                          )
                        }
                        onBlur={() =>
                          onSaveCustomerInfo(row.ground_truth_result)
                        }
                        autoFocus
                        id="outlined-basic"
                        value={row.ground_truth_result.face_similarity}
                        label=""
                        variant="outlined"
                      />
                    ) : (
                      <>
                        {row.ground_truth_result.face_similarity || 0}
                      </>
                    )}
                  </TableCell>
                  <TableCell rowSpan={2}>{row.face_verified_level ? 'Trùng khớp': 'Không trùng khớp'}</TableCell>
                  <TableCell rowSpan={2}>{row.face_verified_level}</TableCell>
                </TableRow>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell> So khớp khuôn mặt</TableCell>

                  <TableCell>{row.VVN.face_validation || 'False'}</TableCell>
                  <TableCell>{row.FDM.face_similarity || 'False'}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={row.ground_truth_result.face_validation}
                      onChange={(e)=>{
                        onChangeCustomerInfo(
                          row.id,
                          'ground_truth_result',
                          'face_validation',
                          e.target.checked
                        )
                        onSaveCustomerInfoStatus(row.ground_truth_result, 'face_validation')
                      }}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>Nhận diện chữ ký</TableCell>
                  <TableCell>Chữ ký</TableCell>
                  <TableCell>
                    <div>{row.VVN.sign_validation || 'False'}</div>
                  </TableCell>
                  <TableCell>{row.FDM.sign_validation || 'False'}</TableCell>

                  <TableCell>
                    <div>
                      <Checkbox
                        checked={row.ground_truth_result.sign_validation}
                        onChange={(e)=>{
                          onChangeCustomerInfo(
                            row.id,
                            'ground_truth_result',
                            'sign_validation',
                            e.target.checked
                          )
                          onSaveCustomerInfoStatus(row.ground_truth_result, 'sign_validation')
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{row.sign_verified_level ? 'Trùng khớp': 'Không trùng khớp'}</TableCell>
                  <TableCell>{row.sign_verified_level}</TableCell>
                </TableRow>
              </>
            ))}
        </TableBody>
      </StyledTable>
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
      {/* {showModalConfirmVerified ? ( 
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
      )} */}
    </Box>
  );
};

export default ListGeneralDataManagement;
