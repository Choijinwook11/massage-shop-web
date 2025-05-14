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

function CustomerManagement() {
  const [openDialog, setOpenDialog] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    birthDate: '',
    joinDate: '',
    memo: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCustomer({
      name: '',
      phone: '',
      birthDate: '',
      joinDate: '',
      memo: '',
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (isEditing) {
      // TODO: Implement customer update
      console.log('Update customer:', { id: editingId, ...customer });
    } else {
      // TODO: Implement customer creation
      console.log('Create customer:', customer);
    }
    handleCloseDialog();
  };

  const handleEdit = (id) => {
    // TODO: Implement customer edit
    const customerToEdit = customers.find((c) => c.id === id);
    if (customerToEdit) {
      setCustomer(customerToEdit);
      setIsEditing(true);
      setEditingId(id);
      setOpenDialog(true);
    }
  };

  const handleDelete = (id) => {
    // TODO: Implement customer deletion
    console.log('Delete customer:', id);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">고객 관리</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          새 고객
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>이름</TableCell>
              <TableCell>전화번호</TableCell>
              <TableCell>생년월일</TableCell>
              <TableCell>가입일</TableCell>
              <TableCell>메모</TableCell>
              <TableCell align="right">관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.birthDate}</TableCell>
                <TableCell>{customer.joinDate}</TableCell>
                <TableCell>{customer.memo}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(customer.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(customer.id)}
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
        <DialogTitle>{isEditing ? '고객 정보 수정' : '새 고객'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="이름"
              name="name"
              value={customer.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              label="전화번호"
              name="phone"
              value={customer.phone}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="생년월일"
              name="birthDate"
              value={customer.birthDate}
              onChange={handleInputChange}
              fullWidth
              placeholder="YY-MM-DD"
            />
            <TextField
              label="가입일"
              name="joinDate"
              value={customer.joinDate}
              onChange={handleInputChange}
              fullWidth
              placeholder="YY-MM-DD"
            />
            <TextField
              label="메모"
              name="memo"
              value={customer.memo}
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

export default CustomerManagement; 