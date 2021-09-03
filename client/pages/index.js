import Button from '@material-ui/core/Button';
import Router from 'next/router';
import buildClient from '../api/build-client';
import Container from '@material-ui/core/Container';

const HomeScreen = ({ currentUser }) => {
  return (
    <Container>
      <h1>Get Your Tickets</h1>
      {
        (currentUser === null || currentUser === undefined) 
        ? (<div>
          <Button color='primary' onClick={() => Router.push('/auth/signup')}>Sign Up</Button>
          <Button onClick={() => Router.push('/auth/signin')}>Sign In</Button>
        </div>)
        : (<div><p>Hello user {currentUser.email}</p></div>)
      }
    </Container>
  )
};

HomeScreen.getInitialProps = async (context) => {
  try {
    const { data } = await buildClient(context).get('/api/users/currentuser');
    return data;
  } catch (err) {
    console.log(err)
    return { currentUser: null }
  }
};

export default HomeScreen;