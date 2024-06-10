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
  Dialog,  // Importa Dialog
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

function ResLineas_de_investigacion() {
  const [lineas_de_investigacion, setLineas_de_investigacion] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lineas_de_investigacionPerPage] = useState(5);
  const [showInactive, setShowInactive] = useState(false);
  const navigate = useNavigate();

  const [hasReloaded, setHasReloaded] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);  // Nuevo estado
  const [lineaToDelete, setLineaToDelete] = useState(null);  // Nuevo estado

  useEffect(() => {
    const fetchLineas_de_investigacion = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('Token de autenticación no encontrado en el localStorage.');
          // Redirigir al usuario a la página de inicio de sesión
          navigate('/login');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}disciplinas`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (response.status === 200) {
          const data = response.data;
          const activelineas_de_investigacion = data['disciplinas'].filter(lineas_de_investigacion => lineas_de_investigacion.estado === true);

          setLineas_de_investigacion(activelineas_de_investigacion);
        } else {
          console.error('Error en la respuesta de la API:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchLineas_de_investigacion();
  }, []);

  const handleToggleInactive = () => {
    setShowInactive((prevState) => !prevState);
  };

  const handleBack = () => {
    navigate(-1);
  };


  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const add_management = (option) => {
    navigate('/add_management', { state: { option } });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleUpdateLineas_de_investigacion = (datos) => {
    let option = 3;
    navigate('/updateManagement', { state: { datos, option } });
  };

  const handleOpenDialog = (linea) => {
    setLineaToDelete(linea);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setLineaToDelete(null);
    setOpenDialog(false);
  };

  const confirmDelete = () => {
    if (lineaToDelete) {
      const { disciplina_id } = lineaToDelete;
      const token = localStorage.getItem('token');
      axios
        .delete(`${API_BASE_URL}disciplinas/${disciplina_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            window.location.reload();
          } else {
            console.error('Error en la respuesta de la API:', response.status);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    handleCloseDialog();
  };

  const indexOfLastLineas_de_investigacion = currentPage * lineas_de_investigacionPerPage;
  const indexOfFirstLineas_de_investigacion = indexOfLastLineas_de_investigacion - lineas_de_investigacionPerPage;
  const currentLineas_de_investigacion = lineas_de_investigacion.slice(indexOfFirstLineas_de_investigacion, indexOfLastLineas_de_investigacion);


  //modificado
  const filteredLineas_de_investigacion = lineas_de_investigacion.filter((linea) =>
    linea.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedFilteredLineas_de_investigacion = filteredLineas_de_investigacion.slice(
    indexOfFirstLineas_de_investigacion,
    indexOfLastLineas_de_investigacion
  );
  //modificado

  return (
    <Container
    maxWidth="mg" sx={{ py: 4  }} >
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
                  Lineas de Investigación
                </Typography>
              </Grid>
            </Grid>


        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={10}>
            <Button
              variant="contained"
              style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
              onClick={() => add_management(3)}
            >
              Agregar Líneas de Investigación
            </Button>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Buscar Área"
              variant="outlined"
              margin="normal"
              InputLabelProps={{ style: { color: '#64001D' } }}
              value={searchQuery}
              onChange={handleSearch}
            />
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>ID</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Nombre</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Actividad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                /*modificado
                currentLineas_de_investigacion
                .filter((lineas_de_investigacion) =>
                  lineas_de_investigacion.nombre.toLowerCase().includes(searchQuery.toLowerCase())
                )*/
                paginatedFilteredLineas_de_investigacion.map((lineas_de_investigacion, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ textAlign: 'center' }}>{lineas_de_investigacion.disciplina_id}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{lineas_de_investigacion.nombre}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Grid container spacing={1} alignItems="center" justifyContent="center">
                        <Grid item xs={12} sm={4}>
                          <Button
                            variant="contained"
                            fullWidth
                            style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                            onClick={() => handleUpdateLineas_de_investigacion(lineas_de_investigacion)}
                          >
                            Modificar
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Button
                            variant="contained"
                            fullWidth
                            style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                            onClick={() => handleOpenDialog(lineas_de_investigacion)}
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
          {Array.from({ length: Math.ceil(filteredLineas_de_investigacion.length / lineas_de_investigacionPerPage) }).map((_, index) => (
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
          onClose={handleCloseDialog}
        >
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que deseas eliminar esta línea de investigación?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={confirmDelete} autoFocus>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

export default ResLineas_de_investigacion;
