import React, { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Grid,
    IconButton
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../js/config';


function ListaLab() {
    const [labs, setLab] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();

  

    useEffect(() => {
        const fetchLab = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    console.error('Token de autenticación no encontrado en el localStorage.');
                    return;
                }

                const response = await axios.get(`${API_BASE_URL}registroLaboratorioPublico`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
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
                        disciplina_id: entry.disciplina_id,
                        ubicacion: entry.ubicacion,
                        registro_id: entry.registro_id,
                        disciplina: entry.disciplina.nombre // Asumiendo que existe un id en la respuesta de la API.
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
    const filteredUsers = labs.filter((user) =>
        user.laboratorio.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedUsers = filteredUsers.slice(
        currentPage * rowsPerPage,
        currentPage * rowsPerPage + rowsPerPage
    );
    const handleUpdateUser = (userToEdit) => {
        navigate('/info_laboratorio', { state: { userToEdit } });
    };

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

    return (
        <Container
            maxWidth="xl"
            sx={{
                minHeight: '50vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: '5%',
            }}
        >
            <Paper
                elevation={3}
                style={{ padding: '5px', width: '100%' }}
            >
                <Typography
                    variant="h4"
                    align="left"
                    gutterBottom
                    style={{ color: '#64001D', fontWeight: 'bold' }}
                >
                    Laboratorios Públicos
                </Typography>

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

                <TableContainer style={{ maxHeight: '50vh' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '100%', Width: '30%' }}>Laboratorio</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '100%', Width: '30%' }}>Área</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '100%', Width: '30%' }}>Disciplina</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '100%', Width: '30%' }}>Responsable</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '100%', Width: '40%' }}>Actividad</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedUsers.map((user, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ textAlign: 'center' }}>{user.laboratorio}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{user.area}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{user.disciplina}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{user.responsable}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        <Grid container alignItems="center" justifyContent="center">
                                            <Grid item xs={12} sm={4}>
                                                <IconButton
                                                    style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                                                    onClick={() => handleUpdateUser(user)}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
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
