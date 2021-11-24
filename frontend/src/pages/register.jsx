import React from 'react';
import { BACKEND_PORT } from '../config';
import { TopBanner, Form, Container, NavBar, Content } from './components';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {
  useNavigate
} from 'react-router-dom';

const RegisterPage = () => {
  const [matchingPasswords, setMatchingPasswords] = React.useState(false);
  const navigate = useNavigate();

  let pass1, pass2;
  const checkDifference = (event) => {
    if (event.target.id === 'pass1') {
      pass1 = event.target.value;
    } else {
      pass2 = event.target.value;
    }

    if (pass1 !== pass2) {
      setMatchingPasswords(false);
    } else if (pass1 === '') {
      setMatchingPasswords(false);
    } else {
      setMatchingPasswords(true);
    }
  }
  const submitRegister = (event) => {
    event.preventDefault();

    const header = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: document.getElementById('email').value, password: document.getElementById('pass1').value, name: document.getElementById('name').value })
    }
    fetch('http://localhost:' + BACKEND_PORT + '/user/auth/register', header)
      .then(response => {
        if (response.ok !== true) {
          alert('Error');
        } else {
          response.json()
            .then(data => {
              window.localStorage.setItem('token', data.token);
              window.localStorage.setItem('email', document.getElementById('email').value);
              navigate('/');
            })
        }
      })
  }

  return (
    <Container>
      <TopBanner text="Register"/>
      <Content>
        <Form>
          <TextField id="name" label="Name" variant="standard"/>
          <TextField id="email" label="Email" variant="standard" />
          <TextField id="pass1" label="Password" variant="standard" type='password' onChange={checkDifference}/>
          <TextField id="pass2" label="Password" variant="standard" type='password' onChange={checkDifference}/>
          { matchingPasswords
            ? (<div><Button onClick={submitRegister} variant="filled">Submit</Button></div>)
            : (<div><label>Error: Passwords do not match or empty</label><br/><Button disabled variant="filled" onClick={submitRegister}>Submit</Button></div>)
            }
        </Form>
      </Content>
    <NavBar/>
    </Container>
  )
}

export default RegisterPage;
