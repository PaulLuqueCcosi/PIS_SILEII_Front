import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Asumiendo que estás usando axios para las peticiones HTTP
import { API_BASE_URL } from '../js/config';
import { Box, MenuItem, Select, Container, Grid, TextField, Button, Typography, IconButton, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel } from '@mui/material';
import Escudo from "../assets/imagenes/login_back.png";


function formatDate(dateString) {
  // Extrae solo la fecha (ignorando la hora)
  return dateString.split(' ')[0];
}
const AddFuntion = () => {

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses en JS van de 0 a 11, por lo que sumamos 1
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const location = useLocation(); // Accede a la ubicación actual en la navegación
  const labToEdit = location.state?.labData || {};



  const [nombre_proyecto, setnombre_proyecto] = useState(labToEdit?.nombre_proyecto || "");
  const [investigador_principal, setinvestigador_principal] = useState(labToEdit?.investigador_principal || "");
  const [coinvestigadores, setcoinvestigadores] = useState(labToEdit?.coinvestigadores || "");
  const [descripcion, setdescripcion] = useState(labToEdit?.descripcion || "");
  const [etapa, setetapa] = useState(labToEdit?.etapa || "INICIO");

  const [instituto_id, setinstituto_id] = useState(parseInt(labToEdit?.instituto_id, 10));
  const [proyecto_id, setproyecto_id] = useState(parseInt(labToEdit?.proyecto_id, 10));
  const [fecha_finalizacion, setfecha_finalizacion] = useState(labToEdit?.fecha_finalizacion ? formatDate(labToEdit.fecha_finalizacion) : getCurrentDate());
  const [fecha_inicio, setfecha_inicio] = useState(labToEdit?.fecha_inicio ? formatDate(labToEdit.fecha_inicio) : getCurrentDate());

  const [error, setError] = useState(false);



  const handleCancel = () => {
    navigate(-1);
  };

  useEffect(() => {
    // Verifica si el usuario está autenticado al cargar el componente
    const token = localStorage.getItem('token');
    if (!token) {
        // Si el usuario no está autenticado, redirige al login
        navigate('/login'); // Ajusta la ruta según la ruta de tu login
        
    }
}, []);

  const handleSave = async () => {
    if (!nombre_proyecto || !investigador_principal || !descripcion || !fecha_finalizacion || !fecha_inicio) {
      setError(true);
      setDialogMessage("Hay campos obligatorios que debe completar.");
      setDialogOpen(true);
      return;
    }

    // Validar el campo de co-investigadores
    if (!coinvestigadores.trim()) {
      setError(true);
      setDialogMessage("Hay campos obligatorios que debe completar.");
      setDialogOpen(true);
      return;
    }

    setError(false);
    const token = localStorage.getItem('token');

    if (proyecto_id) {
      try {

        const response = await axios.post(`${API_BASE_URL}proyecto/instituto/update/${proyecto_id}`, {
          instituto_id,
          nombre_proyecto,
          investigador_principal,
          coinvestigadores,
          etapa,
          descripcion,
          fecha_inicio,
          fecha_finalizacion,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });
        if (response.status >= 200 && response.status <= 300) {
          setDialogMessage("Se Ha Guardado Excitosamente el Proyecto");
          setDialogOpen(true);

        }


        // Aquí puedes añadir lógica adicional para manejar la respuesta del servidor, como navegación o mensajes de éxito/error.
      } catch (error) {
        setDialogMessage("Error al enviar el formulario:", error);
        setDialogOpen(true);
        // Puedes manejar errores específicos aquí si es necesario.
      }
    }
    else {
      try {
        const response = await axios.post(`${API_BASE_URL}proyecto/instituto`, {
          instituto_id,
          nombre_proyecto,
          investigador_principal,
          coinvestigadores,
          etapa,
          descripcion,
          fecha_inicio,
          fecha_finalizacion,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          }
        });
        if (response.status >= 200 && response.status <= 300) {
          setDialogMessage("Se Ha Guardado Excitosamente el Proyecto");
          setDialogOpen(true);

        }


        // Aquí puedes añadir lógica adicional para manejar la respuesta del servidor, como navegación o mensajes de éxito/error.
      } catch (error) {
        setDialogMessage("Error al enviar el formulario:", error);
        setDialogOpen(true);
        // Puedes manejar errores específicos aquí si es necesario.
      }
    }

  };
  const handleCloseDialog = () => {
    if (dialogMessage === 'Se Ha Guardado Excitosamente el Proyecto') {
      navigate(-1);
    }
    else {
      setDialogOpen(false);
    }

  };
  const styles = {
    label: {
        color: '#555',
    },

    button: {
        backgroundColor: '#64001D',
        '&:hover': {
            backgroundColor: '#44001F',
        },
        color: '#fff',
        padding: '10px 30px',
    },
    fileInput: {
        display: 'none',
    },
    inputWithIcon: {
        paddingRight: 0
    },
};

  return (
    <Container className='fondo'
    maxWidth="xl"
    sx={{
        paddingTop: '5%',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}> {/* Padding top and bottom */}
      <Grid
        container
        spacing={2} // Espaciado entre elementos reducido para dispositivos más pequeños
        justifyContent="center" // Alineación de contenido en el centro horizontal
        alignItems="center" // Alineación de contenido en el centro vertical
      >

      <Grid item xs={12} sm={6} md={6} lg={7}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}> {/* Responsive padding */}
          <Grid container spacing={2} justifyContent="center">
            <Grid container xs={12} display="flex" justifyContent="flex-start">
              <IconButton aria-label="back" onClick={handleCancel}>
                <ArrowBackIcon />
              </IconButton>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5" component="h2" textAlign="center" sx={{ textAlign: "center" }}>
                Proyecto
              </Typography>
            </Grid>
            <Grid container xs={8} sm={8} md={8} lg={8.5}>

              <Grid container spacing={2} direction="row" sx={{ paddingTop: '5%' }}>
                <Grid item xs={6}>
                  <TextField
                    label="Título"
                    type="input"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    value={nombre_proyecto}
                    onChange={(e) => setnombre_proyecto(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Descripción"
                    type="input"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    multiline
                    rows={4}
                    value={descripcion}
                    onChange={(e) => setdescripcion(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} direction="row" sx={{ marginTop: '-8.8%' }}>
                <Grid item xs={6}>
                  <TextField
                    label="Investigadores"
                    type="input"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    value={investigador_principal}
                    onChange={(e) => setinvestigador_principal(e.target.value)}
                  />
                </Grid>

              </Grid>
              <Grid container spacing={2} direction="row" sx={{ marginTop: '0.5%' }}>
                <Grid item xs={6}>
                  <TextField
                    label="Co-Investigadores"
                    type="input"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    value={coinvestigadores}
                    onChange={(e) => setcoinvestigadores(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Etapa
                    </InputLabel>
                    <Select
                      name="Etapa"
                      label="Etapa"
                      value={etapa}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      labelId="demo-simple-select-label"
                      onChange={(e) => setetapa(e.target.value)}
                    >
                      <MenuItem value={"INICIO"}>Inicio</MenuItem>
                      <MenuItem value={"EN PROCESO"}>En Proceso</MenuItem>
                      <MenuItem value={"FINALIZADO"}>Finalizado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

              </Grid>
              <Grid container spacing={2} direction="row" sx={{ marginTop: '1%' }}>
                <Grid item xs={6}>
                  <TextField
                    label="Fecha de Inicio"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    value={fecha_inicio}
                    onChange={(e) => setfecha_inicio(e.target.value)}
                  />
                </Grid>

              </Grid>
              <Grid container spacing={2} direction="row" sx={{ marginTop: '1%' }}>
                <Grid item xs={6}>
                  <TextField
                    label="Fecha de Finalización"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    type="date"
                    fullWidth
                    value={fecha_finalizacion}
                    onChange={(e) => setfecha_finalizacion(e.target.value)}
                  />
                </Grid>

              </Grid>
            </Grid>
            
            <Grid container xs={12} display="flex" justifyContent="center" gap={2} sx={{ marginTop: '2%' }}>
              <Button variant="outlined" style={styles.button}
 onClick={handleCancel}>
                Cancelar
              </Button>
              <Button variant="contained" style={styles.button}
 onClick={handleSave}>
                Guardar
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Información</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {dialogMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      </Grid>
      {/* Columna derecha */}        
      <Grid item xs={12} sm={6} md={6} lg={5}> {/* Cambiado el valor de lg para darle más espacio */}
          {/* Contenedor flexible para centrar la imagen */}        
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            {/* Imagen del escudo */}            
            <img
              src={Escudo}
              alt="Logo-Sileii"
              style={{ width: "50%" ,height: "auto" }} // Ancho fijo y altura automática para mantener la proporción
            />
          </Box>
        </Grid>
      </Grid>
    </Container >
  );
};

export default AddFuntion;
