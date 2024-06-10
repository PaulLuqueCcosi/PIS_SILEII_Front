import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid
} from "@mui/material";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../js/config';

const styles = {
  label: {
    display: "flex",
    alignItems: "center",
    color: "#64001D",
  },
  formField: {
    margin: "0px 0",
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
  errorText: {
    color: "red",
  },
};

function ManagementForm() {
  const location = useLocation();
  const locationOp = useLocation();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rol_id: 0,
    nombre: "",
  });
  const getIdField = (option) => {
   
    switch (option) {
      case 1: return 'laboratorio_id';
      case 2: return 'area_id';
      case 3: return 'disciplina_id';
      case 4: return 'rol_id';
      case 5: return 'instituto_id';
      default: return 'rol_id';
    }
  };

  
  const option = locationOp.state?.option;
  useEffect(() => {
    if (location.state && location.state?.datos) {
      const idField = getIdField(option);
   
      const { nombre } = location.state?.datos;
      const id = location.state?.datos[idField];
      setFormData(prevData => ({
        ...prevData,
        [idField]: id ? id : prevData[idField],
        nombre: nombre ? nombre : prevData.nombre,
      }));
    }
  }, [location]);

  
  const handleRegisterClick = () => {
    const formErrors = validateForm();
  
    if (Object.keys(formErrors).length === 0) {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        console.error('Token de autenticación no encontrado en el localStorage.');
        return;
      }
  
      const idField = getIdField(option);
      const hasId = Boolean(formData[idField]);
  
      let url, redirectUrl, requestMethod;
      switch (option) {
        case 1:
          url = hasId
            ? `${API_BASE_URL}laboratorios/${formData[idField]}`
            : `${API_BASE_URL}laboratorios`;
          redirectUrl = '/res_laboratory';
          break;
        case 2:
          url = hasId
            ? `${API_BASE_URL}areas/${formData[idField]}`
            : `${API_BASE_URL}areas`;
          redirectUrl = '/res_area';
          break;
        case 3:
          url = hasId
            ? `${API_BASE_URL}disciplinas/${formData[idField]}`
            : `${API_BASE_URL}disciplinas`;
          redirectUrl = '/res_discipline';
          break;
        case 4:
          url = hasId
            ? `${API_BASE_URL}roles/${formData[idField]}`
            : `${API_BASE_URL}roles`;
          redirectUrl = '/res_rol';
          break;
        case 5:
          url = hasId
            ? `${API_BASE_URL}institutos/${formData[idField]}`
            : `${API_BASE_URL}institutos`;
          redirectUrl = '/res_insti_admin';
          break;
        default:
          console.error("Opción no válida:", option);
          return;
      }
  
      requestMethod = hasId ? axios.put : axios.post;
  
      requestMethod(url, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          navigate(redirectUrl);
        } else {
          console.error("Error en la respuesta de la API:", response.status);
        }
      })
      .catch((error) => {
        console.error("Error al hacer la solicitud:", error);
        console.error("Detalles del error:", error.response?.data); 
      });
  
    } else {
      console.log('Campos que fallaron:', Object.keys(formErrors));
      
    }
  };
  

  const [formErrors, setFormErrors] = useState({
    nombre: "",
  });
  

  /*const validateForm = () => {
    const formErrors = {};
    const idField = getIdField(location.state?.option);
  
    // Solo validar el campo nombre
    if (!formData.nombre) {
      formErrors.nombre = true;
      console.error("El campo nombre no puede estar vacío");
    }
  
    // Validar el campo ID relevante para la opción seleccionada
    
  
    return formErrors;
  };*/
  const validateForm = () => {
    const newFormErrors = {};
    const idField = getIdField(location.state?.option);
  
    // Validar el campo nombre
    if (!formData.nombre) {
      newFormErrors.nombre = "El campo nombre no puede estar vacío";
    }
  
    // Otras validaciones aquí...
  
    setFormErrors(newFormErrors);
    return newFormErrors;
  };
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormErrors({
      ...formErrors,
      [name]: false,
    });
  };

  const isFieldEmpty = (field) => !formData[field];
  
  return (
    <form>
      <Grid container spacing={2}>
        <TextField
          label={getIdField(option)}
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{ style: styles.label }}
          sx={{
            ...styles.formField,
            visibility: 'hidden',
            position: 'absolute',
          }}
          name={getIdField(option)}
          value={formData[getIdField(option)] || 0}
        />

        <Grid item xs={12} style={{ marginRight: '10px' }}>
          <TextField
            fullWidth
            name="nombre"
            label="Nombre"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.nombre || ""}
            error={formErrors.nombre}
            helperText={formErrors.nombre}
            
          />
        </Grid>
      </Grid>
      <Button
        variant="contained"
        onClick={handleRegisterClick}
        style={{ marginTop: '20px', width: "260px" }}
        sx={{ ...styles.button }}>
        ENVIAR
      </Button>
      
    </form>
  );
}

export default ManagementForm;
