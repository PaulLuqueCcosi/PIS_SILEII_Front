import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Asumiendo que estás usando axios para las peticiones HTTP
import { API_BASE_URL } from '../js/config';
import { MenuItem, Select, Container, Grid, TextField, Button, Typography, IconButton, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel } from '@mui/material';

// Componente funcional MyFormPage
const MyFormPage = () => {
    // Configurar navegación y estado para el cuadro de diálogo
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    // Obtener la ubicación actual y los datos del laboratorio (si existen)
    const location = useLocation(); // Accede a la ubicación actual en la navegación
    const labToEdit = location.state?.labData || {};

    // Estados para los campos del formulario y manejo de errores
    const [registro_id, setregistro_id] = useState(parseInt(labToEdit?.registro_id, 10));
    const [nombre, setnombre] = useState(labToEdit.titulo || '');


    const [error, setError] = useState(false);

    // Función para cancelar y regresar    
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

    // Función para manejar el guardado del formulario
    const handleSave = async () => {
        // Validar campos obligatorios      
        if (!nombre) {
            setError(true);
            setDialogMessage("Hay campos obligatorios que debe completar.");
            setDialogOpen(true);
            return;
        }

     

        setError(false);
        const token = localStorage.getItem('token');

        // Enviar solicitud PUT si hay un registro_id, de lo contrario, enviar solicitud POST
        if (labToEdit.laboratorio_id) {
            let registro_id = labToEdit.laboratorio_id;
            let servicios = [nombre]
            try {
                const response = await axios.post(`${API_BASE_URL}coordinador/servicio/${registro_id}`, {
                    servicios
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
                if (response.status >= 200 && response.status <= 300) {
                    setDialogMessage("¡La información se guardó exitosamente!");
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
            let servicio = nombre;
            let servicio_id = labToEdit.posicion;
            try {
                const response = await axios.put(`${API_BASE_URL}coordinador/servicio/editar/${registro_id}`, {
                    servicio_id,
                    servicio
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
                if (response.status >= 200 && response.status <= 300) {
                    setDialogMessage("¡La información se guardó exitosamente!");
                    setDialogOpen(true);

                }
                else {
                    setDialogMessage("Error al enviar el formulario:", error);
                }


                // Aquí puedes añadir lógica adicional para manejar la respuesta del servidor, como navegación o mensajes de éxito/error.
            } catch (error) {
                setDialogMessage("Error al enviar el formulario:", error);
                setDialogOpen(true);
                // Puedes manejar errores específicos aquí si es necesario.
            }
        }


    };
    // Función para cerrar el cuadro de diálogo    
    const handleCloseDialog = () => {
        navigate(-1);

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
          paddingRight: 0,
        },
      };

    // Renderizar el formulario y los elementos UI
    return (
        <Container maxWidth="md" sx={{ py: 8 }}> {/* Padding top and bottom */}
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}> {/* Responsive padding */}
                <Grid container spacing={3} justifyContent="center">
                    {/* Botón para regresar */}
                    <Grid item xs={12} display="flex" justifyContent="flex-start">
                        <IconButton aria-label="back" onClick={handleCancel}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Grid>

                    {/* Título del formulario */}
                    <Grid item xs={12}>
                        <Typography variant="h5" component="h2" textAlign="center">
                            Servicio y Actividad
                        </Typography>
                    </Grid>

                    {/* Campo de entrada de texto para el nombre */}
                    <Grid item xs={12}>
                        <TextField
                            label="Nombre del Servicio / Actividad"
                            multiline
                            rows={4}
                            placeholder="Ingrese el nombre"
                            variant="outlined"
                            fullWidth
                            value={nombre}
                            onChange={(e) => setnombre(e.target.value)}
                        />

                    </Grid>

                    {/* Botones de acción */}
                    <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                        <Button variant="outlined" style={styles.button} onClick={handleCancel}>
                            Cancelar
                        </Button>
                        <Button variant="contained" style={styles.button} onClick={handleSave}>
                            Guardar
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            {/* Cuadro de diálogo para mostrar mensajes */}
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
        </Container >
    );
};

export default MyFormPage;
