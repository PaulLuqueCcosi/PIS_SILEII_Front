import React, { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Container, Paper, Typography, TextField, Table, TableContainer,
    TableHead, TableBody, TableRow, TableCell, Button, Grid, IconButton, Box
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import BuildIcon from '@mui/icons-material/Build';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import EditIcon from '@mui/icons-material/Edit';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { API_BASE_URL } from '../js/config';



// Componente funcional FuntionInsti
function FuntionInsti() {
    const navigate = useNavigate();
    const location = useLocation();
    const labData = location.state?.labData;
    const [showInactive, setShowInactive] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [linesInves, setLinesInves] = useState([]);
    const [showPaper, setShowPaper] = useState(false);
    const [userToDelete, setuserToDelete] = useState(null);
    const [servicio_id, setservicio_id] = useState(null);


    const getStatusColor = (status) => {
        switch (status) {
            case 'INICIO':
                return '#E1DB24'; // Rojo
            case 'EN PROCESO':
                return '#FFA40E'; // Naranja
            case 'FINALIZADO':
                return '#55D50C'; // Verde
            default:
                return ''; // Puedes establecer un color predeterminado o dejarlo vacío
        }
    };



    useEffect(() => {
        // Obtener el token de autenticación y el correo electrónico del almacenamiento local
        const token = localStorage.getItem('token');

        // Verificar si el token existe en el almacenamiento local
        if (!token) {
            console.log('Token de autenticación no encontrado en el localStorage.');
            setShowPaper(false);
            // Redirigir al usuario a la página de inicio de sesión
            navigate('/login');
            return;

        }
        else {
            setShowPaper(true);
        }

        // Verificar si el correo electrónico existe en el almacenamiento local
        if (labData?.instituto_id) {
            // Realizar una solicitud para obtener información del usuario por correo electrónico
            axios.get(`${API_BASE_URL}directores/servicios/${labData?.instituto_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            })
                .then((response) => {
                    if (response.status === 200) {
                        const rawData = response.data.servicios;
                        const filteredData = rawData.filter(entry => entry.estado === true);
                        if (filteredData[0]?.servicio_id) {
                            setservicio_id(true);
                        } else {
                            setservicio_id(null);
                        }

                        setLinesInves(filteredData);


                    }

                })
                .catch(
                    console.error()
                );
        }
    }, []);
    // Datos de ejemplo para la tabla


    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const rowsPerPage = 5;
    //const handleView = (userToEdit) => navigate('/view_responsable', { state: { userToEdit } });

    // Usuarios filtrados por la búsqueda
    const filteredUsers = linesInves.filter((user) =>
        user.servicio.toLowerCase().includes(searchQuery.toLowerCase())
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
        navigate('/add_tusne_insti', { state: { labData } });
    };
    const handleUpdateUser = (labData) => {
        navigate('/add_tusne_insti', { state: { labData } });
    };


    const deleteUser = async servicio_id => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.delete(`${API_BASE_URL}directores/servicios/eliminar/${servicio_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });


            if (response.status === 200) {
                //const updatedUsers = linesInves.filter(user => user.servicio_id !== servicio_id);
                //setLinesInves(updatedUsers);
                //setservicio_id(null);
                setLinesInves(prevTusne => prevTusne.filter(linesInves => linesInves.servicio_id !== servicio_id));

            } else {
                console.error('Error en la respuesta de la API:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        //window.location.reload();

    };

    const handleOpenDialog = (servicio_id) => {
        setuserToDelete(servicio_id);
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

    // Renderizar el componente FuntionInsti    
    return (

        <Container maxWidth="mg" sx={{ py: 4  }} >
        <Paper elevation={5} sx={{ p: { xs: 2, md: 4 } }}>

                {/* Encabezado */}
                <Box sx={{ alignItems: 'center', mb: 1 }}>
                    <IconButton aria-label="back" onClick={handleCancel} sx={{ color: '#64001D', fontWeight: 'bold' }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" align="center" gutterBottom sx={{ textAlign: 'center', color: '#64001D', fontWeight: 'bold' }}>
                        Gestión Tusne
                    </Typography>
                </Box>

                {/* Botones de Agregar y Buscar */}
                {/* {showPaper ? (</>):(</>)}*/}
                {showPaper ? (
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={10}>
                            <Button
                                variant="contained"
                                style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                                onClick={() => handleadd()}
                            >
                                Añadir
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

                ) : (
                    <></>
                )}
                {/* Tabla de servicioses */}
                {servicio_id ? (
                    <TableContainer sx={{ border: '1px solid rgba(100, 0, 29, 0.5)', borderRadius: '8px', marginBottom: '16px' }}>
                        <Table sx={{ borderRadius: '8px', overflow: 'hidden' }}>
                        <TableHead sx={{ backgroundColor: '#64001D', borderRadius: '8px' }}>
                            <TableRow>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%', color: '#ffffff', border: '1px solid #64001D' }}>id</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%', color: '#ffffff', border: '1px solid #64001D' }}>Servicio</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%', color: '#ffffff', border: '1px solid #64001D' }}>Total</TableCell>

                                {showPaper ? (<TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%', color: '#ffffff', border: '1px solid #64001D' }}>Accion</TableCell>) : (<></>)}
                            </TableRow>
                        </TableHead>
                            <TableBody>
                                {paginatedUsers.map((user, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ textAlign: 'center', }}>{user.servicio_id}</TableCell>
                                        <TableCell sx={{ textAlign: 'center', }}>{user.servicio}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}> 
                                            S/. {(
                                                parseFloat(user.mano_obra) +
                                                parseFloat(user.materiales) +
                                                parseFloat(user.ci_mano_obra) +
                                                parseFloat(user.ci_deprec_equi) +
                                                parseFloat(user.ci_deprec_edif) +
                                                parseFloat(user.ci_util_limp) +
                                                parseFloat(user.ci_util_aseo) +
                                                parseFloat(user.ci_mantto) +
                                                parseFloat(user.ci_servicios)
                                            ).toFixed(2)}
                                        </TableCell>

                                        {showPaper ? (

                                            <TableCell sx={{ textAlign: 'center' }}>
                                                {/* Acciones: Editar y Eliminar */}
                                                <Grid container spacing={1} alignItems="center" justifyContent="center">
                                                <Grid item xs={4}>
                                                    <IconButton onClick={() => handleUpdateUser(user)}>
                                                        <EditIcon color="action" />
                                                    </IconButton>
                                                </Grid>
                                                    <Grid item xs={4}>
                                                        <IconButton
                                                            onClick={() => handleOpenDialog(user.servicio_id)}>
                                                            <DeleteIcon color="error" />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </TableCell>

                                        ) : (<></>)}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
                        <h1 sx={{ textAlign: 'center' }}>LA INFORMACIÓN ESTARÁ DISPONIBLE PRÓXIMAMENTE</h1>
                    </Grid>
                )}
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
                        ¿Estás seguro de que quieres eliminar esta servicio?
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


export default FuntionInsti;
