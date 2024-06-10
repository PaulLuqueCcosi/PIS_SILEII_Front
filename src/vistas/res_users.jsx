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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../js/config';

/**
 * Componente ResUsers para gestionar la visualización y acciones sobre usuarios.
 */
function ResUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;  // Convertido a constante ya que no se modifica
  const [showInactive, setShowInactive] = useState(false);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  //modificado
  const [allUsers, setAllUsers] = useState([]);  // Nuevo estado para almacenar todos los usuarios
  const [filteredUsers, setFilteredUsers] = useState([]);  // Nuevo estado para almacenar los usuarios filtrados
  //modificado


  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token de autenticación no encontrado en el localStorage.');
        // Redirigir al usuario a la página de inicio de sesión
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}usuarios`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (response.status === 200) {
          /*
          const updatedUsers = response.data.usuarios.filter(user => user.estado === true);
          setUsers(updatedUsers);*/
          //modificado
          const updatedAllUsers = response.data.usuarios;
          setAllUsers(updatedAllUsers);
          applySearch(updatedAllUsers);
          //modificado
        } else {
          console.error('Error en la respuesta de la API:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchRoles = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${API_BASE_URL}roles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        console.log('Roles:', response.data);
        // Actualiza el estado de los roles con los datos recibidos
        setRoles(response.data.roles);
      } catch (error) {
        console.error('Error al obtener los roles:', error);
        // Manejo de errores
      }
    };

    fetchUsers();
    fetchRoles();
  }, [navigate]);

  const handleToggleInactive = () => setShowInactive(prevState => !prevState);

  //modificado
  const applySearch = (usersToFilter) => {
    // Filtrar usuarios según la consulta de búsqueda
    const filtered = usersToFilter.filter((user) =>
      user.correo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  };
  //modificado

  //comentado const handleSearch = e => setSearchQuery(e.target.value);

  //modificado
  const handleSearch = e => {
    setSearchQuery(e.target.value);
    // Aplicar búsqueda a todos los usuarios
    applySearch(allUsers);
  };
  //modificado

  const handleUpdateUser = userToEdit => {
    const email_local = localStorage.getItem('correo');
    if (email_local === userToEdit.correo) {
      localStorage.setItem('id_user_l', userToEdit.usuario_id);
    }
    navigate('/UpdateUser', { state: { userToEdit } });
  };

  const deleteUser = async userId => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.delete(`${API_BASE_URL}usuarios/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const updatedUsers = users.filter(user => user.usuario_id !== userId);
        setUsers(updatedUsers);
      } else {
        console.error('Error en la respuesta de la API:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  /*comentado
  const handlePageChange = pageNumber => setCurrentPage(pageNumber);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  */
  const handlePageChange = pageNumber => setCurrentPage(pageNumber);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentFilteredUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const confirmDelete = async (userId) => {
    try {
      await deleteUser(userId);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setOpenDialog(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };



  return (
    <Container maxWidth="mg" sx={{ py: 4  }} >
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
                  Gestión de Usuarios
                </Typography>
              </Grid>
            </Grid>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={9} md={10}>
            <Button
              component={Link}
              to="/AddUser"
              variant="contained"
              style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
            >
              Agregar Usuario
            </Button>
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <TextField
              label="Buscar correo o nombre"
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
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Código de Usuario</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Nombre y Apellidos</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Rol</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Correo Institucional</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Actividad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                /* comentado
                currentUsers
                .filter((user) =>
                  user.correo.toLowerCase().includes(searchQuery.toLowerCase())
                )*/
                filteredUsers.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ textAlign: 'center' }}>{user.usuario_id}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{user.nombre} {user.apellido_paterno} {user.apellido_materno}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>  {roles.find(role => role.rol_id === user.rol_id)?.nombre || 'Desconocido'} </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{user.correo}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Grid container spacing={1} alignItems="center" justifyContent="center">
                        <Grid item xs={12} sm={4}>
                          <Button
                            variant="contained"
                            fullWidth
                            style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                            onClick={() => handleUpdateUser(user)}
                          >
                            Modificar
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Button
                            variant="contained"
                            fullWidth
                            style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                            onClick={() => {
                              setUserToDelete(user.usuario_id);
                              setOpenDialog(true);
                            }}
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
          {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map((_, index) => (
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
              ¿Estás seguro de que quieres eliminar este usuario?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancelar
            </Button>
            <Button onClick={() => confirmDelete(userToDelete)} color="primary" autoFocus>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

export default ResUsers;