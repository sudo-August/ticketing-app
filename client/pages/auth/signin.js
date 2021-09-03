import { useState } from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Router from 'next/router';
import Input from '@material-ui/core/Input';
import useRequest from '../../hooks/use-request';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
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
    <Container>
      <h1>Sign In</h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <InputLabel>Email</InputLabel>
          <Input type='text' value={email} onChange={e => setEmail(e.target.value)} className='form-control' />
        </div>
        <div className='form-group'>
          <InputLabel>Password</InputLabel>
          <Input type='password' value={password} onChange={e => setPassword(e.target.value)} className='form-control' />
        </div>
        {errors}
        <Button className='btn btn-primary' onClick={onSubmit} type='submit'>Sign In</Button>
      </form>
    </Container>
  )
}

export default SignIn;