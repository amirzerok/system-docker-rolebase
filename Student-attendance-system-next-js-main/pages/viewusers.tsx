import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  permissions: string | Permission[];
}

interface User {
  id: number;
  fullName: string;
  nationalCode: string;
  phoneNumber: string;
  roleId: number;
  role: Role;
}

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]); // وضعیت جدید برای نقش‌ها
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('/api/users'); // آدرس مناسب API را جایگزین کنید
      setUsers(response.data);
    };

    const fetchRoles = async () => {
      const response = await axios.get('http://nestjs:3001/users/role'); // آدرس API نقش‌ها
      setRoles(response.data);
    };

    fetchUsers();
    fetchRoles();
  }, []);

  const toggleEditMode = (id: number) => {
    setEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
    if (editMode[id]) {
      setEditedUser({});
    }
  };

  const handleEditChange = (field: keyof User, value: string | number) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async (id: number) => {
    try {
      await axios.put(`/api/users/${id}`, editedUser);
      setEditMode((prev) => ({ ...prev, [id]: false }));
      setEditedUser({});
      const response = await axios.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error("خطا در به‌روزرسانی کاربر:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("خطا در حذف کاربر:", error);
    }
  };

  const renderPermissions = (permissions: string | Permission[]) => {
    if (typeof permissions === 'string') {
      try {
        const parsedPermissions = JSON.parse(permissions);
        return Object.entries(parsedPermissions).map(([key, value]) => (
          <div key={key}>
            {key}: {value ? 'دارد' : 'ندارد'}
          </div>
        ));
      } catch (error) {
        console.error("خطا در تجزیه مجوزها:", error);
        return <div>خطا در نمایش مجوزها</div>;
      }
    } else if (Array.isArray(permissions)) {
      return permissions.map((permission) => (
        <div key={permission.id}>{permission.name}</div>
      ));
    } else {
      return <div>بدون مجوز</div>;
    }
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>نام کامل</TableCell>
            <TableCell>کد ملی</TableCell>
            <TableCell>شماره تلفن</TableCell>
            <TableCell>نقش</TableCell>
            <TableCell>مجوزها</TableCell>
            <TableCell>عملیات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {editMode[user.id] ? (
                    <TextField
                      value={editedUser.fullName || user.fullName}
                      onChange={(e) => handleEditChange('fullName', e.target.value)}
                    />
                  ) : (
                    user.fullName
                  )}
                </TableCell>
                <TableCell>
                  {editMode[user.id] ? (
                    <TextField
                      value={editedUser.nationalCode || user.nationalCode}
                      onChange={(e) => handleEditChange('nationalCode', e.target.value)}
                    />
                  ) : (
                    user.nationalCode
                  )}
                </TableCell>
                <TableCell>
                  {editMode[user.id] ? (
                    <TextField
                      value={editedUser.phoneNumber || user.phoneNumber}
                      onChange={(e) => handleEditChange('phoneNumber', e.target.value)}
                    />
                  ) : (
                    user.phoneNumber
                  )}
                </TableCell>
                <TableCell>
                  {editMode[user.id] ? (
                    <Select
                      value={editedUser.roleId || user.roleId}
                      onChange={(e) => handleEditChange('roleId', e.target.value)}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    user.role.name
                  )}
                </TableCell>
                <TableCell>
                  {renderPermissions(user.role.permissions)}
                </TableCell>
                <TableCell>
                  {editMode[user.id] ? (
                    <>
                      <Button
                        onClick={() => handleEditSubmit(user.id)}
                        variant="contained"
                        color="primary"
                        sx={{ marginRight: 1 }}
                      >
                        ذخیره
                      </Button>
                      <Button
                        onClick={() => toggleEditMode(user.id)}
                        variant="outlined"
                      >
                        لغو
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => toggleEditMode(user.id)}
                        variant="contained"
                        color="primary"
                        sx={{ marginRight: 2 }}
                      >
                        ویرایش
                      </Button>
                      <Button
                        onClick={() => handleDelete(user.id)}
                        variant="contained"
                        sx={{ backgroundColor: '#FF6F00', color: 'white', marginLeft: 1 }}
                      >
                        حذف
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">هیچ داده‌ای موجود نیست</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersTable;
