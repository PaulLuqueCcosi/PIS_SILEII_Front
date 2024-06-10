import { Container, Grid, Paper, Typography, Box, Button,IconButton } from "@mui/material";
import LabForm from "../componentes/LabForm";
import React, { useRef } from 'react';
import Escudo from "../assets/imagenes/login_back.png";
import { useLocation } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
    //ManageDocuments
    const handleCancel = () => {
        navigate(-1);
    };
    //ManageProyects
    return (
        <Container maxWidth="lg" sx={{
            minHeight: '80vh',
            paddingTop: '5%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'top',
            alignItems: 'top',
           
        }}>
            <Grid item xs={12} sm={12} md={12} lg={12} style={{ paddingBottom: "30px" }}>
                <Paper elevation={12} style={{ padding: "30px", width: '100%' }}>
                
                    <Grid container spacing={2} justifyContent="center" alignItems="center">

                        {/* Columna Izquierda (Imagen y Botones) */}
                        <Grid item xs={12} sm={12} md={3} lg={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconButton aria-label="back" onClick={handleCancel}  sx={{ color: '#64001D', fontWeight: 'bold', marginRight: '10px' }}>
                        <ArrowBackIcon />
                    </IconButton>
                            <Typography variant="h5" gutterBottom align="left" style={{ color: "#64001D", fontWeight: "bold" }}>
                                EQUIPO ESPECIALIZADO
                            </Typography>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={12} md={9} lg={9}>
                            <Typography gutterBottom align="left">
                                {labData.nombre}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid container spacing={4} justifyContent="center" alignItems="center" style={{ paddingBottom: "30px" }}>

                {/* Columna Izquierda (Imagen y Botones) */}
                <Grid item xs={12} sm={12} md={4} lg={4}>

                    <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection="column" height="100%">
                        <img  src={`${labData.image_url}`} alt="Logo-Sileii" style={{ maxWidth: "80%", height: "auto" }} />


                    </Box>

                </Grid>

                {/* Columna Derecha (Formulario) */}
                <Grid item xs={12} sm={12} md={8} lg={8}>
                    <Paper elevation={12} style={{ padding: "30px", width: '100%' }}>
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            {/* Columna Izquierda (Imagen y Botones) */}
                            <Grid item xs={12} sm={12} md={3} lg={3}>
                                <Typography variant="h6" gutterBottom align="left" style={{ color: "#64001D", fontWeight: "bold" }}>
                                    Marca/Modelo
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={9} lg={9}>
                                <Typography gutterBottom align="left">
                                    {labData.marca_modelo}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <Grid container spacing={2} justifyContent="center" alignItems="center">
                                    {/* Columna Izquierda (Imagen y Botones) */}
                                    <Grid item xs={12} sm={12} md={4} lg={4}>
                                        <Typography variant="h6" gutterBottom align="left" style={{ color: "#64001D", fontWeight: "bold" }}>
                                            Proveedor
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={8} lg={8}>
                                        <Typography gutterBottom align="left">
                                            {labData.proveedor}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <Grid container spacing={2} justifyContent="center" alignItems="center">
                                    {/* Columna Izquierda (Imagen y Botones) */}
                                    <Grid item xs={12} sm={12} md={4} lg={4}>
                                        <Typography variant="h6" gutterBottom align="left" style={{ color: "#64001D", fontWeight: "bold" }}>
                                            Contacto Proveedor
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={8} lg={8}>
                                        <Typography gutterBottom align="left">
                                            {labData.contacto_proveedor}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <Grid container spacing={2} justifyContent="center" alignItems="center">
                                    {/* Columna Izquierda (Imagen y Botones) */}
                                    <Grid item xs={12} sm={12} md={4} lg={4}>
                                        <Typography variant="h6" gutterBottom align="left" style={{ color: "#64001D", fontWeight: "bold" }}>
                                            Fecha de adquisición
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={8} lg={8}>
                                        <Typography gutterBottom align="left">
                                            {labData.fecha_adquisicion}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <Grid container spacing={2} justifyContent="center" alignItems="center">
                                    {/* Columna Izquierda (Imagen y Botones) */}
                                    <Grid item xs={12} sm={12} md={4} lg={4}>
                                        <Typography variant="h6" gutterBottom align="left" style={{ color: "#64001D", fontWeight: "bold" }}>
                                            Codigo Patrimonial
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={8} lg={8}>
                                        <Typography gutterBottom align="left">
                                            {labData.codigo_patrimonio}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                    </Paper>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} style={{ paddingBottom: "30px" }}>
                <Paper elevation={12} style={{ padding: "30px", width: '100%' }}>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <Grid container spacing={2} justifyContent="center" alignItems="center">
                                <Grid item xs={12} sm={12} md={2} lg={2}>
                                    <Typography variant="h6" gutterBottom align="left" style={{ color: "#64001D", fontWeight: "bold" }}>
                                        Accesorio
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} md={10} lg={10}>
                                    <Typography gutterBottom align="left">
                                        {labData.accesorio}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} justifyContent="center" alignItems="center">
                                <Grid item xs={12} sm={12} md={2} lg={2}>
                                    <Typography variant="h6" gutterBottom align="left" style={{ color: "#64001D", fontWeight: "bold" }}>
                                        Insumos
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} md={10} lg={10}>
                                    <Typography gutterBottom align="left">
                                        {labData.insumos}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <Typography variant="h6" gutterBottom align="left" style={{ color: "#64001D", fontWeight: "bold" }}>
                                Descripción
                            </Typography>
                            <Typography gutterBottom align="left">
                                {labData.descripcion}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Container>

    );
}

export default App;
