import React, { useState } from 'react';
import { AuthProvider } from './components/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import ExamPage from './components/ExamPage';
import AuthContext from './components/AuthContext';

function App() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <AuthProvider>
      <AuthContext.Consumer>
        {({ token }) => (
          <div>
            {!token && (
              <>
                {showRegister ? <Register /> : <Login />}
                <button onClick={() => setShowRegister(!showRegister)} style={{ marginTop: 10 }}>
                  {showRegister ? 'Already have an account? Login' : 'New user? Register'}
                </button>
              </>
            )}
            {token && <ExamPage />}
          </div>
        )}
      </AuthContext.Consumer>
    </AuthProvider>
  );
}

export default App;
