import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Escudo from "../assets/imagenes/login_back.png";
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../js/config';
import { TextField, Button, Grid, InputAdornment, IconButton, Container, Paper, Box, Typography  } from '@mui/material';


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

function PoiForm() {
  const location = useLocation();
  const labData = location.state?.labData;
  const navigate = useNavigate();

  const fileInputRef = useRef();

  const handleBack = () => {
    navigate(-1);
  };

  const [formData, setFormData] = useState({
    fileName: labData?.nombre_poi || "",
    //fileName: labData?.document_uri || "",
    selectedFile: null,
    year: labData?.year || "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      selectedFile: file,
      fileName: file.name
    }));
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const subirArchivo = async () => {
    try {
      const { selectedFile, year, fileName } = formData;
      const file = selectedFile;

      if (!labData || !labData.instituto_id) {
        console.error('poiData o poiData.instituto_id es undefined');
        return;
      }

      const formPayload = new FormData();
      formPayload.append("instituto_id", labData.instituto_id);
      formPayload.append("year", year);
      formPayload.append("nombre_poi", fileName);
      formPayload.append("document_uri", file);

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token de autenticación no encontrado en el localStorage.');
        return;
      }

      const config = {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      let response;

      if (labData.id) {
        const apiUrl = `${API_BASE_URL}director/pois/update/${labData.id}`;
        response = await axios.post(apiUrl, formPayload, config);
      } else {
        const apiUrl = `${API_BASE_URL}director/pois`;
        response = await axios.post(apiUrl, formPayload, config);
      }

      if (response.status === 200) {
        navigate(-1, { state: { labData } });
      } else {
        console.error("La solicitud no fue exitosa:", response.status, response.data);
      }
    } catch (error) {
      console.error("Error:", error);
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

  return (
    <Container
      className='fondo'
      maxWidth="xl"
      sx={{
        paddingTop: '5%',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={6} md={6} lg={7}>
          <Paper
            elevation={3}
            style={{
              padding: "60px",
              width: '100%',
              maxWidth: '600px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <IconButton
                aria-label="back"
                onClick={handleBack}
                sx={{ color: '#64001D', fontWeight: 'bold', marginRight: '10px' }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h5"
                gutterBottom
                align="left"
                style={{ color: "#64001D", fontWeight: "bold", marginBottom: "10px" }}
              >
                Registro POI
              </Typography>
            </Box>
            <form style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '8px', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="year"
                    label="Año"
                    variant="outlined"
                    InputLabelProps={{ style: styles.label }}
                    style={styles.textField}
                    value={formData.year || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="nombre_poi"
                    label="Archivo"
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
                  <input type="file" ref={fileInputRef} style={styles.fileInput} onChange={handleFileChange} />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" style={styles.button} onClick={subirArchivo}>Guardar</Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={5}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <img
              src={Escudo}
              alt="Logo-Sileii"
              style={{ width: "50%", height: "auto" }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PoiForm;





/*import { Container, Grid, Paper, Typography, Box, IconButton } from "@mui/material";
import React, { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PoiForm from "../componentes/PoiForm"; // Cambiado el nombre del componente importado
import Escudo from "../assets/imagenes/login_back.png";
import { Link, useNavigate, useLocation } from 'react-router-dom';

function AddPoi() { // Cambiado el nombre del componente funcional
  const navigate = useNavigate();
  const location = useLocation();
  const instiToEdit = location.state?.instiToEdit;
    
  const handleBack = () => {
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

  return (
    <Container
      className='fondo'
      maxWidth="xl"
      sx={{
        paddingTop: '5%',
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={6} md={6} lg={7}>
          <Paper
            elevation={3}
            style={{
              padding: "60px",
              width: '100%',
              maxWidth: '600px'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <IconButton
                aria-label="back"
                onClick={handleBack}
                sx={{ color: '#64001D', fontWeight: 'bold', marginRight: '10px' }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h5"
                gutterBottom
                align="left"
                style={{ color: "#64001D", fontWeight: "bold", marginBottom: "10px" }}
              >
                Registro POI
              </Typography>
            </Box>
            <PoiForm labData={instiToEdit} />  
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={5}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <img
              src={Escudo}
              alt="Logo-Sileii"
              style={{ width: "50%", height: "auto" }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AddPoi; // Cambiado el nombre del componente exportado
*/