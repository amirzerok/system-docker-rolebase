import React, { useEffect, useMemo, useState } from 'react';
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';

interface Role {
  id: number;
  name: string;
  permissions: Record<string, boolean> | string; // مجوزها می‌توانند به صورت شی یا رشته باشند
  actions?: any; // اضافه کردن کلید actions به اینترفیس
}

const RoleTable: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogRole, setDialogRole] = useState<Role | null>(null);
  const [editedRoleName, setEditedRoleName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://nestjs:3001/users/role');

        // فیلتر کردن نقش‌ها و تبدیل مجوزها به شی (object)
        const filteredRoles = response.data.map((role: Role) => {
          if (typeof role.permissions === 'string') {
            role.permissions = JSON.parse(role.permissions); // تبدیل به شی
          }
          return role;
        }).filter((role: Role) => role.name); // فیلتر کردن نقش‌های بدون نام

        setRoles(filteredRoles);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const columnHelper = createColumnHelper<Role>();

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'نام نقش',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('permissions', {
      header: 'صفحات دسترسی',
      cell: info => {
        const permissions = info.getValue();
        const accessiblePages = Object.entries(permissions).filter(([_, hasAccess]) => hasAccess);

        return (
          <div>
            {accessiblePages.length > 0 ? (
              accessiblePages.map(([page]) => <div key={page}>{page}</div>)
            ) : (
              <div>هیچ دسترسی وجود ندارد</div>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('actions', {
      header: 'عملیات',
      cell: info => (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEditClick(info.row.original)}
          >
            ویرایش
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDeleteClick(info.row.original.id)}
            sx={{ marginLeft: 1 }}
          >
            حذف
          </Button>
        </div>
      ),
    }),
  ], []);

  const handleEditClick = (role: Role) => {
    setEditedRoleName(role.name);
    setDialogRole(role);
    setOpenDialog(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm('آیا از حذف این نقش مطمئن هستید؟')) {
      try {
        await axios.delete(`http://nestjs:3001/users/role/${id}`);
        setRoles(roles.filter(role => role.id !== id));
      } catch (error) {
        console.error('Error deleting role:', error);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogRole(null);
  };

  const handleUpdateRole = async () => {
    if (dialogRole) {
      try {
        await axios.patch(`http://nestjs:3001/users/role/${dialogRole.id}`, {
          name: editedRoleName,
          permissions: dialogRole.permissions, // یا مجوزهای جدید را بفرستید
        });
        setRoles(roles.map(role => (role.id === dialogRole.id ? { ...role, name: editedRoleName } : role)));
        handleCloseDialog();
      } catch (error) {
        console.error('Error updating role:', error);
      }
    }
  };

  const table = useReactTable({
    data: roles,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {roles.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="body1" color="textSecondary">
                    داده‌ای موجود نیست
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>ویرایش نقش</DialogTitle>
        <DialogContent>
          <DialogContentText>
            نام جدید نقش را وارد کنید.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="نام نقش"
            type="text"
            fullWidth
            variant="standard"
            value={editedRoleName}
            onChange={(e) => setEditedRoleName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>لغو</Button>
          <Button onClick={handleUpdateRole}>ذخیره</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoleTable;
