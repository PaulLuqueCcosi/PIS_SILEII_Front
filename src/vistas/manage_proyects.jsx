import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Container, Paper, Typography, TextField, Table, TableContainer,
  TableHead, TableBody, TableRow, TableCell, Button, Grid, IconButton, Box
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../js/config';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// Definir un componente funcional llamado G_Proyects
function G_Proyects() {
  // Obtener la ubicación actual de la aplicación  
  const location = useLocation();

  // Función que devuelve el color según el estado del proyecto  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Inicio':
        return '#D50C0C'; // Rojo
      case 'En Proceso':
        return '#FFA40E'; // Naranja
      case 'Finalizado':
        return '#55D50C'; // Verde
      default:
        return ''; // Puedes establecer un color predeterminado o dejarlo vacío
    }
  };

  // Estados del componente
  const [Rol, setLab] = useState([]); // Estado para almacenar información sobre roles
  const [documents, setDocuments] = useState([]); // Estado para almacenar información sobre documentos
  const [searchQuery, setSearchQuery] = useState(''); // Estado para almacenar la consulta de búsqueda
  const [currentPage, setCurrentPage] = useState(0); // Estado para la página actual de la tabla
  const [rowsPerPage, setRowsPerPage] = useState(5); // Estado para la cantidad de filas por página
  const navigate = useNavigate(); // Función de navegación
  const [users, setUsers] = useState({ nombreusuario: '', rol: 0, id_user: 0 }); // Estado para información del usuario
  const labData = location.state?.labData; // Obtener datos de laboratorio de la ubicación

  // Efecto que se ejecuta al cargar el componente  
  useEffect(() => {
    // Obtener el token de autenticación y el correo electrónico del almacenamiento local
    const token = localStorage.getItem('token');
    const email_local = localStorage.getItem('correo');

    // Verificar si el token existe en el almacenamiento local
    if (!token) {
      console.error('Token de autenticación no encontrado en el localStorage.');
      return;
    }

    // Verificar si el correo electrónico existe en el almacenamiento local
    if (email_local) {
      // Realizar una solicitud para obtener información del usuario por correo electrónico
      axios.get(`${API_BASE_URL}usuarios/getAllByEmail/${email_local}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })
        .then((response) => {
          if (response.status === 200) {
            // Extraer la información del usuario desde la respuesta
            const userData = response.data.usuarios[0];
            // Actualizar el estado con la información del usuario
            setUsers({
              nombreusuario: userData.correo,
              rol: userData.rol.rol_id,
              id_user: userData.usuario_id
            });
            
            if (userData.rol.rol_id === 1) {
              fetchAdminDocuments(userData.usuario_id, token);
            }
            // Verificar el rol del usuario y realizar acciones específicas
            if (userData.rol.rol_id === 2) {
              fetchCoordinatorDocuments(userData.usuario_id, token);
            } else {
              //fetchOperadorLabs(userData.usuario_id, token);
            }
          }
        })
        .catch(console.error);
    }
  }, []); // El efecto se ejecuta solo una vez al montar el componente

  // Función asincrónica para obtener documentos del operador del laboratorio
  /*const fetchOperadorLabs = async (userId, token) => {
    try {
      // Realizar una solicitud para obtener documentos      
      const response = await axios.get(`${API_BASE_URL}documentos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        // Filtrar los documentos por el ID del laboratorio y el estado activo        
        const filteredDocs = response.data.documentos.filter(doc => doc.registro_id === labData.registro_id && doc.estado === true);
        // Actualizar el estado con los documentos filtrados
        setDocuments(filteredDocs);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };*/

  // Función asincrónica para obtener documentos del coordinador del laboratorio
  const fetchCoordinatorDocuments = async (userId, token) => {
    try {
      // Realizar una solicitud para obtener proyectos del coordinador
      const response = await axios.get(`${API_BASE_URL}coordinador/proyectos/${labData.registro_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        // Filtrar los proyectos por estado activo
        const filteredDocs = response.data.proyectos.filter(doc => doc.estado === true);
        // Actualizar el estado con los proyectos filtrados
        setDocuments(filteredDocs);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchAdminDocuments = async (userId, token) => {
    try {
      // Realizar una solicitud para obtener proyectos del coordinador
      const response = await axios.get(`${API_BASE_URL}coordinador/proyectos/${labData.registro_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        // Filtrar los proyectos por estado activo
        const filteredDocs = response.data.proyectos.filter(doc => doc.estado === true);
        // Actualizar el estado con los proyectos filtrados
        setDocuments(filteredDocs);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Filtrar elementos según el rol del usuario y la consulta de búsqueda
  //const filteredItems = users.rol === 2 ? documents.filter(doc => String(doc.documento_id).includes(searchQuery))
  //  : Rol.filter(user => String(user.laboratorio_id).includes(searchQuery));

  const filteredItems = documents.filter(doc => {
    return String(doc.documento_id).includes(searchQuery) ||
      String(doc.nombre_proyecto).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(doc.descripcion).toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Obtener elementos paginados según la página actual y la cantidad de filas por página
  const paginatedItems = filteredItems.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage);
  // Calcular el número total de páginas para la paginación
  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

  // Función para manejar la actualización de un usuario
  const handleUpdateUser = (userToEdit) => navigate('/UpdateProyect', { state: { userToEdit } });
  // Función para manejar la adición de documentos
  const handleAddDocumentes = (userToEdit) => navigate('/AddProyect', { state: { userToEdit } });
  // Función para manejar la eliminación de información
  const handleDeleteInfo = async userId => {
    const token = localStorage.getItem('token');
  
    try {
      // Realizar una solicitud para eliminar un proyecto  
      const response = await axios.delete(`${API_BASE_URL}coordinador/proyectos/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status >= 200 && response.status <= 300) {
        // Recargar la página después de una eliminación exitosa
        //window.location.reload();
        setDocuments(prevProyectos => prevProyectos.filter(documents => documents.proyecto_id !== userId));
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

  // Renderizar el componente
  return (
    <Container
    maxWidth="mg" sx={{ py: 4  }} >
    <Paper elevation={5} sx={{ p: { xs: 2, md: 4 } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <IconButton aria-label="back" onClick={handleBack} sx={{ color: '#64001D', fontWeight: 'bold', marginRight: '10px' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            align="left"
            gutterBottom
            style={{ color: '#64001D', fontWeight: 'bold' }}
          >
            Gestión de Proyectos
          </Typography>
        </Box>
        {/* Barra de herramientas con botón Agregar y campo de búsqueda */}
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

        {/* Tabla que muestra la información de los proyectos */}
        <TableContainer >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>ID</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Nombre</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Estado</TableCell>
                <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Actividad</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {/* Mapear y renderizar cada fila de la tabla */}
              {paginatedItems.map((document, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: 'center' }}>{document.proyecto_id}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>{document.nombre_proyecto}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    {/* Mostrar el estado del proyecto con un estilo de color */}
                    <span style={{ backgroundColor: getStatusColor(document.etapa), padding: '5px', borderRadius: '5px' }}>
                      {document.etapa}
                    </span>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                  {/* Botones para modificar y eliminar proyectos */}
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
                          onClick={() => handleDeleteInfo(document.proyecto_id)}
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
        {/* Botones de paginación */}
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

export default G_Proyects;
