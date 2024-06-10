import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; 
import { API_BASE_URL } from '../js/config';
import { Container, Grid, TextField, Button, Typography, IconButton, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const MyFormPage = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const labToEdit = location.state?.labData || {};

    const [idpublicacion, setidpublicacion] = useState(parseInt(labToEdit?.publicacion_id, 10));
    const [nombre, setnombre] = useState(labToEdit?.titulo || '');
    const [url, setUrl] = useState(labToEdit?.link || '');
    const [error, setError] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleCancel = () => {
        navigate(-1);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, []);

    const handleSave = async () => {
        if (!nombre || !url) {
            setError(true);
            setErrorMessage("¡Todos los campos deben ser llenados!");
            setDialogOpen(true);
            return;
        }

        setError(false);
        const token = localStorage.getItem('token');

        if (idpublicacion) {
            try {
                let registro_id = labToEdit.registro_id;          
                let link = url;
                let titulo = nombre
                const response = await axios.put(`${API_BASE_URL}coordinador/publicacion/${idpublicacion}`, {                   
                    titulo,
                    link,
                    registro_id
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
                if (response.status >= 200 && response.status <= 300) {
                    setSuccessMessage("¡La información se guardó exitosamente!");
                    setDialogOpen(true);
                }
            } catch (error) {
                setErrorMessage("Error al enviar el formulario: " + error);
                setDialogOpen(true);
            }
        }
        else {
            let registro_id = labToEdit.laboratorio_id;          
            let link = url;
            let titulo = nombre
            try {
                const response = await axios.post(`${API_BASE_URL}coordinador/publicacion`, {
                    titulo,
                    link,
                    registro_id
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
                if (response.status >= 200 && response.status <= 300) {
                    setSuccessMessage("¡La información se guardó exitosamente!");
                    setDialogOpen(true);
                }
            } catch (error) {
                setErrorMessage("Error al enviar el formulario: " + error);
                setDialogOpen(true);
            }
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        if (successMessage) {
            navigate(-1);
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
          paddingRight: 0,
        },
      };

    return (
        <Container maxWidth="md" sx={{ py: 8 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
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
                            label="Nombre de la Publicación"
                            type="input"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={nombre}
                            onChange={(e) => setnombre(e.target.value)}
                            error={error && !nombre}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="link / Enlace"
                            type="input"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            error={error && !url}
                        />
                    </Grid>
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
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Información</DialogTitle>
                <DialogContent>
                    <DialogContentText color={successMessage ? "primary" : "error"}>
                        {successMessage || errorMessage}
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
