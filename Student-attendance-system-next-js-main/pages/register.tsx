import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';

interface FormInputs {
  fullName: string;
  nationalCode: string;
  phoneNumber: string;
  password: string;
  role: string;
  submit?: string; // فیلد جدید برای خطاهای عمومی
}

const AddUserForm: React.FC = () => {
  const { handleSubmit, control, setError, reset } = useForm<FormInputs>();
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [open, setOpen] = useState(false); // وضعیت باز بودن توست
  const [message, setMessage] = useState(''); // پیام توست
  const [severity, setSeverity] = useState<'success' | 'error'>('success'); // نوع توست

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://nestjs:3001/users/role');
        setRoles(response.data);
      } catch (error) {
        console.error('Failed to fetch roles:', error);
        setError('submit', { message: 'Failed to fetch roles' }); // حالا این خط کار می‌کند
      }
    };

    fetchRoles();
  }, [setError]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const role = roles.find((r) => r.name === data.role);
      if (!role) {
        throw new Error('نقش معتبر نیست');
      }

      const response = await axios.post('/api/add-user', {
        ...data,
        roleId: role.id,
      });

      if (response.status === 200) {
        console.log('Data saved successfully:', response.data);
        reset();
        setMessage('کاربر با موفقیت اضافه شد!'); // پیام موفقیت
        setSeverity('success'); // نوع توست
        setOpen(true); // باز کردن توست
      } else {
        console.error('Failed to save data:', response.statusText);
        setError('submit', { message: 'عملیات ناموفق بود' });
        setMessage('عملیات ناموفق بود'); // پیام خطا
        setSeverity('error'); // نوع توست
        setOpen(true); // باز کردن توست
      }
    } catch (error) {
      console.error('Failed to save data:', error);
      if (axios.isAxiosError(error)) {
        // بررسی اینکه آیا خطا از نوع AxiosError است
        setError('submit', { message: error.response?.data?.message || 'خطا در ارسال داده' });
        setMessage(error.response?.data?.message || 'خطا در ارسال داده'); // پیام خطا
      } else {
        setError('submit', { message: 'خطا در ارسال داده' }); // برای خطاهای دیگر
        setMessage('خطا در ارسال داده'); // پیام خطا
      }
      setSeverity('error'); // نوع توست
      setOpen(true); // باز کردن توست
    }
  };

  const handleClose = () => {
    setOpen(false); // بسته شدن توست
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: '20px', maxWidth: '400px', width: '100%' }}>
          <Typography component="h1" variant="h5" sx={{ marginBottom: '20px' }}>
            افزودن کاربر
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ marginBottom: '20px' }}>
              <Controller
                name="fullName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="نام و نام خانوادگی"
                  />
                )}
              />
            </Box>
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
                  />
                )}
              />
            </Box>
            <Box sx={{ marginBottom: '20px' }}>
              <Controller
                name="phoneNumber"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="شماره تماس"
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
                    type="password"
                  />
                )}
              />
            </Box>
            <Box sx={{ marginBottom: '20px' }}>
              <FormControl fullWidth>
                <InputLabel>نقش</InputLabel>
                <Controller
                  name="role"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="نقش"
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Box>
            <Button type="submit" fullWidth variant="contained">
              ثبت
            </Button>
          </form>
        </Paper>
      </Box>

      {/* توست برای نمایش پیام */}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const token = req.headers.cookie ? req.headers.cookie.split('=')[1] : null;

  if (!token) {
    res.writeHead(302, { Location: '/login' });
    res.end();
    return { props: {} };
  }

  const response = await fetch(`/api/validateToken`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 403) {
    res.writeHead(302, { Location: '/403' });
    res.end();
    return { props: {} };
  }

  if (!response.ok) {
    res.writeHead(302, { Location: '/login' });
    res.end();
    return { props: {} };
  }

  return {
    props: {},
  };
};

export default AddUserForm;
