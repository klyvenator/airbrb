import React from 'react';
import { TopBanner, Container, NavBar, Content, ListingCard } from './components';
import {
  Link,
} from 'react-router-dom';
import { BACKEND_PORT } from '../config';

const YourListingsPage = () => {
  const [listings, setListings] = React.useState([]);
  const header = {
    headers: { 'Content-Type': 'application/json' }
  }
  React.useEffect(async () => {
    const response = await fetch('http://localhost:' + BACKEND_PORT + '/listings', header);
    const json = await response.json();
    filterListings(json.listings);
  }, []);

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
      const response = await fetch('http://localhost:' + BACKEND_PORT + '/listings/' + id, header);
      const json = await response.json();
      json.listing.id = id;
      list2.push(json.listing);
    }
    setListings(list2);
  }

  return (
    <Container>
      <TopBanner text='Your Listings'/>
      <Content direction='column'>
      <Link to='/newlisting'>Add new listing</Link>
      { listings.map((item, idx) => {
        return (<ListingCard
                  item={ item }
                  variant='owner'
                  key={idx}/>);
      })}
      </Content>
      <NavBar/>
    </Container>
  )
}
export default YourListingsPage;
