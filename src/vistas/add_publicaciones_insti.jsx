import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Asumiendo que estás usando axios para las peticiones HTTP
import { API_BASE_URL } from '../js/config';
import { MenuItem, Select, Container, Grid, TextField, Button, Typography, IconButton, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel } from '@mui/material';

const AddFuntion = () => {
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const location = useLocation(); // Accede a la ubicación actual en la navegación
    const labToEdit = location.state?.labData || {};
    const [url, setUrl] = useState(labToEdit?.link || '');



    const [instituto_id, setinstituto_id] = useState(parseInt(labToEdit?.instituto_id, 10));
    const [titulo, setfuncion] = useState(labToEdit?.titulo || '');
    const [publicacion_id, setfuncion_id] = useState(parseInt(labToEdit?.publicacion_id, 10));


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
        if (!titulo) {
            setError(true);
            setDialogMessage("Hay campos obligatorios que debe completar.");
            setDialogOpen(true);
            return;
        }

        setError(false);
        const token = localStorage.getItem('token');

        if (publicacion_id) {
            try {
                let link= url;
                const response = await axios.put(`${API_BASE_URL}publicacion/instituto/${publicacion_id}`, {
                    titulo,
                    link,
                    instituto_id,
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
                if (response.status >= 200 && response.status <= 300) {
                    setDialogMessage("Se Ha Guardado Excitosamente la Publicación");
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
                let link= url;
                const response = await axios.post(`${API_BASE_URL}publicacion/instituto`, {
                    titulo,
                    link,
                    instituto_id,
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
                if (response.status >= 200 && response.status <= 300) {
                    setDialogMessage("Se Ha Guardado Excitosamente la Publicación");
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
        if (dialogMessage === 'Se Ha Guardado Excitosamente la Publicación') {
            navigate(-1);
        }
        else {
            setDialogOpen(false);
        }

    };
    const styles = {
        button: {
          backgroundColor: '#64001D',
          '&:hover': {
            backgroundColor: '#44001F',
          },
          color: '#fff',
          padding: '10px 30px',
        },
      };


    return (
        <Container maxWidth="md" sx={{ py: 8 }}> {/* Padding top and bottom */}
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}> {/* Responsive padding */}
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} display="flex" justifyContent="flex-start">
                        <IconButton aria-label="back" onClick={handleCancel}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h5" component="h2" textAlign="center">
                            Publicaciones
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Título"
                            type="input"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={titulo}
                            onChange={(e) => setfuncion(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Link / Enlace"
                            type="input"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} display="flex" justifyContent="center" gap={2}>
                        <Button variant="outlined" style={styles.button} onClick={handleCancel}>
                            Cancelar
                        </Button>
                        <Button variant="contained" style={styles.button} onClick={handleSave}>
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
        </Container >
    );
};

export default AddFuntion;
