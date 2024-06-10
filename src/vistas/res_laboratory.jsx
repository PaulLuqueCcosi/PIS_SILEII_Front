import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../js/config';

function ResLaboratory() {
  const [laboratory, setLaboratory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [laboratoryPerPage] = useState(5);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [laboratoryToDelete, setLaboratoryToDelete] = useState(null);

  useEffect(() => {
    const fetchLaboratory = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('Token de autenticación no encontrado en el localStorage.');
          // Redirigir al usuario a la página de inicio de sesión
          navigate('/login');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}laboratorios`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (response.status === 200) {
          const data = response.data;
          const activeLaboratory = data['laboratorios'].filter(laboratory => laboratory.estado === true);

          setLaboratory(activeLaboratory);
        } else {
          console.error('Error en la respuesta de la API:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Llama a la función para obtener los laboratorios
    fetchLaboratory();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleBack = () => {
    navigate(-1);
  };


  const add_management = (option) => {
    // Redirige a la página de edición de laboratorio
    navigate('/add_management', { state: { option } });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleUpdateLaboratory = (datos) => {
    let option = 1;
    navigate('/updateManagement', { state: { datos, option } });
  };

  const deleteLaboratory = (laboratoryId) => {
    // Muestra la ventana de confirmación
    setLaboratoryToDelete(laboratoryId);
    setOpenDialog(true);
  };

  const confirmDelete = async (laboratoryId) => {
    try {
      // Realiza la solicitud para eliminar el laboratorio por su ID
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_BASE_URL}laboratorios/${laboratoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Eliminación exitosa, actualiza el estado para reflejar los cambios
        const updatedLaboratory = laboratory.filter(laboratory => laboratory.laboratorio_id !== laboratoryId);
        setLaboratory(updatedLaboratory);
      } else {
        console.error('Error en la respuesta de la API:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      // Cierra la ventana de confirmación
      setOpenDialog(false);
    }
  };

  const indexOfLastLaboratory = currentPage * laboratoryPerPage;
  const indexOfFirstLaboratory = indexOfLastLaboratory - laboratoryPerPage;
  const currentLaboratory = laboratory.slice(indexOfFirstLaboratory, indexOfLastLaboratory);

  return (
    <Container
    maxWidth="mg" sx={{ py: 4  }} >
    <Paper elevation={5} sx={{ p: { xs: 2, md: 4 } }}
      >
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
                  Laboratorios
                </Typography>
              </Grid>
            </Grid>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={10}>
            <Button
              variant="contained"
              style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
              onClick={() => add_management(1)}
            >
              Agregar Nuevo
            </Button>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Buscar Laboratorio"
              variant="outlined"
              margin="normal"
              InputLabelProps={{ style: { color: '#64001D' } }}
              value={searchQuery}
              onChange={handleSearch}
            />
          </Grid>
        </Grid>

        <TableContainer style={{ maxHeight: '50vh' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>ID</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Nombre</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%', width: '60%' }}>Actividad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentLaboratory
                .filter((laboratory) =>
                  laboratory.nombre.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((laboratory, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ textAlign: 'center' }}>{laboratory.laboratorio_id}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{laboratory.nombre}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={6} sm={6} alignItems="center">
                          <Button
                            variant="contained"
                            //fullWidth
                            style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                            onClick={() => handleUpdateLaboratory(laboratory)}
                          >
                            Modificar
                          </Button>
                        </Grid>
                        <Grid item xs={6} sm={6} alignItems="center">
                          <Button
                            variant="contained"
                            //fullWidth
                            style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                            onClick={() => deleteLaboratory(laboratory.laboratorio_id)}
                          >
                            Eliminar
                          </Button>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          {Array.from({ length: Math.ceil(laboratory.length / laboratoryPerPage) }).map((_, index) => (
            <Button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              variant={currentPage === index + 1 ? 'contained' : 'outlined'}
              style={{ margin: '5px' }}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        {/* Ventana de confirmación */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirmación de Eliminación"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ¿Estás seguro de que quieres eliminar este laboratorio?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancelar
            </Button>
            <Button onClick={() => confirmDelete(laboratoryToDelete)} color="primary" autoFocus>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

export default ResLaboratory;
