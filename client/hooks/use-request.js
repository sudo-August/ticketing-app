import axios from 'axios';
import { useState, useEffect } from 'react';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

const useRequest = ({url, method, body, onSuccess}) => {
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    console.log(errors)
  }, [errors])

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data
    } catch (err) {
      setErrors(
        <div>
          <Alert severity='error' onClose={() => setErrors(null)}>
            <AlertTitle>Sign Up Error</AlertTitle>
            <ul>
              {
                err.response.data.errors.map(error => (
                  <li>
                    {error.message}<br></br>
                  </li>
                ))
              }
            </ul>
          </Alert>
        </div>
      )
    }
  }

  return { doRequest, errors }
};

export default useRequest;