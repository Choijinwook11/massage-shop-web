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
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

function TherapistManagement() {
  const [therapists, setTherapists] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phone: '',
    status: '',
    memo: '',
  });

  const genders = ['남', '여'];
  const statuses = ['재직', '휴직', '퇴사'];

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/therapists');
      setTherapists(response.data);
    } catch (error) {
      console.error('Error fetching therapists:', error);
    }
  };

  const handleOpen = (therapist = null) => {
    if (therapist) {
      setEditingTherapist(therapist);
      setFormData(therapist);
    } else {
      setEditingTherapist(null);
      setFormData({
        name: '',
        gender: '',
        phone: '',
        status: '재직',
        memo: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTherapist(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTherapist) {
        await axios.put(`http://localhost:5000/api/therapists/${editingTherapist.id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/therapists', formData);
      }
      fetchTherapists();
      handleClose();
    } catch (error) {
      console.error('Error saving therapist:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 관리사를 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:5000/api/therapists/${id}`);
        fetchTherapists();
      } catch (error) {
        console.error('Error deleting therapist:', error);
      }
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          새 관리사 추가
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>이름</TableCell>
              <TableCell>성별</TableCell>
              <TableCell>전화번호</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>메모</TableCell>
              <TableCell>작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {therapists.map((therapist) => (
              <TableRow key={therapist.id}>
                <TableCell>{therapist.name}</TableCell>
                <TableCell>{therapist.gender}</TableCell>
                <TableCell>{therapist.phone}</TableCell>
                <TableCell>{therapist.status}</TableCell>
                <TableCell>{therapist.memo}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(therapist)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(therapist.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTherapist ? '관리사 정보 수정' : '새 관리사 추가'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="이름"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="성별"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  required
                >
                  {genders.map((gender) => (
                    <MenuItem key={gender} value={gender}>
                      {gender}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="전화번호"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="상태"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
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

export default TherapistManagement; 