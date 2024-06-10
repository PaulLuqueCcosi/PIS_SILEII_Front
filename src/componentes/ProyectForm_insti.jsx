import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Grid, TextField, Button, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../js/config';

function ProyectForm() {
  const location = useLocation();
  const labToEdit = location.state?.labData;
  const [fileName, setFileName] = useState(labToEdit?.nombre_documento || "");  // Inicializa fileName con el valor de labToEdit.nombre_documento
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();
  const [titulo, settitulo] = useState(labToEdit?.nombre_proyecto || "");
  const [investigador, setInvestigador] = useState(labToEdit?.investigador_principal || "");
  const [coinvestigadores, setCoinvestigadores] = useState(labToEdit?.coinvestigadores || "");
  const [doi, setDOI] = useState(labToEdit?.doi || "");
  const [resumen, setResumen] = useState(labToEdit?.resumen || "");
  const [iba, setIBA] = useState(labToEdit?.iba || "");
  const [etapa, setetapa] = useState(labToEdit?.etapa || "");

  const [instituto_id, setinstituto_id] = useState(parseInt(labToEdit?.instituto_id, 10));
  const [equipos_id, setEquipos_id] = useState(parseInt(labToEdit?.funcion_id, 10));
  const [fecha_fin, setfecha_fin] = useState(labToEdit.fecha_fin || '');
  const [fecha_inicio, setfecha_inicio] = useState(labToEdit.fecha_inicio || '');
  const navigate = useNavigate(); // Hook para la navegación

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFileName(file.name);
  };
  const handletituloChange = (e) => {
    settitulo(e.target.value);
  };

  const handleInvestigadorChange = (e) => {
    setInvestigador(e.target.value);
  };

  const handleCoinvestigadoresChange = (e) => {
    setCoinvestigadores(e.target.value);
  };

  const handleDOIChange = (e) => {
    setDOI(e.target.value);
  };

  const handleResumenChange = (e) => {
    setResumen(e.target.value);
  };

  const handleIBAChange = (e) => {
    setIBA(e.target.value);
  };

  const subirArchivo = async () => {
    try {
      const file = selectedFile;
      const formData = new FormData();

      formData.append("nombre_imagen", fileName);
      formData.append("nombre_proyecto", titulo);
      formData.append("investigador_principal", investigador);
      formData.append("coinvestigadores", coinvestigadores);
      formData.append("doi", doi);
      formData.append("resumen", resumen);
      formData.append("iba", iba);
      formData.append("imagen_referencial", file);
      formData.append("etapa", etapa);


      if (!labToEdit || labToEdit.registro_id === undefined) {
        console.error('registro_id no está definido.');
        return;
      }
      formData.append('registro_id', labToEdit.registro_id);

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token de autenticación no encontrado en el localStorage.');
        return;
      }

      const config = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      let response;

      if (labToEdit.proyecto_id) {
        const apiUrl = `${API_BASE_URL}coordinador/proyectos/update/${labToEdit.proyecto_id}`;
        // Si labToEdit.nombre_documento tiene datos, realiza una solicitud PUT
        response = await axios.post(apiUrl, formData, config);
      } else {
        const apiUrl = `${API_BASE_URL}coordinador/proyectos`;
        // Si labToEdit.nombre_documento no tiene datos, realiza una solicitud POST
        response = await axios.post(apiUrl, formData, config);
      }


      // Redirige al usuario después de una respuesta exitosa
      navigate('/ManageProyects', { state: { labToEdit } });
    } catch (error) {
      console.error('Error:', error);
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

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <form>
      <Grid container spacing={2} direction="row">
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="titulo"
            label="Título"
            variant="outlined"
            size="small"
            margin="dense"
            InputLabelProps={{ style: styles.label }}
            style={styles.textField}
            value={titulo}
            onChange={handletituloChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="resumen"
            label="Resumen"
            variant="outlined"
            size="small"
            margin="dense"
            InputLabelProps={{ style: styles.label }}
            style={styles.textField}
            value={resumen}
            onChange={handleResumenChange}
          />
        </Grid>

      </Grid>
      <Grid container spacing={2} direction="row">
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="investigador"
            label="Investigadores"
            variant="outlined"
            size="small"
            margin="dense"
            InputLabelProps={{ style: styles.label }}
            style={styles.textField}
            value={investigador}
            onChange={handleInvestigadorChange}
          />
        </Grid>

      </Grid>
      <Grid container spacing={2} direction="row">
        <Grid item xs={6}>
          <TextField
            fullWidth
            name="coinvestigadores"
            label="Co-Investigadores"
            variant="outlined"
            size="small"
            margin="dense"
            InputLabelProps={{ style: styles.label }}
            style={styles.textField}
            value={coinvestigadores}
            onChange={handleCoinvestigadoresChange}
          />
        </Grid>
        <Grid item xs={6} sx={{ marginTop: '8px', }}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="demo-simple-select-label">
              Etapa
            </InputLabel>
            <Select
              name="Etapa"
              label="Etapa"
              size='small'
              value={etapa}
              margin="dense"
              labelId="demo-simple-select-label"
              onChange={(e) => setetapa(e.target.value)}
            >
              <MenuItem value={"Inicio"}>Inicio</MenuItem>
              <MenuItem value={"En Proceso"}>En Proceso</MenuItem>
              <MenuItem value={"Finalizado"}>Finalizado</MenuItem>
            </Select>
          </FormControl>
        </Grid>

      </Grid>
      <Grid item spacing={2} direction="row">
        <Grid sm={6}>
          <TextField
            label="Fecha de Inicio"
            type="date"
            size="small"
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            value={fecha_inicio}
            onChange={(e) => setfecha_inicio(e.target.value)}
          />
        </Grid>


      </Grid>
      <Grid item spacing={2} direction="row">
        <Grid sm={6}>
          <TextField
            label="Fecha de Finalización"
            type="date"
            size="small"
            margin="dense"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            value={fecha_fin}
            onChange={(e) => setfecha_fin(e.target.value)}
          />
        </Grid>
      </Grid>
      <br />
      <Button variant="contained" style={styles.button} onClick={subirArchivo}>
        Guardar
      </Button>
    </form>
  );
}

export default ProyectForm;
