import logoo from '../utils/logoo.gif';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons' 
import {useHandleClicks} from '../hooks/useHandleClicks'

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const {handlePasswordChange,handleUsernameChange,error,onLoginClick,username,password} = useHandleClicks();

  const onLogin = (e: any) => {
    onLoginClick(e, navigate, username, password);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="login-container" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '300px', textAlign: 'center' }}>
        <img
          src={logoo}
          alt="logo"
          style={{
            alignSelf: 'center',
            width: '23pc',
            height: '21pc',
            marginBottom: '-80px',
            marginInlineStart: '-56px',
            marginTop: '-90px'
          }}
        />
        <h2 style={{ marginTop: '15px', marginBottom: '20px' }}>LOGIN</h2>
        <form onSubmit={onLogin} style={{ margin: '10px 0' }}>
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <label style={{ fontSize: 14, display: 'block', marginBottom: '5px' }}>Username:</label>
            <input
              type="text"
              name="username"
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#F08080',
                border: 'none',
                borderRadius: '10px',
              }}
              onChange={(e) => handleUsernameChange(e.target.value)}
            />
          </div>
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <label style={{ fontSize: 14, display: 'block', marginBottom: '5px' }}>Password:</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#F08080',
                  border: 'none',
                  borderRadius: '10px',
                }}
                onChange={(e) => handlePasswordChange(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                }}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>

          {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'maroon',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: 16,
            }}
            onClick={onLogin}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
