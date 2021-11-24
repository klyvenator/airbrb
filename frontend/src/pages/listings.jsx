import { TextField } from '@mui/material';
import React from 'react';
import { TopBanner, NavBar, Container, Content, ListingCard } from './components';
import { myFetch } from './functions';

const ListingsPage = () => {
  const [sortedListings, setListings] = React.useState([]);
  const [copyListing, setCopyListing] = React.useState([]);

  React.useEffect(async () => {
    const response = await myFetch('/listings', 'GET');
    const tempList = [];
    for (const item of response.listings) {
      const detailedItem = await myFetch('/listings/' + item.id, 'GET');
      if (detailedItem.listing.availability.length > 0) {
        detailedItem.listing.id = item.id;
        tempList.push(detailedItem.listing);
      }
    }
    const resp = await myFetch('/bookings', 'GET');
    tempList.sort((a, b) => {
      if (resp.error === undefined) {
        for (const booking of resp.bookings) {
          if (a.id === booking.listingId) {
            return -1;
          }
          if (b.id === booking.listingId) {
            return 1;
          }
        }
        return a.title.localeCompare(b.title);
      } else {
        return a.title.localeCompare(b.title);
      }
    })
    setListings(tempList);
    setCopyListing(tempList);
  }, []);

  const handleChange = (event) => {
    const regex = new RegExp(event.target.value);
    const newList = [];
    if (event.target.value === '') {
      setListings(copyListing);
      return;
    }
    for (const item of copyListing) {
      if (regex.test(item.title) || regex.test(item.address.city)) {
        newList.push(item);
      }
    }
    setListings(newList);
  }

  return (
    <Container>
      <TopBanner text="AirBrb"/>
      <Content direction='column'>
        <TextField label="Search" onChange={handleChange} variant="standard" />
        { sortedListings.map((item, idx) => {
          return (<ListingCard
            item={ item }
            variant='normal'
            key={idx}/>);
        })}
      </Content>
      <NavBar/>
    </Container>
  );
}

export default ListingsPage;
