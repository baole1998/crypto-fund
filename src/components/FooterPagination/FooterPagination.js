import React from 'react';
import { MenuItem, Pagination, Select } from '@mui/material';
import './style.scss';


const FooterPagination = (props) => {
  const { handleChangeRowsPerPage, handleChangePage, totalPage, rowsPerPage, currentPage } =
    props;
  return (
    <div className='div-pagination'>
      <div className='d-flex justify-content-end'>
        <div className='select-page'>
          <div>Số hàng mỗi trang:</div>
          <div className='rowPerPage'>
            <Select value={rowsPerPage} onChange={handleChangeRowsPerPage} size="small">
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>
          </div>
        </div>

        <Pagination
          showFirstButton
          showLastButton
          page={currentPage}
          count={totalPage}
          siblingCount={1}
          boundaryCount={1}
          color='primary'
          onChange={handleChangePage}
        />
      </div>
    </div>
  );
};

export default FooterPagination;
