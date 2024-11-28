import React, { useEffect, useState } from 'react';
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
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface Location {
  id: number;
  title: string;
  representative: string;
  grade: string;
  major: string;
}

const grades = ['دهم', 'یازدهم', 'دوازدهم'];
const majors = ['ماشین ابزار', 'مکاترونیک', 'شبکه و نرم‌افزار'];

const LocationsTable: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openSaveDialog, setOpenSaveDialog] = useState<boolean>(false);
  const [locationToDelete, setLocationToDelete] = useState<number | null>(null);
  const [locationToSave, setLocationToSave] = useState<number | null>(null);

  // بارگذاری اطلاعات از API
  const fetchLocations = async () => {
    try {
      const response = await fetch('http://nestjs:3001/locations');
      if (!response.ok) {
        throw new Error('خطا در دریافت مکان‌ها');
      }
      const data = await response.json();
      setLocations(data);
    } catch (error) {
      console.error('خطا در ارتباط با سرور:', error);
    }
  };

  useEffect(() => {
    fetchLocations(); // بارگذاری داده‌ها هنگام بارگذاری کامپوننت
  }, []);

  const toggleEditMode = (id: number) => {
    setEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInputChange = (field: keyof Location, value: string, id: number) => {
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id === id ? { ...loc, [field]: value } : loc
      )
    );
  };

  const handleDeleteOpen = (id: number) => {
    setLocationToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteClose = () => {
    setLocationToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleSaveOpen = (id: number) => {
    setLocationToSave(id);
    setOpenSaveDialog(true);
  };

  const handleSaveClose = () => {
    setLocationToSave(null);
    setOpenSaveDialog(false);
  };

  const confirmDelete = async () => {
    if (locationToDelete) {
      try {
        const response = await fetch(`http://nestjs:3001/locations/${locationToDelete}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('خطا در حذف مکان');
        }
        setLocations(locations.filter((loc) => loc.id !== locationToDelete));
      } catch (error) {
        console.error('خطا در ارتباط با سرور:', error);
      }
      handleDeleteClose();
    }
  };

  const confirmSave = async () => {
    if (locationToSave !== null) {
      const updatedLocation = locations.find(loc => loc.id === locationToSave);
      if (updatedLocation) {
        try {
          const response = await fetch(`http://nestjs:3001/locations/${locationToSave}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedLocation),
          });
          if (!response.ok) {
            throw new Error('خطا در به‌روزرسانی مکان');
          }
          toggleEditMode(locationToSave); // خروج از حالت ویرایش
        } catch (error) {
          console.error('خطا در ارتباط با سرور:', error);
        }
      }
      handleSaveClose();
    }
  };

  return (
    <Container>
      <TableContainer sx={{ borderRadius: 2, backgroundColor: 'white', overflow: 'auto', width: '100%' }}>
        <Table sx={{ borderSpacing: '0 15px', width: '100%' }}> {/*  فقط از width: '100%' استفاده کنید و minWidth را حذف کنید */}
          <TableHead>
            <TableRow>
              <TableCell>عنوان</TableCell>
              <TableCell>نماینده</TableCell>
              <TableCell>پایه</TableCell>
              <TableCell>رشته</TableCell>
              <TableCell>عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.length > 0 ? (
              locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>
                    {editMode[location.id] ? (
                      <TextField
                        value={location.title}
                        onChange={(e) => handleInputChange('title', e.target.value, location.id)}
                        fullWidth
                      />
                    ) : (
                      location.title
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode[location.id] ? (
                      <TextField
                        value={location.representative}
                        onChange={(e) => handleInputChange('representative', e.target.value, location.id)}
                        fullWidth
                      />
                    ) : (
                      location.representative
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode[location.id] ? (
                      <Select
                        value={location.grade}
                        onChange={(e) => handleInputChange('grade', e.target.value, location.id)}
                        fullWidth
                      >
                        {grades.map((grade) => (
                          <MenuItem key={grade} value={grade}>
                            {grade}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      location.grade
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode[location.id] ? (
                      <Select
                        value={location.major}
                        onChange={(e) => handleInputChange('major', e.target.value, location.id)}
                        fullWidth
                      >
                        {majors.map((major) => (
                          <MenuItem key={major} value={major}>
                            {major}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      location.major
                    )}
                  </TableCell>
                  <TableCell>
                    {editMode[location.id] ? (
                      <>
                        <Button
                          onClick={() => handleSaveOpen(location.id)} // Open save dialog
                          variant="contained"
                          color="success" // Change to green for save
                          sx={{ marginRight: 1 }}
                        >
                          ذخیره
                        </Button>
                        <Button
                          onClick={() => toggleEditMode(location.id)}
                          variant="outlined"
                        >
                          لغو
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => toggleEditMode(location.id)}
                          variant="contained"
                          color="primary"
                          sx={{ marginRight: 2 }}
                        >
                          ویرایش
                        </Button>
                        <Button
                          onClick={() => handleDeleteOpen(location.id)} // Open delete dialog
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
                <TableCell colSpan={5} align="center">
                  هیچ داده‌ای موجود نیست
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog برای تأیید حذف */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteClose}>
        <DialogTitle>تأیید حذف</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا از حذف این مکان مطمئن هستید؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            لغو
          </Button>
          <Button onClick={confirmDelete} sx={{ color: 'red' }}> {/* Change delete button color to red */}
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog برای تأیید ذخیره */}
      <Dialog open={openSaveDialog} onClose={handleSaveClose}>
        <DialogTitle>تأیید ذخیره</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا از ذخیره این تغییرات مطمئن هستید؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveClose} color="primary">
            لغو
          </Button>
          <Button onClick={confirmSave} color="success"> {/* Change save button color to green */}
            تأیید
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LocationsTable;
