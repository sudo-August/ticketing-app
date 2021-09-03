import { useEffect } from 'react';
import router from 'next/router';
import useRequest from '../../hooks/use-request';
import Typography from '@material-ui/core/Typography';

const signOut = () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => router.push('/')
  });

  useEffect(() => {
    doRequest();
  }, [])

  return <div><Typography>Signing you out....</Typography></div>
};

export default signOut;