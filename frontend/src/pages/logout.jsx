import React from 'react';
import { Content, NavBar, TopBanner, Container } from './components';
import { useNavigate } from 'react-router-dom';
import { myFetch } from './functions';

const LogoutPage = () => {
  const navigate = useNavigate();

  React.useEffect(async () => {
    const resp = await myFetch('/user/auth/logout', 'POST');
    if (resp.error === undefined) {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('email');
      setTimeout(() => { navigate('/') }, 1000);
    } else {
      alert(resp.error);
    }
  }, []);

  return (
    <Container>
      <TopBanner/>
      <Content>
        <label>You have been logged out. Redirecting..</label>
      </Content>
      <NavBar/>
    </Container>
  )
}

export default LogoutPage
