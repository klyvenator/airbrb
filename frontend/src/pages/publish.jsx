import React from 'react';
import { TopBanner, Form, Container, NavBar, Content } from './components';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom'
import { myFetch } from './functions';

const PublishPage = () => {
  const { id } = useParams();
  const [startDate, setStartDate] = React.useState('2021-11-15');
  const [endDate, setEndDate] = React.useState('2021-11-16');

  // Need to implement checking valid dates
  const checkDates = async () => {
    const body = {
      availability: [startDate, endDate]
    }
    const response = await myFetch('/listings/publish/' + id, 'PUT', body);
    if (response.error !== undefined) {
      alert(response.error);
    } else {
      alert('Successfully published your listing')
    }
  }
  return (
    <Container>
      <TopBanner text='Publish Listing'/>
      <Content>
        <Form>
        <TextField
          id="dateStart"
          label="Starting availability date"
          type="date"
          defaultValue="2021-11-15"
          onChange={ event => { setStartDate(event.target.value) }}
        />
        <p/>
        <TextField
          id="dateEnd"
          label="End availabillity date"
          type="date"
          defaultValue="2021-11-16"
          onChange={ event => { setEndDate(event.target.value) }}
        />
        <Button variant='contained' onClick={checkDates}>Submit</Button>
        </Form>
      </Content>
      <NavBar/>
    </Container>
  )
}

export default PublishPage;
