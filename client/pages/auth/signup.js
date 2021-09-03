import { useState } from 'react';
import axios from 'axios';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/users/signup', {
        email, password
      });
      console.log(response.data);
    } catch (err) {
      setErrors(err.response.data.errors);
    }
  };

  return (
    <Container>
      <h1>Sign Up</h1>
      <form onSubmit={onSubmit} >
        <div className='form-group'>
          <InputLabel>Email</InputLabel>
          <Input type='text' value={email} onChange={e => setEmail(e.target.value)} className='form-control' />
        </div>
        <div className='form-group'>
          <InputLabel>Password</InputLabel>
          <Input type='password' value={password} onChange={e => setPassword(e.target.value)} className='form-control' />
        </div>
          {(errors.length < 1) && (
            <div>
              <Alert severity='error'>
                <AlertTitle>Sign Up Error</AlertTitle>
                {
                  errors.map(err => err.message)
                }
              </Alert>
            </div>
          )}
        <Button className='btn btn-primary' onClick={onSubmit} type='submit'>Sign Up</Button>
      </form>
    </Container>
  )
}

export default SignUp;