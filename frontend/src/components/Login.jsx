import React, { useState, useContext } from 'react';
import AuthContext from './AuthContext';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px 30px',
    borderRadius: '10px',
    boxShadow: '0 15px 25px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '400px',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  heading: {
    margin: '0 0 30px 0',
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
  },
  toggleText: {
    fontSize: 14,
    color: '#555',
    marginTop: 20,
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#667eea',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 14,
    padding: '0 8px',
    marginLeft: 8,
    textDecoration: 'underline',
    transition: 'color 0.3s ease, background-color 0.3s ease',
    borderRadius: 4,
  },
  toggleButtonHover: {
    color: '#3950a3',
    backgroundColor: 'rgba(102, 126, 234, 0.15)',
  },
  error: {
    backgroundColor: '#ffe6e6',
    color: '#cc0000',
    padding: '10px 15px',
    borderRadius: '5px',
    marginBottom: '20px',
    fontWeight: '500',
    fontSize: '14px',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    marginBottom: '20px',
    borderRadius: '6px',
    border: '1.8px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  inputFocus: {
    borderColor: '#667eea',
  },
  button: {
    width: '100%',
    padding: '14px 0',
    backgroundColor: '#667eea',
    border: 'none',
    color: '#fff',
    fontSize: '18px',
    fontWeight: '600',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#5563c1',
  },
};

export default function AuthForm() {
  const { login } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const [focusedInput, setFocusedInput] = useState(null);
  const [buttonHover, setButtonHover] = useState(false);
  const [toggleHover, setToggleHover] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const url = isRegister
      ? 'http://localhost:5000/api/auth/register'
      : 'http://localhost:5000/api/auth/login';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || (isRegister ? 'Registration failed' : 'Login failed'));
      login(data.token);
    } catch (err) {
      setError(err.message);
    }
  }

  function toggleMode() {
    setError('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setIsRegister(!isRegister);
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card} noValidate>
        <h2 style={styles.heading}>{isRegister ? 'Register' : 'Login'}</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="text"
          value={username}
          placeholder="Username"
          required
          style={{
            ...styles.input,
            ...(focusedInput === 'username' ? styles.inputFocus : {}),
          }}
          onFocus={() => setFocusedInput('username')}
          onBlur={() => setFocusedInput(null)}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />

        <input
          type="password"
          value={password}
          placeholder="Password"
          required
          style={{
            ...styles.input,
            ...(focusedInput === 'password' ? styles.inputFocus : {}),
          }}
          onFocus={() => setFocusedInput('password')}
          onBlur={() => setFocusedInput(null)}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={isRegister ? 'new-password' : 'current-password'}
        />

        {isRegister && (
          <input
            type="password"
            value={confirmPassword}
            placeholder="Confirm Password"
            required
            style={{
              ...styles.input,
              ...(focusedInput === 'confirmPassword' ? styles.inputFocus : {}),
            }}
            onFocus={() => setFocusedInput('confirmPassword')}
            onBlur={() => setFocusedInput(null)}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        )}

        <button
          type="submit"
          style={{
            ...styles.button,
            ...(buttonHover ? styles.buttonHover : {}),
          }}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
        >
          {isRegister ? 'Register' : 'Login'}
        </button>

        <p style={styles.toggleText}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            onClick={toggleMode}
            style={{
              ...styles.toggleButton,
              ...(toggleHover ? styles.toggleButtonHover : {}),
            }}
            onMouseEnter={() => setToggleHover(true)}
            onMouseLeave={() => setToggleHover(false)}
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </form>
    </div>
  );
}
