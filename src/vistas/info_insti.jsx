import { Container, Grid, Paper, Typography, Box, Button, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LabForm from "../componentes/LabForm";
import React, { useRef } from 'react';
import Escudo from "../assets/imagenes/login_back.png";
import { useLocation, useNavigate } from 'react-router-dom';

function App() {
    const location = useLocation();
    const labData = location.state?.userToEdit;
    const navigate = useNavigate();

    const handleUploadClick = () => {
        fileInputRef.current.click();
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
    const handlecruddocuments = () => {
        navigate('/ManageDocuments', { state: { labData } });
    };
    const handleViewInfo = () => {
        navigate('/res_funtion_insti', { state: { labData } });
    };
    const handleViewProyect = () => {
        navigate('/manage_proyects_inti', { state: { labData } });
    };
    const handleViewPublic = () => {
        navigate('/res_publicaciones_insti', { state: { labData } });
    };
    const handleViewConvenios = () => {
        navigate('/res_convenio_insti', { state: { labData } });
    };
    const handleBack = () => {
        navigate(-1);
    };
    const handleViewTusne = () => {
        navigate('/res_tusne_insti', { state: { labData } });
    };

    
    //ManageDocuments 

    //ManageProyects
    return (
        <Container maxWidth="mf" sx={{ py: 5 }}>
            <Grid container spacing={4} justifyContent="center" alignItems="center">

                {/* Columna Izquierda (Imagen y Botones) */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
                        {/* Imagen */}
                        <img src={Escudo} alt="Logo-Sileii" style={{ maxWidth: "80%", height: "auto" }} />
                        
                        {/* URL */}
                        <Typography variant="h6" gutterBottom align="center">
                            <Button
                                align="left"
                                style={{ background: 'transparent', color: '#2424E1', textDecoration: 'underline', textAlign: 'center' }}
                                onClick={() => window.location.href = `${labData?.url_instituto}`}
                            >
                                URL DEL INSTITUTO
                            </Button>
                        </Typography>
                    </Box>
                </Grid>

                {/* Columna Derecha (Formulario) */}
                <Grid item xs={12} sm={6} md={8} lg={8}>
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
                            <Typography variant="h4" gutterBottom align="left" style={{ color: "#64001D", fontWeight: "bold", marginBottom: "20px" }}>
                                {labData.nombre} {labData.apellido_paterno} {labData.apellido_materno}
                            </Typography>
                        </Box>
                        {/* Información para el encargado */}
                        <Typography variant="h6" gutterBottom align="left">
                            Visión
                        </Typography>
                        <Typography variant="body1" paragraph align="left">
                            {labData.vision}
                        </Typography>
                        {/* ... (información del encargado) */}

                        {/* Información para el laboratorio */}
                        <Typography variant="h6" gutterBottom align="left">
                            Misión

                        </Typography>
                        <Typography variant="body1" paragraph align="left">
                            {labData.mision}
                        </Typography>
                        {/* ... (información del laboratorio) */}

                        {/* Información para el área */}
                        <Typography variant="h6" gutterBottom align="left">
                            Reseña Histórica
                        </Typography>
                        <Typography variant="body1" paragraph align="left">
                            {labData.historia}
                        </Typography>
                        {/* ... (información del área) */}

                        {/* Información para la misión */}
                        <Typography variant="h6" gutterBottom align="left">
                            Ubicación:
                        </Typography>
                        <Typography variant="body1" paragraph align="left">
                            {labData.ubicacion}
                        </Typography>

                        {/* Información para la visión */}
                        <Typography variant="h6" gutterBottom align="left">
                            Director:
                        </Typography>
                        <Typography variant="body1" paragraph align="left">
                            {labData.director.nombre}
                        </Typography>
                        {/* Información para la visión */}

                        {/* Información para la visión */}
                        <Typography variant="h6" gutterBottom align="left">
                            Contacto:
                        </Typography>
                        <Typography variant="body1" paragraph align="left">
                            {labData.contacto}
                        </Typography>
                        
                        
                    </Paper>
                </Grid>
            </Grid>
        </Container>

    );
}

export default App;
