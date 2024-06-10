import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box, IconButton } from "@mui/material";
import Escudo from "../assets/imagenes/login_back.png";
import ProyectForm from "../componentes/ProyectForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate, useLocation } from 'react-router-dom';


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
    <Container 
    maxWidth="mg" sx={{ py: 4  }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        direction="row"
        justifyContent="center"
        alignItems="center"
        style ={{
          /* border: "1px solid red" */
        }}
      >
        {/* Columna Izquierda (Formulario) */}
        <Grid item xs={6} sm={6} md={6} lg={7}>
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
            <Typography
              variant="h4"
              gutterBottom
              align="left"
              style={{ color: "#64001D", fontWeight: "bold", marginBottom: "20px" }}
            >
              Editar Proyecto
            </Typography>
            </Box>
            <ProyectForm />
          </Paper>
        </Grid>

        {/* Columna Derecha (Imagen) */}
        <Grid item xs={6} sm={6} md={6} lg={5}>
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
    </Container>
  );
}

export default add_users;
