import React, { useRef } from 'react';
import axios from 'axios';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Escudo from "../assets/imagenes/login_back.png";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Paper, Typography, Box, Button, IconButton } from "@mui/material";
import { API_BASE_URL } from '../js/config';

// Definir estilos para el componente
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
        paddingRight: 0
    },
  };

function App() {
    const location = useLocation();
    const labData = location.state?.labData;
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const handleDownload = async (poiId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('Token de autenticación no encontrado en el localStorage.');
                setShowPaper(false);
                navigate('/login');
                return;
            }

            const response = await axios.get(`${API_BASE_URL}director/pois/download/${poiId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', labData.nombre_poi); 
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error al descargar el archivo:', error);
        }
    };

    const handleBack = () => {
        navigate(-1);
      };

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

    return (
        <Container
        className='fondo'
        maxWidth="xl"
        sx={{
            paddingTop: '5%',
            minHeight: '50vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        }}
        >
        <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
        >
            <Grid item xs={12} sm={6} md={6} lg={7}>
            <Paper
                elevation={3}
                style={{
                padding: "60px",
                width: '100%',
                maxWidth: '600px'
                }}
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
                    POI
                </Typography>
                </Box>
                <Grid style={{ backgroundColor: '#FFFFFF', padding: '20px' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Typography variant="h6" gutterBottom align="left" style={{ color: "#64001D", fontWeight: "bold" }}>
                            Año
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} lg={8}>
                        <Typography gutterBottom align="left">
                            {labData?.year}
                        </Typography>
                    </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        <Typography variant="h6" gutterBottom align="left" style={{ color: "#64001D", fontWeight: "bold" }}>
                            Archivo
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} lg={8}>
                        <Typography gutterBottom align="left">
                            {labData?.nombre_poi}
                        </Typography>
                    </Grid>
                    </Grid>
                </Grid>
                </Grid>
            </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={5}>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
            >
                <img
                src={Escudo}
                alt="Logo-Sileii"
                style={{ width: "50%", height: "auto" }}
                />
            </Box>
            </Grid>
        </Grid>
        </Container>
    );
}

export default App;


/*import { Container, Grid, Paper, Typography, Box, Button } from "@mui/material";
import LabForm from "../componentes/LabForm";
import React, { useRef } from 'react';
import Escudo from "../assets/imagenes/login_back.png";
import { useLocation } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function App() {
    const location = useLocation();
    const labData = location.state?.labData;
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const handleDownload = async (poiId) => {
        try {
            const response = await axios.get(`/director/pois/download/${poiId}`, {
                responseType: 'blob', // Especificar el tipo de respuesta como blob
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'archivo_poi.pdf'); // Nombre de archivo sugerido
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error al descargar el archivo:', error);
            // Agregar código para manejar el error, como mostrar un mensaje al usuario
        }
    };


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
            <Grid container spacing={4} justifyContent="center" alignItems="center" style={{ paddingBottom: "30px" }}>

                <Grid item xs={12} sm={12} md={4} lg={4}>

                    <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection="column" height="100%">
                        <Button variant="contained" onClick={() => handleDownload(labData.id)}>Descargar POI</Button>

                    </Box>

                </Grid>

                <Grid item xs={12} sm={12} md={8} lg={8}>
                    <Paper elevation={12} style={{ padding: "30px", width: '100%' }}>
                        <Grid container spacing={2} justifyContent="center" alignItems="center">

                            <Grid item xs={12} sm={12} md={3} lg={3}>
                                <Typography variant="h5" gutterBottom align="left" style={{ color: "#64001D", fontWeight: "bold" }}>
                                    POI
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <Grid container spacing={2} justifyContent="center" alignItems="center">

                                    <Grid item xs={12} sm={12} md={4} lg={4}>
                                        <Typography variant="h6" gutterBottom align="left" style={{ color: "#64001D", fontWeight: "bold" }}>
                                            Año
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={8} lg={8}>
                                        <Typography gutterBottom align="left">
                                            {labData.year}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <Grid container spacing={2} justifyContent="center" alignItems="center">

                                    <Grid item xs={12} sm={12} md={4} lg={4}>
                                        <Typography variant="h6" gutterBottom align="left" style={{ color: "#64001D", fontWeight: "bold" }}>
                                            Archivo
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={8} lg={8}>
                                        <Typography gutterBottom align="left">
                                            {labData.document_uri}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                    </Paper>
                </Grid>
            </Grid>
        </Container>

    );
}

export default App;
*/