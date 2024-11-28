import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  Link
} from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/router';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface LoginInputs {
  nationalCode: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const { handleSubmit, control, setError, clearErrors } = useForm<LoginInputs>();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/login', data);
      localStorage.setItem('access_token', response.data.access_token);
      setSnackbarSeverity('success');
      setSnackbarMessage('ورود موفقیت‌آمیز بود');
      setSnackbarOpen(true);
      setTimeout(() => {
        setLoading(false);
        router.push('/');
      }, 2000);
    } catch (error: any) {
      setLoading(false);
      setError('nationalCode', { message: 'Login failed' });
      setSnackbarSeverity('error');
      if (error.response && error.response.status === 401) {
        setSnackbarMessage('رمز عبور یا کد ملی اشتباه است');
      } else {
        setSnackbarMessage('مشکلی پیش آمد. دوباره تلاش کنید.');
      }
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleInputChange = () => {
    clearErrors('nationalCode');
    clearErrors('password');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'white',
        }}
      >
        <Typography component="h1" variant="h5">
          ورود
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', marginTop: 1 }}>
          <Box sx={{ marginBottom: '20px' }}>
            <Controller
              name="nationalCode"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="کد ملی"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => {
                    field.onChange(e);
                    handleInputChange();
                  }}
                />
              )}
            />
          </Box>
          <Box sx={{ marginBottom: '20px' }}>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="رمز عبور"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    handleInputChange();
                  }}
                />
              )}
            />
          </Box>
          <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading}>
            ورود
          </Button>
        </form>

        <Link
          href="/register2"
          sx={{ marginTop: 2, textDecoration: 'none', color: 'primary.main', fontSize: '0.875rem' }}
        >
          ثبت‌نام
        </Link>
      </Box>

      <Backdrop
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(10px)',
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: '100%',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            padding: '16px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            '& .MuiAlert-icon': {
              marginRight: '12px',
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginForm;
