import React, { useState } from 'react';
import {
  Container, Paper, Typography, TextField, Button, Grid, Box, ThemeProvider,
  createTheme, Alert, AlertTitle
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../js/config';
import Icon from '@mui/material/Icon';
import { Google } from '@mui/icons-material';
import { GoogleLogin } from '@leecheuk/react-google-login';

import {useGoogleLogin} from '@react-oauth/google';

import logo from "../assets/imagenes/login_back.png";

const customTheme = createTheme({
  palette: {
    primary: {
      main: "#64001D",
    },
  },
});

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const navigate = useNavigate();
  const [googleUserData, setGoogleUserData] = useState(null);


  const isFormValid = () => {
    return email && password; // Aquí puedes añadir más validaciones si es necesario
  };

  const handleLogin = async () => {
    if (!isFormValid()) {
      setAlert({ show: true, type: 'error', message: 'Por favor complete todos los campos.' });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('correo', email);
        localStorage.setItem('rol_id', data.usuario.rol_id);
        navigate('/Inicio', { state: { correo: email } });
      } else {
        setAlert({ show: true, type: 'error', message: 'Usuario o contraseña incorrectos. Por favor, inténtelo de nuevo.' });
      }
    } catch (error) {
      setAlert({ show: true, type: 'error', message: 'Error al iniciar sesión. Intente de nuevo.' });
      console.error('Error al iniciar sesión:', error);
    }
  };
  const handleLogingoogle = async (googleData) => {
    try {
      const response = await fetch(`${API_BASE_URL}login/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenId: googleData.tokenId }),
      });

      if (response.ok) {
        const userData = await response.json();
        setGoogleUserData(userData);
        localStorage.setItem('googleUserData', JSON.stringify(userData));
        navigate('/Inicio', { state: { correo: userData.email } });
      } else {
        setAlert({ show: true, type: 'error', message: 'Error al iniciar sesión con Google. Intente de nuevo.' });
      }
    } catch (error) {
      setAlert({ show: true, type: 'error', message: 'Error al iniciar sesión con Google. Intente de nuevo.' });
      console.error('Error al iniciar sesión con Google:', error);
    }
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: async (googleUser) => {
  
      // Obtener el token de acceso
      const accessToken = googleUser.access_token;
  
      try {
        // Enviar el token al servidor back-end
        const serverResponse = await sendTokenToBackend(accessToken);
  
        if (serverResponse.success) {
          // El servidor respondió con éxito
          const userData = serverResponse.userData; // Puedes utilizar esto según tu respuesta del servidor
  
          localStorage.setItem('token', userData.token);
          localStorage.setItem('correo', userData.correo);
          localStorage.setItem('rol_id', userData.rol_id);
          navigate('/Inicio', { state: { correo: userData.correo } });
        } else {
          // El servidor respondió con un error
          console.error('Error en el servidor:', serverResponse.error);
        }
  
      } catch (error) {
        console.error('Error al comunicarse con el servidor', error);
      }
    },
    onError: (error) => {
      console.error('Error en el inicio de sesión con Google', error);
    },
  });
  
  async function sendTokenToBackend(accessToken) {
    try {
      const response = await fetch(`${API_BASE_URL}auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: accessToken }),
      });
  
      if (!response.ok) {
        throw new Error('front: Error al enviar el token al servidor');
      }
  
      return await response.json();
    } catch (error) {
      console.error('front: Error al enviar el token al servidor', error);
      return { success: false, error: 'front: Error al enviar el token al servidor' };
    }
  }

  const handleInvitado = () => navigate('/Inicio');

  return (
    <Container maxWidth="md">
      <Grid container alignItems="center" style={{ minHeight: '100vh' }}>
        <Grid item xs={12} sm={6} md={6} lg={6}>

          <Paper elevation={3} style={{ padding: '50px', margin: 'auto', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" align="center" gutterBottom style={{ color: '#64001D', fontWeight: 'bold' }}>
              Iniciar Sesión
            </Typography>

            {/*
            <TextField
              label="Nombre de usuario"
              variant="outlined"
              margin="normal"
              fullWidth
              InputLabelProps={{ style: { color: '#64001D' } }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              margin="normal"
              fullWidth
              InputLabelProps={{ style: { color: '#64001D' } }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              style={{ backgroundColor: '#64001D', color: '#FFFFFF', margin: '1% 1% 1% 1%' }}
            >
              Iniciar Sesión
            </Button>
            */}

            
           
            <Button
              variant="contained"
              fullWidth
              onClick={loginGoogle}
              // Agrega aquí la función o lógica para iniciar sesión con Google <Button onClick={() => loginGoogle()}>Sign in with Google 🚀</Button>
              style={{ backgroundColor: '#64001D', color: '#FFFFFF', margin: '1% 1% 1% 1%' }}
              startIcon={<Icon style={{ fontSize: 20 }}><Google /></Icon>}
            >
              Iniciar Sesión con Google 
            </Button>

            
            
            
            <Button
              variant="contained"
              fullWidth
              onClick={handleInvitado}
              style={{ backgroundColor: '#64001D', color: '#FFFFFF', margin: '1% 1% 1% 1%' }}
            >
              Invitado
            </Button>
            {alert.show && (
              <Alert severity={alert.type}>
                <AlertTitle>{alert.type === 'error' ? 'Error' : 'Éxito'}</AlertTitle>
                {alert.message}
              </Alert>
            )}
          </Paper>

        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6}>
          <Box display="flex" justifyContent="center" height="100%">
            <img src={logo} alt="Imagen de fondo" style={{ maxWidth: '80%', maxHeight: '100%', width: 'auto' }} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Login;
