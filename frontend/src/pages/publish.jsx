import React from 'react';
import { TopBanner, Form, Container, NavBar, Content, MyAlert } from './components';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useParams, useNavigate } from 'react-router-dom'
import { myFetch } from './functions';

const PublishPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const defaultDate = '2021-11-25';
  const [alert, setAlert] = React.useState();
  const [dates, setDates] = React.useState([defaultDate, defaultDate]);

  // Need to implement checking valid dates
  const handleSubmit = async () => {
    const response = await myFetch('/listings/publish/' + id, 'PUT', { availability: dates });
    if (response.error !== undefined) {
      setAlert({ title: 'Error', severity: 'error', text: response.error });
    } else {
      setAlert({ title: 'Success', severity: 'success', text: 'Successfully published your listing.. redirecting' });
      setTimeout(() => { navigate('/yourlistings') }, 1500);
    }
  }

  React.useEffect(() => {
    const start = dates[dates.length - 2];
    const end = dates[dates.length - 1];
    if (Date.parse(end) <= Date.parse(start)) {
      setAlert({ title: 'Error', severity: 'error', text: 'End date must be after start date' });
      return;
    }
    for (let i = 0; i < dates.length - 2; i++) {
      if (Date.parse(dates[i]) >= Date.parse(start) && Date.parse(dates[i]) <= Date.parse(end)) {
        setAlert({ title: 'Error', severity: 'error', text: 'Cannot have overlapping dates' });
        return;
      }
    }
    setAlert();
  }, [dates])

  const addDates = () => {
    const copyDates = [...dates];
    copyDates.push(defaultDate);
    copyDates.push(defaultDate);
    setDates(copyDates);
  }

  const modifyDate = (e) => {
    const copyDates = [...dates];
    copyDates[parseInt(e.target.id)] = e.target.value;
    setDates(copyDates);
  }

  return (
    <Container>
      <TopBanner text='Publish Listing'/>
      <Content direction='column'>
        { alert && <MyAlert title={ alert.title } severity={ alert.severity } text={ alert.text }></MyAlert> }
        <Form>
        <p/>
        { dates.map((date, idx) => {
          let label;
          if (idx % 2 === 0) {
            label = 'Start date'
          } else {
            label = 'End date'
          }
          return (
                <TextField
                label={ label }
                type="date"
                key={ idx }
                id={ idx.toString() }
                defaultValue={ defaultDate }
                onChange={ modifyDate }
              />
          )
        }) }

        <br/><Button variant='contained' onClick={ addDates }>Add more dates</Button><br/>
        { alert
          ? <Button variant='contained' disabled onClick={ handleSubmit }>Submit</Button>
          : <Button variant='contained' onClick={ handleSubmit }>Submit</Button> }
        </Form>
      </Content>
      <NavBar/>
    </Container>
  )
}

export default PublishPage;
