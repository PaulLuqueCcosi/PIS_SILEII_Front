import { useState, useEffect } from 'react';
import React from "react";
import { Container, Grid, Paper, Typography, Box, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InstiForm from "../componentes/InstiForm";
import Escudo from "../assets/imagenes/login_back.png";
import { useNavigate } from 'react-router-dom';
/* import Navigation from "../componentes/Nav"; */

function add_users() {
  const navigate = useNavigate();
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
    <Container maxWidth="mg" sx={{ py: 8  }}>
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
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
                sx={{ color: '#64001D', fontWeight: 'bold', marginBottom: '10px' }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h5"
                gutterBottom
                align="left"
                style={{ color: "#64001D", fontWeight: "bold", marginBottom: "20px" }}
              >
                Crear un Instituto
              </Typography>
              </Box>
            <InstiForm />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default add_users;
