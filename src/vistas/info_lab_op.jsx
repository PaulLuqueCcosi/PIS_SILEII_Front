import { Container, Grid, Paper, Typography, Box, Button, IconButton } from "@mui/material";
import LabForm from "../componentes/LabForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useRef } from 'react';
import Escudo from "../assets/imagenes/login_back.png";
import { useLocation } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

function App() {
    const location = useLocation();
    const labData = location.state?.userToEdit;
    const navigate = useNavigate();

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };
    const handleBack = () => {
        navigate(-1);
    };

    const handleFileSelected = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            console.log('Archivo seleccionado:', selectedFile.name);
        }
    };

    const handlecrudequipos = () => {
        navigate('/res_equipment', { state: { labData } });
    };
    const handlecrudproyects = () => {
        navigate('/ManageProyects', { state: { labData } });
    };
    const handlecrudoposted = () => {
        navigate('/res_publicaciones_public', { state: { labData } });
    };
    const handlecrudservice = () => {
        navigate('/res_servicios_public', { state: { labData } });
    };
    const handlecrudgalery = () => {
        navigate('/res_galeria_public', { state: { labData } });
    };
    //ManageDocuments
    const styles = {
        label: {
          color: '#555',
        },
    
        button: {
          backgroundColor: '#64001D',
          '&:hover': {
            backgroundColor: '#44001F',
          },
          color: '#fff',
          padding: '10px 30px',
        },
        fileInput: {
          display: 'none',
        },
        inputWithIcon: {
          paddingRight: 0,
        },
      };
    //ManageProyects
    return (
        <Container maxWidth="mg" sx={{ py: 8  }}>
            <Grid container spacing={4} justifyContent="center" alignItems="center">

                {/* Columna Izquierda (Imagen y Botones) */}
                <Grid item xs={6} sm={4} md={4} lg={3.5}>

                    <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection="column" height="100%">
                        <img src={Escudo} alt="Logo-Sileii" style={{ maxWidth: "80%", height: "auto" }} />


                    </Box>

                </Grid>

                {/* Columna Derecha (Formulario) */}
                <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Paper elevation={5} sx={{ p: { xs: 2, md: 4 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconButton
                                aria-label="back"
                                onClick={handleBack}
                                sx={{ color: '#64001D', fontWeight: 'bold', marginBottom: '10px' }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography variant="h5" gutterBottom align="left" style={{ color: "#64001D", fontWeight: "bold", marginBottom: "10px" }}>
                                Información de Laboratorio
                            </Typography>
                            </Box>
                        {/* Información para el encargado */}
                        <Typography variant="h6" gutterBottom align="left">
                            Encargado:  {labData.responsable}
                        </Typography>
                        {/* ... (información del encargado) */}

                        {/* Información para el laboratorio */}
                        <Typography variant="h6" gutterBottom align="left">
                            Laboratorio: {labData.laboratorio}
                        </Typography>
                        {/* ... (información del laboratorio) */}

                        {/* Información para el área */}
                        <Typography variant="h6" gutterBottom align="left">
                            Área: {labData.area}
                        </Typography>
                        {/* ... (información del área) */}

                        {/* Información para la misión */}
                        <Typography variant="h6" gutterBottom align="left">
                            Misión:
                        </Typography>
                        <Typography variant="body1" paragraph align="left">
                            {labData.mision}
                        </Typography>

                        {/* Información para la visión */}
                        <Typography variant="h6" gutterBottom align="left">
                            Visión:
                        </Typography>
                        <Typography variant="body1" paragraph align="left">
                            {labData.vision}
                        </Typography>

                        {/* Información para la visión */}
                        <Typography variant="h6" gutterBottom align="left">
                            Historia:
                        </Typography>
                        <Typography variant="body1" paragraph align="left">
                            {labData.historia}
                        </Typography>

                    </Paper>
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                    

                        {/*<Button variant="outlined" style={styles.button} >
                        Gestión Tusne
                        </Button>*/}
                        <Button variant="outlined" style={styles.button} onClick={() => handlecrudequipos()}>
                            Gestión Equipo
                        </Button>
                        <Button variant="outlined" style={styles.button} onClick={() => handlecrudproyects()}>
                            Gestión Proyectos
                        </Button>
                        <Button variant="outlined" style={styles.button} onClick={() => handlecrudoposted()}>
                            Gestión Publicaciones
                        </Button>
                        <Button variant="outlined" style={styles.button} onClick={() => handlecrudservice()}>
                            Gestión Servicios
                        </Button>
                        <Button variant="outlined" style={styles.button} onClick={() => handlecrudgalery()}>
                            Galeria de fotos
                        </Button>

                    
                </Grid>
            </Grid>
        </Container>

    );
}

export default App;
