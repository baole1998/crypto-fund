import * as React from 'react'
import viLocale from 'date-fns/locale/vi'
import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

export default function ItemDateTime(props) {
    const { startDate, setStartDate, endDate,setEndDate,} = props;
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>
            <div className="d-flex align-items-center">
                <div>
                    <DatePicker
                        mask={'__/__/____'}
                        value={startDate}
                        onChange={(newValue) => setStartDate('from_date',newValue)}
                        renderInput={(params) => <TextField size="small" {...params} />}
                    />
                </div>
                <div style={{ margin: '0px 10px'}}> - </div>
                <div>
                    <DatePicker
                        mask={'__/__/____'}
                        value={endDate}
                        minDate={startDate}
                        onChange={(newValue) => setEndDate('to_date',newValue)}
                        renderInput={(params) => <TextField size="small" {...params} />}
                    />
                </div>
            </div>
        </LocalizationProvider>
    )
}
