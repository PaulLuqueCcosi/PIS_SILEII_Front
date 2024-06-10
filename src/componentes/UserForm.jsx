// Importaciones de React y bibliotecas relevantes.
import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,IconButton, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl,
  InputLabel,
} from "@mui/material";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../js/config';

// Roles disponibles para el usuario.

// Estilos específicos para los componentes del formulario.



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

// Componente del formulario de usuario.
function UserForm() {
  // Variables de estado y utilidades de navegación.
  const location = useLocation();
  const locationsec = useLocation();

  const navigate = useNavigate();
  const [user_type, setUsertype] = useState({ code: 0 }); // Inicializamos users con un objeto vacío

  const [roles, setRoles] = useState([]); // Estado para almacenar los roles

  // Estado inicial de los datos del formulario.
  const [formData, setFormData] = useState({
    id: 0,
    nombreusuario: "",
    apellidopa: "",
    apellidoma: "",
    documento: "",
    telefonousuario: "",
    email: "",
    password: "password",
    rol: roles.length > 0 ? roles[0].rol_id : '',
  });

  // Estado inicial de validación de errores en el formulario.
  const [formErrors, setFormErrors] = useState({
    nombre: false,
    apellidoPaterno: false,
    apellidoMaterno: false,
    documento: false,
    telefono: false,
    correo: false,
    contraseña: false,
    rol: false,
  });

  // Función para manejar el cambio en los campos del formulario.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Solo actualiza los otros campos del formulario, sin considerar la contraseña
    setFormData({ ...formData, [name]: value, password: "password" });
    setFormErrors({
      ...formErrors,
      [name]: false,
    });
  };

  // Función para manejar el envío del formulario.
  const handleSubmit = (e) => {
    e.preventDefault();

    // Verificación de campos vacíos.
    const newFormErrors = {};
    for (const key in formData) {
      if (formData[key].trim() === '') {
        newFormErrors[key] = true;
      } else {
        newFormErrors[key] = false;
      }
    }
    setFormErrors(newFormErrors);

    // Si no hay errores, se muestran los datos en la consola.
    if (Object.values(newFormErrors).every((error) => !error)) {
      console.log(formData);
    }
  };

  

  // Hook useEffect para verificar datos de usuario en la ubicación actual.
  useEffect(() => {
    const option = locationsec.state?.option;
    if (option === 2) {
      setUsertype({ code: 3 });
    }
    if (location.state && location.state?.userToEdit) {
      const userToEdit = location.state?.userToEdit;
      setFormData({
        id: userToEdit.usuario_id || 0,
        nombreusuario: userToEdit.nombre || "",
        apellidopa: userToEdit.apellido_paterno || "",
        apellidoma: userToEdit.apellido_materno || "",
        documento: userToEdit.dni || "",
        telefonousuario: userToEdit.telefono || "",
        email: userToEdit.correo || "",
        password: userToEdit.password || "",
        rol: userToEdit.rol_id || 0,
      });
    }
  }, [location.state]);






  // Estados adicionales.
  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formGeneralError, setFormGeneralError] = useState('');



  // Función para validar el formulario.
  const validateForm = () => {
    const formErrors = {};

    for (const key in formData) {
      if (key !== 'id' && !formData[key]) {
        formErrors[key] = true;
      }
    }

    return formErrors;
  };


  const handleRegisterClick = async () => {
    const formErrors = validateForm();
  
    if (Object.keys(formErrors).length === 0) {
      const requestBody = {
        idusuario: parseInt(formData.id, 10),
        documento: formData.documento,
        nombreusuario: formData.nombreusuario,
        apellidopa: formData.apellidopa,
        apellidoma: formData.apellidoma,
        direccionusuario: 'UNSA',
        telefonousuario: formData.telefonousuario,
        email: formData.email,
        password: formData.password,
        idrol: parseInt(formData.rol, 10),
        estado: true,
        // Agrega otros campos si es necesario
      };
  
      const token = localStorage.getItem('token');
  
      if (!token) {
        navigate('/');
        console.error('Token de autenticación no encontrado en el localStorage.');
        return;
      }
  
      const id_user_l = localStorage.getItem('id_user_l');
      const emaile = formData.email;
  
      try {
        let response;
      
        if (formData.id === 0) {
          response = await axios.post(`${API_BASE_URL}usuarios`, requestBody, {
            headers: {
              'Authorization': `Bearer ${token}`,
              // Agrega otros encabezados si es necesario
            },
          });
        } else {
          response = await axios.put(`${API_BASE_URL}usuarios/${requestBody.idusuario}`, requestBody, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        }
      
        console.log('Respuesta de la API:', response);
      
        if (response.status >= 200 && response.status <= 300) {
          console.log('Solicitud exitosa, mostrando diálogo de éxito');
          setOpenDialog(true);
          setFormSubmitted(true);
          navigate('/res_users');
      
          if (parseInt(id_user_l, 10) === formData.id) {
            localStorage.setItem('correo', emaile);
            navigate('/Inicio');
          } else {
            navigate('/res_users');
          }
        } else {
          console.error("Error en la respuesta de la API:", response.status);
          if (formData.id === 0) {
            setErrors({ apiError: 'Informacion o usuario ya existe al agregar!' });
          } else {
            setErrors({ apiError: 'Informacion o usuario ya existe al modificar!' });
          }
          setOpenDialog(true);
        }
      } catch (error) {
        console.error("Error:", error);
        setErrors({ apiError: 'Error en la respuesta de la API' });
        setOpenDialog(true);
      }
      
  
    } else {
      setFormSubmitted(true);
      setFormGeneralError('Todos los campos deben completarse.');
    }
  };
  


  // Función para cerrar el diálogo.
  const handleDialogClose = () => {
    console.log("Cerrando el diálogo");
    setOpenDialog(false);
  };

  // Estilos específicos para los campos de entrada.
  const inputStyles = {
   
    marginBottom: "16px",
  };

  const isFieldEmpty = (field) => {
    return !formData[field];
  };

  const atLeastOneFieldEmpty = Object.keys(formData).some(isFieldEmpty);

  useEffect(() => {
    // Función para cargar los roles desde la API
    const fetchRoles = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${API_BASE_URL}roless`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        console.log('Roles:', response.data);
        // Actualiza el estado de los roles con los datos recibidos
        setRoles(response.data.roles);
      } catch (error) {
        console.error('Error al obtener los roles:', error);
        // Manejo de errores
      }
    };

    fetchRoles(); // Llamar a la función para cargar los roles cuando el componente se monte
  }, []);

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
            visibility: 'hidden', // Hacer que el campo sea invisible
            position: 'absolute', // Retirar el campo del flujo normal del diseño
          }}
          name="id"
          value={formData.id || 0}
          onChange={handleInputChange}
        />

        <Grid item xs={5.8} style={{ marginRight: '10px' }}>
          <TextField
            fullWidth
            name="nombreusuario"
            label="Nombre de Usuario"
            variant="outlined"
            onChange={handleInputChange}
            size='small'
            margin="dense"
            /* InputLabelProps={{ style: styles.label }} */
           
            value={formData.nombreusuario || ""}
            error={formSubmitted && !formData.nombreusuario}
          />
        </Grid>
        <Grid item xs={5.8}>
          <TextField
            fullWidth
            name="apellidopa"
            label="Apellido Paterno"
            variant="outlined"
            onChange={handleInputChange}
            size='small'
            margin="dense"
            /* InputLabelProps={{ style: styles.label }} */
           
            value={formData.apellidopa || ""}
            error={formSubmitted && !formData.apellidopa}
          />
        </Grid>
        <Grid item xs={5.8} style={{ marginRight: '10px' }}>
          <TextField
            fullWidth
            name="apellidoma"
            label="Apellido Materno"
            variant="outlined"
            onChange={handleInputChange}
            size='small'
            margin="dense"
            /* InputLabelProps={{ style: styles.label }} */
           
            value={formData.apellidoma || ""}
            error={formSubmitted && !formData.apellidoma}
          />
        </Grid>
        <Grid item xs={5.8}>
          <TextField
            fullWidth
            name="documento"
            label="Documento"
            variant="outlined"
            onChange={handleInputChange}
            size='small'
            margin="dense"
            /* InputLabelProps={{ style: styles.label }} */
           
            value={formData.documento || ""}
            error={formSubmitted && !formData.documento}
          />
        </Grid>
        <Grid item xs={5.8} style={{ marginRight: '10px' }}>
          <TextField
            fullWidth
            name="telefonousuario"
            label="Teléfono"
            variant="outlined"
            onChange={handleInputChange}
            size='small'
            margin="dense"
            /* InputLabelProps={{ style: styles.label }} */
           
            value={formData.telefonousuario || ""}
            error={formSubmitted && !formData.telefonousuario}
          />
        </Grid>
        <Grid item xs={5.8} >
          <TextField
            fullWidth
            name="email"
            label="Correo Institucional"
            variant="outlined"
            onChange={handleInputChange}
            size='small'
            margin="dense"
            /* InputLabelProps={{ style: styles.label }} */
           
            value={formData.email || ""}
            error={formSubmitted && !formData.email}
          />
        </Grid>
        {/*<Grid item xs={5.8} style={{ marginRight: '10px' }}>
          <TextField
            fullWidth
            type="password"
            name="password"
            label="Contraseña"
            variant="outlined"
            onChange={handleInputChange}
            size='small'
            margin="dense"
            value={formData.password || ""}
            error={formSubmitted && !formData.password}
          />
        </Grid>*/}
        <Grid item xs={5.8}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel
              id="demo-simple-select-label"
            /* sx={{ ...styles.label, ...styles.formField }} */
            >
              Rol
            </InputLabel>
            <Select
              name="rol"
              label="Age"
              value={formData.rol || user_type.code}
              onChange={handleInputChange}
              size='small'
              style={{ marginTop: "8px" }}
              error={formSubmitted && !formData.rol}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
            >
              {/*<MenuItem value={1}>Administrador</MenuItem>
              <MenuItem value={3}>Operador</MenuItem>
              <MenuItem value={2}>Coordinador</MenuItem>
              <MenuItem value={4}>Director</MenuItem>
              <MenuItem value={5}>Comite Directivo	</MenuItem>
              <MenuItem value={6}>Admin de Laboratorio</MenuItem>
              <MenuItem value={7}>Admin de Instituto</MenuItem>
              */}
              <MenuItem value="" disabled>
                Seleccione rol
              </MenuItem>
              {/* Mapea los roles en los MenuItem */}
              {roles.map((role) => (
                <MenuItem key={role.rol_id} value={role.rol_id}>
                  {role.nombre}
                </MenuItem>
              ))}

            </Select>
            {formErrors.rol && <p style={{ color: '#D32F2F', fontSize: '12px', marginTop: '4px' }}>Selecciona un rol</p>}
          </FormControl>
        </Grid>
      </Grid>
      <Button
      variant="contained"
      style={{ marginTop: '20px', width: "260px" }}
      sx={{ ...styles.button }}
      onClick={handleRegisterClick}
    >
      ENVIAR
    </Button>
    {/* Mensaje de error general */}
    {formGeneralError && (
      <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
        {formGeneralError}
      </p>
    )}

    {/* Diálogo para mostrar mensajes */}
    <Dialog open={openDialog} onClose={handleDialogClose}>
      <DialogTitle>Información</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {formSubmitted ? 'Petición exitosa' : ''}
          
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
    </form>
  );

}

export default UserForm;