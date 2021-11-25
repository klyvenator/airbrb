import React from 'react';
import { TopBanner, Form, Container, NavBar, Content, MyAlert } from './components';
import { myFetch } from './functions';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const [alert, setAlert] = React.useState();

  const submit = async (event) => {
    event.preventDefault();
    const body = {
      email: email,
      password: password
    }
    const result = await myFetch('/user/auth/login', 'POST', body);
    if (result.token === undefined) {
      setAlert({ title: 'Error', severity: 'error', text: result.error });
    } else {
      window.localStorage.setItem('token', result.token);
      window.localStorage.setItem('email', email);
      setAlert({ title: 'Success', severity: 'success', text: 'You have successfully logged in... redirecting' })
      setTimeout(() => { navigate('/') }, 1000);
    }
  }

  return (
    <Container>
      <TopBanner text="Login"/>
      <Content direction='column'>
      { alert && <MyAlert title={ alert.title } severity={ alert.severity } text={ alert.text }></MyAlert> }
        <Form>
          <TextField label="Email" onChange={event => { setEmail(event.target.value); setAlert(); }} variant="standard" />
          <TextField label="Password" variant="standard" onChange={event => { setPassword(event.target.value); setAlert(); }} type='password'/>
          <Button variant="filled" onClick={submit}>Submit</Button>
        </Form>
      </Content>
      <NavBar/>
    </Container>
  )
}

export default LoginPage;
