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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../js/config';

function ListaLab() {
  const [Rol, setLab] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [labToDelete, setLabToDelete] = useState(null);

  //modificado
  const [filteredLabs, setFilteredLabs] = useState([]);
  //modificado

  useEffect(() => {
    const fetchLab = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('Token de autenticación no encontrado en el localStorage.');
          // Redirigir al usuario a la página de inicio de sesión
          navigate('/login');
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
          const filteredData = rawData.filter(entry => entry.estado === true);
          const transformedData = filteredData.map(entry => ({
            laboratorio: entry.laboratorio.nombre,
            responsable: `${entry.coordinador.nombre} ${entry.coordinador.apellido_paterno} ${entry.coordinador.apellido_materno}`,
            estado: entry.estado,
            area: entry.area.nombre,
            coordinador_id: entry.coordinador.usuario_id,
            laboratorio_id: entry.laboratorio.laboratorio_id,
            area_id: entry.area.area_id,
            disciplinas: entry.disciplinas.map(disciplina => disciplina.nombre).join(', '),
            ubicacion: entry.ubicacion,
            registro_id: entry.registro_id,
            mision: entry.mision,
            vision: entry.vision,
            historia:  entry.historia,
          }));

          setLab(transformedData);
          setFilteredLabs(transformedData);
        } else {
          console.error('Error en la respuesta de la API:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchLab();
  }, []);

  const handleModificarInfo = (labToEdit) => {
    navigate('/update_resp_lab', { state: { labToEdit } });
  };

  const handleVerInfo = (userToEdit) => {
    navigate('/info_laboratorio', { state: { userToEdit } });
  };

  const handleDeleteInfo = (labId) => {
    setLabToDelete(labId);
    setOpenDialog(true);
  };

  const handleBack = () => {
    navigate(-1);
  };


  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const lowerCaseQuery = e.target.value.toLowerCase();
    const updatedFilteredLabs = Rol.filter(
      (lab) => lab.laboratorio.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredLabs(updatedFilteredLabs);
    setCurrentPage(0); // Reinicia la página actual al realizar una nueva búsqueda
  };

  const confirmDelete = async (labId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_BASE_URL}registroLaboratorio/${labId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const updatedLabs = Rol.filter(lab => lab.registro_id !== labId);
        setLab(updatedLabs);
      } else {
        console.error('Error en la respuesta de la API:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setOpenDialog(false);
    }
  };

  //modificacion
  //const filteredLabs = Rol.filter((lab) =>
  //  lab.laboratorio.toLowerCase().includes(searchQuery.toLowerCase())
  //);
  //borrar viejo

  const paginatedLabs = filteredLabs.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const totalPages = Math.ceil(filteredLabs.length / rowsPerPage);

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
                  Laboratorios
                </Typography>
              </Grid>
            </Grid>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={9} md={10}>
            <Button
              component={Link}
              to="/add_gestion"
              variant="contained"
              style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
            >
              Asignar responsable
            </Button>
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <TextField
              label="Buscar (nombre laboratorio)"
              variant="outlined"
              margin="normal"
              InputLabelProps={{ style: { color: '#64001D' } }}
              value={searchQuery}
              onChange={handleSearch}
              //modificado
              //onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
        </Grid>

        <TableContainer style={{ maxHeight: '50vh' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '100%', Width: '30%' }}>Laboratorio</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '100%', Width: '30%' }}>Responsable</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '100%', Width: '40%' }}>Actividad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedLabs.map((lab, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: 'center' }}>{lab.laboratorio}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{lab.responsable}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Grid container alignItems="center" justifyContent="center">
                      <Grid item xs={12} sm={4}>
                        <IconButton
                          style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                          onClick={() => handleVerInfo(lab)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Button
                          variant="contained"
                          style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                          onClick={() => handleModificarInfo(lab)}
                        >
                          Modificar
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Button
                          variant="contained"
                          style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                          onClick={() => handleDeleteInfo(lab.registro_id)}
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
              ¿Estás seguro de que quieres eliminar responsable de laboratorio?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancelar
            </Button>
            <Button onClick={() => confirmDelete(labToDelete)} color="primary" autoFocus>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
}

export default ListaLab;
