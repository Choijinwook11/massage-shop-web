import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

function ReservationManagement() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [reservation, setReservation] = useState({
    customerName: '',
    time: '',
    therapist: '',
    massageType: '',
    duration: '',
    memo: '',
  });
  const [reservations, setReservations] = useState([]);

  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = Math.floor((i + 9) / 2);
    const minute = (i + 9) % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const massageTypes = ['스웨디시', '아로마', '활법', '지압', '발마사지', '스포츠'];
  const durations = ['30분', '60분', '90분', '120분', '150분', '180분'];

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // TODO: Implement reservation submission
    const newReservation = {
      id: Date.now(),
      ...reservation,
      date: selectedDate,
    };
    setReservations((prev) => [...prev, newReservation]);
    handleCloseDialog();
  };

  const handleDateSelect = (selectInfo) => {
    setSelectedDate(selectInfo.start);
    handleOpenDialog();
  };

  const handleEventClick = (clickInfo) => {
    // TODO: Implement event click handling
    console.log('Event clicked:', clickInfo.event);
  };

  const todayReservations = reservations.filter(
    (r) => format(r.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">예약 관리</Typography>
          <Button variant="contained" onClick={handleOpenDialog}>
            새 예약
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                예약 현황
              </Typography>
              <Box sx={{ height: 600 }}>
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                  }}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  weekends={true}
                  events={reservations.map((r) => ({
                    id: r.id,
                    title: `${r.customerName} - ${r.massageType}`,
                    start: `${format(r.date, 'yyyy-MM-dd')}T${r.time}`,
                    end: `${format(r.date, 'yyyy-MM-dd')}T${r.time}`,
                  }))}
                  select={handleDateSelect}
                  eventClick={handleEventClick}
                  locale="ko"
                  slotMinTime="09:00:00"
                  slotMaxTime="17:00:00"
                  allDaySlot={false}
                />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                오늘의 예약
              </Typography>
              <List>
                {todayReservations.map((reservation) => (
                  <React.Fragment key={reservation.id}>
                    <ListItem>
                      <ListItemText
                        primary={`${reservation.time} - ${reservation.customerName}`}
                        secondary={`${reservation.massageType} (${reservation.duration})`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
                {todayReservations.length === 0 && (
                  <ListItem>
                    <ListItemText primary="오늘의 예약이 없습니다." />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>새 예약</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="고객명"
                name="customerName"
                value={reservation.customerName}
                onChange={handleInputChange}
                fullWidth
              />
              <DatePicker
                label="예약일"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <TextField
                select
                label="시간"
                name="time"
                value={reservation.time}
                onChange={handleInputChange}
                fullWidth
              >
                {timeSlots.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="관리사"
                name="therapist"
                value={reservation.therapist}
                onChange={handleInputChange}
                fullWidth
              >
                {/* TODO: Add therapist list */}
              </TextField>
              <TextField
                select
                label="마사지 종류"
                name="massageType"
                value={reservation.massageType}
                onChange={handleInputChange}
                fullWidth
              >
                {massageTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="마사지 시간"
                name="duration"
                value={reservation.duration}
                onChange={handleInputChange}
                fullWidth
              >
                {durations.map((duration) => (
                  <MenuItem key={duration} value={duration}>
                    {duration}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="메모"
                name="memo"
                value={reservation.memo}
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
              예약하기
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}

export default ReservationManagement; 