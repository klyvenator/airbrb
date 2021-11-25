import React from 'react';
import { TopBanner, Container, NavBar, Content, ListingCard, MyAlert } from './components';
import {
  Link,
} from 'react-router-dom';
import { Button } from '@mui/material';
import { myFetch } from './functions';

const YourListingsPage = () => {
  const [listings, setListings] = React.useState([]);
  const [alert, setAlert] = React.useState();

  React.useEffect(async () => {
    const resp = await myFetch('/listings', 'GET');
    filterListings(resp.listings);
  }, [alert]);

  async function filterListings (array) {
    const owner = window.localStorage.getItem('email');
    const list = [];
    for (const listing of array) {
      if (listing.owner === owner) {
        list.push(listing.id);
      }
    }
    const list2 = [];
    for (const id of list) {
      const response = await myFetch('/listings/' + id, 'GET');
      response.listing.id = id;
      list2.push(response.listing);
    }
    setListings(list2);
  }

  return (
    <Container>
      <TopBanner text='Your Listings'/>
      <Content direction='column'>
      { alert && <MyAlert title={ alert.title } severity={ alert.severity } text={ alert.text }></MyAlert> }
      <p/>
      <Link to='/newlisting'><Button variant='contained'>Add new listing</Button></Link>
      { listings && listings.map((item, idx) => {
        return (<ListingCard
                  item={ item }
                  variant='owner'
                  setAlert={ setAlert }
                  key={idx}/>);
      })}
      </Content>
      <NavBar/>
    </Container>
  )
}
export default YourListingsPage;
