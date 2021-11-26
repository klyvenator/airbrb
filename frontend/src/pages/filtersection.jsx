import React from 'react';
import PropTypes from 'prop-types'
import { Slider, InputLabel, TextField, Typography, Button } from '@mui/material';
import { isNumber, avgReview } from './functions';
import styled from 'styled-components';

const SortDiv = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const Box = styled.div`
  border: 1px solid #23395B;
  margin-bottom: 10px;
  width: 80%;
  padding-left: 20px;
  padding-bottom: 10px;
`;

const DateDiv = styled.div`
  margin-top: '20px'
  padding-top: '20px'
`
const MyLink = styled.a`
  color: #CBF7ED;
  margin-left: 10px;
  margin-right: 10px;
  &:hover {
    cursor: pointer;
  }
`

const FilterSortSection = ({ setListings, listings, bookedListings, setBookedListings, setAlert, setStartDate, setEndDate, startDate, endDate }) => {
  const [search, setSearch] = React.useState();
  const [copyListing, setCopyListing] = React.useState();
  const [bookedCopy, setBookedCopy] = React.useState();
  const [numBeds, setNumBeds] = React.useState([0, 20]);
  const [minPrice, setMinPrice] = React.useState(Number.MIN_SAFE_INTEGER);
  const [maxPrice, setMaxPrice] = React.useState(Number.MAX_SAFE_INTEGER);
  const [sortRatings, setSortRatings] = React.useState();

  React.useState(() => {
    setCopyListing(listings);
    setBookedCopy(bookedListings);
  }, []);

  const applyFilters = () => {
    let bookList = searchFilter(bookedCopy, 'booked');
    let regList = searchFilter(copyListing, 'regular');
    bookList = priceFilter(bookList);
    regList = priceFilter(regList);
    bookList = dateFilter(bookList);
    regList = dateFilter(regList);
    bookList = bedFilter(bookList);
    regList = bedFilter(regList);
    if (sortRatings !== undefined) {
      regList.sort(sortFunction);
      bookList.sort(sortFunction);
    }
    setBookedListings(bookList);
    setListings(regList);
  }

  const sortFunction = (a, b) => {
    const averageA = avgReview(a.reviews);
    const averageB = avgReview(b.reviews);
    let returnValue;
    if (averageA < averageB) {
      returnValue = -1;
    } else if (averageB < averageA) {
      returnValue = 1;
    } else {
      returnValue = 0;
    }
    if (sortRatings === 'Descending') {
      returnValue *= -1;
    }

    return returnValue;
  }

  const dateFilter = (list) => {
    const newList = [];
    for (const date of list) {
      for (let i = 0; i < date.availability.length; i += 2) {
        if (Date.parse(startDate) >= Date.parse(date.availability[i]) &&
          Date.parse(endDate) <= Date.parse(date.availability[i + 1])) {
          newList.push(date);
          break;
        }
      }
    }
    return newList;
  }

  const bedFilter = (list) => {
    const newList = [];
    let numberBeds = 0;
    for (const listing of list) {
      for (const beds of listing.metadata.beds) {
        numberBeds += beds;
      }
      if (numberBeds >= numBeds[0] && numberBeds <= numBeds[1]) {
        newList.push(listing);
      }
      numberBeds = 0;
    }
    return newList;
  }

  const priceFilter = (list) => {
    const newList = [];
    for (const item of list) {
      if (minPrice < parseInt(item.price) && maxPrice > parseInt(item.price)) {
        newList.push(item);
      }
    }
    return newList;
  }

  const searchFilter = (list, type) => {
    const regex = new RegExp(search);
    if (search === '') {
      if (type === 'booked') {
        return bookedCopy;
      } else {
        return copyListing;
      }
    }
    const newList = [];
    for (const item of list) {
      if (regex.test(item.title) || regex.test(item.address.city)) {
        newList.push(item);
      }
    }
    return newList;
  }

  const setMax = (e) => {
    if (e.target.value === undefined) {
      setMaxPrice(Number.MAX_SAFE_INTEGER);
    } else if (!isNumber(e.target.value)) {
      setAlert({ title: 'Error', text: 'Error please only enter numbers', severity: 'error' })
      return;
    } else {
      setMaxPrice(e.target.value);
    }
    setAlert();
  }
  const setMin = (e) => {
    if (e.target.value === undefined) {
      setMinPrice(Number.MIN_SAFE_INTEGER);
    } else if (!isNumber(e.target.value)) {
      setAlert({ title: 'Error', text: 'Error please only enter numbers', severity: 'error' })
      return;
    } else {
      setMinPrice(e.target.value);
    }
    setAlert();
  }
  return (
    <Box>
      <TextField label="Search" onChange={ (e) => { setSearch(e.target.value) }} variant="standard" />
      <br/><InputLabel >Number of beds: </InputLabel>
      <Slider
        getAriaLabel={() => 'Number of beds'}
        defaultValue={ [0, 20] }
        steps={ 1 }
        min={ 0 }
        max={ 20 }
        valueLabelDisplay="auto"
        sx={{ width: '300px' }}
        marks={[{ value: 0, label: '0' }, { value: 20, label: '20' }]}
        onChange={(e) => { setNumBeds(e.target.value) }}
      />
      <div>
        <TextField label='Min price' sx={{ width: '100px', marginRight: '20px' }} onChange={ setMin }/>
        <TextField sx={{ width: '100px' }} label='Max price' onChange={ setMax }/>
        </div>
      <br/>
      <DateDiv>
        <TextField
          label={ 'Start date' }
          type="date"
          defaultValue={ '2021-11-15' }
          sx= {{ width: '170px', marginRight: '10px' }}
          onChange={(e) => { setStartDate(e.target.value) }}
        />
        <TextField
          label={ 'End date' }
          type="date"
          defaultValue={ '2021-11-15' }
          sx= {{ width: '170px' }}
          onChange={(e) => { setEndDate(e.target.value) }}
        />
      </DateDiv>
      <SortDiv>
        <Typography >Sort by ratings:</Typography>
        <MyLink onClick={() => { setSortRatings('Ascending') }}>Ascending</MyLink>|<MyLink onClick={() => { setSortRatings('Descending') }}>Descending</MyLink>
      </SortDiv>
      <Button variant='contained' onClick={ applyFilters }>Apply filters</Button>
    </Box>
  );
}

FilterSortSection.propTypes = {
  listings: PropTypes.array,
  setListings: PropTypes.function,
  bookedListings: PropTypes.array,
  setBookedListings: PropTypes.function,
  setAlert: PropTypes.function,
  setStartDate: PropTypes.function,
  setEndDate: PropTypes.function,
  startDate: PropTypes.string,
  endDate: PropTypes.string
}

export default FilterSortSection;
