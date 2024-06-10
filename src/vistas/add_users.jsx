import React from "react";
import { Container, Grid, Paper, Typography, Box, IconButton  } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UserForm from "../componentes/UserForm";
import Escudo from "../assets/imagenes/login_back.png";
import { useNavigate } from 'react-router-dom';
/* import Navigation from "../componentes/Nav"; */

function add_users() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container 
    maxWidth="mg" sx={{ py: 4  }}>
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
            {/* Botón de retroceso */}
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
                Registrar Usuario
              </Typography>
              </Box>
            <UserForm />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default add_users;
