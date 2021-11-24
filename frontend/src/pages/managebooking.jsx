import React from 'react';
import { Content, NavBar, TopBanner, Container, Line, BookingCard } from './components';
import { daysBetween, myFetch } from './functions';
import { Typography } from '@mui/material';
import { useLocation } from 'react-router-dom'

const ManageBookingsPage = () => {
  const listing = useLocation().state;
  const [daysOnline, setDaysOnline] = React.useState();
  const [pending, setPending] = React.useState();
  const [nonPending, setNonPending] = React.useState();
  const [profitYear, setProfitYear] = React.useState();
  const [daysBooked, setDaysBooked] = React.useState();

  React.useEffect(async () => {
    const days = daysBetween(Date.parse(listing.postedOn), Date.now());
    setDaysOnline(Math.round(days));
    const resp = await myFetch('/bookings', 'GET');
    if (resp.error === undefined) {
      const pendingList = [];
      const nonPendingList = [];
      for (const booking of resp.bookings) {
        if (parseInt(booking.listingId) === listing.id) {
          booking.status === 'pending' ? pendingList.push(booking) : nonPendingList.push(booking);
        }
      }
      setPending(pendingList);
      setNonPending(nonPendingList);
      calcBooked(nonPendingList);
    } else {
      alert(resp.error);
    }
  }, [daysBooked]);

  const calcBooked = (list) => {
    let days = 0;
    let profit = 0;
    for (const booking of list) {
      if (booking.status === 'accepted') {
        const startDate = Date.parse(booking.dateRange.startDate);
        const endDate = Date.parse(booking.dateRange.endDate);
        days += daysBetween(startDate, endDate);
        profit += booking.totalPrice;
      }
    }
    setDaysBooked(Math.round(days));
    setProfitYear(profit);
  }

  return (
    <Container>
      <TopBanner text='Manage Bookings'/>
      <Content direction='column'>
        <Typography variant='h6'>Summary: </Typography>
        <Typography>Days online: { daysOnline } </Typography>
        <Typography>Number of days booked this year: { daysBooked } </Typography>
        <Typography>Profit this year: ${ profitYear }</Typography>
        <Line />
        <Typography variant='h6'>Pending requests: </Typography>
        { pending && pending.length > 0 && pending.map((booking, idx) => {
          return <BookingCard booking={ booking } key={ idx } reload={ setDaysBooked } days={ daysBooked } />
        })}
        <Line />
        <Typography variant='h6'>Booking History: </Typography>
        { nonPending && nonPending.length > 0 && nonPending.map((booking, idx) => {
          return <BookingCard booking={ booking } key={ idx } reload={ setDaysBooked } days={ daysBooked } />
        })}
      </Content>
      <NavBar/>
    </Container>
  )
}

export default ManageBookingsPage;
