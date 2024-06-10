import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Container, Paper, Typography, TextField, Table, TableContainer,
    TableHead, TableBody, TableRow, TableCell, Button, Grid, IconButton
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../js/config';

function ListaLab() {
    const [Rol, setLab] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLabs = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error('Token de autenticación no encontrado en el localStorage.');
                // Redirigir al usuario a la página de inicio de sesión
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get(`${API_BASE_URL}registroLaboratorios/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });

                if (response.status === 200) {
                    const filteredData = response.data.Labs.filter(entry => entry.estado === true);
                    const transformedData = filteredData.map(entry => ({
                        laboratorio: entry.laboratorio.nombre,
                        responsable: `${entry.coordinador.nombre} ${entry.coordinador.apellido_paterno} ${entry.coordinador.apellido_materno}`,
                        estado: entry.estado,
                        area: entry.area.nombre,
                        coordinador_id: entry.coordinador_id,
                        laboratorio_id: entry.laboratorio_id,
                        area_id: entry.area_id,
                        mision: entry.mision,
                        vision: entry.vision,
                        historia: entry.historia,
                        ubicacion: entry.ubicacion,
                        registro_id: entry.registro_id,
                    }));

                    setLab(transformedData);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchLabs();
    }, []);

    const filteredLabs = Rol.filter(lab => String(lab.laboratorio_id).includes(searchQuery));
    const paginatedLabs = filteredLabs.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);
    const totalPages = Math.ceil(filteredLabs.length / rowsPerPage);

    const handleUpdateUser = (userToEdit) => navigate('/info_lab_admin', { state: { userToEdit } });


const handleBack = () => {
    navigate(-1);
  };

    const handleCompleteLab = (userToEdit) => navigate('/complete_lab_admin', { state: { userToEdit } });

    return (
        <Container maxWidth="mg" sx={{ py: 4 }}>
            <Paper elevation={5} sx={{ p: { xs: 2, md: 4 } }}>
                {/* Fila con dos columnas */}
            <Grid container alignItems="center">
              <Grid item>
                {/* Flecha de retroceso */}
                <IconButton
                  aria-label="back"
                  onClick={handleBack}
                  sx={{ color: '#64001D', fontWeight: 'bold', marginRight: '10px' }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Grid>
              <Grid item>
                {/* Título */}
                <Typography
                  variant="h4"
                  align="left"
                  gutterBottom
                  sx={{
                    color: '#64001D',
                    fontWeight: 'bold',
                  }}
                >
                  Laboratorios Registrados
                </Typography>
              </Grid>
            </Grid>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={10}></Grid>
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

                <TableContainer >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%', width: '37%' }}>Laboratorio</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%', width: '37%' }}>Responsable</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%', width: '25%' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedLabs.map((lab, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ textAlign: 'center' }}>{lab.laboratorio}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{lab.responsable}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <Grid container spacing={2} alignItems="center" direction="row">
                                            <Grid item xs={12} sm={6}>
                                                <IconButton style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                                                    onClick={() => handleUpdateUser(lab)}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Grid>
                                            <Grid item xs={12} sm={5}>
                                                <Button variant="contained" style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                                                onClick={() => handleCompleteLab(lab)}
                                                >
                                                    Completar
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
                    {[...Array(totalPages)].map((_, index) => (
                        <Button
                            key={index}
                            variant={currentPage === index ? 'contained' : 'outlined'}
                            onClick={() => setCurrentPage(index)}
                            style={{ margin: '0 5px' }}
                        >
                            {index + 1}
                        </Button>
                    ))}
                </div>
            </Paper>
        </Container>
    );
}

export default ListaLab;
