import { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch('http://localhost:3000/admin/sign_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Redirect to the specified URL
          window.location.href = data.redirectTo;
        } else {
          // Handle authentication error, e.g., display an error message
          console.error('Authentication error:', data.message);
        }
      } else {
        // Handle other response errors
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Assuming handleLogin is a function passed from the parent component
    handleLogin({ username, password });
  };

  return (
    <div>
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
        <br />
        <label>
          Password:
          <input
            type='password'
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </label>
        <br />
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default Login;
