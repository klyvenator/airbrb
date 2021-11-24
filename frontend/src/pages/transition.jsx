import React from 'react';
import { Content, NavBar, TopBanner, Container } from './components';
import { useNavigate, useParams } from 'react-router-dom';
import { myFetch } from './functions';

const TransitionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  React.useEffect(async () => {
    const resp = await myFetch('/listings/unpublish/' + id, 'PUT');
    if (resp.error === undefined) {
      setTimeout(() => { navigate('/yourlistings') }, 1000);
    } else {
      alert(resp.error);
    }
  }, []);

  return (
    <Container>
      <TopBanner/>
      <Content>
        <label>Your listing has been unpublished. Redirecting..</label>
      </Content>
      <NavBar/>
    </Container>
  )
}

export default TransitionPage;
