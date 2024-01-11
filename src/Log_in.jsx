import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const history = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (credentials) => {
    const response = await fetch('http://localhost:3000/admin/sign_in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const data = await response.json();
      setMessage(data.message);
      console.error('Login failed');
      return;
    }

    const data = await response.json();

    if (data && data.token) {
      localStorage.setItem('token', data.token);
      history('/');
    } else {
      console.error('Unexpected server response');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Assuming handleLogin is a function passed from the parent component
    handleLogin({ username, password });
  };

  return (
    <div className='loginBox'>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type='text'
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type='password'
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </label>
        <button type='submit'>Login</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Login;
