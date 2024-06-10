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
  Switch,
  IconButton
} from '@mui/material';
import axios from 'axios'; 
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../js/config';
import DeleteIcon from '@mui/icons-material/Delete';
import BuildIcon from '@mui/icons-material/Build';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
/**
 * Componente ResUsers para gestionar la visualización y acciones sobre usuarios.
 */
function ResUsers() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;  // Convertido a constante ya que no se modifica
  const [showInactive, setShowInactive] = useState(false);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [userToDelete, setuserToDelete] = useState(null);

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
          const updatedUsers = response.data.usuarios.filter(user => user.rol_id === 5 && user.estado === true);
          setUsers(updatedUsers);
        } else {
          console.error('Error en la respuesta de la API:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleInactive = () => setShowInactive(prevState => !prevState);

  const handleSearch = e => setSearchQuery(e.target.value);

  const handleUpdateUser = userToEdit => {
    const email_local = localStorage.getItem('correo');
    if (email_local === userToEdit.correo) {
      localStorage.setItem('id_user_l', userToEdit.usuario_id);
    }
    navigate('/add_comite_director', { state: { userToEdit } });
  };

  const deleteUser = async userId => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.delete(`${API_BASE_URL}comiteDirectivo/${userId}`, {
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

  const handleOpenDialog = (userId) => {
    setuserToDelete(userId);
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
  const handlePageChange = pageNumber => setCurrentPage(pageNumber);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <Container
    maxWidth="mg" sx={{ py: 4  }} >
            <Paper elevation={5} sx={{ p: { xs: 2, md: 4 } }}

      >
        <Typography
          variant="h4"
          align="left"
          gutterBottom
          sx={{
            color: '#64001D',
            fontWeight: 'bold',

          }}
        >
          Gestión de Operador de Instituto
        </Typography>

        <Grid container spacing={2} alignItems="center">

          <Grid item xs={12} sm={9} md={10}>
            <Button
              component={Link}
              to="/add_comite_director"
              variant="contained"
              style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
            >
              Añadir
            </Button>
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <TextField
              label="Buscar"
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
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Código de Usuario</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Nombre y Apellidos</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Rol</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Correo Institucional</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Actividad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentUsers
                .filter((user) =>
                  user.nombre.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((user, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ textAlign: 'center' }}>{user.usuario_id}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{user.nombre} {user.apellido_paterno} {user.apellido_materno}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>  {user.rol_id === 5 ? 'Operador de Instituto' : user.rol_id === 1 ? 'Administrador' : user.rol_id === 3 ? 'Operador' : user.rol_id === 2 ? 'Coordinador' : user.rol_id === 4 ? 'Director' : 'Desconocido'}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{user.correo}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Grid container spacing={1} alignItems="center" justifyContent="center">
                        <Grid item xs={4}>
                          <IconButton
                            onClick={() => handleUpdateUser(user)}>
                            <BuildIcon color="action" />
                          </IconButton>
                        </Grid>
                        <Grid item xs={4}>
                          <IconButton
                            onClick={() => handleOpenDialog(user.usuario_id)}>
                            <DeleteIcon color="error" />
                          </IconButton>
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
          {Array.from({ length: Math.ceil(users.length / usersPerPage) }).map((_, index) => (
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

      </Paper>
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
            ¿Estás seguro de que quieres eliminar este usuario?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
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

export default ResUsers;
