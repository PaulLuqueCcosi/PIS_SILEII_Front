import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box, Button, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Escudo from "../assets/imagenes/login_back.png";
import { useLocation, useNavigate } from 'react-router-dom';

function App() {
    const location = useLocation();
    const labData = location.state?.userToEdit;

    const navigate = useNavigate();
    const [showPaper, setShowPaper] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setShowPaper(!!token);
    }, []);

    const handleViewLines = (userToEdit) => navigate('/res_linesInvest', { state: { userToEdit } });
    const handleViewpost = (userToEdit) => navigate('/res_publicaciones_public', { state: { userToEdit } });
    const handleViwService = (userToEdit) => navigate('/res_servicios_public', { state: { userToEdit } });
    const handleViewProyectos = (userToEdit) => navigate('/res_proyectos_public', { state: { userToEdit } });
    const handleViewEquipos = (userToEdit) => navigate('/res_equipo_public', { state: { userToEdit } });
    const handleViewGalery = (labData) => navigate('/res_galeria_public', { state: { labData } });
    const handleBack = () => navigate(-1);

    const styles = {
        button: {
          backgroundColor: '#64001D',
          '&:hover': {
            backgroundColor: '#44001F',
          },
          color: '#fff',
          padding: '10px 30px',
        },
      };
    
    return (
        <Container maxWidth="mf" sx={{ py: 5 }}>
            <Grid container spacing={4} justifyContent="center" alignItems="center">
                {/* Columna Izquierda (Imagen) */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <img src={Escudo} alt="Logo-Sileii" style={{ width: "80%", height: "auto" }} />
                    </Box>
                </Grid>

                {/* Columna Derecha (Formulario) */}
                <Grid item xs={12} sm={6} md={8} lg={9}>
                    <Paper elevation={5} sx={{ p: { xs: 2, md: 4 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            {/* Botón de retroceso */}
                            <IconButton
                                aria-label="back"
                                onClick={handleBack}
                                sx={{ color: '#64001D', fontWeight: 'bold', marginRight: '10px' }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h5" gutterBottom align="left" style={{ color: "#64001D", fontWeight: "bold", marginBottom: "20px" }}>
                                Información
                            </Typography>
                        </Box>

                        {/* Información del laboratorio */}
                        <Typography variant="h6" gutterBottom align="left">
                            Encargado: {labData?.responsable}
                        </Typography>
                        <Typography variant="h6" gutterBottom align="left">
                            Laboratorio: {labData?.laboratorio}
                        </Typography>
                        <Typography variant="h6" gutterBottom align="left">
                            Área: {labData?.area}
                        </Typography>
                        <Typography variant="h6" gutterBottom align="left">
                            Misión:
                        </Typography>
                        <Typography variant="body1" paragraph align="left">
                            {labData?.mision}
                        </Typography>
                        <Typography variant="h6" gutterBottom align="left">
                            Visión:
                        </Typography>
                        <Typography variant="body1" paragraph align="left">
                            {labData?.vision}
                        </Typography>
                        <Typography variant="h6" gutterBottom align="left">
                            Ubicación:
                        </Typography>
                        <Typography variant="body1" paragraph align="left">
                            {labData?.ubicacion}
                        </Typography>
                        <Typography variant="h6" gutterBottom align="left">
                            Líneas de investigación:
                        </Typography>
                        <Typography variant="body1" paragraph align="left">
                            {labData?.disciplinas
                            ? labData.disciplinas.split(',').map((disciplina) => (
                                <span key={disciplina}>{disciplina.trim()}<br /></span>
                            ))
                            : 'No hay líneas de investigación disponibles.'}
                        </Typography>

                        {/* Apartado de botones */}
                        {!showPaper && (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h5" gutterBottom align="left" style={{ color: "#64001D", fontWeight: "bold", marginBottom: "20px" }}>
                                        Solicitar Información
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                                    <Button style={styles.button} onClick={() => handleViewEquipos(labData)} fullWidth>
                                        Equipos especializados
                                    </Button>
                                    <Button style={styles.button} onClick={() => handleViewProyectos(labData)} fullWidth>
                                        Proyectos de Investigación
                                    </Button>
                                    <Button style={styles.button} onClick={() => handleViwService(labData)} fullWidth>
                                        Servicios y Actividades
                                    </Button>
                                </Grid>
                                
                                <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                                    <Button style={styles.button} onClick={() => handleViewpost(labData)} fullWidth>
                                        Publicaciones
                                    </Button>
                                    <Button style={styles.button} onClick={() => handleViewLines(labData)} fullWidth>
                                        Líneas de Investigación
                                    </Button>
                                    <Button style={styles.button} onClick={() => handleViewGalery(labData)} fullWidth>
                                        GALERIA DE FOTOS
                                    </Button>
                                </Grid>
                                
                            </Grid>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default App;
