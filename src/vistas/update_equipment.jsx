import { Container, Grid, Paper, Typography, Box, IconButton } from "@mui/material";
import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import EquipmentForm from "../componentes/equipment_form";
import Escudo from "../assets/imagenes/login_back.png";
/* import Navigation from "../componentes/Nav"; */
import { Link, useNavigate, useLocation } from 'react-router-dom';



function update_equipment() {
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
    <Container
    maxWidth="mg" sx={{ py: 4  }}
    >
      <Grid
        container
        spacing={2} // Reducido el espacio entre elementos para dispositivos más pequeños
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={6} md={6} lg={7}>
          <Paper
            elevation={5} sx={{ p: { xs: 2, md: 4 } }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            {/* Botón de retroceso */}
                            <IconButton
                                aria-label="back"
                                onClick={handleBack}
                                sx={{ color: '#64001D', fontWeight: 'bold', marginRight: '10px' }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                {/* Título de la sección */} 
                <Typography
                  variant="h5"
                  gutterBottom
                  align="left"
                  style={{ color: "#64001D", fontWeight: "bold", marginBottom: "10px" }} // Reducido el margen inferior
                >
                  Editar Equipo
                </Typography>
              </Box>
            <EquipmentForm />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={5}> {/* Cambiado el valor de lg para darle más espacio */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <img
              src={Escudo}
              alt="Logo-Sileii"
              style={{ width: "50%" ,heigth: "auto" }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar para mostrar mensaje de éxito al guardar */}
      
    </Container>

  );
}

export default update_equipment;
