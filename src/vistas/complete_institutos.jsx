// Importar React y otras dependencias
import React, { useState, useRef, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // Asumiendo que estás usando axios para las peticiones HTTP
import { API_BASE_URL } from '../js/config';
import { ListItemText, Checkbox, MenuItem, Select, Container, Grid, TextField, Button, Typography, IconButton, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel } from '@mui/material';

// Componente funcional MyFormPage
const MyFormPage = () => {
    // Hooks de estado y referencia
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const location = useLocation(); // Accede a la ubicación actual en la navegación
    const labToEdit = location.state?.userToEdit || {};
    const fileInputRef = useRef();
    const [fileName, setFileName] = useState(labToEdit?.nombre_imagen || "");  // Inicializa fileName con el valor de labToEdit.nombre_mision
    const [selectedFile, setSelectedFile] = useState(null);
    const [instituto_id, SetInstituto_id] = useState(parseInt(labToEdit?.instituto_id, 10));
    const [mision, setmision] = useState(labToEdit?.mision || '');
    const [vision, setvision] = useState(labToEdit?.vision || '');
    const [historia, sethistoria] = useState(labToEdit?.historia || '');
    const [ubicacion, setubicacion] = useState(labToEdit?.ubicacion || '');
    const [contacto, setContacto] = useState(labToEdit?.contacto || '');
    //const [comite_directivo, setcomite_directivo] = useState(labToEdit?.comite_directivo || '');
    const [isLoading, setIsLoading] = useState(true);
    const [url_instituto, SetUrl_instituto] = useState(labToEdit?.url_instituto || '');

    const [error, setError] = useState(false);

    // Efecto para cargar datos iniciales
    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token de autenticación no encontrado en el localStorage.');
                // Redirigir al usuario a la página de inicio de sesión
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}usuarios`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                });

                if (response.status === 200) {
                    const updatedUsers = response.data.usuarios.filter(user => user.rol_id === 5 && user.estado === true);
                    //setcomite_directivo(updatedUsers);
                    setIsLoading(false);
                } else {
                    console.error('Error en la respuesta de la API:', response.status);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchUsers();
    }, []);

    // Función para cancelar la operación y volver atrás
    const handleCancel = () => {
        navigate(-1);
    };

    // Estilos definidos para el componente
    const styles = {
        label: {
            color: '#555',
            borderColor: '#64001D',
        },
        formField: {
            marginBottom: '20px',

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
    };
    
    // Función para abrir el diálogo de selección de archivo
    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };
    
    // Función para manejar el cambio de archivo seleccionado
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setFileName(file.name);
    };

    // Función para guardar la información del formulario
    const handleSave = async () => {
        if (!mision || !vision || !instituto_id || !historia || !ubicacion || !contacto 
            //|| !comite_directivo 
            || !url_instituto) {
            setError(true);
            setDialogMessage("Hay campos obligatorios que debe completar.");
            setDialogOpen(true);
            return;
        }

        setError(false);
        const token = localStorage.getItem('token');

        const config = {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        };

        let response;
        if (instituto_id) {
            const file = selectedFile;
            const formData = new FormData();
            formData.append("imagen_instituto", file);
            formData.append("nombre_imagen", fileName);
            formData.append("mision", mision);
            formData.append("vision", vision);
            formData.append("historia", historia);
            formData.append("contacto", contacto);
            formData.append("ubicacion", ubicacion);
            //let a = comite_directivo.filter(elemento => Number.isInteger(elemento))
            //console.log(a)
            //formData.append("comite_directivo", a);
            formData.append("url_instituto", url_instituto);
            formData.append("url_facebook", 'https://www.facebook.com/');  

            try {
                const apiUrl = `${API_BASE_URL}directores/completarInstituto/${instituto_id}`;
                // Si labData.nombre_documento tiene datos, realiza una solicitud PUT
                response = await axios.post(apiUrl, formData, config);

                if (response.status >= 200 && response.status <= 300) {
                    setDialogMessage("Petición exitosa");
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

    // Función para cerrar el diálogo de información
    const handleCloseDialog = () => {
        if (dialogMessage === 'Petición exitosa') {
            navigate(-1);
        }
        else {
            setDialogOpen(false);
        }

    };
    
    // Función para manejar el cambio en el nombre del archivo
    const handleFileNameChange = (e) => {
        setFileName(e.target.value);
    };
    
    // Definir roles disponibles
    const roles = [
        { id: 1, name: 'Presidente' },
        { id: 2, name: 'Vicepresidente' },
        { id: 3, name: 'Secretario' },
        { id: 4, name: 'Tesorero' },
        // ... otros roles
    ];
    
    // Función para manejar el cambio en los roles seleccionados
    const handleChange = (event) => {
        // Set the selected roles to the new value
        let a =event.target.value;

        //setcomite_directivo(a);
    };

    // Renderizar componente de carga si aún se están cargando los datos
    if (isLoading) {
        return <div>Cargando...</div>;
    }

    // Retornar el JSX del formulario
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
            <Paper elevation={3}
            style={{
              padding: "60px", // Espaciado interior reducido para dispositivos más pequeños
              width: '100%',
              maxWidth: '600px'}}> {/* Responsive padding */}
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} display="flex" justifyContent="flex-start">
                        <IconButton aria-label="back" onClick={handleCancel}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h5" component="h2" textAlign="center">
                            Completar Información Instituto <strong>{labToEdit.nombre}</strong>
                        </Typography>
                    </Grid>

                    {/* Campos del formulario */}
                    <Grid item xs={12}>
                        <TextField
                            label="Misión"
                            type="text"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={mision}
                            onChange={(e) => setmision(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Visión"
                            type="text"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={vision}
                            onChange={(e) => setvision(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Reseña Histórica"
                            type="text"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={historia}
                            onChange={(e) => sethistoria(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Ubicación"
                            type="text"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={ubicacion}
                            onChange={(e) => setubicacion(e.target.value)}
                        />
                    </Grid>

                    {/* Selector de roles del comité directivo */}
                    {/*<Grid item xs={12}>
                        {comite_directivo.length > 0 ? (
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel id="demo-multiple-checkbox-label">Comité Directivo</InputLabel>
                                <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={comite_directivo }
                                    onChange={handleChange}
                                    renderValue={(selected) =>
                                        (selected || [])
                                            .map(id => comite_directivo.find(role => role && role.usuario_id === id))
                                            .filter(role => role != null && role.usuario_id != null)
                                            .map(role => role.nombre)
                                            .join(', ')
                                    }
                                    label="Comité Directivo"
                                >
                                    {comite_directivo.filter(role => role.nombre).map((role) => (
                                        <MenuItem key={role.usuario_id} value={role.usuario_id}>
                                            <Checkbox checked={comite_directivo.indexOf(role.usuario_id) > -1} />
                                            <ListItemText primary={role.apellido_paterno+" "+role.apellido_materno+", "+role.nombre} />
                                        </MenuItem>
                                    ))}


                                </Select>
                            </FormControl>
                        ) : (
                            <div>Cargando opciones...</div>
                        )}

                        </Grid>*/}


                    <Grid item xs={12}>
                        <TextField
                            label="Contacto"
                            type="text"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={contacto}
                            onChange={(e) => setContacto(e.target.value)}
                        />
                    </Grid>

                    {/* Campos relacionados con la imagen y la URL */}
                    <Grid item xs={12} container alignItems="flex-end" spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                name="fileName"
                                label="Nombre del archivo"
                                variant="outlined"
                                size='small'
                                margin="dense"
                                InputLabelProps={{ style: styles.label }}
                                style={{ borderColor: "#64001D" }}
                                value={fileName || " "}
                                onChange={handleFileNameChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            {/* Botón para disparar el input de tipo "file" */}
                            <Button onClick={triggerFileSelect} variant="outlined" style={{ width: '100%', color: '#64001D', borderColor: "#64001D", }}>
                                Seleccionar archivo
                            </Button>
                            <input type="file" ref={fileInputRef} style={styles.fileInput} onChange={handleFileChange} />
                            {/* Muestra el nombre del archivo seleccionado */}

                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="URL"
                            type="text"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            fullWidth
                            value={url_instituto}
                            onChange={(e) => SetUrl_instituto(e.target.value)}
                        />
                    </Grid>

                    {/* Botones para cancelar y guardar */}
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
            
            {/* Diálogo de información */}
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
