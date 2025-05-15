import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

function TherapistManagement() {
  const [openDialog, setOpenDialog] = useState(false);
  const [therapists, setTherapists] = useState([]);
  const [therapist, setTherapist] = useState({
    name: '',
    phone: '',
    birthDate: '',
    joinDate: '',
    specialty: '',
    memo: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTherapist({
      name: '',
      phone: '',
      birthDate: '',
      joinDate: '',
      specialty: '',
      memo: '',
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTherapist((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (isEditing) {
      // TODO: Implement therapist update
      console.log('Update therapist:', { id: editingId, ...therapist });
    } else {
      // TODO: Implement therapist creation
      console.log('Create therapist:', therapist);
    }
    handleCloseDialog();
  };

  const handleEdit = (id) => {
    // TODO: Implement therapist edit
    const therapistToEdit = therapists.find((t) => t.id === id);
    if (therapistToEdit) {
      setTherapist(therapistToEdit);
      setIsEditing(true);
      setEditingId(id);
      setOpenDialog(true);
    }
  };

  const handleDelete = (id) => {
    // TODO: Implement therapist deletion
    console.log('Delete therapist:', id);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">관리사 관리</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          새 관리사
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>이름</TableCell>
              <TableCell>전화번호</TableCell>
              <TableCell>생년월일</TableCell>
              <TableCell>입사일</TableCell>
              <TableCell>전문분야</TableCell>
              <TableCell>메모</TableCell>
              <TableCell align="right">관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {therapists.map((therapist) => (
              <TableRow key={therapist.id}>
                <TableCell>{therapist.name}</TableCell>
                <TableCell>{therapist.phone}</TableCell>
                <TableCell>{therapist.birthDate}</TableCell>
                <TableCell>{therapist.joinDate}</TableCell>
                <TableCell>{therapist.specialty}</TableCell>
                <TableCell>{therapist.memo}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(therapist.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(therapist.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? '관리사 정보 수정' : '새 관리사'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="이름"
              name="name"
              value={therapist.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="전화번호"
              name="phone"
              value={therapist.phone}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="생년월일"
              name="birthDate"
              value={therapist.birthDate}
              onChange={handleInputChange}
              fullWidth
              placeholder="YY-MM-DD"
            />
            <TextField
              label="입사일"
              name="joinDate"
              value={therapist.joinDate}
              onChange={handleInputChange}
              fullWidth
              placeholder="YY-MM-DD"
            />
            <TextField
              label="전문분야"
              name="specialty"
              value={therapist.specialty}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="메모"
              name="memo"
              value={therapist.memo}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEditing ? '수정' : '추가'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TherapistManagement; 