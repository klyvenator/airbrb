import React from 'react';
import { TopBanner, NavBar, Container, Content, ListingCard, MyAlert } from './components';
import { myFetch } from './functions';
import { Button, Typography } from '@mui/material';
import FilterSortSection from './filtersection';

const ListingsPage = () => {
  const [listings, setListings] = React.useState([]);
  const [alert, setAlert] = React.useState();
  const [openSearch, setOpenSearch] = React.useState(false);
  const [bookedListings, setBookedListings] = React.useState();
  const [startDate, setStartDate] = React.useState();
  const [endDate, setEndDate] = React.useState();
  const email = window.localStorage.getItem('email');

  React.useEffect(async () => {
    const tempList = [];
    const tempBookedList = [];

    const respListings = await myFetch('/listings', 'GET');
    const respBookings = await myFetch('/bookings', 'GET');

    for (const item of respListings.listings) {
      const detailedItem = await myFetch('/listings/' + item.id, 'GET');
      if (detailedItem.listing.availability.length > 0) {
        detailedItem.listing.id = item.id;
        let booked = false;
        if (respBookings.bookings) {
          for (const booking of respBookings.bookings) {
            if (booking.owner === email &&
                parseInt(booking.listingId) === item.id &&
                (booking.status === 'pending' ||
                booking.status === 'accepted')) {
              tempBookedList.push(detailedItem.listing);
              booked = true;
            }
          }
        }
        !booked && tempList.push(detailedItem.listing);
        booked = false;
      }
    }
    tempList.sort(sortListings);
    tempBookedList.sort(sortListings);
    setListings(tempList);
    setBookedListings(tempBookedList);
  }, []);

  const sortListings = (a, b) => {
    return a.title.localeCompare(b.title);
  }

  return (
    <Container>
      <TopBanner text="AirBrb"/>
      <Content direction='column'>
        { alert && <MyAlert title={ alert.title } severity={ alert.severity } text={ alert.text }></MyAlert> }
        <Button variant='contained' onClick={ () => { setOpenSearch(!openSearch) } }>Search/Filter/Sort</Button>
        { openSearch && <FilterSortSection
                          bookedListings={ bookedListings }
                          setBookedListings={ setBookedListings }
                          listings={ listings }
                          setListings={ setListings }
                          setAlert={ setAlert }
                          setStartDate={ setStartDate }
                          setEndDate={ setEndDate }
                          startDate={ startDate }
                          endDate={ endDate }
                        /> }
        { bookedListings && bookedListings.length > 0 && <Typography>Listings Booked: </Typography> }
        { bookedListings && bookedListings.map((item, idx) => {
          return (<ListingCard
            item={ item }
            variant='normal'
            startDate={ startDate }
            endDate={ endDate }
            key={idx}/>);
        })}
        <Typography>Listings: </Typography>
        { listings && listings.map((item, idx) => {
          return (<ListingCard
            item={ item }
            variant='normal'
            startDate={ startDate }
            endDate={ endDate }
            key={idx}/>);
        })}
      </Content>
      <NavBar/>
    </Container>
  );
}

export default ListingsPage;
