import React, { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Container, Paper, Typography, TextField, Table, TableContainer,
    TableHead, TableBody, TableRow, TableCell, Button, Grid, IconButton, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { API_BASE_URL } from '../js/config';

function ListaLab() {
    const navigate = useNavigate();
    const [labs, setLab] = useState([]);


    useEffect(() => {
        const fetchLab = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}registroLaboratorioPublico`, {
                    headers: {
                        'Accept': 'application/json',
                    },
                });

                if (response.status === 200) {
                    const rawData = response.data.publiclabs;
                    const transformedData = rawData.map(entry => ({
                        laboratorio: entry.laboratorio.nombre,
                        responsable: `${entry.coordinador.nombre} ${entry.coordinador.apellido_paterno} ${entry.coordinador.apellido_materno}`,
                        estado: entry.estado,
                        area: entry.area.nombre,
                        coordinador_id: entry.coordinador.usuario_id,
                        laboratorio_id: entry.laboratorio.laboratorio_id,
                        area_id: entry.area.area_id,
                        //disciplina_id: entry.disciplina_id,
                        disciplinas: entry.disciplinas.map(disciplina => disciplina.nombre).join(', '),
                        ubicacion: entry.ubicacion,
                        registro_id: entry.registro_id,
                        //disciplina: entry.disciplina.nombre,
                        coordinador: entry.coordinador,  // Aquí incluimos todos los datos del coordinador
                        // Asumiendo que existe un id en la respuesta de la API.
                    }));

                    setLab(transformedData);
                } else {
                    console.error('Error en la respuesta de la API:', response.status);
                }
                //  window.location.reload();
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchLab();
    }, []);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const rowsPerPage = 5;
    const handleView = (userToEdit) => navigate('/view_responsable', { state: { userToEdit } });

    const handleViewLab = (userToEdit) => navigate('/info_laboratorio', { state: { userToEdit } });

    const filteredUsers = labs.filter((user) =>
        user.laboratorio.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedUsers = filteredUsers.slice(
        currentPage * rowsPerPage,
        currentPage * rowsPerPage + rowsPerPage
    );
    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const handleBack = () => {
        navigate(-1);
      };
    
    return (
        <Container maxWidth="ml" sx={{ py: 4  }}>
            <Paper elevation={5} sx={{ p: { xs: 2, md: 4 } }}>
                {/* Botón de retroceso */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <IconButton
                        aria-label="back"
                        onClick={handleBack}
                        sx={{ color: '#64001D', fontWeight: 'bold', marginRight: '10px' }}
                    >
                        <ArrowBackIcon />
                    </IconButton>

                    <Typography variant="h4" align="left" gutterBottom sx={{ color: '#64001D', fontWeight: 'bold' }}>
                        Laboratorios
                    </Typography></Box>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={10}>
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

                <TableContainer >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Laboratorios</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Responsable</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedUsers.map((user, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ textAlign: 'center' }}>{user.laboratorio}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{user.responsable}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <Grid container spacing={1} alignItems="center" justifyContent="center">
                                            <Grid item xs={12} sm={4}>
                                                <IconButton
                                                    sx={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                                                    onClick={() => handleView(user)}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                                                    onClick={() => handleViewLab(user)}
                                                >
                                                    Mostrar Información
                                                </Button>

                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

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
        </Container>
    );
}

export default ListaLab;
