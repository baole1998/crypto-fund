import * as React from 'react';
import viLocale from 'date-fns/locale/vi';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import './ItemDateTime.scss';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  datetimeContainer: {
    '& .css-h5wa9b-MuiInputBase-root-MuiOutlinedInput-root ': {
      borderRadius: '5px'
    }
  }
});

export default function ItemDateTime(props) {
  const { startDate, setStartDate, endDate, setEndDate } = props;
  const styles = useStyles();
  const [openFromDate, setOpenFromDate] = React.useState(false);
  const [openToDate, setOpenToDate] = React.useState(false);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>
      <div className="d-flex align-items-center">
        <div className={styles.datetimeContainer}>
          <DatePicker
            mask={'__/__/____'}
            value={startDate}
            onChange={(newValue) => {
              setStartDate('from_date', newValue);
              setOpenFromDate(!openFromDate);
            }}
            open={openFromDate}
            renderInput={(params) => (
              <TextField
                size="small"
                {...params}
                onClick={(e) => setOpenFromDate(!openFromDate)}
              />
            )}
          />
        </div>
        <div style={{ margin: '0px 10px' }}> - </div>
        <div className={styles.datetimeContainer}>
          <DatePicker
            mask={'__/__/____'}
            value={endDate}
            minDate={startDate}
            open={openToDate}
            onChange={(newValue) => {
              setEndDate('to_date', newValue);
              setOpenToDate(!openToDate)
            }}
            renderInput={(params) => (
              <TextField
                size="small"
                {...params}
                onClick={(e) => setOpenToDate(!openToDate)}
              />
            )}
            className="date-picker-container"
          />
        </div>
      </div>
    </LocalizationProvider>
  );
}
