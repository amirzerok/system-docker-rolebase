import React, { useState, useRef } from 'react';
import { Container, Box, Paper, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, CircularProgress } from '@mui/material';
import Webcam from 'react-webcam';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/router'; // اضافه کردن useRouter

interface FormInputs {
  fullName: string;
  nationalCode: string;
  phoneNumber: string;
  password: string;
  grade: string;
  major: string;
  roleId: number; // اضافه کردن roleId به اینترفیس
}

const RegisterForm: React.FC = () => {
  const [step, setStep] = useState(1); // مدیریت مراحل
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false); // حالت لودینگ
  const { control, handleSubmit, reset, setError } = useForm<FormInputs>();
  const webcamRef = useRef<any>(null);
  const router = useRouter(); // استفاده از useRouter

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // برای ارسال تصویر به سرور و شناسایی چهره از این تصویر استفاده کنید
    console.log(imageSrc);
    // اینجا می‌توانید درخواست برای شناسایی چهره بفرستید
  };

  const onSubmit = async (data: FormInputs) => {
    const formData = { ...data, roleId: 4 }; // اضافه کردن roleId با مقدار پیش‌فرض 4

    try {
      const response = await axios.post('/api/add-user', formData);
      if (response.status === 200) {
        setMessage('ثبت‌نام با موفقیت انجام شد!');
        setSeverity('success');
        setOpen(true);

        // نمایش لودینگ و سپس هدایت به صفحه لاگین
        setLoading(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000); // تغییر صفحه پس از 3 ثانیه
      } else {
        setMessage('عملیات ثبت‌نام با خطا مواجه شد.');
        setSeverity('error');
        setOpen(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('خطا در ارسال داده‌ها');
      setSeverity('error');
      setOpen(true);
    }
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleBackStep = () => {
    setStep(step - 1);
  };

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ padding: '20px', maxWidth: '400px', width: '100%' }}>
          <Typography component="h1" variant="h5" sx={{ marginBottom: '20px' }}>
            ثبت‌نام
          </Typography>

          {/* مرحله 1: شناسایی چهره با دوربین */}
          {step === 1 && (
            <>
              <Typography variant="h6" sx={{ marginBottom: '20px' }}>
                لطفاً چهره خود را شناسایی کنید
              </Typography>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width="100%"
                videoConstraints={{
                  facingMode: 'user',
                }}
              />
              <Button variant="contained" fullWidth sx={{ marginTop: '20px' }} onClick={handleCapture}>
                شناسایی چهره
              </Button>
              <Button variant="outlined" fullWidth sx={{ marginTop: '10px' }} onClick={handleNextStep}>
                ادامه به مرحله بعد
              </Button>
            </>
          )}

          {/* مرحله 2: ورود اطلاعات */}
          {step === 2 && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ marginBottom: '20px' }}>
                <Controller
                  name="fullName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField {...field} fullWidth label="نام و نام خانوادگی" />
                  )}
                />
              </Box>
              <Box sx={{ marginBottom: '20px' }}>
                <Controller
                  name="nationalCode"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField {...field} fullWidth label="کد ملی" />
                  )}
                />
              </Box>
              <Box sx={{ marginBottom: '20px' }}>
                <Controller
                  name="phoneNumber"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField {...field} fullWidth label="شماره تماس" />
                  )}
                />
              </Box>
              <Box sx={{ marginBottom: '20px' }}>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <TextField {...field} fullWidth label="رمز عبور" type="password" />
                  )}
                />
              </Box>
              <Box sx={{ marginBottom: '20px' }}>
                <FormControl fullWidth>
                  <InputLabel>پایه</InputLabel>
                  <Controller
                    name="grade"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select {...field} label="پایه">
                        <MenuItem value="دهم">دهم</MenuItem>
                        <MenuItem value="یازدهم">یازدهم</MenuItem>
                        <MenuItem value="دوازدهم">دوازدهم</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Box>
              <Box sx={{ marginBottom: '20px' }}>
                <FormControl fullWidth>
                  <InputLabel>رشته</InputLabel>
                  <Controller
                    name="major"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select {...field} label="رشته">
                        <MenuItem value="ماشین ابزار">ماشین ابزار</MenuItem>
                        <MenuItem value="مکاترونیک">مکاترونیک</MenuItem>
                        <MenuItem value="شبکه و نرم افزار">شبکه و نرم افزار</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" onClick={handleBackStep}>بازگشت</Button>
                <Button type="submit" variant="contained">ثبت‌نام</Button>
              </Box>
            </form>
          )}
        </Paper>
      </Box>

      {/* نمایش پیام توست */}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

      {/* لودینگ اسکرین */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <CircularProgress color="inherit" />
        </Box>
      )}
    </Container>
  );
};

export default RegisterForm;
