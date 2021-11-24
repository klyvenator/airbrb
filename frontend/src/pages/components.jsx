import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types'
import { Card, CardContent, Typography, Button, TextField, Rating } from '@mui/material';
import defaultHousePic from '../images/defaulthouse.png'
import {
  Link,
  useNavigate,
} from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import { myFetch } from './functions';

export const CarouselImage = styled.img`
  height: 250px;
  width: 350px;
`
export const ListingCarousel = styled(Carousel)`
  margin-top: 20px;
  width: 350px;
`

const BannerDiv = styled.div`
  height: 30px;
  background-color: #23395B;
  color: #CBF7ED;
  display: flex;
  justify-content: center;
  align-items: center;
`
export const TopBanner = ({ text }) => {
  return <BannerDiv><h1>{ text }</h1></BannerDiv>;
}
TopBanner.propTypes = {
  text: PropTypes.string
}

const FooterDiv = styled.div`
  height: 30px;
  background-color: #23395B;
  color: #CBF7ED;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-self: flex-end;
  margin-top: 20px;
  `
export const NavBar = () => {
  return (
    <FooterDiv>{window.localStorage.getItem('token') === null
      ? (<div><Link to="/">Home</Link>&nbsp;
        <Link to="/login">Login</Link>&nbsp;
        <Link to="/register">Register</Link></div>)
      : (<div><Link to="/">Home</Link>&nbsp;
        <Link to="/logout">Logout</Link>&nbsp;
        <Link to="/yourlistings">Your Listings</Link></div>)}
    </FooterDiv>
  )
}

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  justify-self: center;
  justify-content: center;
  margin-top: 10px;
`
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #406E8E;
  color: #161925;
`
export const Content = styled.div`
  display: flex;
  min-height: calc(100vh - 60px);
  justify-content: ${props => props.direction === 'column' ? 'flex-start' : 'center'};
  align-items: ${props => props.direction === 'column' ? 'center' : 'flex-start'};
  flex-direction: ${props => props.direction};
`

const Thumbnail = styled.img`
  width: 150px;
  height: 100px;
`
const ClickableCard = styled(Card)`
  &:hover {
    background-color: #CBF7ED;
    cursor: pointer;
  }
`

export const ListingCard = ({ item, variant }) => {
  const id = item.id.toString();
  const navigate = useNavigate();
  let numBeds = 0;
  for (const i of item.metadata.beds) {
    numBeds += parseInt(i);
  }
  const cardFunctions = () => {
    let returnValue;
    if (variant === 'owner' && item.availability.length === 0) {
      returnValue = <><Button onClick={ (e) => { e.stopPropagation(); navigate('/listing/edit/' + id) } }>Edit</Button>
      <Button onClick={ (e) => { e.stopPropagation(); navigate('/listing/publish/' + id.toString()) } }>Publish</Button></>;
    } else if (variant === 'owner') {
      returnValue = <><Button onClick={ (e) => { e.stopPropagation(); navigate('/listing/edit/' + id) } }>Edit</Button>
      <Button onClick={ (e) => { e.stopPropagation(); navigate('/listing/unpublish/' + id.toString()) } }>Unpublish</Button></>;
    } else {
      returnValue = <></>;
    }
    return returnValue;
  }

  const handleCardClick = () => {
    if (variant === 'owner') {
      navigate('/listing/bookings/' + id, { state: item });
    } else {
      navigate('/listing/' + id, { state: item });
    }
  }

  return (
    <ClickableCard onClick={ handleCardClick } sx={{ minWidth: 400, display: 'flex', flexDirection: 'row', marginTop: '10px' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <Thumbnail src={ item.thumbnail === 'default' ? defaultHousePic : item.thumbnail }/>
        { cardFunctions() }
      </CardContent>
      <CardContent>
        <Typography>{ item.title }</Typography>
        <Typography>Type: { item.metadata.type } </Typography>
        <Typography>Beds: { numBeds } </Typography>
        <Typography>Bathrooms: { item.metadata.bathrooms }</Typography>
        <Typography>Rating: { item.rating }</Typography>
        <Typography>Total reviews: { item.reviewNums }</Typography>
        <Typography>Price: { item.price }</Typography>
        { item.availability.length > 0 ? <Typography>Available from: { item.availability[0] } to { item.availability[1] } </Typography> : <></> }
      </CardContent>
    </ClickableCard>
  )
}
ListingCard.propTypes = {
  item: PropTypes.object,
  variant: PropTypes.string
}

export const TextArea = ({ onChange }) => {
  return <TextField multiline={true} onChange={ onChange } sx={{ width: '350px', minHeight: '80px' }}/>
}
TextArea.propTypes = {
  onChange: PropTypes.func
}

export const ReviewCard = ({ rating, comment }) => {
  return (
    <Card sx={{ width: '95%', marginTop: '10px' }}>
      <CardContent>
      <Rating value={rating} readOnly /><br/>
        { comment }
      </CardContent>
    </Card>
  )
}
ReviewCard.propTypes = {
  rating: PropTypes.number,
  comment: PropTypes.string
}

export const Line = styled.hr`
  width: 90%;
  margin-top: 20px;
  border: 1px solid #23395B;
  background-color: #23395B;
`
export const BookingCard = ({ booking, reload, daysBooked }) => {
  const handleClick = async (event) => {
    event.stopPropagation();
    let url;
    if (event.target.id === 'accept') {
      url = '/bookings/accept/' + booking.id;
    } else {
      url = '/bookings/decline/' + booking.id;
    }
    const resp = await myFetch(url, 'PUT');
    if (resp.error === undefined) {
      const item = daysBooked + 1;
      reload(item);
    } else {
      alert(resp.error);
    }
  }

  return (
    <Card sx={{ marginTop: '10px' }}>
      <CardContent>
        <Typography>Requester: { booking.owner }</Typography>
        <Typography>Start date: { booking.dateRange.startDate }</Typography>
        <Typography>End date: { booking.dateRange.endDate }</Typography>
        <Typography>Total Price: ${ booking.totalPrice }</Typography>
        <Typography>Status: { booking.status } </Typography>
      </CardContent>
      { booking.status === 'pending' &&
        <CardContent>
          <Button id='accept' onClick={ handleClick }>Accept</Button>
          <Button id='reject' onClick={ handleClick }>Reject</Button>
        </CardContent>
      }
    </Card>
  )
}
BookingCard.propTypes = {
  booking: PropTypes.object,
  reload: PropTypes.function,
  daysBooked: PropTypes.number
}
