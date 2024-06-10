import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Grid, TextField, Button, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../js/config';

function PoiForm() {
  const location = useLocation();
  const poiData = location.state?.labData;
  const navigate = useNavigate();

  const fileInputRef = useRef();

  const [formData, setFormData] = useState({
    fileName: poiData?.nombre_imagen || "",
    selectedFile: null,
    year: poiData?.year || "",
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
      const { selectedFile, fileName, year } = formData;
      const file = selectedFile;

      const formPayload = new FormData();
      formPayload.append("instituto_id", poiData.instituto_id);
      formPayload.append("year", year);
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

      if (poiData.id) {
        const apiUrl = `${API_BASE_URL}director/pois/update/${poiData.id}`;
        response = await axios.post(apiUrl, formPayload, config);
      } else {
        const apiUrl = `${API_BASE_URL}director/pois`;
        response = await axios.post(apiUrl, formPayload, config);
      }

      if (response.status === 200) {
        navigate(-1, { state: { poiData } });
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
            value={formData.year}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            name="fileName"
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
  );
}

export default PoiForm;
