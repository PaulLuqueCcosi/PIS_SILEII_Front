import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Container, Paper, Typography, TextField, Table, TableContainer,
  TableHead, TableBody, TableRow, TableCell, Button, Grid, IconButton,Box,
  Card, CardContent
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import edit from "../assets/iconos/edit.ico";
import delete_ico from "../assets/iconos/delete.ico";
import maintenance_ico from "../assets/iconos/maintenance.ico";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BuildIcon from '@mui/icons-material/Build';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';

import { API_BASE_URL } from '../js/config';


function G_Equipments() {
  const location = useLocation();
  const [openDialog, setOpenDialog] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);
  const [Rol, setLab] = useState([]);
  const [equipment, setequipment] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const navigate = useNavigate();
  const [users, setUsers] = useState({ nombreusuario: '', rol: 0, id_user: 0 });
  const labData = location.state?.labData;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email_local = localStorage.getItem('correo');

    if (!token) {
      console.error('Token de autenticación no encontrado en el localStorage.');
      // Redirigir al usuario a la página de inicio de sesión
      navigate('/login');
      return;
    }

    if (email_local) {
      axios.get(`${API_BASE_URL}usuarios/getAllByEmail/${email_local}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })
        .then((response) => {
          if (response.status === 200) {
            const userData = response.data.usuarios[0];
            setUsers({
              nombreusuario: userData.correo,
              rol: userData.rol.rol_id,
              id_user: userData.usuario_id
            });

            if (userData.rol.rol_id === 1) {
              fetchAdminequipment(userData.usuario_id, token);
            } 
            if (userData.rol.rol_id === 2) {
              fetchCoordinatorequipment(userData.usuario_id, token);
            } else {
              fetchOperadorLabs(userData.usuario_id, token);
            }
          }
        })
        .catch(console.error);
    }
  }, []);


  const fetchOperadorLabs = async (userId, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}equipmentos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        const filteredDocs = response.data.equipos.filter(doc => doc.registro_id === labData.registro_id && doc.estado === true);
        setequipment(filteredDocs);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchCoordinatorequipment = async (userId, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}coordinador/equipos/${labData.registro_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        const filteredDocs = response.data.equipos.filter(doc => doc.estado === true);
        setequipment(filteredDocs);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchAdminequipment = async (userId, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}coordinador/equipos/${labData.registro_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        const filteredDocs = response.data.equipos.filter(doc => doc.estado === true);
        setequipment(filteredDocs);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  //const filteredItems = users.rol === 2 ? equipment.filter(doc => String(doc.equipmento_id).includes(searchQuery))
  //  : Rol.filter(user => String(user.laboratorio_id).includes(searchQuery));

  const filteredItems = equipment.filter(doc => {
    return String(doc.equipmento_id).includes(searchQuery) ||
      String(doc.nombre).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(doc.descripcion).toLowerCase().includes(searchQuery.toLowerCase());
  });
  

  const paginatedItems = filteredItems.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);
  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);


  const handleUpdateUser = (userToEdit) => navigate('/update_equipment', { state: { userToEdit } });
  const handleAddequipmentes = (userToEdit) => navigate('/add_equipment', { state: { userToEdit } });

  const handleMaintenance = (userToEdit) => navigate('/view_maintenance', { state: { userToEdit } });


  const handleDeleteInfo = async userId => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(`${API_BASE_URL}coordinador/equipos/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status >= 200 && response.status <= 300) {
        //window.location.reload();
        setequipment(prevEquipment => prevEquipment.filter(equipment => equipment.equipo_id !== userId));
      } else {
        console.error('Error en la respuesta de la API:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  /*const handleDeleteInfo = (RolId) => {
    // Realiza la solicitud para eliminar el instituto por su ID
    const token = localStorage.getItem('token');
    axios.delete(`${API_BASE_URL}coordinador/equipos/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          // Eliminación exitosa, actualiza el estado para reflejar los cambios
          const updatedRol = Rol.filter(Rol => Rol.instituto_id !== RolId);
          setLab(updatedRol);
        } else {
          console.error('Error en la respuesta de la API:', response.status);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };*/

  const handleOpenDialog = (equipmentId) => {
    setEquipmentToDelete(equipmentId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEquipmentToDelete(null);
  };
  const handleBack = () => {
    navigate(-1);
  };

  const confirmDelete = () => {
    handleDeleteInfo(equipmentToDelete);
    handleCloseDialog();
  };
  
  return (
    <Container
    maxWidth="mg" sx={{ py: 4  }} >
    <Paper elevation={5} sx={{ p: { xs: 2, md: 4 } }}
      >
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton aria-label="back" onClick={handleBack} sx={{ color: '#64001D', fontWeight: 'bold', marginRight: '10px' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            align="left"
            gutterBottom
            sx={{ color: '#64001D', fontWeight: 'bold', paddingLeft: '15px', paddingTop: '15px' }}
          >
            Gestión de Equipos
          </Typography>
        </Box>


        <Grid container spacing={2} alignItems="center" style={{paddingLeft: '35px'}}>
          <Grid item xs={12} sm={10}>
            <Button
              variant="contained"
              style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
              onClick={() => handleAddequipmentes(labData)}
            >
              Agregar
            </Button>
          </Grid>
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

        {/*<TableContainer style={{ maxHeight: '50vh' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Imagen</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Nombre</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Fecha</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Descripción</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Actividad</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedItems.map((equipment, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: 'center' }}>{equipment.imagen_equipo}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{equipment.nombre}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{equipment.fecha_adquisicion}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{equipment.descripcion}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                      <Grid item xs={4}>
                        <IconButton onClick={() => handleUpdateUser(equipment)}>
                          <EditIcon color="primary" />
                        </IconButton>
                      </Grid>
                      <Grid item xs={4}>
                        <IconButton onClick={() => handleOpenDialog(equipment.equipo_id)}
>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Grid>
                      <Grid item xs={4}>
                        <IconButton onClick={() => handleMaintenance(equipment)}>
                          <BuildIcon color="action" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>*/}

        <div style={{ display: 'flex', justifyContent: '', flexWrap: 'wrap', paddingLeft: '50px' }}>
          {paginatedItems.map((equipment, index) => (
            <Card key={index} style={{ margin: '10px', width: '300px', display: 'flex', flexDirection: 'column', marginLeft:'30px' }}>
              <CardMedia
                component="img"
                alt={equipment.nombre}
                height="200"
                image={equipment.image_url}
              />
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                  {equipment.nombre}
                </Typography>
                <Typography variant="p" component="div" sx={{ }}>
                  {equipment.descripcion}
                </Typography>
              </CardContent>
              <CardActions style={{justifyContent:'right', padding:'10px'}}>
                <IconButton onClick={() => handleUpdateUser(equipment)}>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => handleOpenDialog(equipment.equipo_id)}>
                  <DeleteIcon color="error" />
                </IconButton>
                <IconButton onClick={() => handleMaintenance(equipment)}>
                  <BuildIcon color="action" />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </div>

        {/* PAGINACIÓN DE LA TABLA */}
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
            ¿Estás seguro de que quieres eliminar este equipo?
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

export default G_Equipments;
