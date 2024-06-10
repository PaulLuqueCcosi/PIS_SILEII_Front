import React, { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import {
    Container, Paper, Typography, TextField, Table, TableContainer,
    TableHead, TableBody, TableRow, TableCell, Button, Grid, IconButton, Box
} from '@mui/material';
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

// Componente funcional FunctionInsti
function FunctionInsti() {
    const navigate = useNavigate();
    const location = useLocation();
    const labData = location.state?.labData;
    const [showPaper, setShowPaper] = useState(false);
    const [pois, setPois] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const rowsPerPage = 5;
    const [openDialog, setOpenDialog] = useState(false);
    const [poiToDelete, setPoiToDelete] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('Token de autenticación no encontrado en el localStorage.');
                    setShowPaper(false);
                    navigate('/login');
                    return;
                } else {
                    setShowPaper(true);
                }

                if (labData?.instituto_id) {
                    axios.get(`${API_BASE_URL}director/pois/${labData?.instituto_id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                        },
                    })
                    .then((response) => {
                        if (response.status === 200) {
                            setPois(response.data.pois);
                        }
                    })
                }
            } catch (error) {
                console.error('Error al obtener los POIs:', error);
            }
        };
        fetchData();
    }, [labData, navigate]);

    const filteredPois = pois.filter((poi) =>
        poi.nombre_poi.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const paginatedPois = filteredPois.slice(
        currentPage * rowsPerPage,
        currentPage * rowsPerPage + rowsPerPage
    );
    const totalPages = Math.ceil(filteredPois.length / rowsPerPage);

    const handleCancel = () => {
        navigate(-1);
    };

    const handleAdd = () => {
        navigate('/add_poi', { state: { labData } });
    };

    const handleViewPoi = (labData) => {
        navigate('/info_poi', { state: { labData } });
    };

    const handleUpdatePoi = (labData) => {
        navigate('/add_poi', { state: { labData } });
    };

    const deletePoi = async (poiId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(`${API_BASE_URL}director/pois/${poiId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                //const updatedPois = pois.filter(poi => poi.id !== poiId);
                //setPois(updatedPois);
                setPois(prevPoi => prevPoi.filter(pois => pois.id !== poiId));
            } else {
                console.error('Error en la respuesta de la API:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleOpenDialog = (poiId) => {
        setPoiToDelete(poiId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setPoiToDelete(null);
    };

    const confirmDelete = () => {
        deletePoi(poiToDelete);
        handleCloseDialog();
    };

    const handleDownloadPoi = async (poi) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${API_BASE_URL}director/pois/download/${poi.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                responseType: 'blob', // Indicamos que esperamos un blob como respuesta
            });
    
            // Creamos un Blob a partir de la respuesta
            const blob = new Blob([response.data]);
    
            // Creamos una URL para el blob
            const url = window.URL.createObjectURL(blob);
    
            // Creamos un elemento de enlace
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', poi.nombre_poi); // Establecemos el nombre de archivo para la descarga
            document.body.appendChild(link);
    
            // Disparamos el evento click para iniciar la descarga
            link.click();
    
            // Limpiamos
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    return (
        <Container maxWidth="mg" sx={{ py: 4  }} >
        <Paper elevation={5} sx={{ p: { xs: 2, md: 4 } }}>
                <Box sx={{ alignItems: 'center', mb: 1 }}>
                    <IconButton aria-label="back" onClick={handleCancel} sx={{ color: '#64001D', fontWeight: 'bold' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" align="center" gutterBottom sx={{ textAlign: 'center', color: '#64001D', fontWeight: 'bold' }}>
                        POIs
                    </Typography>
                </Box>

                {showPaper ? (
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={10}>
                            <Button
                                variant="contained"
                                style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                                onClick={handleAdd}
                            >
                                Agregar POI
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={2}>
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
                ) : null}

                {pois.length ? (
                    <TableContainer sx={{ maxHeight: '50vh', marginTop: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Año</TableCell>
                                    <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Nombre del Archivo</TableCell>
                                    {showPaper ? (<TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Acción</TableCell>) : null}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedPois.map((poi) => (
                                    <TableRow key={poi.id}>
                                        <TableCell sx={{ textAlign: 'center' }}>{poi.year}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>{poi.nombre_poi}</TableCell>
                                        {showPaper ? (
                                            <TableCell sx={{ textAlign: 'center' }}>
                                                <Grid container spacing={1} alignItems="center" justifyContent="center">
                                                    <Grid item xs={3}>
                                                        <IconButton onClick={() => handleUpdatePoi(poi)}>
                                                            <BuildIcon color="action" />
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <IconButton onClick={() => handleOpenDialog(poi.id)}>
                                                            <DeleteIcon color="error" />
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <IconButton onClick={() => handleDownloadPoi(poi)}>
                                                            <GetAppIcon color="primary" />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </TableCell>
                                        ) : null}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
                        <Typography variant="h6">No hay POIs disponibles.</Typography>
                    </Grid>
                )}

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
                        ¿Estás seguro de que quieres eliminar este POI?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
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

export default FunctionInsti;
