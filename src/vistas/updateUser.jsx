import { useState, useEffect } from 'react';
import React from "react";
import { Container, Grid, Paper, Typography, Box, IconButton  } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UserForm from "../componentes/UserForm";
import Escudo from "../assets/imagenes/login_back.png";
/* import Navigation from "../componentes/Nav"; */
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);


  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    // Verifica si el usuario está autenticado al cargar el componente
    const token = localStorage.getItem('token');
    if (!token) {
        // Si el usuario no está autenticado, redirige al login
        navigate('/login'); // Ajusta la ruta según la ruta de tu login
        
    }
}, []);

  return (
    <Container  maxWidth="mg" sx={{ py: 4  }}>
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="flex-start"
      >
        {/* Columna Izquierda (Imagen) */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <img src={Escudo} alt="Logo-Sileii" style={{ width: "80%", height: "auto" }} />
                    </Box>
                </Grid>

        {/* Columna Derecha (Formulario) */}
        <Grid item xs={6} sm={6} md={6} lg={7}>
          <Paper
            elevation={5} sx={{ p: { xs: 2, md: 4 } }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <IconButton
                aria-label="back"
                onClick={handleBack}
                sx={{ color: '#64001D', fontWeight: 'bold', marginRight: '10px' }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h5"
                gutterBottom
                align="left"
                style={{ color: "#64001D", fontWeight: "bold", marginBottom: "20px" }}
              >
                Modificar Usuario
              </Typography>
              </Box>
            <UserForm />
            <br></br>
            <Typography variant="body2" color="textSecondary" align="center">
              Podrás ver los datos actualizados cuando vuelvas a iniciar sesión
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
