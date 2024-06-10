import React, { useState, useEffect } from 'react';
import { Collapse, AppBar, Box, Toolbar, IconButton, Typography, Menu, Button, Tooltip, MenuItem, Popover, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Icon from '../assets/imagenes/login_back.png';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import ArrowRightIcon from '@mui/icons-material/ArrowRight'; // Importa más íconos según sea necesario
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Ícono para expandir
import ExpandLessIcon from '@mui/icons-material/ExpandLess'; // Ícono para contraer


import GroupAddIcon from '@mui/icons-material/GroupAdd'; // Alternativa para 'Asignar Coordinador'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ScienceIcon from '@mui/icons-material/Science'; // Alternativa para 'Gestion de Laboratorios'
import ExploreIcon from '@mui/icons-material/Explore'; // Alternativa para 'Lineas de Investigación'
import BuildIcon from '@mui/icons-material/Build';
import PublicIcon from '@mui/icons-material/Public';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'; // Alternativa para 'Mis Laboratorios'
import EngineeringIcon from '@mui/icons-material/Engineering'; // Alternativa para 'Gestion de Operadores'
//import MaintenanceIcon from '@mui/icons-material/Maintenance'; // Alternativa para 'Solicitud de Mantenimiento'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'; // Alternativa para 'Institutos'
import SchoolIcon from '@mui/icons-material/School'; // Alternativa para 'Asignar Director'
import { API_BASE_URL } from '../js/config';

// Definimos las opciones del menú de configuración y las rutas de las páginas.

const SidebarContainer = styled('div')({
  height: '100%',
  width: '250px',
  color: 'black',
  paddingTop: '40%',
});

const pageIcons = {
  'Inicio': <HomeIcon />,
  'Gestion de Usuarios': <PeopleIcon />,
  'Asignar Coordinador': <GroupAddIcon />,
  'Gestion de Roles': <AdminPanelSettingsIcon />,
  'Gestion de Laboratorios': <ScienceIcon />,
  'Área': <DashboardIcon />,
  'Lineas de Investigación': <ExploreIcon />,
  'Gestion de Equipos': <BuildIcon />,
  'Laboratorios públicos': <PublicIcon />,
  'Mis Laboratorios': <WorkspacePremiumIcon />,
  'Laboratorios asignados': <WorkspacePremiumIcon />,
  'Institutos asignados': <WorkspacePremiumIcon />,
  'Gestion de Operadores': <GroupAddIcon />,
  'Solicitud de Mantenimiento': <EngineeringIcon />,
  'Asignar Director': <SchoolIcon />,
  'Institutos': <AccountBalanceIcon />,
  'Institutos Registrados': <AccountBalanceIcon />,
  'Gestión de Institutos': <AccountBalanceIcon />,
  'Registrar Operador': <GroupAddIcon />,
  'Todos Los Institutos': <AccountBalanceIcon />,
  'Todos Los Laboratorios': <WorkspacePremiumIcon />,
  'Laboratorios Registrados': <WorkspacePremiumIcon />,
};
const settings = ['Perfil', 'Cerrar Sesión'];
const pageRoutes = {
  'Inicio': '/Inicio',
  'Gestion de Usuarios': '/res_users',
  'Asignar Coordinador': '/gestion_resp_lab',
  'Gestion de Roles': '/res_rol',
  'Gestion de Laboratorios': '/res_laboratory',
  'Área': '/res_area',
  'Lineas de Investigación': '/res_discipline',
  'Gestion de Equipos': '/res_equipment',
  'Laboratorios públicos': '/op_listaLabPublicos',
  'Mis Laboratorios': '/op_listaLab',
  'Laboratorios asignados': '/vermislaboratorios',
  'Institutos asignados': '/vermisinstitutos',
  'Gestion de Operadores': '/res_op',
  'Solicitud de Mantenimiento': '/res_maintenance',
  'Asignar Director': '/gestion_resp_insti',
  'Institutos': '/res_insti_dire',
  'Institutos Registrados': '/res_insti_adminLista',
  'Gestión de Institutos': '/res_insti_admin',
  'Registrar Operador': '/res_users_director',
  'Todos Los Institutos':'/res_insti_public',
  'Todos Los Laboratorios':'/res_laboratory_public',
  'Laboratorios Registrados':'/listaLab',
};
// Definimos estilos CSS para el componente.

const styles = {
  barra: {
    backgroundColor: '#FFFFFF',
    color: '#FFFFFF',
    position: 'relative',

    width: '100%'
  },
  enlace: {
    marginLeft: '8px',
    fontSize: '12px',
  },
};

// Función que devuelve un conjunto de páginas basadas en el rol del usuario.
function getPagesForRole(rol) {
  if (rol === 1) {
    return [
      //'Inicio',
      'Gestion de Usuarios',
      'Asignar Coordinador',
      'Gestion de Roles',
      'Gestion de Laboratorios',

      'Solicitud de Mantenimiento',
      'Asignar Director',
      'Laboratorios Registrados',
      'Institutos Registrados',
      //'Gestion de Equipos',
      {
        title: 'Configuración',
        subpages: ['Área', 'Lineas de Investigación']
      },
    ];
  }
  if (rol === 3) {
    return [{
      title: 'Gestión laboratorios',
      subpages: ['Laboratorios asignados']
    },];
  }
  if (rol === 4) {
    return [

      'Institutos',
      'Registrar Operador',

    ];
  }

  if (rol === 5) {
    return [{
      title: 'Gestión institutos',
      subpages: ['Institutos asignados']
    },];
  }
  if (rol === 2) {
    {
      return ['Gestion de Operadores', {
        title: 'Gestión laboratorios',
        subpages: ['Mis Laboratorios']
      },];
    }
  }
  if (rol === 6) {
    {
      return [
        
        //'Inicio',
        //'Gestion de Usuarios',
        'Asignar Coordinador',
        'Gestion de Laboratorios',  
        'Todos Los Laboratorios',
        //'Solicitud de Mantenimiento',
        //'Asignar Director',
        //'Gestion de Equipos',
        {
          title: 'Configuración',
          subpages: ['Área', 'Lineas de Investigación']
        },
      ];
    }
  }
  if (rol === 7) {
    {
      return [
        //'Inicio',
        //'Gestion de Usuarios',
        //'Asignar Coordinador',
        //'Gestion de Laboratorios',  
        //'Solicitud de Mantenimiento',
        'Asignar Director',
        'Gestión de Institutos',
        //'Registrar Comite',
        'Todos Los Institutos'
        //'Gestion de Equipos',
        //{
        //  title: 'Configuración',
        //  subpages: ['Área', 'Lineas de Investigación']
        //},

      ];
    }
    
  }
  if (rol > 7){
    {
      return [
        'Inicio',
      ]
    }
  }
}

function ResponsiveAppBar() {
  // Definimos estados para controlar diferentes partes de la barra de navegación.
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pages, setPages] = useState(['Inicio']);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState({ nombreusuario: 'Invitado', rol: 0 });
  const [user, setUser] = useState([]);
  const [openSubmenus, setOpenSubmenus] = useState({});


  useEffect(() => {
    const fetchUserData = async (email) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token de autenticación no encontrado en el localStorage.');
        }

        const response = await axios.get(`${API_BASE_URL}usuarios/getAllByEmail/${email}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (response.status === 200) {
          const { usuarios } = response.data;
          
          const user = usuarios[0];
          const nombreUsuario = user.correo;
          const rol = user.rol.rol_id;
          setUser(usuarios.filter(u => u.estado === true));
          setUsers({ nombreusuario: nombreUsuario, rol });
          setPages(getPagesForRole(rol));
          localStorage.setItem('id_user_l', user.usuario_id);
        } else {
          console.error('Error en la respuesta de la API:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    const email_local = localStorage.getItem('correo') || location.state?.correo;
    if (email_local) {
      fetchUserData(email_local);
    }
  }, []);


  const handleToggleSubmenu = (submenu) => {
    setOpenSubmenus((prevOpenSubmenus) => ({
      ...prevOpenSubmenus,
      [submenu]: !prevOpenSubmenus[submenu],
    }));
  };

  const handleOpenUserMenu = (event) => {
    // Función para abrir el menú de usuario
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    // Función para cerrar el menú de navegación
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (action) => {
    // Función para cerrar el menú de usuario y realizar acciones basadas en la opción seleccionada
    setAnchorElUser(null); // Cierra el menú

    // Ejecuta acciones basadas en la opción seleccionada
    switch (action) {
      case 'Perfil':
        let userToEdit = { ...user[0] }; // Clonar el objeto user
        localStorage.setItem('id_user_l', userToEdit.usuario_id);

        navigate('/UpdateUser', { state: { userToEdit } });
        break;
      case 'Cerrar Sesión':
        localStorage.setItem('token', "");
        localStorage.setItem('id_user_l', "");
        localStorage.setItem('correo', "");
        localStorage.setItem('rol', "");
        navigate('/');
        break;
      default:
        break;
    }
  };
  const handleDrawerToggle = () => {
    // Función para abrir/cerrar el menú lateral en dispositivos móviles
    setMobileOpen(!mobileOpen);
  };
  const appBarHeight = 64; // Ajusta este valor según la altura de tu AppBar
  let primeraLetra = users.nombreusuario ? users.nombreusuario[0].toUpperCase() : '';

  const drawer = (
    <SidebarContainer >
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
        <Box sx={{ flexGrow: 0, paddingLeft: '10px' }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar>{primeraLetra}</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{
              mt: '45px',
              right: 0, // Alinea el menú en el lado derecho
            }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <Typography variant="body2" style={{ marginTop: '8px' }}>
          {users.nombreusuario}
        </Typography>
      </div>
      <Divider />
      <List>
        {pages.map((page, index) => (
          <React.Fragment key={index}>
            {typeof page === 'string' ? (
              <ListItem button component={Link} to={pageRoutes[page]}>
                <ListItemIcon>
                  {pageIcons[page]} {/* Ícono para cada página */}
                </ListItemIcon>
                <ListItemText primary={page} />
              </ListItem>
            ) : (
              <>
                <ListItem button onClick={() => handleToggleSubmenu(page.title)}>
                  <ListItemIcon>
                    {pageIcons[page.title]} {/* Ícono para títulos de submenú */}
                  </ListItemIcon>
                  <ListItemText primary={page.title} />
                  {openSubmenus[page.title] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItem>
                <Collapse in={openSubmenus[page.title]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {page.subpages.map((subpage) => (
                      <ListItem button key={subpage} component={Link} to={pageRoutes[subpage]} style={{ marginLeft: '16px' }}>
                        <ListItemIcon>
                          {pageIcons[subpage]} {/* Ícono para subpáginas */}
                        </ListItemIcon>
                        <ListItemText primary={subpage} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            )}
          </React.Fragment>
        ))}
      </List>
      <Divider />
    </SidebarContainer>
  );


  return (
    // Estructura de la barra de navegación
    <Box sx={{ display: 'flex', flexDirection: 'column', padding: '0px 0px 0px 0px', }}>

      <AppBar sx={{ ...styles.barra, zIndex: (theme) => theme.zIndex.drawer + 1 }}>

        <Container maxWidth="">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 0 }}>
              <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true,
                }}
              >
                {drawer}
              </Drawer>
            </Box>


            <IconButton
              size="large"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              style={{ color: 'black', }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {/* LOGO */}
            </Typography>

            <Link to="/Inicio">
              <img src={Icon} alt="" style={{ width: "60px", heigth: "auto", marginRight: "10px", padding: '10%' }} />
            </Link>


            {/* Nombre del usuario */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Contenido que se encuentra en el lado derecho */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                fontFamily: 'monospace',
                color: 'black',
                textDecoration: 'none',
              }}
            >
              {users.nombreusuario}
            </Typography>

            <Box sx={{ flexGrow: 0, paddingLeft: '10px' }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar>{primeraLetra}</Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{
                  mt: '45px',
                  right: 0, // Alinea el menú en el lado derecho
                }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>

      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            width: '250px',
            marginTop: `${appBarHeight}px`, // Margen superior igual a la altura del AppBar
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: '250px', boxSizing: 'border-box' },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

export default ResponsiveAppBar;
