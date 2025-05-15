import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import axios from 'axios';

function ManagementRecord() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/management-records', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
        setError('관리 기록을 불러오는데 실패했습니다.');
      }
    };

    fetchRecords();
  }, []);

  if (error) {
    return (
      <Container>
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        관리 기록
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>날짜</TableCell>
              <TableCell>작업자</TableCell>
              <TableCell>작업 내용</TableCell>
              <TableCell>상세 정보</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{new Date(record.created_at).toLocaleString()}</TableCell>
                <TableCell>{record.user}</TableCell>
                <TableCell>{record.action}</TableCell>
                <TableCell>{record.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default ManagementRecord; 