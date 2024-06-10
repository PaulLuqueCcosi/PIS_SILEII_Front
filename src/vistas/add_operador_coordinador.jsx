import { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Asumiendo que estás usando axios para las peticiones HTTP
import { API_BASE_URL } from '../js/config';
import { MenuItem, Select, Container, Grid, TextField,Box, Button, Typography, IconButton, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel } from '@mui/material';


const MyFormPage = () => {
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const location = useLocation(); // Accede a la ubicación actual en la navegación
    const labToEdit = location.state?.userToEdit || {};



    const [idUsuario] = useState(parseInt(labToEdit.usuario_id, 10));
    const [documento, setDocumento] = useState(labToEdit.dni || '');
    const [nombreUsuario, setNombreUsuario] = useState(labToEdit.nombre || '');
    const [apellidoPaterno, setApellidoPaterno] = useState(labToEdit.apellido_paterno || '');
    const [apellidoMaterno, setApellidoMaterno] = useState(labToEdit.apellido_materno || '');
    const [direccionUsuario, setDireccionUsuario] = useState(labToEdit.direccion); // Valor fijo 'UNSA'

    const [categoria_, setCategoria] = useState(labToEdit.categoria || "Principal"); // Supongamos que el valor predeterminado es 5
    const [regimen_, setRegimen] = useState(labToEdit.regimen || "Tiempo Parcial"); //
    const [telefonoUsuario, setTelefonoUsuario] = useState(labToEdit.telefono || '');
    const [email, setEmail] = useState(labToEdit.correo || '');
    const [password, setPassword] = useState(labToEdit.password || '');

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
        if (!documento || !nombreUsuario || !apellidoPaterno || !apellidoMaterno || !direccionUsuario || !telefonoUsuario || !email || !password  || !regimen_ || !categoria_  ) {
            setError(true);
            setDialogMessage("Hay campos obligatorios que debe completar.");
            setDialogOpen(true);
            return;
        }

        setError(false);
        const token = localStorage.getItem('token');
        let nombreusuario = nombreUsuario;
        let apellidopa = apellidoPaterno;
        let apellidoma = apellidoMaterno;
        let direccionusuario = direccionUsuario;
        let telefonousuario = telefonoUsuario;
        let regimen = regimen_;
        let categoria = categoria_;
        let idrol = 3
        
        if (idUsuario) {
            try {
                const response = await axios.put(`${API_BASE_URL}comiteDirectivo/${idUsuario}`, {
                    documento,
                    nombreusuario,
                    apellidopa,
                    apellidoma,
                    direccionusuario,
                    telefonousuario,
                    email,
                    password,
                    regimen,
                    categoria,
                    idrol
                    
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
                if (response.status >= 200 && response.status <= 300) {
                    setDialogMessage("Operador guardado exitosamente");
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
                const response = await axios.post(`${API_BASE_URL}coordinador/operadores/crear`, {
                    documento,
                    nombreusuario,
                    apellidopa,
                    apellidoma,
                    direccionusuario,
                    telefonousuario,
                    email,
                    password,
                    regimen,
                    categoria,
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
                if (response.status >= 200 && response.status <= 300) {
                    setDialogMessage("Operador guardado exitosamente");
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
        if (dialogMessage === 'Operador guardado exitosamente') {
            navigate(-1);
        }
        else {
            setDialogOpen(false);
        }

    };


    return (
        <Container maxWidth="md" sx={{ py: 4  }} >
        <Paper elevation={5} sx={{ p: { xs: 2, md: 4 } }}> {/* Responsive padding */}
                <Grid container spacing={3} justifyContent="center">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                       
                            <IconButton aria-label="back" onClick={handleCancel} sx={{ color: '#64001D', fontWeight: 'bold', marginRight: '10px' }}>
                                <ArrowBackIcon />
                            </IconButton>
                        
                        
                            <Typography  variant="h5"
                  gutterBottom
                  align="left"
                  style={{ color: "#64001D", fontWeight: "bold", marginBottom: "10px" }}>
                                Registro Usuario (Operador de Laboratorio)
                            </Typography>
                        
                    </Box>
                    <Grid item xs={12}>
                        <TextField
                            label="Nombre"
                            type="input"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={nombreUsuario}
                            onChange={(e) => setNombreUsuario(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Apellido Paterno"
                            type="input"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={apellidoPaterno}
                            onChange={(e) => setApellidoPaterno(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Apellido Materno"
                            type="input"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={apellidoMaterno}
                            onChange={(e) => setApellidoMaterno(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Nro de Identificación"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={documento}
                            onChange={(e) => setDocumento(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Celular"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={telefonoUsuario}
                            onChange={(e) => setTelefonoUsuario(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Dirección"
                            type="input"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={direccionUsuario}
                            onChange={(e) => setDireccionUsuario(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Correo institucional"
                            type="email"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Contraseña"
                            type="password"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel
                                id="demo-simple-select-label"
                            /* sx={{ ...styles.label, ...styles.formField }} */
                            >
                                Categoria
                            </InputLabel>
                            <Select
                                name="Categoria"
                                label="Age"
                                // onChange={handleInputChange}
                                size='small'
                                style={{ marginTop: "8px" }}
                                //error={formSubmitted && !formData.rol}
                                value={categoria_}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                onChange={(e) => setCategoria(e.target.value)}

                            >
                                <MenuItem value={"Principal"}>Principal</MenuItem>
                                <MenuItem value={"Asociado"}>Asociado</MenuItem>
                                <MenuItem value={"Auxiliar"}>Auxiliar</MenuItem>



                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel
                                id="demo-simple-select-label"
                            /* sx={{ ...styles.label, ...styles.formField }} */
                            >
                                Regimen
                            </InputLabel>
                            <Select
                                name="rol"
                                label="Age"
                                // onChange={handleInputChange}
                                size='small'
                                style={{ marginTop: "8px" }}
                                //error={formSubmitted && !formData.rol}
                                value={regimen_}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                onChange={(e) => setRegimen(e.target.value)}

                            >
                                <MenuItem value={"Tiempo Parcial"}>Tiempo Parcial</MenuItem>
                                <MenuItem value={"Tiempo Completo"}>Tiempo Completo</MenuItem>
                                <MenuItem value={"Dedicación Exclusiva"}>Dedicación Exclusiva</MenuItem>


                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                        <Button variant="outlined" style={{ backgroundColor: '#64001D', color: '#FFFFFF' }} onClick={handleCancel}>
                            Cancelar
                        </Button>
                        <Button variant="contained" style={{ backgroundColor: '#64001D', color: '#FFFFFF' }} onClick={handleSave}>
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

export default MyFormPage;
