import React, { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { Container, Paper, Box, TextField, Grid, Button, Card, CardContent, CardMedia, Typography, IconButton } from '@mui/material';

import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import BuildIcon from '@mui/icons-material/Build';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { API_BASE_URL } from '../js/config';

// Componente funcional ListaGaleria
function ListaGaleria() {
    const navigate = useNavigate();
    const location = useLocation();
    const labData = location.state?.labData;
    const [showInactive, setShowInactive] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [linesInves, setLinesInves] = useState([]);
    const [showPaper, setShowPaper] = useState(false);
    const [userToDelete, setuserToDelete] = useState(null);

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

    useEffect(() => {
        // Obtener el token de autenticación y el correo electrónico del almacenamiento local
        const token = localStorage.getItem('token');

        // Verificar si el token existe en el almacenamiento local
        if (!token) {
            if (labData?.registro_id) {
                // Realizar una solicitud para obtener información del usuario por correo electrónico
                axios.get(`${API_BASE_URL}invitado/galeriaLaboratorios/${labData?.registro_id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                })
                    .then((response) => {
                        if (response.status === 200) {
                            const rawData = response.data.galeria;
                            setLinesInves(rawData);

                        }
                       

                    })
                    .catch(
                        console.error()
                    );
            }
            setShowPaper(false);
            return;

        }
        else {
            if (labData?.laboratorio_id) {
                // Realizar una solicitud para obtener información del usuario por correo electrónico
                axios.get(`${API_BASE_URL}coordinador/galeriaLaboratorios/${labData?.laboratorio_id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                })
                    .then((response) => {
                        if (response.status === 200) {
                            const rawData = response.data.galeria;
                            setLinesInves(rawData);

                        }

                    })
                    .catch(
                        console.error()
                    );
            }
            setShowPaper(true);
        }

        // Verificar si el correo electrónico existe en el almacenamiento local

    }, []);
    // Datos de ejemplo para la tabla


    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const rowsPerPage = 5;
    //const handleView = (userToEdit) => navigate('/view_responsable', { state: { userToEdit } });

    // Usuarios filtrados por la búsqueda
    const filteredUsers = linesInves.filter((user) =>
        user.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Usuarios paginados según la página actual
    const paginatedUsers = filteredUsers.slice(
        currentPage * rowsPerPage,
        currentPage * rowsPerPage + rowsPerPage
    );
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

    const handleCancel = () => {
        navigate(-1);
    };

    const handleadd = () => {
        navigate('/add_image', { state: { labData } });
    };
    const handleUpdateUser = (labData) => {
        navigate('/add_image', { state: { labData } });
    };


    const deleteUser = async galeria_id => {
        const token = localStorage.getItem('token');

        try {
            let servicio_id = galeria_id
            const response = await axios.delete(`${API_BASE_URL}coordinador/galeriaLaboratorio/${servicio_id}`, {
            
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });


            if (response.status === 200) {
                const updatedUsers = linesInves.filter(user => user.galeria_id !== galeria_id);
                setLinesInves(updatedUsers);
            } else {
                console.error('Error en la respuesta de la API:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };



    const handleOpenDialog = (galeria_id) => {
        setuserToDelete(galeria_id);
        setOpenDialog(true);
    };


    const handleCloseDialog = () => {
        setOpenDialog(false);
        setuserToDelete(null);
    };

    const confirmDelete = () => {
        deleteUser(userToDelete);
        handleCloseDialog();
    };

    // Renderizar el componente ListaGaleria   
    return (
        <Container maxWidth="mg" sx={{ py: 4  }} >
        <Paper elevation={5} sx={{ p: { xs: 2, md: 4 } }}>
                {/* Encabezado */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <IconButton aria-label="back" onClick={handleCancel} sx={{ color: '#64001D', fontWeight: 'bold', marginRight: '10px' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" align="left" gutterBottom sx={{ color: '#64001D', fontWeight: 'bold' }}>
                        Galería
                    </Typography>
                </Box>

                {/* Botones de Agregar y Buscar */}
                {/* {showPaper ? (</>):(</>)}*/}
                {showPaper ? (
                    <Grid container spacing={2} alignItems="center" style={{paddingLeft: '35px'}}>
                        <Grid xs={12} sm={10}>
                            <Button
                                variant="contained"
                                style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                                onClick={() => handleadd()}
                            >
                                Agregar
                            </Button>
                        </Grid>
                        <Grid xs={12} sm={2}>
                            <TextField
                                label="Buscar"
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{ style: { color: '#64001D' } }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                ) : (
                    <Grid container spacing={2} alignItems="center">

                        <Grid xs={12} sm={2}>
                            <TextField
                                label="Buscar"
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{ style: { color: '#64001D' } }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                )}
                {/* Secccion de galeria */}

                <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>


                    {paginatedUsers.map((project, index) => (
                        <Grid xs={12} sm={6} md={4} lg={4} key={index} sx={{ padding: "5%" }} >
                            <Card >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    src={`${project.image_url}`}
                                    alt={`${project.nombre_imagen}`}
                                />
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {project.nombre_imagen}
                                    </Typography>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {project.descripcion}
                                    </Typography>
                                    {showPaper ? ( <Grid container xs={12} style={{ paddingTop: '4%', alignContent: 'center', textAlign: 'center' }}
                                    >
                                        <Grid item xs={6} md={6}>
                                            {/* Botón para guardar el formulario */}
                                            <Button variant="contained" style={styles.button} onClick={() => handleUpdateUser(project)}>Editar</Button>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            {/* Botón para guardar el formulario */}
                                            <Button variant="contained" style={styles.button} onClick={() => handleOpenDialog(project.galeria_id)}>Eliminar</Button>
                                        </Grid>
                                    </Grid>):(<></>)}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}


                </Grid>
                {/* Paginación */}
                <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
                    {[...Array(totalPages)].map((_, index) => (
                        <Grid item key={index}>
                            <Button
                                variant={currentPage === index ? 'contained' : 'outlined'}
                                onClick={() => setCurrentPage(index)}
                                sx={{ mx: 0.5 }}
                            >
                                {index + 1}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
            {/* Cuadro de diálogo de confirmación de eliminación */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirmación de Eliminación"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ¿Estás seguro de que quieres eliminar esta imagen?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {/* Botones de Cancelar y Eliminar */}
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={confirmDelete} color="primary" autoFocus>
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}


export default ListaGaleria;
