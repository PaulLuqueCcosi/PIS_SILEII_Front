import React, { useRef, useState } from 'react';
import axios from 'axios';
import { Grid, TextField, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom'; // Importa useNavigate junto con useLocation
import { API_BASE_URL } from '../js/config';

//

function DocumentForm() {
  const location = useLocation();
  const labData = location.state?.userToEdit;
  const [fileName, setFileName] = useState(labData.nombre_documento || "");  // Inicializa fileName con el valor de labData.nombre_documento
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  const navigate = useNavigate();  // Hook para la navegación

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFileName(file.name);
  };

  const subirArchivo = async () => {
    try {
      const file = selectedFile;
      const formData = new FormData();
      formData.append("archivo_documento", file);
      formData.append("nombre_documento", fileName);

      if (!labData || labData.registro_id === undefined) {
        console.error('registro_id no está definido.');
        return;
      }
      formData.append("registro_id", labData.registro_id);

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
      
      if (labData.documento_id) {
        const apiUrl = `${API_BASE_URL}coordinador/documentos/update/${labData.documento_id}`;
        // Si labData.nombre_documento tiene datos, realiza una solicitud PUT
        response = await axios.post(apiUrl, formData, config);
      } else {
        const apiUrl = `${API_BASE_URL}coordinador/documentos`;
        // Si labData.nombre_documento no tiene datos, realiza una solicitud POST
        response = await axios.post(apiUrl, formData, config);
      }


      // Redirige al usuario después de una respuesta exitosa
      navigate('/ManageDocuments', { state: { labData } });

    } catch (error) {
      console.error("Error:", error);
    }
  };

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
      width: '100%',
    },
    fileInput: {
      display: 'none',
    },
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <form>
      <Grid container spacing={2} direction="column" justifyContent="flex-start" alignItems="flex-start">
        <Grid item xs={12} style={{ marginRight: '10px', width: '100%',  }}>
          <TextField
            fullWidth
            name="fileName"
            label="Nombre del Documento"
            variant="outlined"
            size='small'
            margin="dense"
            InputLabelProps={{ style: styles.label }}            
            style={{borderColor: "#64001D"}}
            value={fileName || " "}
            onChange={handleFileNameChange}
          />
        </Grid>

        <Grid item xs={5.8} style={{ marginRight: '10px', width: '100%'  }}>
          {/* Botón para disparar el input de tipo "file" */}
          <Button onClick={triggerFileSelect} variant="outlined" style={{  width: '100%', color: '#64001D',  borderColor: "#64001D",}}>
            Seleccionar archivo
          </Button>
          <input type="file" ref={fileInputRef} style={styles.fileInput} onChange={handleFileChange} />
          {/* Muestra el nombre del archivo seleccionado */}

        </Grid>
      </Grid>

      <Button
        variant="contained"
        style={{ marginTop: '30px', width: "100%" }}
        sx={{ ...styles.button }}
        onClick={subirArchivo}
      >
        SUBIR
      </Button>
    </form>
  );
}

export default DocumentForm;
