import React, { useState, useEffect } from 'react';
import { TextField, Button, Autocomplete, Checkbox, ListItemText, FormControl, InputLabel, Select, Grid, MenuItem } from '@mui/material';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../js/config';

function Formulario({ labData }) {
  const [responsable, setResponsable] = useState(null);
  const [laboratorio, setLaboratorio] = useState(null);
  const [area, setArea] = useState(null);
  //const [lineasInvestigacion, setLineasInvestigacion] = useState(null);
  const [lineasInvestigacion, setLineasInvestigacion] = useState([]);
  const [ubicacion, setUbicacion] = useState('');
  const [laboratoriosOptions, setLaboratoriosOptions] = useState([]);
  const [areasOptions, setAreasOptions] = useState([]);
  const [disciplinasOptions, setDisciplinasOptions] = useState([]);
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
      laboratoriosOptions.length &&
      areasOptions.length &&
      disciplinasOptions.length &&
      labData
    ) {
      const foundResponsable = responsablesOptions.find(
        (option) => option.value === labData.coordinador_id
      );
      const foundLaboratorio = laboratoriosOptions.find(
        (option) => option.value === labData.laboratorio_id
      );
      const foundArea = areasOptions.find(
        (option) => option.value === labData.area_id
      );
      /*const foundLineasInvestigacion = disciplinasOptions.find(
        (option) => option.value === labData.disciplina_id
      );*/

      const foundLineasInvestigacion = labData.disciplinas
      ? labData.disciplinas.split(',').map((disciplinaName) => {
          const disciplinaOption = disciplinasOptions.find(
            (option) => option.label === disciplinaName.trim()
          );
          return disciplinaOption;
        })
      : [];

      if (foundResponsable) setResponsable(foundResponsable);
      if (foundLaboratorio) setLaboratorio(foundLaboratorio);
      if (foundArea) setArea(foundArea);
      if (foundLineasInvestigacion) setLineasInvestigacion(foundLineasInvestigacion);
      setUbicacion(labData.ubicacion);
      setRegistroId(labData.registro_id);     
    }
  }, [
    responsablesOptions,
    laboratoriosOptions,
    areasOptions,
    disciplinasOptions,
    labData
  ]);

  const isOptionEqualToValue = (option, value) => {
    // Verificar si la opción y el valor son válidos
    if (!option || !value) return false;
  
    // Verificar si las propiedades 'value' son iguales
    return option.value === value.value;
  };

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
      try {
        const disciplinasData = await fetchAPI('disciplinas');
        const responsablesData = await fetchAPI('usuarios/coordinadores');
        const laboratoriosData = await fetchAPI('laboratorios');
        const areasData = await fetchAPI('areas');

        if (disciplinasData && disciplinasData.disciplinas) {
          const transformedData = disciplinasData.disciplinas.map(disciplina => ({
            label: disciplina.nombre,
            value: disciplina.disciplina_id
          }));
          setDisciplinasOptions(transformedData);
        }

        if (responsablesData && responsablesData.coordinadores) {
          const transformedResponsables = responsablesData.coordinadores.map(coordinador => ({
            label: `${coordinador.nombre} ${coordinador.apellido_paterno} ${coordinador.apellido_materno}`,
            value: coordinador.usuario_id
          }));
          setResponsablesOptions(transformedResponsables);
        }

        if (laboratoriosData && laboratoriosData.laboratorios) {
          const transformedData = laboratoriosData.laboratorios.map(lab => ({
            label: lab.nombre,
            value: lab.laboratorio_id
          }));
          setLaboratoriosOptions(transformedData);
        }

        if (areasData && areasData.areas) {
          const transformedData = areasData.areas.map(area => ({
            label: area.nombre,
            value: area.area_id
          }));
          setAreasOptions(transformedData);
        }

        setDataLoaded(true);
      } catch (error) {
        console.error('Error al obtener las disciplinas:', error);
      }
      };


      fetchOptions();
      
  }, []);

  
  if (!dataLoaded) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    //if (!responsable || !laboratorio || !area || !lineasInvestigacion || !ubicacion) {
    if (!responsable || !laboratorio || !area || lineasInvestigacion.length === 0 || !ubicacion) {
      setError('Todos los campos deben completarse.');
      return;
    }

    try {
      // Obtener las opciones necesarias antes de enviar el formulario
      const [disciplinasData, responsablesData, laboratoriosData, areasData] = await Promise.all([
        fetchAPI('disciplinas'),
        fetchAPI('usuarios/coordinadores'),
        fetchAPI('laboratorios'),
        fetchAPI('areas')
      ]);

      const data = {
        coordinador_id: responsable.value,
        laboratorio_id: laboratorio.value,
        area_id: area.value,
        //disciplina_id: lineasInvestigacion.value,
        disciplinas: lineasInvestigacion.map((disciplina) => disciplina.value),
        ubicacion: ubicacion
      };
      let response;
      if (registroId) {
        // Actualizar el registro existente
        response = await fetchAPI(`registroLaboratorio/${registroId}`, 'PUT', data);
      } else {
        // Crear un nuevo registro
        response = await fetchAPI('registroLaboratorio', 'POST', data);
      }
      if (response) {
        navigate('/gestion_resp_lab');
      } else {
        setError('Ocurrió un error al procesar la solicitud.');
      }
    } catch (error) {
      console.error('Error al obtener opciones:', error);
      setError('Ocurrió un error al obtener opciones.');
    }
  };


  return (
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Autocomplete
            options={responsablesOptions}
            getOptionLabel={(option) => option ? option.label : ''}
            style={{ width: '100%' }}
            value={responsable}
            renderInput={(params) => (
              <TextField {...params} label="Responsable" variant="outlined" />
            )}
            isOptionEqualToValue={(option, value) => option.value === (value ? value.value : null)}
            onChange={(event, newValue) => {
              console.log("Nuevo valor de responsable:", newValue);
              setResponsable(newValue);
            }}
          />
          <Autocomplete
            options={laboratoriosOptions}
            getOptionLabel={(option) => option ? option.label : ''}
            style={{ width: '100%' }}
            value={laboratorio}
            renderInput={(params) => (
              <TextField {...params} label="Laboratorio" variant="outlined" />
            )}
            isOptionEqualToValue={(option, value) => option.value === (value ? value.value : null)}
            onChange={(event, newValue) => {
              console.log("Nuevo valor de laboratorio:", newValue);
              setLaboratorio(newValue);
            }}
          />
          <Autocomplete
            options={areasOptions}
            getOptionLabel={(option) => option ? option.label : ''}
            style={{ width: '100%' }}
            value={area}
            renderInput={(params) => (
              <TextField {...params} label="Área" variant="outlined" />
            )}
            isOptionEqualToValue={(option, value) => option.value === (value ? value.value : null)}
            onChange={(event, newValue) => {
              console.log("Nuevo valor de área:", newValue);
              setArea(newValue);
            }}
          />
          <Autocomplete
            multiple
            options={disciplinasOptions}
            getOptionLabel={(option) => option ? option.label : ''}
            style={{ width: '100%' }}
            value={lineasInvestigacion}
            renderInput={(params) => (
              <TextField {...params} label="Líneas de investigación" variant="outlined" />
            )}
            onChange={(event, newValues) => {
              console.log("Nuevos valores de líneas de investigación:", newValues);
              setLineasInvestigacion(newValues);
            }}
            isOptionEqualToValue={(option, value) => option.value === (value ? value.value : null)}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} />
                <ListItemText primary={option.label} />
              </li>
            )}
          />
          <TextField
            label="Ubicación"
            variant="outlined"
            value={ubicacion}
            onChange={(event) => setUbicacion(event.target.value)}
          />
          <Button type="submit" variant="contained" style={{ background: "#64001d" }}>
            ENVIAR
          </Button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </form>
    );
  }

export default Formulario;
