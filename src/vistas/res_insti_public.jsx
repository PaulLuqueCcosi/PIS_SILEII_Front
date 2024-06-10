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
    IconButton, Box
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { API_BASE_URL } from '../js/config';

function ListaLab() {
    const [Rol, setLab] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchLab = async () => {
            try {       
                const response = await axios.get(`${API_BASE_URL}institutos`, {
                    headers: {
                      
                        'Accept': 'application/json',
                    },
                });

                if (response.status === 200) {
                   
                    const rawData = response.data.institutos;
                    const filteredData = rawData.filter(entry => entry.estado === true);
                    

                    setLab(filteredData);
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

    
    const handleView = (userToEdit) => navigate('/info_insti', { state: { userToEdit } });

    const filteredUsers = Rol.filter((user) =>
        user.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedUsers = filteredUsers.slice(
        currentPage * rowsPerPage,
        currentPage * rowsPerPage + rowsPerPage
    );

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    
    const handleDeleteInfo = async userId => {
        const token = localStorage.getItem('token');
    
        try {
          const response = await axios.delete(`${API_BASE_URL}registroLaboratorio/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
    
          if (response.status === 200) {
            const updatedUsers = users.filter(user => user.registro_id !== userId);
            fetchLab(); 
          } else {
            console.error('Error en la respuesta de la API:', response.status);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
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
                    Institutos
                </Typography></Box>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={9} md={10}>
                       
                    </Grid>
                    <Grid item xs={12} sm={3} md={2}>
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
                                
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%'}}>Nombre de Instituto</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '100%' }}>Responsable</TableCell>
                                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Acciones</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedUsers.map((user, index) => (
                                <TableRow key={index}>
                                    
                                    <TableCell sx={{ textAlign: 'center' }}>{user.nombre}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>{user.director.nombre}</TableCell>
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
                            style={{ margin: '0 5px' }}
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
