import { Container, Grid, Paper, Typography, Box, IconButton } from "@mui/material";
import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EquipmentForm from "../componentes/equipment_form";
import Escudo from "../assets/imagenes/login_back.png";
/* import Navigation from "../componentes/Nav"; */
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Definir un componente funcional llamado add_equipment
function add_equipment() {
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
      {/* Contenedor principal con dos columnas */}      
      <Grid
        container
        spacing={2} // Espaciado entre elementos reducido para dispositivos más pequeños
        justifyContent="center" // Alineación de contenido en el centro horizontal
        alignItems="center" // Alineación de contenido en el centro vertical
      >
        {/* Columna izquierda */}        
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
                  style={{ color: "#64001D", fontWeight: "bold", marginBottom: "10px" }} // Color, fuente y margen del título
                >
                  Registro Equipo
                </Typography>
            </Box>
            {/* Renderizar el formulario del equipo */}            
            <EquipmentForm />
          </Paper>
        </Grid>

        {/* Columna derecha */}        
        <Grid item xs={12} sm={6} md={6} lg={5}> {/* Cambiado el valor de lg para darle más espacio */}
          {/* Contenedor flexible para centrar la imagen */}        
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            {/* Imagen del escudo */}            
            <img
              src={Escudo}
              alt="Logo-Sileii"
              style={{ width: "50%" ,height: "auto" }} // Ancho fijo y altura automática para mantener la proporción
            />
          </Box>
        </Grid>
      </Grid>
    </Container>

  );
}

export default add_equipment;
