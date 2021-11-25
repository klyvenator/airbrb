import React from 'react';
import { TopBanner, Form, Container, NavBar, Content, MyAlert } from './components';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { myFetch } from './functions';

const RegisterPage = () => {
  const [pass1, setPass1] = React.useState();
  const [pass2, setPass2] = React.useState();
  const [email, setEmail] = React.useState();
  const [name, setName] = React.useState();
  const [alert, setAlert] = React.useState();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (pass1 !== pass2) {
      setAlert({ title: 'Warning', severity: 'warning', text: 'Passwords do not match' });
    } else {
      setAlert();
    }
  }, [pass1, pass2]);

  const submitRegister = async (event) => {
    event.preventDefault();
    const resp = await myFetch('/user/auth/register', 'POST', { email: email, password: pass1, name: name })
    if (resp.error === undefined) {
      window.localStorage.setItem('token', resp.token);
      window.localStorage.setItem('email', email);
      setAlert({ title: 'Success', severity: 'success', text: 'You have successfully signed up... redirecting' });
      setTimeout(() => { navigate('/') }, 1500);
    } else {
      setAlert({ title: 'Error', severity: 'error', text: resp.error })
    }
  }

  return (
    <Container>
      <TopBanner text="Register"/>
      <Content direction='column'>
      { alert && <MyAlert title={ alert.title } severity={ alert.severity } text={ alert.text }></MyAlert> }
        <Form>
          <TextField label="Name" variant="standard" onChange={e => { setName(e.target.value); setAlert(); }} />
          <TextField label="Email" variant="standard" onChange={e => { setEmail(e.target.value); setAlert(); }} />
          <TextField id="pass1" label="Password" variant="standard" type='password' onChange={ e => { setPass1(e.target.value); setAlert(); } }/>
          <TextField id="pass2" label="Password" variant="standard" type='password' onChange={e => { setPass2(e.target.value); setAlert(); } }/>
          { !alert
            ? <Button onClick={submitRegister} variant="filled">Submit</Button>
            : <Button disabled variant="filled" onClick={submitRegister}>Submit</Button>
            }
        </Form>
      </Content>
    <NavBar/>
    </Container>
  )
}

export default RegisterPage;
