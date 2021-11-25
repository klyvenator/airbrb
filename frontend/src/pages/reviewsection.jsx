import React from 'react';
import { ReviewCard, TextArea } from './components';
import PropTypes from 'prop-types';
import { myFetch, avgReview } from './functions';
import { Rating, Typography, Button } from '@mui/material';

const ReviewSection = ({ reviews, setReviews, booking, listingId }) => {
  const [rating, setRating] = React.useState(1);
  const [comment, setComment] = React.useState();
  const [totalRating, setTotalRating] = React.useState(0);
  const user = window.localStorage.getItem('email');

  React.useEffect(async () => {
    const avgRating = avgReview(reviews);
    setTotalRating(avgRating);
  }, [reviews]);

  const submitReview = async () => {
    const body = {
      review: { rating: rating, comment: comment, owner: user }
    }
    const resp = await myFetch('/listings/' + listingId + '/review/' + booking.id, 'PUT', body);
    if (resp.error === undefined) {
      const copy = [...reviews];
      copy.push({ rating: rating, comment: comment, owner: user });
      setReviews(copy);
    } else {
      console.log(resp.error);
    }
  }

  return (
        <>
          {/* Average review */}
          <Typography variant='h6'>Reviews: </Typography>
          <Typography>Average rating of { reviews.length } reviews: </Typography>
          <Rating name="read-only" value={ totalRating } readOnly />
          <p/>

          {/* Review form */}
          { booking && booking.status === 'accepted'
            ? <div>
              <Typography variant='h6'>New Review: </Typography>
              <Rating
                name="simple-controlled"
                value={rating}
                onChange={(event) => {
                  setRating(parseInt(event.target.value));
                }}
              /><br/>
          <Typography variant='h6'>Comment: </Typography>
          <TextArea onChange={e => { setComment(e.target.value) }} />
          <br/><Button variant='contained' onClick={submitReview}>Submit</Button></div>
            : <></> }

          {/* List of reviews */}
          { reviews.length > 0 && reviews.map((review, idx) => {
            return <ReviewCard comment={review.comment} rating={review.rating} key={idx}/>
          })}

        </>
  );
}

ReviewSection.propTypes = {
  reviews: PropTypes.array,
  setReviews: PropTypes.function,
  booking: PropTypes.object,
  listingId: PropTypes.string
}

export default ReviewSection;
