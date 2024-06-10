import { Container, Grid, Paper, Typography, Box, IconButton } from "@mui/material";
import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ManagementForm from "../componentes/management_form";
import Escudo from "../assets/imagenes/login_back.png";
/* import Navigation from "../componentes/Nav"; */
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Update_management() {
  const location = useLocation();
  const navigate = useNavigate();
  const [management, setManagement] = useState({ name: '' }); // Inicializamos users con un objeto vacío
  const [management_name, setManagementName] = useState({ name: '' });
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token de autenticación no encontrado en el localStorage.');
      // Redirigir al usuario a la página de inicio de sesión
      navigate('/login');
      return;
    }

    const option = location.state?.option;
    const data = location.state?.datos;
    if (option === 1) {
      setManagement({ name: 'Laboratorio' });
      setManagementName({ name: data.nombre });
    }
    if (option === 2) {
      setManagement({ name: 'Área' });
      setManagementName({ name: data.nombre });
    }
    if (option === 3) {
      setManagement({ name: 'Disciplina' });
      setManagementName({ name: data.nombre });
    }
    if (option === 4) {
      setManagement({ name: 'Rol' });
      setManagementName({ name: data.nombre });
    }
    if (option === 5) {
      setManagement({ name: 'Instituto' });
      setManagementName({ name: data.nombre });
    }
  }, []);
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container
    maxWidth="md" sx={{ py: 8  }}
    >
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
      >
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
                style={{ color: "#64001D", fontWeight: "bold", marginBottom: "10px" }}
              >
                Edición de {management.name}
              </Typography>
              </Box>
            <ManagementForm />
          </Paper>
        </Grid>
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
              style={{ width: "80%" ,heigth: "auto" }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>

  );
}

export default Update_management;
