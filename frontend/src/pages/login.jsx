import React from 'react';
import { TopBanner, Form, Container, NavBar, Content } from './components';
import { myFetch } from './functions';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();

  const submit = async (event) => {
    event.preventDefault();
    const body = {
      email: email,
      password: password
    }
    const result = await myFetch('/user/auth/login', 'POST', body);
    if (result.token === undefined) {
      alert(result.error);
    } else {
      window.localStorage.setItem('token', result.token);
      window.localStorage.setItem('email', email);
      navigate('/');
    }
  }

  return (
    <Container>
      <TopBanner text="Login"/>
      <Content>
        <Form>
          <TextField label="Email" onChange={event => { setEmail(event.target.value) }} variant="standard" />
          <TextField label="Password" variant="standard" onChange={event => { setPassword(event.target.value) }} type='password'/>
          <Button variant="filled" onClick={submit}>Submit</Button>
        </Form>
      </Content>
      <NavBar/>
    </Container>
  )
}

export default LoginPage;
