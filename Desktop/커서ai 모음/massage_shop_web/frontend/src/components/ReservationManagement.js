import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Grid,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

function ReservationManagement() {
  const [reservations, setReservations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    customer_id: '',
    reservation_date: '',
    start_time: '',
    therapist: '',
    massage_type: '',
    massage_duration: '',
    designation: '',
    memo: '',
  });

  const massageTypes = ['스웨디시', '아로마', '활법', '지압', '발마사지', '스포츠'];
  const durations = ['30분', '60분', '90분', '120분', '150분', '180분'];
  const designations = ['지명', '남자', '여자', '신규'];

  useEffect(() => {
    fetchReservations();
    fetchCustomers();
    fetchTherapists();
  }, [selectedDate]);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reservations?date=${selectedDate.toISOString().split('T')[0]}`);
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchTherapists = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/therapists');
      setTherapists(response.data);
    } catch (error) {
      console.error('Error fetching therapists:', error);
    }
  };

  const handleOpen = (reservation = null) => {
    if (reservation) {
      setEditingReservation(reservation);
      setFormData(reservation);
    } else {
      setEditingReservation(null);
      setFormData({
        customer_id: '',
        reservation_date: selectedDate.toISOString().split('T')[0],
        start_time: '',
        therapist: '',
        massage_type: '',
        massage_duration: '',
        designation: '',
        memo: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingReservation(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReservation) {
        await axios.put(`http://localhost:5000/api/reservations/${editingReservation.id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/reservations', formData);
      }
      fetchReservations();
      handleClose();
    } catch (error) {
      console.error('Error saving reservation:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 예약을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:5000/api/reservations/${id}`);
        fetchReservations();
      } catch (error) {
        console.error('Error deleting reservation:', error);
      }
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="날짜 선택"
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={() => handleOpen()}>
              새 예약 추가
            </Button>
          </Grid>
        </Grid>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>고객명</TableCell>
              <TableCell>시작시간</TableCell>
              <TableCell>관리사</TableCell>
              <TableCell>마사지 종류</TableCell>
              <TableCell>마사지 시간</TableCell>
              <TableCell>지명</TableCell>
              <TableCell>메모</TableCell>
              <TableCell>작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.customer_name}</TableCell>
                <TableCell>{reservation.start_time}</TableCell>
                <TableCell>{reservation.therapist}</TableCell>
                <TableCell>{reservation.massage_type}</TableCell>
                <TableCell>{reservation.massage_duration}</TableCell>
                <TableCell>{reservation.designation}</TableCell>
                <TableCell>{reservation.memo}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(reservation)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(reservation.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingReservation ? '예약 수정' : '새 예약 추가'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="고객"
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  required
                >
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="시작시간"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="관리사"
                  value={formData.therapist}
                  onChange={(e) => setFormData({ ...formData, therapist: e.target.value })}
                  required
                >
                  {therapists.map((therapist) => (
                    <MenuItem key={therapist.id} value={therapist.name}>
                      {therapist.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="마사지 종류"
                  value={formData.massage_type}
                  onChange={(e) => setFormData({ ...formData, massage_type: e.target.value })}
                  required
                >
                  {massageTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="마사지 시간"
                  value={formData.massage_duration}
                  onChange={(e) => setFormData({ ...formData, massage_duration: e.target.value })}
                  required
                >
                  {durations.map((duration) => (
                    <MenuItem key={duration} value={duration}>
                      {duration}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="지명"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                >
                  {designations.map((designation) => (
                    <MenuItem key={designation} value={designation}>
                      {designation}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="메모"
                  value={formData.memo}
                  onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ReservationManagement; 