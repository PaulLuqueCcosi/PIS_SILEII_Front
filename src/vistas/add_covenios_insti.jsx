import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Asumiendo que estás usando axios para las peticiones HTTP
import { API_BASE_URL } from '../js/config';
import { MenuItem, Select, Container, Grid, TextField, Button, Typography, IconButton, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel } from '@mui/material';

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



    const [instituto_id, setinstituto_id] = useState(parseInt(labToEdit?.instituto_id, 10));
    const [entidad, setentidad] = useState(labToEdit?.entidad || '');
    const [convenio_id, setconvenio_id] = useState(parseInt(labToEdit?.convenio_id, 10));
    const [fecha_inicio, setfecha_inicio] = useState(labToEdit?.fecha_inicio ? formatDate(labToEdit.fecha_inicio) : getCurrentDate());
    const [fecha_fin, setfecha_fin] = useState(labToEdit?.fecha_fin ? formatDate(labToEdit.fecha_fin) : getCurrentDate());
    const [objetivo, setobjetivo] = useState(labToEdit?.objetivo || '');
    const [detalles, setdetalles] = useState(labToEdit?.detalles || '');



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
        if (!entidad || !fecha_inicio || !fecha_fin || !objetivo || !detalles) {
            setError(true);
            setDialogMessage("Hay campos obligatorios que debe completar.");
            setDialogOpen(true);
            return;
        }

        setError(false);
        const token = localStorage.getItem('token');

        if (convenio_id) {
            try {

                const response = await axios.put(`${API_BASE_URL}directores/convenios/${convenio_id}`, {
                    instituto_id,
                    entidad,
                    fecha_inicio,
                    fecha_fin,
                    objetivo,
                    detalles,
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
                if (response.status >= 200 && response.status <= 300) {
                    setDialogMessage("Se Ha Guardado Excitosamente el Convenio");
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
                const response = await axios.post(`${API_BASE_URL}directores/convenios`, {
                    instituto_id,
                    entidad,
                    fecha_inicio,
                    fecha_fin,
                    objetivo,
                    detalles,
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
                if (response.status >= 200 && response.status <= 300) {
                    setDialogMessage("Se Ha Guardado Excitosamente el Convenio");
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
        if (dialogMessage === 'Se Ha Guardado Excitosamente el Convenio') {
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
                            Convenio
                        </Typography>
                    </Grid>
                    <Grid container spacing={2} direction="row" sx={{ paddingTop: '5%' }}>
                        <Grid item xs={6}>
                            <TextField
                                label="Entidad Colaboradora"
                                type="input"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                value={entidad}
                                onChange={(e) => setentidad(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Objetivo"
                                type="input"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                multiline
                                rows={4}
                                value={objetivo}
                                onChange={(e) => setobjetivo(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} direction="row" sx={{ marginTop: '-8.8%' }}>
                        <Grid item xs={6}>
                            <TextField
                                label="Fecha Inicial"
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
                    <Grid container spacing={2} direction="row" sx={{ marginTop: '0.5%' }}>
                        <Grid item xs={6}>
                            <TextField
                                label="Fecha Final"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                value={fecha_fin}
                                onChange={(e) => setfecha_fin(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Detalles"
                                type="input"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                multiline
                                rows={4}
                                value={detalles}
                                onChange={(e) => setdetalles(e.target.value)}
                            />
                        </Grid>

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
