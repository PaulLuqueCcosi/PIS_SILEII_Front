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

function ResArea() {
  const [area, setArea] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [areaPerPage] = useState(5);
  const [showInactive, setShowInactive] = useState(false);
  const navigate = useNavigate();

const handleBack = () => {
    navigate(-1);
  };

  const [hasReloaded, setHasReloaded] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);  // Nuevo estado
  const [areaToDelete, setAreaToDelete] = useState(null);  // Nuevo estado
  
  useEffect(() => {
    const fetchArea = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('Token de autenticación no encontrado en el localStorage.');
          // Redirigir al usuario a la página de inicio de sesión
          navigate('/login');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}areas`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (response.status === 200) {
          const data = response.data;
          const activearea = data['areas'].filter(area => area.estado === true);

          setArea(activearea);
        } else {
          console.error('Error en la respuesta de la API:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchArea();
  }, []);

  const handleToggleInactive = () => {
    setShowInactive((prevState) => !prevState);
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

  const handleUpdateArea = (datos) => {
    let option = 2;
    navigate('/updateManagement', { state: { datos, option } });
  };

  const handleOpenDialog = (area) => {
    setAreaToDelete(area);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setAreaToDelete(null);
    setOpenDialog(false);
  };

  const confirmDelete = () => {
    if (areaToDelete) {
      const { area_id } = areaToDelete;
      const token = localStorage.getItem('token');
      axios
        .delete(`${API_BASE_URL}areas/${area_id}`, {
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

  const indexOfLastArea = currentPage * areaPerPage;
  const indexOfFirstArea = indexOfLastArea - areaPerPage;
  const currentArea = area.slice(indexOfFirstArea, indexOfLastArea);

  return (
    <Container
    maxWidth="mg" sx={{ py: 4  }}
    >
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
                  Areas
                </Typography>
              </Grid>
            </Grid>


        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={10}>
            <Button
              variant="contained"
              style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
              onClick={() => add_management(2)}
            >
              Agregar Área
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
              {currentArea
                .filter((area) =>
                  area.nombre.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((area, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ textAlign: 'center' }}>{area.area_id}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{area.nombre}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={6} sm={6} alignItems="center">
                          <Button
                            variant="contained"
                            style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                            onClick={() => handleUpdateArea(area)}
                          >
                            Modificar
                          </Button>
                        </Grid>
                        <Grid item xs={6} sm={6} alignItems="center">
                          <Button
                            variant="contained"
                            style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                            onClick={() => handleOpenDialog(area)}
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
          {Array.from({ length: Math.ceil(area.length / areaPerPage) }).map((_, index) => (
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
              ¿Estás seguro de que deseas eliminar esta área?
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

export default ResArea;
