import React from 'react';
import { TopBanner, Container, NavBar, Content, ListingCarousel, CarouselImage, Line } from './components';
import { Typography, Button, Alert, Snackbar } from '@mui/material';
import { useLocation, useParams } from 'react-router-dom'
import defaultHousePic from '../images/defaulthouse.png'
import { myFetch } from './functions';
import ReviewSection from './reviewsection';

const ListingView = () => {
  const listing = useLocation().state;
  const loggedIn = window.localStorage.getItem('token');
  const { id } = useParams();
  const [price, setPrice] = React.useState();
  const [startDate, setStartDate] = React.useState(listing.availability[0]);
  const [endDate, setEndDate] = React.useState(listing.availability[1]);
  const [booking, setBooking] = React.useState();
  const [alertOpen, setAlertOpen] = React.useState(false);

  React.useEffect(() => {
    calculatePrice();
  }, [startDate, endDate]);

  React.useEffect(async () => {
    if (!loggedIn) {
      return;
    }
    const resp = await myFetch('/bookings', 'GET');
    if (resp.error !== undefined) {
      return;
    }
    for (const item of resp.bookings) {
      if (item.listingId === id) {
        setBooking(item);
      }
    }
  }, [alertOpen]);

  const msToDays = (num) => {
    return num / 1000 / 60 / 60 / 24;
  }

  const calculatePrice = () => {
    const days = msToDays(Date.parse(endDate) - Date.parse(startDate));
    days > 0 ? setPrice('$' + days * listing.price) : setPrice('N/A')
  }

  const handleBook = async () => {
    const resp = await myFetch('/bookings/new/' + id, 'POST', {
      dateRange: { startDate: startDate, endDate: endDate },
      totalPrice: price
    }, id)
    resp.error === undefined ? setAlertOpen(true) : console.log(resp.error);
  }

  const closeAlert = () => {
    setAlertOpen(false);
  }

  const bookingStatus = () => {
    if (!booking) {
      return;
    }
    if (booking.status === 'accepted') {
      return <Alert severity='success'>Booking status: Accepted</Alert>
    } else if (booking.status === 'pending') {
      return <Alert severity='info'>Booking status: Pending</Alert>
    } else {
      return <Alert severity='error'>Booking status: Rejected</Alert>
    }
  }

  return (
    <Container>
      <TopBanner text='Listing Details'/>
      <Content direction='column'>

      {/* Carousel */}
      <ListingCarousel>
        { listing.metadata.images
          ? listing.metadata.images.map((item, idx) => {
              return <CarouselImage src={ item } key={ idx } />
            })
          : <CarouselImage src={ defaultHousePic } />
        }
        </ListingCarousel>
        { bookingStatus() }
        <p/>

        {/* Listing details */}
        <Typography variant="h6"> { listing.title }</Typography>
        <Typography>Address: { listing.address.street + ',' + listing.address.city }</Typography>
        <Typography>Type: { listing.type }</Typography>
        <Typography>Bathrooms: { listing.metadata.bathrooms } </Typography>
        <Typography>Bedrooms: { listing.metadata.beds.length } </Typography>
        <Typography>Number of beds: </Typography>

        <Line />

        {/* Booking section - Date selectors */}
        <Typography variant='h6'>Book: </Typography>
        <br/>
        <Typography>Start date: </Typography>
        <input
            type="date"
            min={listing.availability[0]}
            max={endDate}
            value={startDate}
            onChange={ event => { setStartDate(event.target.value) }}
        /><br/>
        <Typography>End date: </Typography>
        <input
          label="End date"
          type="date"
          min={startDate}
          max={listing.availability[1]}
          value={endDate}
          onChange={ event => { setEndDate(event.target.value) }}
        /><p/>
        <Typography>Price per stay: { price } </Typography>
        <br/>
        {/* Book button */}
        { loggedIn &&
          (price !== 'N/A'
            ? <Button variant='contained' onClick={ handleBook }>Book</Button>
            : <><Alert severity="error">Error - end date must be after start date</Alert>
            <Button variant='contained' disabled>Book</Button></>) }

        <Line />
        <ReviewSection listingId={ id } booking={ booking } />
        {/* Transient alert pop up */}
        <Snackbar open={ alertOpen } autoHideDuration={1500} onClose={closeAlert} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}><Alert severity='success'>Request sent successfully</Alert></Snackbar>
      </Content>
      <NavBar/>
    </Container>
  )
}

export default ListingView;
