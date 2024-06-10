import React, { useState, useEffect } from 'react';
import { TextField, Button, Autocomplete } from '@mui/material';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../js/config';

function Formulario({ labData }) {
  // Estados para gestionar los campos del formulario y las opciones de selección
  const [responsable, setResponsable] = useState(null);
  //const [laboratorio, setLaboratorio] = useState(null);
  //const [area, setArea] = useState(null);
  //const [lineasInvestigacion, setLineasInvestigacion] = useState(null);
  const [ubicacion, setUbicacion] = useState('');
  //const [laboratoriosOptions, setLaboratoriosOptions] = useState([]);
  //const [areasOptions, setAreasOptions] = useState([]);
  //const [disciplinasOptions, setDisciplinasOptions] = useState([]);
  const [responsablesOptions, setResponsablesOptions] = useState([]);
  const [error, setError] = useState('');
  const [registroId, setRegistroId] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    // Verifica si el usuario está autenticado al cargar el componente
    const token = localStorage.getItem('token');
    if (!token) {
        // Si el usuario no está autenticado, redirige al login
        navigate('/login'); // Ajusta la ruta según la ruta de tu login
        
    }
    
    if (
      responsablesOptions.length &&
      //laboratoriosOptions.length &&
      //areasOptions.length &&
      //disciplinasOptions.length &&
      labData
    ) {
      const foundResponsable = responsablesOptions.find(
        //(option) => option.value === labData.directores_id
        (option) => option.value === labData.usuario_director
      );
      //const foundLaboratorio = laboratoriosOptions.find(
      //  (option) => option.value === labData.laboratorio_id
      //);
      //const foundArea = areasOptions.find(
      //  (option) => option.value === labData.area_id
      //);
      //const foundLineasInvestigacion = disciplinasOptions.find(
      //  (option) => option.value === labData.disciplina_id
      //);

      if (foundResponsable) setResponsable(foundResponsable);
      //if (foundLaboratorio) setLaboratorio(foundLaboratorio);
      //if (foundArea) setArea(foundArea);
      //if (foundLineasInvestigacion) setLineasInvestigacion(foundLineasInvestigacion);
      //setUbicacion(labData.ubicacion);
      //setRegistroId(labData.registro_id);
      setUbicacion(labData.nombre);
      setRegistroId(labData.instituto_id);
    }
  }, [
    responsablesOptions,
    //laboratoriosOptions,
    //areasOptions,
    //disciplinasOptions,
    //labData
  ]);

  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token de autenticación no encontrado en el localStorage.');
      return null;
    }
    return token;
  }

  const fetchAPI = async (endpoint, method = 'GET', data = null) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

      const config = {
        method: method,
        url: `${API_BASE_URL}${endpoint}`,
        headers: headers
      };

      if (data) {
        config.data = JSON.stringify(data);
      }

      const response = await axios(config);
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        console.error('Error en la respuesta de la API:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      const responsablesData = await fetchAPI('directores');

      // Transformar los datos y actualizar las opciones de responsables
      if (responsablesData && responsablesData.directores) {
        const transformedResponsables = responsablesData.directores.map(directores => ({
          label: `${directores.nombre} ${directores.apellido_paterno} ${directores.apellido_materno}`,
          value: directores.usuario_id
        }));
        setResponsablesOptions(transformedResponsables);
      }





      setDataLoaded(true);
    };

    // Llamar a la función de obtención de opciones al cargar el componente
    fetchOptions();
  }, []);


  if (!dataLoaded) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validación: todos los campos deben completarse
    //if (!responsable) {
    if (!responsable || !ubicacion) {
      setError('Todos los campos deben completarse.');
      return;
    }

    // Datos a enviar en la solicitud    
    const data = {
      nombre: ubicacion,
      //mision: '',
      //vision: '',
      //historia: '',
      usuario_director: responsable.value,
      //comite_directivo: '',
      //comite_directivo: ''


    };
    let response;

    // Determinar si se está actualizando o creando un nuevo registro    
    if (registroId) {
      // Actualizar el registro existente
      response = await fetchAPI(`institutos/update/${registroId}`, 'PUT', data);
    } else {
      // Crear un nuevo registro
      response = await fetchAPI('institutos', 'POST', data);
    }
    if (response) {
    // Verificar la respuesta de la API y redirigir a la página correspondiente      
      navigate('/gestion_resp_insti');
    } else {
      setError('Ocurrió un error al procesar la solicitud.');
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <TextField
          label="Instituto"
          variant="outlined"
          value={ubicacion}
          onChange={(event) => setUbicacion(event.target.value)}
        />
        {/* Selector de director del instituto */}        
        <Autocomplete
          options={responsablesOptions}
          getOptionLabel={(option) => option.label}
          style={{ width: '100%' }}
          value={responsable} // <-- Aquí usamos la propiedad "value"
          renderInput={(params) => (
            <TextField {...params} label="Director de Instituto" variant="outlined" />
          )}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(event, newValue) => setResponsable(newValue)}
        />
        {/* Botón de envío del formulario */}        
        <Button type="submit" variant="contained" style={{ background: "#64001d" }}>
          ENVIAR
        </Button>
        {/* Mensaje de error (si hay alguno) */}        
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </form>
  );
}

export default Formulario;
