import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
    color: "red", // Color rojo para el mensaje de error
  },
};

function LabUpdateForm() {
  const location = useLocation();
  const navigate = useNavigate();

  /* Obteniendo los datos del laboratorio */
  const laboratoryToEdit = location.state.laboratoryToEdit;
  
  const [formData, setFormData] = useState({
    id: laboratoryToEdit ? laboratoryToEdit.id : 0,
    nombre: laboratoryToEdit ? laboratoryToEdit.nombre : "",
  });

  /* Validación de errores */
  const [formErrors, setFormErrors] = useState({
    nombre: "",
  });



  const handleSubmit = (e) => {
    e.preventDefault();
    // Verificar campos vacíos
    const newFormErrors = {};
    for (const key in formData) {
      if (formData[key].trim() === '') {
        newFormErrors[key] = true;
      } else {
        newFormErrors[key] = false;
      }
    }
    setFormErrors(newFormErrors);

    if (Object.values(newFormErrors).every((error) => !error)) {
      console.log(formData);
    }
  };

  const [, setErrors] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const validateForm = () => {
    const formErrors = {};

    for (const key in formData) {
      if (key !== 'id' && !formData[key]) {

        formErrors[key] = true;
      }
    }

    return formErrors;
  };


  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({
      ...formErrors,
      [name]: false,
    });
  };

  const inputStyles = {
    "& .MuiInputBase-input": {
      color: "#64001D",
      height: "30px",
      fontSize: "14px",
      padding: "5px 12px",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#64001D",
        height: "40px",
      },
      "&:hover fieldset": {
        borderColor: "#64001D",
        height: "40px",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#64001D",
        height: "40px",
      },
    },
    marginBottom: "16px",
  };

  const isFieldEmpty = (field) => {
    return !formData[field];
  };
  const handleRegisterClick = () => {
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {     
      const token = localStorage.getItem('token');

      // Verifica si se ha almacenado un token en el localStorage
      if (!token) {
        navigate('/');
        console.error('Token de autenticación no encontrado en el localStorage.');
        return;
      }      
            
        axios
          .put(`${API_BASE_URL}laboratorios/${formData.id}`, formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
          .then((response) => {
            if (response.status === 200) {
              setOpenDialog(true);
              setFormSubmitted(true);
                           
              navigate('/res_laboratory');
            } else {
              console.error("Error en la respuesta de la API:", response.status);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });    } else {
      console.log('Campos que fallaron:', Object.keys(formErrors));
      setFormSubmitted(true);
    }
  };

 
  const atLeastOneFieldEmpty = Object.keys(formData).some(isFieldEmpty);

  return (
    <form >
      <Grid container spacing={1}>
        <TextField
          label="id"
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{ style: styles.label }}
          sx={{
            ...styles.formField,
            ...inputStyles,
            visibility: 'hidden',
            position: 'absolute',
          }}
          name="id"
          value={formData.id || 0}
        />

        <Grid item xs={5.8} style={{ marginRight: '10px' }}>
        <TextField
          fullWidth
          name="nombre"
          label="Nombre"
          variant="outlined"
          onChange={handleInputChange}
          size='small'
          margin="dense"
          /* InputLabelProps={{ style: styles.label }} */
          /* sx={{ ...styles.formField, ...inputStyles }} */
          value={formData.nombre || ""}
          error={!formData.nombre}
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

export default LabUpdateForm;
