import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Container, Paper, Typography, TextField, Table, TableContainer,
  TableHead, TableBody, TableRow, TableCell, Button, Grid, IconButton
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../js/config';

function G_document() {
  const location = useLocation();

  const [Rol, setLab] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();
  const [users, setUsers] = useState({ nombreusuario: '', rol: 0, id_user: 0 });
  const labData = location.state?.labData;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email_local = localStorage.getItem('correo');

    if (!token) {
      console.error('Token de autenticación no encontrado en el localStorage.');
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

            if (userData.rol.rol_id === 2) {
              fetchCoordinatorDocuments(userData.usuario_id, token);
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
      const response = await axios.get(`${API_BASE_URL}documentos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        const filteredDocs = response.data.documentos.filter(doc => doc.registro_id === labData.registro_id && doc.estado === true);
        setDocuments(filteredDocs);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchCoordinatorDocuments = async (userId, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}coordinador/documentos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        const filteredDocs = response.data.documentos.filter(doc => doc.registro_id === labData.registro_id && doc.estado === true);
        setDocuments(filteredDocs);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const filteredItems = users.rol === 2 ? documents.filter(doc => String(doc.documento_id).includes(searchQuery))
    : Rol.filter(user => String(user.laboratorio_id).includes(searchQuery));

  const paginatedItems = filteredItems.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);
  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);


  const handleUpdateUser = (userToEdit) => navigate('/UpdateDocument', { state: { userToEdit } });
  const handleAddDocumentes = (userToEdit) => navigate('/AddDocument', { state: { userToEdit } });
  const handleDeleteInfo = async userId => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.delete(`${API_BASE_URL}coordinador/documentos/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error('Error en la respuesta de la API:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
          Gestión de Documentos
        </Typography>


        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={10}>
            <Button
              variant="contained"
              style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
              onClick={() => handleAddDocumentes(labData)}
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

        <TableContainer style={{ maxHeight: '50vh' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>ID Documento</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Nombre</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Archivo</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Actividad</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedItems.map((document, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: 'center' }}>{document.documento_id}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{document.nombre_documento}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{document.archivo_documento}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                      <Grid item xs={12} sm={4}>
                        <Button
                          variant="contained"
                          fullWidth
                          style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                          onClick={() => handleUpdateUser(document)}
                        >
                          Modificar
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Button
                          variant="contained"
                          fullWidth
                          style={{ backgroundColor: '#64001D', color: '#FFFFFF' }}
                          onClick={() => handleDeleteInfo(document.documento_id)}
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
    </Container>
  );

}

export default G_document;
