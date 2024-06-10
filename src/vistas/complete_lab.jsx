import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Grid, Paper, Typography, Box, TextField, Button, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { API_BASE_URL } from '../js/config';
import Escudo from "../assets/imagenes/login_back.png";

const styles = {
    container: {
        paddingTop: '5%',
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    paper: {
        width: '100%',
        maxWidth: '100%',
    },
    typography: {
        color: "#64001D",
        fontWeight: "bold",
        padding: '5%',
    },
    gridItemLeft: {
        marginRight: '10px'
    },
    logoImage: {
        maxWidth: "100%",
        maxHeight: "100%",
        width: "auto"
    },
    form: {
        paddingLeft: '5%',
        paddingBottom: '5%',
    },
    button: {
        backgroundColor: "#64001D",
        color: "#FFFFFF",
        "&:hover": {
            backgroundColor: "#64001D",
        },
        marginTop: "10px",
        marginBottom: "5px",
    },
}

function LaboratorioForm() {
    const location = useLocation();
    const userToEdit = location.state?.userToEdit || {};
    const navigate = useNavigate();

    const [mision, setMision] = useState(userToEdit.mision || '');
    const [vision, setVision] = useState(userToEdit.vision || '');
    const [historia, setHistoria] = useState(userToEdit.historia || '');
    const [error, setError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Verifica si el usuario está autenticado al cargar el componente
        const token = localStorage.getItem('token');
        if (!token) {
            // Si el usuario no está autenticado, redirige al login
            navigate('/login'); // Ajusta la ruta según la ruta de tu login
        }
    }, []);

    const handleAgregar = async () => {
        if (!mision || !vision || !historia) {
            setError(true);
            return;
        }

        setError(false);
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`${API_BASE_URL}registroLaboratorio/completar/${userToEdit.registro_id}`, {
                mision,
                vision,
                historia,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            if (response.status === 200) {
                setSuccessMessage("¡La información se guardó exitosamente!");
                navigate('/op_listaLab');
            }

            // Puedes añadir lógica adicional para manejar la respuesta del servidor, como navegación o mensajes de éxito/error.
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            setErrorMessage("Error al enviar el formulario. Por favor, inténtelo de nuevo.");
            // Puedes manejar errores específicos aquí si es necesario.
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <Container  maxWidth="mg" sx={{ py: 4  }}>
            <Grid container spacing={4} justifyContent="center" alignItems="center">
                {/* Columna Izquierda (Imagen y Botones) */}
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <img src={Escudo} alt="Logo-Sileii" style={{ width: "80%", height: "auto" }} />
                    </Box>
                </Grid>
                {/* Columna Derecha (Formulario) */}
                <Grid item xs={6} sm={6} md={6} lg={7}>
                    <Paper  elevation={5} sx={{ p: { xs: 2, md: 4 } }}>
                        {/* Botón de retroceso */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <IconButton
                                aria-label="back"
                                onClick={handleBack}
                                sx={{ color: '#64001D', fontWeight: 'bold', marginBottom: '10px' }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            <Typography
                                variant="h5"
                                gutterBottom
                                align="left"
                                sx={{
                                    color: "#64001D",
                                    fontWeight: "bold",
                                    marginBottom: "10px"
                                  }}
                            >
                                Laboratorio
                            </Typography>
                        </Box>
                        <form style={styles.form}>
                            <Grid container spacing={1}>
                                <TextField
                                    label="id"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    sx={{
                                        visibility: 'hidden',
                                        position: 'absolute',
                                    }}
                                    name="id"
                                />
                                <Grid item xs={12} md={12}>
                                    <TextField
                                        fullWidth
                                        name="Misión"
                                        label="Misión"
                                        multiline
                                        rows={2}
                                        variant="outlined"
                                        size='small'
                                        margin="dense"
                                        value={mision}
                                        onChange={(e) => setMision(e.target.value)}
                                        sx={{ overflowX: 'hidden' }}
                                    />
                                    <TextField
                                        fullWidth
                                        name="Visión"
                                        label="Visión"
                                        multiline
                                        rows={2}
                                        variant="outlined"
                                        size='small'
                                        margin="dense"
                                        value={vision}
                                        onChange={(e) => setVision(e.target.value)}
                                        sx={{ overflowX: 'hidden' }}
                                    />
                                    <TextField
                                        fullWidth
                                        name="Historia"
                                        label="Historia"
                                        multiline
                                        rows={2}
                                        variant="outlined"
                                        size='small'
                                        margin="dense"
                                        value={historia}
                                        onChange={(e) => setHistoria(e.target.value)}
                                        sx={{ overflowX: 'hidden' }}
                                    />

                                </Grid>
                            </Grid>
                            <Button
                                variant="contained"
                                onClick={handleAgregar}
                                style={{ marginTop: '20px', width: "260px" }}
                                sx={styles.button}
                            >
                                Agregar
                            </Button>
                        </form>
                        {error && (
                            <Typography variant="body1" color="error" style={{ marginTop: '10px' }}>
                                ¡Todos los campos deben ser llenados!
                            </Typography>
                        )}
                        {successMessage && (
                            <Typography variant="body1" color="primary" style={{ marginTop: '10px' }}>
                                {successMessage}
                            </Typography>
                        )}
                    </Paper>
                </Grid>
                
            </Grid>
        </Container>
    );
}

export default LaboratorioForm;
