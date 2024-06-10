import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Asumiendo que estás usando axios para las peticiones HTTP
import { API_BASE_URL } from '../js/config';
import InputAdornment from '@mui/material/InputAdornment';
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

    const [servicio, setservicio] = useState(labToEdit?.servicio || '');
    const [materiales, setmateriales] = useState(labToEdit?.materiales || '');

    const [servicio_id, setservicio_id] = useState(parseInt(labToEdit?.servicio_id, 10));
    const [mano_obra, setmano_obra] = useState(labToEdit?.mano_obra || '');
    const [ci_mano_obra, setci_mano_obra] = useState(labToEdit?.ci_mano_obra || '');
    const [ci_deprec_equi, setci_deprec_equi] = useState(labToEdit?.ci_deprec_equi || '');
    const [ci_deprec_edif, setci_deprec_edif] = useState(labToEdit?.ci_deprec_edif || '');
    const [ci_util_limp, setci_util_limp] = useState(labToEdit?.ci_util_limp || '');
    const [ci_util_aseo, setci_util_aseo] = useState(labToEdit?.ci_util_aseo || '');
    const [ci_mantto, setci_mantto] = useState(labToEdit?.ci_mantto || '');
    const [ci_servicios, setci_servicios] = useState(labToEdit?.ci_servicios || '');



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
        if (!servicio || !materiales || !mano_obra) {
            setError(true);
            setDialogMessage("Hay campos obligatorios que debe completar.");
            setDialogOpen(true);
            return;
        }

        setError(false);
        const token = localStorage.getItem('token');

        if (servicio_id) {
            try {

                const response = await axios.put(`${API_BASE_URL}directores/servicios/${servicio_id}`, {
                    instituto_id,
                    servicio,
                    materiales,
                    mano_obra,
                    ci_mano_obra,
                    ci_deprec_equi,
                    ci_deprec_edif,
                    ci_util_limp,
                    ci_util_aseo,
                    ci_mantto,
                    ci_servicios,


                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
                if (response.status >= 200 && response.status <= 300) {
                    setDialogMessage("Se Ha Guardado Exitosamente el Tusne");
                    setDialogOpen(true);

                }


                // Aquí puedes añadir lógica adicional para manejar la respuesta del servidor, como navegación o mensajes de éxito/error.
            } catch (error) {
                setDialogMessage("Error 444 al enviar el formulario:", error.message);
                setDialogOpen(true);
                // Puedes manejar errores específicos aquí si es necesario.
            }
        }
        else {
            try {
                const response = await axios.post(`${API_BASE_URL}directores/servicios`, {
                    instituto_id,
                    servicio,
                    materiales,
                    mano_obra,
                    ci_mano_obra,
                    ci_deprec_equi,
                    ci_deprec_edif,
                    ci_util_limp,
                    ci_util_aseo,
                    ci_mantto,
                    ci_servicios,

                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
                if (response.status >= 200 && response.status <= 300) {
                    setDialogMessage("Se Ha Guardado Exitosamente el Tusne");
                    setDialogOpen(true);

                }


                // Aquí puedes añadir lógica adicional para manejar la respuesta del servidor, como navegación o mensajes de éxito/error.
            } catch (error) {
                setDialogMessage("Error2 al enviar el formulario:", error);
                setDialogOpen(true);
                // Puedes manejar errores específicos aquí si es necesario.
            }
        }

    };
    const handleCloseDialog = () => {
        if (dialogMessage === 'Se Ha Guardado Exitosamente el Tusne') {
            navigate(-1);
        }
        else {
            setDialogOpen(false);
        }

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

                    <Grid item xs={12} sx={{ marginBottom: '15px' }}>
                        <Typography variant="h5" component="h2" textAlign="center" sx={{ fontWeight: 'bold', color: '#333' }}>
                            TUSNE
                        </Typography>
                    </Grid>
                    <Grid container spacing={2} direction="row" sx={{ paddingTop: '5%' }}>
                        <Grid item xs={12}>
                            <TextField
                                label="Nombre del Servicio"
                                type="input"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                value={servicio}
                                onChange={(e) => setservicio(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ marginBottom: '10px' }}>
                            <Typography variant="h6" component="h2" textAlign="left" sx={{ color: '#555' }}>
                                Costos Fijos
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Materiales"
                                type="input"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">S/.</InputAdornment>,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                value={materiales}
                                onChange={(e) => setmateriales(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Mano de obra"
                                type="input"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">S/.</InputAdornment>,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                value={mano_obra}
                                onChange={(e) => setmano_obra(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ marginBottom: '10px' }}>
                            <Typography variant="h6" component="h2" textAlign="left" sx={{ color: '#555' }}>
                                Costos Indirectos
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Mano de obra Indirecta"
                                type="input"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">S/.</InputAdornment>,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                value={ci_mano_obra}
                                onChange={(e) => setci_mano_obra(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Depreciación de equipo"
                                type="input"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">S/.</InputAdornment>,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                value={ci_deprec_equi}
                                onChange={(e) => setci_deprec_equi(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Depreciación de edificio"
                                type="input"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">S/.</InputAdornment>,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                value={ci_deprec_edif}
                                onChange={(e) => setci_deprec_edif(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={3}>
                            <TextField
                                label="Útiles de limpieza"
                                type="input"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">S/.</InputAdornment>,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                value={ci_util_limp}
                                onChange={(e) => setci_util_limp(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Útiles de aseo"
                                type="input"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">S/.</InputAdornment>,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                value={ci_util_aseo}
                                onChange={(e) => setci_util_aseo(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Mantenimiento de Equipos"
                                type="input"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">S/.</InputAdornment>,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                value={ci_mantto}
                                onChange={(e) => setci_mantto(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Servicios Esenciales"
                                type="input"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">S/.</InputAdornment>,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                fullWidth
                                value={ci_servicios}
                                onChange={(e) => setci_servicios(e.target.value)}
                            />
                        </Grid>

                    </Grid>




                    <Grid item xs={12} display="flex" justifyContent="center" gap={2}>
                        <Button variant="outlined" onClick={handleCancel} style={{ color: '#fff', backgroundColor: '#dc3545', borderColor: '#dc3545' }}>
                            Cancelar
                        </Button>
                        <Button variant="contained" onClick={handleSave} style={{ color: '#fff', backgroundColor: '#28a745' }}>
                            Guardar
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <Dialog open={dialogOpen} onClose={handleCloseDialog} >
            <DialogTitle sx={{ textAlign: 'center' }}>Información</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Button onClick={handleCloseDialog} style={{ color: '#28a745' }}>
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container >
    );
};

export default AddFuntion;
