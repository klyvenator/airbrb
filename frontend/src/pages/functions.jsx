import { BACKEND_PORT } from '../config';

export const myFetch = async (path, method, body, id) => {
  let header;
  if (body === undefined || body === null) {
    header = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + window.localStorage.getItem('token')
      }
    }
  } else {
    header = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + window.localStorage.getItem('token'),
      },
      body: JSON.stringify(body)
    }
  }
  const url = 'http://localhost:' + BACKEND_PORT + path;
  const response = await fetch(url, header);
  const json = await response.json();
  return json;
}

export const daysBetween = (startDate, endDate) => {
  let days = endDate - startDate;
  days = days / 1000 / 60 / 60 / 24;
  return (days)
}

export const avgReview = (reviews) => {
  let avg = 0;
  for (const rev of reviews) {
    avg += rev.rating;
  }
  return (avg / reviews.length);
}

export const isNumber = (string) => {
  const regex = /^[0-9]+$/;
  if (regex.test(string)) {
    return true;
  } else {
    return false;
  }
}
