import React from 'react';
import { Container, Grid, Paper, Typography, Box, Button, IconButton } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Escudo from "../assets/imagenes/login_back.png";
function ResponsableComponent() {
    const navigate = useNavigate();
    const location = useLocation();
    const handleBack = () => {
        navigate(-1);
    };
    const labData = location.state?.userToEdit;
    return (
        <Container
        maxWidth="mf" sx={{ py: 5 }}>
        <Grid container spacing={4} justifyContent="center" alignItems="center">


                    {/* Columna Izquierda (Imagen y Botones) */}
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
                            {/* Imagen */}
                            <img src={Escudo} alt="Logo-Sileii" style={{ maxWidth: "80%", height: "auto" }} />
                            
                            
                        </Box>
                    </Grid>
                
                {/* Columna Derecha (Formulario) */}
                <Grid item xs={12} sm={12} md={6} lg={6}>
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
                            variant="h5"
                            gutterBottom
                            align="left"
                            style={{ color: "#64001D", fontWeight: "bold", marginBottom: "20px" }}
                        >
                            RESPONSABLE
                        </Typography>
                        </Box>
                        {/* Información para el laboratorio */}
                        <Typography variant="h6" gutterBottom align="left"  style={{marginLeft:'20%' }}> 
                            Datos:  {labData.coordinador.nombre} {labData.coordinador.apellido_paterno} {labData.coordinador.apellido_materno}
                        </Typography>
                        {/* ... (información del laboratorio) */}

                        {/* Información para el área */}
                        <Typography variant="h6" gutterBottom align="left" style={{marginLeft:'20%' }}>
                            Teléfono: {labData.coordinador.telefono}
                        </Typography>
                        {/* ... (información del área) */}

                        {/* Información para la misión */}
                        <Typography variant="h6" gutterBottom align="left" style={{marginLeft:'20%' }}>
                            Correo: {labData.coordinador.correo}
                        </Typography>
                        {/* Información para la visión */}
                    </Paper>
                </Grid>
            </Grid>
            
        </Container>
    );
}

export default ResponsableComponent;
