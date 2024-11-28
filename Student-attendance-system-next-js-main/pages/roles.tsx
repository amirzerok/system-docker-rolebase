import React, { useState } from 'react';
import { Checkbox, FormControlLabel, TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { SnackbarCloseReason } from '@mui/material/Snackbar';

const RoleCreationPage: React.FC = () => {
  const [roleName, setRoleName] = useState<string>('');
  const [permissions, setPermissions] = useState({
    viewPlaces: false,
    editPlaces: false,
    deletePlaces: false,
    viewPersons: false,
    editPersons: false,
    deletePersons: false,
    viewRoles: false,
    editRoles: false,
    deleteRoles: false,
  });

  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPermissions({
      ...permissions,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = async () => {
    const newRole = {
      name: roleName,
      permissions: JSON.stringify(permissions),
    };
    
    try {
      const response = await axios.post('http://nestjs:3001/users/role', newRole);
      console.log(response.data);
      setMessage('نقش با موفقیت ایجاد شد.');
      setSeverity('success');
    } catch (error) {
      console.error('Error creating role:', error);
      setMessage('خطا در ایجاد نقش. لطفا دوباره تلاش کنید.');
      setSeverity('error');
    } finally {
      setOpen(true);
    }
  };

  const handleClose = (
    event: React.SyntheticEvent | Event | null,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Box sx={{ maxWidth: '100%', margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        ایجاد نقش جدید
      </Typography>
      <Box sx={{ marginBottom: 3 }}>
        <TextField
          fullWidth
          label="نام نقش"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          margin="normal"
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        {/* بخش اماکن */}
        <Box sx={{ flex: 1, marginRight: 2 }}>
          <Typography variant="h6" gutterBottom>اماکن</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControlLabel
              control={<Checkbox checked={permissions.viewPlaces} onChange={handleCheckboxChange} name="viewPlaces" />}
              label="مشاهده اماکن"
            />
            <FormControlLabel
              control={<Checkbox checked={permissions.editPlaces} onChange={handleCheckboxChange} name="editPlaces" />}
              label="ایجاد/ویرایش اماکن"
            />
            <FormControlLabel
              control={<Checkbox checked={permissions.deletePlaces} onChange={handleCheckboxChange} name="deletePlaces" />}
              label="حذف اماکن"
            />
          </Box>
        </Box>
        {/* بخش اشخاص */}
        <Box sx={{ flex: 1, marginRight: 2 }}>
          <Typography variant="h6" gutterBottom>اشخاص</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControlLabel
              control={<Checkbox checked={permissions.viewPersons} onChange={handleCheckboxChange} name="viewPersons" />}
              label="مشاهده اشخاص"
            />
            <FormControlLabel
              control={<Checkbox checked={permissions.editPersons} onChange={handleCheckboxChange} name="editPersons" />}
              label="ایجاد/ویرایش اشخاص"
            />
            <FormControlLabel
              control={<Checkbox checked={permissions.deletePersons} onChange={handleCheckboxChange} name="deletePersons" />}
              label="حذف اشخاص"
            />
          </Box>
        </Box>
        {/* بخش نقش‌ها */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>نقش‌ها</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControlLabel
              control={<Checkbox checked={permissions.viewRoles} onChange={handleCheckboxChange} name="viewRoles" />}
              label="مشاهده نقش‌ها"
            />
            <FormControlLabel
              control={<Checkbox checked={permissions.editRoles} onChange={handleCheckboxChange} name="editRoles" />}
              label="ایجاد/ویرایش نقش‌ها"
            />
            <FormControlLabel
              control={<Checkbox checked={permissions.deleteRoles} onChange={handleCheckboxChange} name="deleteRoles" />}
              label="حذف نقش‌ها"
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ width: '100%' }}>
          ارسال
        </Button>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RoleCreationPage;
