import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Router from 'next/router';
import buildClient from '../api/build-client';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  inputField: {
    margin: 5,
    width: '125ch'
  },
  inputLabel: {
    marginTop: 10
  },
  formBox: {
    margin: 5
  },
  btn: {
    margin: 15
  }
}));

const HomeScreen = ({ currentUser }) => {
  const classes = useStyles();

  return (
    <Container maxWidth='md'>
      <h1>Get Your Tickets</h1>
      {
        (currentUser === null || currentUser === undefined) 
        ? (<div>
          <div>
            <p>Not signed in. Please sign in or create an account</p>
          </div>
          <Button className={classes.btn} color='primary' onClick={() => Router.push('/auth/signup')}>Sign Up</Button>
          <Button className={classes.btn} onClick={() => Router.push('/auth/signin')}>Sign In</Button>
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