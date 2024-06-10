import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../js/config';
import Escudo from "../assets/imagenes/login_back.png";
import { InputAdornment, Box, MenuItem, Select, Container, Grid, TextField, Button, Typography, IconButton, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel } from '@mui/material';

// Definir estilos para el componente
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

// Función para formatear la fecha
function formatDate(dateString) {
    // Extrae solo la fecha (ignorando la hora)
    return dateString.split(' ')[0];
}


// Componente funcional ImgForm
function ImgForm() {
    // Obtener la ubicación y datos del laboratorio de la ubicación actual  
    const location = useLocation();
    const labData = location.state?.labData;
    const [previewUrl, setPreviewUrl] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [error, setError] = useState(false);

    // Configurar la navegación  
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1);
    };
    // Referencia para el input de archivo
    const fileInputRef = useRef();
    // Función para obtener la fecha actual en formato YYYY-MM-DD  
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses en JS van de 0 a 11, por lo que sumamos 1
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Estado para el formulario  
    const [formData, setFormData] = useState({
        fileName: labData?.nombre_imagen || "",
        selectedFile: null,
        nombreEquipmento: labData?.nombre || "",
        codigo_patrimonio: labData?.codigo_patrimonio || "",
        accesorios: labData?.accesorio || "",
        marca: labData?.marca_modelo || "",
        insumos: labData?.insumos || "",
        fecha_adquisicion: labData?.fecha_adquisicion ? formatDate(labData.fecha_adquisicion) : getCurrentDate(),
        descripcion: labData?.descripcion || ""
    });

    // Manejar cambios en los campos del formulario
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);
    // Manejar cambios en el input de archivo
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        }
        setFormData((prevData) => ({
            ...prevData,
            selectedFile: file,
            fileName: file.name
        }));
    };

    // Mostrar el selector de archivo al hacer clic en el icono
    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };
    // Función para enviar el formulario y subir el archivo  
    const subirArchivo = async () => {
        try {
            // Desestructurar datos del formulario      
            const { selectedFile, fileName, nombreEquipmento, codigo_patrimonio, accesorios, marca, insumos, descripcion, fecha_adquisicion } = formData;
            const file = selectedFile;
            const registro_id_d = labData?.laboratorio_id || labData?.registro_id;
            // Crear un objeto FormData y agregar datos
            const formPayload = new FormData(); // Aquí cambiamos el nombre
            
            formPayload.append("registro_id", labData?.laboratorio_id || labData?.registro_id);
            formPayload.append("nombre_imagen", fileName);
            formPayload.append("descripcion", descripcion);
            formPayload.append("imagen_galeria", file);
            

            if (!registro_id_d || !descripcion) {
                setError(true);
                setDialogMessage("Hay campos obligatorios que debe completar.");
                setDialogOpen(true);
                return;
            }
            // Verificar existencia de datos y token      
            if (!labData || labData.registro_id === undefined) {
                console.error('registro_id no está definido.');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token de autenticación no encontrado en el localStorage.');
                return;
            }

            // Configuración de encabezados para la solicitud
            const config = {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            };

            // Inicializar la variable de respuesta
            let response;

            // Verificar si el equipo ya tiene un ID (solicitud PUT) o no (solicitud POST)      
            if (labData.galeria_id) {

                const apiUrl = `${API_BASE_URL}coordinador/galeriaLaboratorio/${labData.galeria_id}`;
                // Si labData.nombre_documento tiene datos, realiza una solicitud PUT
                response = await axios.post(apiUrl, formPayload, config);
            } else {
                const apiUrl = `${API_BASE_URL}coordinador/galeriaLaboratorio`;
                // Si labData.nombre_documento no tiene datos, realiza una solicitud POST
                response = await axios.post(apiUrl, formPayload, config);
            }

            // Registrar la respuesta en la consola      

            // Redirige al usuario después de una respuesta exitosa
            if (response.status === 200) {
                setDialogMessage("La imagen se guardó Exitosamente");
                setDialogOpen(true);
            } else {
                setDialogMessage("Error al enviar el formulario:", response.status);
                setDialogOpen(true);

            }

        } catch (error) {
            setDialogMessage("Error al enviar el formulario:", error);
            setDialogOpen(true);
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
    const handleCancel = () => {
        navigate(-1);
    };

    const handleCloseDialog = () => {
        if (dialogMessage === 'La imagen se guardó Exitosamente') {
            navigate(-1);
        }
        else {
            setDialogOpen(false);
        }

    };
    // Renderizar el formulario
    return (
        <Container
        maxWidth="md" sx={{ py: 8  }}
        >
            {/* Contenedor principal con dos columnas */}
            <Grid
                container
                spacing={2} // Espaciado entre elementos reducido para dispositivos más pequeños
                justifyContent="center" // Alineación de contenido en el centro horizontal
                alignItems="center" // Alineación de contenido en el centro vertical
            >
                <Grid item xs={12} sm={6} md={6} lg={5}> {/* Cambiado el valor de lg para darle más espacio */}
                    {/* Contenedor flexible para centrar la imagen */}
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                    >
                        {/* Imagen del escudo */}
                        {
                            previewUrl ? (
                                <img src={previewUrl} alt="Vista previa" style={{ width: "50%", height: "auto" }} />
                            ) : (
                                <img
                                    src={`${labData.image_url || Escudo}`}
                                    alt="Logo-Sileii"
                                    style={{ width: "60%", height: "auto" }} // Ancho fijo y altura automática para mantener la proporción
                                />
                            )
                        }

                    </Box>
                </Grid>
                <Grid item xs={10} sm={6} md={6} lg={7}>
                    <Paper
                        elevation={5} sx={{ p: { xs: 2, md: 4 } }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            {/* Botón de retroceso */}
                            <IconButton
                                aria-label="back"
                                onClick={handleBack}
                                sx={{ color: '#64001D', fontWeight: 'bold', marginRight: '10px' }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                            {/* Título de la sección */}
                            <Typography
                                variant="h5"
                                gutterBottom
                                align="left"
                                style={{ color: "#64001D", fontWeight: "bold", marginBottom: "10px" }} // Color, fuente y margen del título
                            >
                                Registro de Imágenes
                            </Typography>
                            </Box>
                        <form style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '8px', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)' }}>
                            <Grid container spacing={2}>
                                {/* Input de imagen */}
                                <Grid item xs={12} md={12}>
                                    <TextField
                                        fullWidth
                                        name="imagenReferencial"
                                        label="Imagen"
                                        variant="outlined"
                                        InputLabelProps={{ style: styles.label }}
                                        style={styles.textField}
                                        value={formData.fileName || " "}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end" style={styles.inputWithIcon}>
                                                    <IconButton edge="end" onClick={triggerFileSelect}>
                                                        <AttachFileIcon color="primary" />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    {/* Input oculto de tipo archivo */}
                                    <input type="file" ref={fileInputRef} style={styles.fileInput} onChange={handleFileChange} />
                                </Grid>
                                {/* Otros campos del formulario */}






                                <Grid item xs={12} md={12}>
                                    <TextField
                                        label="Descripción"
                                        multiline
                                        name="descripcion"
                                        rows={4}
                                        placeholder="Ingrese la Descripción"
                                        variant="outlined"
                                        fullWidth
                                        value={formData.descripcion || ''}
                                        onChange={handleChange}
                                    />

                                </Grid>
                                <Grid container xs={12} style={{ paddingTop: '4%', alignContent: 'center', textAlign: 'center' }}
                                >
                                    <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                                        {/* Botón para guardar el formulario */}
                                        <Button variant="contained" style={styles.button} onClick={subirArchivo}>Guardar</Button>
                                    
                                    
                                        {/* Botón para guardar el formulario */}
                                        <Button variant="contained" style={styles.button} onClick={handleCancel}>Cancelar</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>



            </Grid>
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
        </Container>

    );

}

export default ImgForm;
