import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Rating,
  AlertTitle,
  Alert,
  CardMedia,
  CardActions
} from '@mui/material';
import defaultHousePic from '../images/defaulthouse.png'
import {
  Link,
  useNavigate,
} from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import { avgReview, myFetch } from './functions';

export const CarouselImage = styled.img`
  height: 250px;
  width: 350px;
`
export const ListingCarousel = styled(Carousel)`
  margin-top: 20px;
  width: 350px;
`

const BannerDiv = styled.header`
  height: 30px;
  background-color: #23395B;
  color: #CBF7ED;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100vw;
  z-index: 100;
`
export const TopBanner = ({ text }) => {
  return <BannerDiv><h1>{ text }</h1></BannerDiv>;
}
TopBanner.propTypes = {
  text: PropTypes.string
}

const FooterDiv = styled.nav`
  height: 30px;
  background-color: #23395B;
  color: #CBF7ED;
  position: fixed;
  top: calc(100vh - 30px);
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  `
export const NavBar = () => {
  const logout = async () => {
    const resp = await myFetch('/user/auth/logout', 'POST');
    if (resp.error === undefined) {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('email');
    } else {
      alert(resp.error);
    }
  }
  return (
    <FooterDiv>{window.localStorage.getItem('token') === null
      ? (<div><Link to="/">Home</Link>&nbsp;|&nbsp;
        <Link to="/login">Login</Link>&nbsp;|&nbsp;
        <Link to="/register">Register</Link></div>)
      : (<div><Link to="/">Home</Link>&nbsp;|&nbsp;
        <Link to='/' onClick={ logout }>Logout</Link>&nbsp;|&nbsp;
        <Link to="/yourlistings">Your Listings</Link></div>)}
    </FooterDiv>
  )
}

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-self: center;
  justify-self: flex-start;
  justify-content: center;
  width: 320px;
  margin-top: 20px;
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
  min-height: calc(100vh - 200px);
  justify-content: ${props => props.direction === 'column' ? 'flex-start' : 'center'};
  align-items: ${props => props.direction === 'column' ? 'center' : 'flex-start'};
  flex-direction: ${props => props.direction};
  padding-bottom: 80px;
  padding-top: 40px;
`

const ClickableCard = styled(Card)`
  &:hover {
    background-color: #CBF7ED;
    cursor: pointer;
  }
`

export const ListingCard = ({ item, variant, setAlert, startDate, endDate }) => {
  const id = item.id.toString();
  const navigate = useNavigate();
  let numBeds = 0;
  for (const i of item.metadata.beds) {
    numBeds += parseInt(i);
  }
  const cardFunctions = () => {
    let returnValue = <></>;
    if (variant === 'owner' && item.availability.length === 0) {
      returnValue =
      <>
        <Button onClick={ (e) => { e.stopPropagation(); navigate('/listing/edit/' + id) } }>Edit</Button>
        <Button onClick={ (e) => { e.stopPropagation(); navigate('/listing/publish/' + id.toString()) } }>Publish</Button>
        <Button onClick={ handleDelete }>Delete</Button>
      </>;
    } else if (variant === 'owner') {
      returnValue =
      <>
        <Button onClick={ (e) => { e.stopPropagation(); navigate('/listing/edit/' + id) } }>Edit</Button>
        <Button onClick={ (e) => { e.stopPropagation(); navigate('/listing/unpublish/' + id.toString()) } }>Unpublish</Button>
        <Button onClick={ handleDelete }>Delete</Button>
      </>;
    }
    return returnValue;
  }

  const handleDelete = async (e) => {
    e.stopPropagation();
    const resp = await myFetch('/listings/' + id, 'DELETE');
    if (resp.error !== undefined) {
      setAlert({ title: 'Error', severity: 'error', text: resp.error });
    } else {
      setAlert({ title: 'Success', severity: 'success', text: 'Listing successfully deleted' });
    }
  }

  const handleCardClick = () => {
    if (variant === 'owner') {
      navigate('/listing/bookings/' + id, { state: item });
    } else {
      if (startDate !== undefined) {
        navigate('/listing/' + id, { state: item, startDate: startDate, endDate: endDate });
      } else {
        navigate('/listing/' + id, { state: item });
      }
    }
  }

  return (
    <ClickableCard onClick={ handleCardClick } sx={{ width: '90%', marginTop: '15px' }}>
      <CardMedia
        component='img'
        height='200px'
        image={ item.thumbnail === 'default' ? defaultHousePic : item.thumbnail }
        alt='property image'
      />
      <Typography variant='h5' sx={{ marginLeft: '22px', marginTop: '10px' }}>{ item.title }</Typography>
      <CardContent sx={{ display: 'flex', flexDirection: 'row', paddingTop: '0', paddingBottom: '0' }}>
        <CardContent>
          <Typography>Type: { item.metadata.type } </Typography>
          <Typography>Beds: { numBeds } </Typography>
          <Typography>Bathrooms: { item.metadata.bathrooms }</Typography>
          <Typography>Price: ${ item.price } / pn</Typography>
        </CardContent>
        <CardContent>
          <Typography>Rating:<br/><Rating value={ avgReview(item.reviews) } readOnly /></Typography>
          <Typography>Total reviews: { item.reviews.length }</Typography>
        </CardContent>
      </CardContent>
      <CardActions sx={{ paddingTop: '0' }}>
        { cardFunctions() }
      </CardActions>
    </ClickableCard>
  )
}
ListingCard.propTypes = {
  item: PropTypes.object,
  variant: PropTypes.string,
  setAlert: PropTypes.function,
  startDate: PropTypes.string,
  endDate: PropTypes.string
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

export const MyAlert = ({ severity = 'error', title = 'error', text = 'error message here' }) => {
  return (
    <Alert severity={ severity } variant='filled' sx={{ width: '70%', marginTop: '10px', border: '2px dashed white' }}>
      <AlertTitle>{ title }</AlertTitle>
      { text }
    </Alert>
  )
}
MyAlert.propTypes = {
  severity: PropTypes.string,
  title: PropTypes.string,
  text: PropTypes.string
}

export const MyButton = styled.button`
  min-width: 200px;
  border: 1px solid black;
`
