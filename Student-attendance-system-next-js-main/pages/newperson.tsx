import React, { useState, ChangeEvent } from 'react';
import { TextField, Button, Container, Typography, Paper, Box } from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { GetServerSideProps } from 'next';

interface FormInputs {
  firstName: string;
  lastName: string;
  nationalCode: string;
  studentId: string;
  file: FileList;
}

const NewPersonForm: React.FC = () => {
  const { handleSubmit, control, setError, reset } = useForm<FormInputs>();
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const formData = new FormData();

      if (data.file && data.file.length > 0) {
        formData.append('file', data.file[0]);
      }

      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('nationalCode', data.nationalCode);
      formData.append('studentId', data.studentId);

      const response = await axios.post('/api/new-person', formData);

      if (response.status === 200) {
        console.log('Data saved successfully:', response.data);
        reset();
        setFileName('');
      } else {
        console.error('Failed to save data:', response.statusText);
        setError('firstName', { message: 'Failed to save data' }); // اینجا از یک فیلد معتبر استفاده می‌شود
      }
    } catch (error) {
      console.error('Failed to save data:', error);
      setError('firstName', { message: 'Failed to save data' }); // اینجا هم از یک فیلد معتبر استفاده می‌شود
    }
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
            صفحه شخص جدید
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ marginBottom: '20px' }}>
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="نام"
                  />
                )}
              />
            </Box>
            <Box sx={{ marginBottom: '20px' }}>
              <Controller
                name="lastName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="نام خانوادگی"
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
                name="studentId"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="شماره دانش‌آموزی"
                  />
                )}
              />
            </Box>
            <Box sx={{ marginBottom: '20px' }}>
              <Controller
                name="file"
                control={control}
                render={({ field }) => (
                  <input
                    type="file"
                    onChange={(e) => {
                      field.onChange(e.target.files);
                      handleFileChange(e);
                    }}
                    style={{ display: 'block' }}
                    accept="image/*"
                  />
                )}
              />
              <p>آپلود عکس: {fileName || 'هیچ فایلی انتخاب نشده است'}</p>
            </Box>
            <Button type="submit" fullWidth variant="contained">
              ثبت
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const token = req.headers.cookie ? req.headers.cookie.split('=')[1] : null; // فرض بر این است که توکن به صورت Bearer <token> در هدر ارسال می‌شود

  if (!token) {
    res.writeHead(302, { Location: '/login' });
    res.end();
    return { props: {} };
  }

  // چک کردن توکن با API
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

export default NewPersonForm;
