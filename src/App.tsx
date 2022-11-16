import { useRoutes } from 'react-router-dom';
import router from 'src/router';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { CssBaseline } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import {AuthProvider} from './contexts/JWTAuthContext';
import 'bootstrap/dist/css/bootstrap.css';
import './common/scss/common.scss';

function App() {
  const content = useRoutes(router)
  
  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <AuthProvider>{content}</AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
export default App;
