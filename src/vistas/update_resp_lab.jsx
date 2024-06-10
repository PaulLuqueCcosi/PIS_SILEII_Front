import React from "react";
import { Container, Grid, Paper, Typography, Box, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LabForm from "../componentes/LabForm";
import Escudo from "../assets/imagenes/login_back.png";
import { useLocation, useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const labToEdit = location.state?.labToEdit;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container  maxWidth="mg" sx={{ py: 4  }} 
    >
      <Grid
        container
        spacing={4}
        justifyContent="center"
        alignItems="center"
      >
        {/* Columna Derecha (imagen) */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <img src={Escudo} alt="Logo-Sileii" style={{ width: "80%", height: "auto" }} />
                    </Box>
                </Grid>
        {/* Columna Izquierda (formulario) */}
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
                style={{ color: "#64001D", fontWeight: "bold", marginBottom: "20px" }}
              >
                Editar Registro de Laboratorio
              </Typography>
            </Box>
            <LabForm labData={labToEdit} />
          </Paper>
        </Grid>

        
      </Grid>
    </Container>
  );
}

export default App;
