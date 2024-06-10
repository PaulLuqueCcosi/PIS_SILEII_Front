import React, { useState, useEffect } from 'react';
import { Container, Grid, TextField, Button, Typography, IconButton, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Asumiendo que estás usando axios para las peticiones HTTP
import { API_BASE_URL } from '../js/config';

const MyFormPage = () => {
    const navigate = useNavigate();

    const location = useLocation(); // Accede a la ubicación actual en la navegación
    const labToEdit = location.state?.labToEdit || {};

    const [resumen, setresumen] = useState(labToEdit.resumen || '');
    const [fecha_culminacion, setfecha_culminacion] = useState(labToEdit.fecha_culminacion || '');
    const [fecha_eleccion, setfecha_eleccion] = useState(labToEdit.fecha_eleccion || '');
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
        if (!resumen || !fecha_culminacion || !fecha_eleccion) {
            setError(true);
            return;
        }

        setError(false);
        console.log("Resumen:", resumen);
        console.log("Fecha de elección:", fecha_eleccion);
        console.log("Fecha de culminación:", fecha_culminacion);
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`${API_BASE_URL}directores/completar/${labToEdit.usuario_director}`, {
                resumen,
                fecha_culminacion,
                fecha_eleccion,

            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            if (response.status === 200) {
                navigate(-1);
            }


            // Aquí puedes añadir lógica adicional para manejar la respuesta del servidor, como navegación o mensajes de éxito/error.
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            // Puedes manejar errores específicos aquí si es necesario.
        }
    };

    const handleFechaEleccionChange = (e) => {
        const fechaEleccion = e.target.value;
        setfecha_eleccion(fechaEleccion);

        // Calcula la fecha de culminación sumando 3 años a la fecha de elección
        const fechaCulminacion = new Date(fechaEleccion);
        fechaCulminacion.setFullYear(fechaCulminacion.getFullYear() + 3);

        // Formatea la fecha de culminación en el formato 'YYYY-MM-DD'
        const formattedFechaCulminacion = fechaCulminacion.toISOString().split('T')[0];
        setfecha_culminacion(formattedFechaCulminacion);
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
        <Container maxWidth="md" sx={{ py: 8 }}> {/* Padding top and bottom */}
            <Paper elevation={5} sx={{ p: { xs: 2, md: 4 } }}> {/* Responsive padding */}
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} display="flex" justifyContent="flex-start">
                        <IconButton aria-label="back" onClick={handleCancel}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h5" component="h2" textAlign="center">
                            Completar información de Director
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Resumen"
                            multiline
                            rows={4}
                            placeholder="Ingrese el resumen"
                            variant="outlined"
                            fullWidth
                            value={resumen}
                            onChange={(e) => setresumen(e.target.value)}
                        />
                    </Grid>


                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Fecha de elección"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={fecha_eleccion}
                            onChange={handleFechaEleccionChange}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Fecha de culminación"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={fecha_culminacion}
                            onChange={(e) => setfecha_culminacion(e.target.value)}
                        />
                    </Grid>
               

                    <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
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
        </Container>
    );
};

export default MyFormPage;
