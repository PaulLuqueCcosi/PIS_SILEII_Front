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

function ResRol() {
  const [Rol, setRol] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [RolPerPage] = useState(5);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [rolToDelete, setRolToDelete] = useState(null);
  //modificado
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  //modificado

  useEffect(() => {
    const fetchRol = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('Token de autenticación no encontrado en el localStorage.');
          // Redirigir al usuario a la página de inicio de sesión
          navigate('/login');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}roles`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (response.status === 200) {
          const data = response.data;
          const activeRoles = data['roles'].filter(rol => rol.estado === true);

          setRol(activeRoles);
        } else {
          console.error('Error en la respuesta de la API:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Llama a la función para obtener los roles
    fetchRol();
  }, []);

  /*const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  }; reemplazado con:*/

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setGlobalSearchQuery(query);
  };

  const filteredRoles = Rol.filter((rol) =>
    rol.nombre.toLowerCase().includes(globalSearchQuery)
  );

  const add_management = (option) => {
    // Redirige a la página de edición de rol
    navigate('/add_management', { state: { option } });
  };

  const handleUpdateRol = (datos) => {
    let option = 4;
    // Redirige a la página de edición del rol con el Rol seleccionado
    navigate('/updateManagement', { state: { datos, option } });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const deleteRol = (rolId) => {
    // Muestra la ventana de confirmación
    setRolToDelete(rolId);
    setOpenDialog(true);
  };

  const confirmDelete = async (rolId) => {
    try {
      // Realiza la solicitud para eliminar el rol por su ID
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_BASE_URL}roles/${rolId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Eliminación exitosa, actualiza el estado para reflejar los cambios
        const updatedRol = Rol.filter(rol => rol.rol_id !== rolId);
        setRol(updatedRol);
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastRol = currentPage * RolPerPage;
  const indexOfFirstRol = indexOfLastRol - RolPerPage;
  const currentRol = Rol.slice(indexOfFirstRol, indexOfLastRol);

  return (
    <Container
    maxWidth="mg" sx={{ py: 4  }}
    >
      <Paper
        elevation={5} sx={{ p: { xs: 2, md: 4 } }}
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
                  Roles
                </Typography>
              </Grid>
            </Grid>


        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={10}>
            <Button
              variant="contained"
              style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
              onClick={() => add_management(4)}
            >
              Agregar
            </Button>
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Buscar Rol"
              variant="outlined"
              margin="normal"
              InputLabelProps={{ style: { color: '#64001D' } }}
              value={globalSearchQuery}
              onChange={handleSearch}
            />
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%', width: '10%' }}>ID</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%', width: '60%' }}>Rol</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%', width: '30%' }}>Actividad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRoles.slice(indexOfFirstRol, indexOfLastRol).map((rol, index) => (
                //modificado
                //currentRol
                //.filter((rol) =>
                //  rol.nombre.toLowerCase().includes(searchQuery.toLowerCase())
                //)
                //.map((rol, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ textAlign: 'center' }}>{rol.rol_id}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{rol.nombre}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Grid container spacing={2} alignItems="center" justifyContent="center">
                        <Grid item xs={6} sm={4}>
                          <Button
                            variant="contained"
                            fullWidth
                            style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                            onClick={() => handleUpdateRol(rol)}
                          >
                            Modificar
                          </Button>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                          <Button
                            variant="contained"
                            fullWidth
                            style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                            onClick={() => deleteRol(rol.rol_id)}
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
          {Array.from({ length: Math.ceil(Rol.length / RolPerPage) }).map((_, index) => (
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
              ¿Estás seguro de que quieres eliminar este rol?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancelar
            </Button>
            <Button onClick={() => confirmDelete(rolToDelete)} color="primary" autoFocus>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

export default ResRol;
