import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Box from '@material-ui/core/Box';
import Router from 'next/router';
import Input from '@material-ui/core/Input';
import useRequest from '../../hooks/use-request';

const useStyles = makeStyles((theme) => ({
  inputField: {
    margin: 5
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

const SignUp = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <Container maxWidth='md'>
      <h1>Sign Up</h1>
      <Box display='flex' width={1}>
        <form onSubmit={onSubmit} className={classes.formBox}>
          <div className='form-group'>
            <InputLabel className={classes.inputLabel}>Email</InputLabel>
            <Input className={classes.inputField} type='text' value={email} onChange={e => setEmail(e.target.value)} className='form-control' />
          </div>
          <div className='form-group'>
            <InputLabel className={classes.inputLabel}>Password</InputLabel>
            <Input type='password' value={password} onChange={e => setPassword(e.target.value)} className='form-control' />
          </div>
          {errors}
          <Button className={classes.btn} onClick={onSubmit} type='submit'>Sign Up</Button>
        </form>
      </Box>
    </Container>
  )
}

export default SignUp;