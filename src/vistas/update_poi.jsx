import { Container, Grid, Paper, Typography, Box, IconButton } from "@mui/material";
import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PoiForm from "../componentes/PoiForm"; // Cambiado el nombre del componente importado
import Escudo from "../assets/imagenes/login_back.png";
import { Link, useNavigate, useLocation } from 'react-router-dom';

function update_poi() { // Cambiado el nombre del componente funcional
  const navigate = useNavigate();
  const location = useLocation();
  const instiToEdit = location.state?.instiToEdit;
    
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
    <Container
      className='fondo'
      maxWidth="xl"
      sx={{
        paddingTop: '5%',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={6} md={6} lg={7}>
          <Paper
            elevation={3}
            style={{
              padding: "60px",
              width: '100%',
              maxWidth: '600px'
            }}
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
                style={{ color: "#64001D", fontWeight: "bold", marginBottom: "10px" }}
              >
                Editar POI {/* Cambiado el título de la sección */}
              </Typography>
            </Box>
            {/* Renderizar el formulario del POI */}
            {/*<PoiForm />  Cambiado el nombre del componente */}
            <PoiForm labData={instiToEdit} />
            {/*<PoiForm labData={instiToEdit} />  Cambiado el nombre del componente */}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={5}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <img
              src={Escudo}
              alt="Logo-Sileii"
              style={{ width: "50%", height: "auto" }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default update_poi;
