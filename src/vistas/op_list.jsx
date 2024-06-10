import { Button, Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableRow, TextField, IconButton,TableHead  } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState} from 'react';
import { API_BASE_URL } from '../js/config';
import axios from 'axios';
import {Grid} from'@mui/material';
import { useLocation } from 'react-router-dom';

function SelectorOperador() {
  const location = useLocation();
  const labid = location.state?.laboratorio;
  const namelabo = location.state?.namelab;
  
  const navigate = useNavigate();
  const [operadores, setOperadores] = useState([]);
  const handleRedirect = () => navigate('/op_listaLab');
  const [searchQuery, setSearchQuery] = useState('');

  const [asignado, setAsignado] = useState("Asignar");





  const handleSearch = e => setSearchQuery(e.target.value);
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token de autenticación no encontrado en el localStorage.');
        // Redirigir al usuario a la página de inicio de sesión
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}coordinador/operadores/listar`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (response.status === 200) {
          const data = response.data.operadores.filter(user => user.estado===true);
          setOperadores(data);
        } else {
          console.error('Error en la respuesta de la API:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const fetchAsignados = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token de autenticación no encontrado en el localStorage.');
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}coordinador/operadoresLaboratorio/${labid}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (response.status === 200) {
          const data = response.data;
          console.log(data)
          //setOperadores(data);
        } else {
          console.error('Error en la respuesta de la API:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchAsignados();
    fetchUsers();
  }, []);

  const asingarLaboratorio = async (operador_id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token de autenticación no encontrado en el localStorage.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}coordinador/asignarOperadores/${labid}`,
      {
        operador_id
    }, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
        }
    });

      if (response.status === 200) {
        console.log("hecho")
      } else {
        console.error('Error en la respuesta de la API:', response.status);
      }
    } catch (error) {
      console.log("erroe")
    }

  }

  return (
    <Dialog open={true} fullWidth maxWidth="sm">
      <DialogTitle>
        Seleccionar Operador para {namelabo}
        <IconButton
          style={{ position: 'absolute', right: 10, top: 10 }}
          size="small"
          onClick={handleRedirect}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 15 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Operador"
            size="small"
            style={{ marginRight: 10 }}
            InputProps={{
              endAdornment: <SearchIcon color="action" />
            }}
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Nombres y Apellidos</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Correo</TableCell>
              <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '110%' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
              {operadores
                .filter((user) =>
                  user.correo.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((user, index) => (
                  <TableRow key={index}>
                    
                    <TableCell sx={{ textAlign: 'center' }}>{user.nombre} {user.apellido_paterno} {user.apellido_materno}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{user.correo}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Grid container spacing={1} alignItems="center" justifyContent="center">
                        <Grid item xs={12} sm={12}>
                          <Button
                            variant="contained"
                            fullWidth
                            style={{ backgroundColor: '#64001D', color: '#FFFFFF', minWidth: '120px' }}
                            onClick={() => asingarLaboratorio(user.usuario_id)}
                          >
                            {asignado}
                          </Button>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                  
                  
                ))}
            </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}

export default SelectorOperador;
