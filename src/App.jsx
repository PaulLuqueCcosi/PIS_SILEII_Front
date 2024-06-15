import { Routes, Route } from "react-router-dom";
import Login from "./vistas/login"; // Importa tus componentes de rutas
import Res_users from "./vistas/res_users";
import "../src/css/App.css";
import Navar from "./componentes/Navbar";
import NavbarLogin from "./componentes/NavbarLogin";
/* import Login from "./vistas/login";  */
import UpdateUser from "./vistas/updateUser";
import AddUser from "./vistas/add_users";
import Inicio from "./vistas/index";
import Laboratory from "./vistas/res_laboratory";
import Res_laboratory_public from "./vistas/res_laboratory_public";
import Area from "./vistas/res_area";
import Disciplina from "./vistas/res_discipline";
import Add_Management from "./vistas/add_management";
import Add_Equipment from "./vistas/add_equipment";
import Update_Equipment from "./vistas/update_equipment";
import Update_Poi from "./vistas/update_poi";
import Equipment from "./vistas/res_equipment";
import Rol from "./vistas/res_rol";
/* import SideMenu from "./componentes/SideMenu"; */
/* importacion para admin, gestion de laboratorios con responsable*/
import TbLab from "./vistas/gestion_resp_lab";
import Lab from "./vistas/add_gestion";
import InfoLab from "./vistas/info_laboratorio";
import UpdateLab from "./vistas/update_gestionLab";
/* import SideMenu from "./componentes/SideMenu"; */
/* importacion para operador, laboratorios*/
import ListaLab from "./vistas/op_listaLab";
import ListaLaboratorios from "./vistas/listaLab";
import ListaLabPublicos from "./vistas/op_listaLabPublicos";
import InfoLabOp from "./vistas/info_lab_op";
import InfoLabAdmin from "./vistas/info_lab_admin";
import ManageProyects from "./vistas/manage_proyects";
import AddProyect from "./vistas/add_proyect";
import UpdateProyect from "./vistas/update_proyect";
import ManageDocuments from "./vistas/manage_documents";
import AddDocument from "./vistas/add_document";
import UpdateDocument from "./vistas/update_document";
import Complete_la from "./vistas/complete_lab";
import Complete_la_Admin from "./vistas/complete_lab_admin";
import UpdateRes_lab from "./vistas/update_resp_lab";
import UpdateRes_insti from "./vistas/update_resp_insti";
import UpdateManagement from "./vistas/updateManagement";
import Res_ope from "./vistas/res_op";
import List_op from "./vistas/op_list";
import View_responsable from "./vistas/view_responsable";
import View_Lines_investigacion from "./vistas/res_linesInvest";
import View_equipos_p from "./vistas/res_equipo_public";
import View_proyectos_p from "./vistas/res_proyectos_public";
import View_publicaciones_p from "./vistas/res_publicaciones_public";
import View_servicios_p from "./vistas/res_servicios_public";
import View_info_equipos from "./vistas/info_equipo";
import View_info_poi from "./vistas/info_poi";
import View_info_proyectos from "./vistas/info_proyecto";
import View_Maintenance from "./vistas/view_maintenance";
import Update_Maintenance from "./vistas/update_maintenance";
import Res_maintenance from "./vistas/res_maintenance";

import TbInsti from "./vistas/gestion_resp_insti";
import AddInsti from "./vistas/add_insti";

import ResInsti from "./vistas/res_insti_public";
import ResInstiDire from "./vistas/res_insti_dire";
import ResInstiAdminLista from "./vistas/res_insti_adminLista";
import ResInstiAdmin from "./vistas/res_insti_admin"; //
import View_director_1 from "./vistas/view_director";
import Res_users_dire from "./vistas/res_users_director";
import Add_users_dire from "./vistas/add_comite_director";
import Add_users_coord from "./vistas/add_operador_coordinador";

import Complete_inti from "./vistas/complete_institutos";
import Add_service from "./vistas/add_service";
import Add_posted from "./vistas/add_posted";

import Info_insti from "./vistas/info_intituto";
import Info_instituto from "./vistas/info_insti";

import ResGaleriaPublic from "./vistas/res_galeria_public";
import Add_image from "./vistas/add_image";
import FuntionInsti from "./vistas/res_funtion_insti";
import PoiInsti from "./vistas/res_poi_insti";
import AddFuntion from "./vistas/add_funtion";
import AddPoi from "./vistas/add_poi";
import Res_Proyect_int from "./vistas/manage_proyects_inti";
import AddProyect_Int from "./vistas/add_proyect_insti";
import Vermislaboratorios from "./vistas/vermislaboratorios";
import VermisInstitutos from "./vistas/vermisinstitutos";
import Res_public_Int from "./vistas/res_publicaciones_insti";

import Res_convenio_Int from "./vistas/res_convenio_insti";
import Res_tusne_Int from "./vistas/res_tusne_insti";
import Add_tusne_Int from "./vistas/add_tusne_insti";

import Add_public_Int from "./vistas/add_publicaciones_insti";

import Add_convenio_Int from "./vistas/add_covenios_insti";

import { GoogleOAuthProvider } from "@react-oauth/google";
function App() {
  return (
    <GoogleOAuthProvider clientId="322075246111-ect87qjnsqbljmbemlk2frolihjab4t2.apps.googleusercontent.com">
      <div className="fondo">
        <Routes>
          {/* Rutas de Director*/}
          <Route
            path="/res_users_director"
            element={
              <Layout>
                <Res_users_dire />
              </Layout>
            }
          />
          <Route
            path="/add_comite_director"
            element={
              <Layout>
                <Add_users_dire />
              </Layout>
            }
          />
          <Route
            path="/add_operador_coordinador"
            element={
              <Layout>
                <Add_users_coord />
              </Layout>
            }
          />
          <Route
            path="/complete_institutos"
            element={
              <Layout>
                <Complete_inti />
              </Layout>
            }
          />
          <Route
            path="/info_insti"
            element={
              <Layout>
                <Info_instituto />
              </Layout>
            }
          />
          <Route
            path="/info_intituto"
            element={
              <Layout>
                <Info_insti />
              </Layout>
            }
          />
          <Route
            path="/res_funtion_insti"
            element={
              <Layout>
                <FuntionInsti />
              </Layout>
            }
          />
          <Route
            path="/res_poi_insti"
            element={
              <Layout>
                <PoiInsti />
              </Layout>
            }
          />
          <Route
            path="/add_funtion"
            element={
              <Layout>
                <AddFuntion />
              </Layout>
            }
          />
          <Route
            path="/add_poi"
            element={
              <Layout>
                <AddPoi />
              </Layout>
            }
          />
          <Route
            path="/manage_proyects_inti"
            element={
              <Layout>
                <Res_Proyect_int />
              </Layout>
            }
          />
          <Route
            path="/add_proyect_insti"
            element={
              <Layout>
                <AddProyect_Int />
              </Layout>
            }
          />
          <Route
            path="/res_publicaciones_insti"
            element={
              <Layout>
                <Res_public_Int />
              </Layout>
            }
          />
          <Route
            path="/res_convenio_insti"
            element={
              <Layout>
                <Res_convenio_Int />
              </Layout>
            }
          />
          <Route
            path="/add_publicaciones_insti"
            element={
              <Layout>
                <Add_public_Int />
              </Layout>
            }
          />
          <Route
            path="/add_covenios_insti"
            element={
              <Layout>
                <Add_convenio_Int />
              </Layout>
            }
          />
          <Route
            path="/res_tusne_insti"
            element={
              <Layout>
                <Res_tusne_Int />
              </Layout>
            }
          />
          <Route
            path="/add_tusne_insti"
            element={
              <Layout>
                <Add_tusne_Int />
              </Layout>
            }
          />
          {/* Rutas de Autenticación */}
          <Route
            path="/"
            element={
              <NavbarLogin>
                <Login />
              </NavbarLogin>
            }
          />
          <Route
            path="/login"
            element={
              <NavbarLogin>
                <Login />
              </NavbarLogin>
            }
          />
          {/* Rutas de Usuario */}
          <Route
            path="/Inicio"
            element={
              <Layout>
                <Inicio />
              </Layout>
            }
          />
          <Route
            path="/res_users"
            element={
              <Layout>
                <Res_users />
              </Layout>
            }
          />
          <Route
            path="/UpdateUser"
            element={
              <Layout>
                <UpdateUser />
              </Layout>
            }
          />
          <Route
            path="/AddUser"
            element={
              <Layout>
                <AddUser />
              </Layout>
            }
          />
          {/* Rutas de Laboratorio */}
          <Route
            path="/res_laboratory"
            element={
              <Layout>
                <Laboratory />
              </Layout>
            }
          />
          <Route
            path="/res_laboratory_public"
            element={
              <Layout>
                <Res_laboratory_public />
              </Layout>
            }
          />
          <Route
            path="/gestion_resp_lab"
            element={
              <Layout>
                <TbLab />
              </Layout>
            }
          />
          <Route
            path="/add_gestion"
            element={
              <Layout>
                <Lab />
              </Layout>
            }
          />
          <Route
            path="/info_laboratorio"
            element={
              <Layout>
                <InfoLab />
              </Layout>
            }
          />
          <Route
            path="/update_gestionLab"
            element={
              <Layout>
                <UpdateLab />
              </Layout>
            }
          />
          {/* Rutas para Operador */}
          <Route
            path="/op_listaLab"
            element={
              <Layout>
                <ListaLab />
              </Layout>
            }
          />
          <Route
            path="/listaLab"
            element={
              <Layout>
                <ListaLaboratorios />
              </Layout>
            }
          />
          <Route
            path="/complete_lab"
            element={
              <Layout>
                <Complete_la />
              </Layout>
            }
          />
          <Route
            path="/complete_lab_admin"
            element={
              <Layout>
                <Complete_la_Admin />
              </Layout>
            }
          />
          <Route
            path="/op_listaLabPublicos"
            element={
              <Layout>
                <ListaLabPublicos />
              </Layout>
            }
          />
          <Route
            path="/info_lab_op"
            element={
              <Layout>
                <InfoLabOp />
              </Layout>
            }
          />
          <Route
            path="/info_lab_admin"
            element={
              <Layout>
                <InfoLabAdmin />
              </Layout>
            }
          />
          <Route
            path="/ManageProyects"
            element={
              <Layout>
                <ManageProyects />
              </Layout>
            }
          />
          <Route
            path="/AddProyect"
            element={
              <Layout>
                <AddProyect />
              </Layout>
            }
          />
          <Route
            path="/UpdateProyect"
            element={
              <Layout>
                <UpdateProyect />
              </Layout>
            }
          />
          <Route
            path="/ManageDocuments"
            element={
              <Layout>
                <ManageDocuments />
              </Layout>
            }
          />
          <Route
            path="/AddDocument"
            element={
              <Layout>
                <AddDocument />
              </Layout>
            }
          />
          <Route
            path="/UpdateDocument"
            element={
              <Layout>
                <UpdateDocument />
              </Layout>
            }
          />
          <Route
            path="/op_list"
            element={
              <Layout>
                <List_op />
              </Layout>
            }
          />
          <Route
            path="/res_equipment"
            element={
              <Layout>
                <Equipment />
              </Layout>
            }
          />
          <Route
            path="/res_galeria_public"
            element={
              <Layout>
                <ResGaleriaPublic />
              </Layout>
            }
          />
          <Route
            path="/add_image"
            element={
              <Layout>
                <Add_image />
              </Layout>
            }
          />
          <Route
            path="/vermislaboratorios"
            element={
              <Layout>
                <Vermislaboratorios />
              </Layout>
            }
          />
          <Route
            path="/vermisinstitutos"
            element={
              <Layout>
                <VermisInstitutos />
              </Layout>
            }
          />
          {/* Otras Rutas de la Aplicación */}
          <Route
            path="/res_area"
            element={
              <Layout>
                <Area />
              </Layout>
            }
          />
          <Route
            path="/res_discipline"
            element={
              <Layout>
                <Disciplina />
              </Layout>
            }
          />
          <Route
            path="/add_management"
            element={
              <Layout>
                <Add_Management />
              </Layout>
            }
          />
          <Route
            path="/add_equipment"
            element={
              <Layout>
                <Add_Equipment />
              </Layout>
            }
          />
          <Route
            path="/res_op"
            element={
              <Layout>
                <Res_ope />
              </Layout>
            }
          />
          <Route
            path="/update_equipment"
            element={
              <Layout>
                <Update_Equipment />
              </Layout>
            }
          />
          <Route
            path="/update_poi"
            element={
              <Layout>
                <Update_Poi />
              </Layout>
            }
          />
          <Route
            path="/res_rol"
            element={
              <Layout>
                <Rol />
              </Layout>
            }
          />
          <Route
            path="/updateManagement"
            element={
              <Layout>
                <UpdateManagement />
              </Layout>
            }
          />
          <Route
            path="/update_resp_lab"
            element={
              <Layout>
                <UpdateRes_lab />
              </Layout>
            }
          />
          <Route
            path="/update_resp_insti"
            element={
              <Layout>
                <UpdateRes_insti />
              </Layout>
            }
          />
          <Route
            path="/view_responsable"
            element={
              <Layout>
                <View_responsable />
              </Layout>
            }
          />
          <Route
            path="/res_linesInvest"
            element={
              <Layout>
                <View_Lines_investigacion />
              </Layout>
            }
          />
          <Route
            path="/res_equipo_public"
            element={
              <Layout>
                <View_equipos_p />
              </Layout>
            }
          />
          <Route
            path="/res_proyectos_public"
            element={
              <Layout>
                <View_proyectos_p />
              </Layout>
            }
          />
          <Route
            path="/res_publicaciones_public"
            element={
              <Layout>
                <View_publicaciones_p />
              </Layout>
            }
          />
          <Route
            path="/res_servicios_public"
            element={
              <Layout>
                <View_servicios_p />
              </Layout>
            }
          />
          <Route
            path="/info_equipo"
            element={
              <Layout>
                <View_info_equipos />
              </Layout>
            }
          />
          <Route
            path="/info_poi"
            element={
              <Layout>
                <View_info_poi />
              </Layout>
            }
          />
          <Route
            path="/info_proyecto"
            element={
              <Layout>
                <View_info_proyectos />
              </Layout>
            }
          />
          <Route
            path="/view_maintenance"
            element={
              <Layout>
                <View_Maintenance />
              </Layout>
            }
          />
          <Route
            path="/update_maintenance"
            element={
              <Layout>
                <Update_Maintenance />
              </Layout>
            }
          />
          <Route
            path="/res_maintenance"
            element={
              <Layout>
                <Res_maintenance />
              </Layout>
            }
          />
          <Route
            path="/res_insti_admin"
            element={
              <Layout>
                <ResInstiAdmin />
              </Layout>
            }
          />{" "}
          {/* */}
          <Route
            path="/res_insti_dire"
            element={
              <Layout>
                <ResInstiDire />
              </Layout>
            }
          />
          <Route
            path="/res_insti_adminLista"
            element={
              <Layout>
                <ResInstiAdminLista />
              </Layout>
            }
          />
          <Route
            path="/res_insti_public"
            element={
              <Layout>
                <ResInsti />
              </Layout>
            }
          />
          <Route
            path="/add_insti"
            element={
              <Layout>
                <AddInsti />
              </Layout>
            }
          />
          <Route
            path="/gestion_resp_insti"
            element={
              <Layout>
                <TbInsti />
              </Layout>
            }
          />
          <Route
            path="/view_director"
            element={
              <Layout>
                <View_director_1 />
              </Layout>
            }
          />
          <Route
            path="/add_service"
            element={
              <Layout>
                <Add_service />
              </Layout>
            }
          />
          <Route
            path="/add_posted"
            element={
              <Layout>
                <Add_posted />
              </Layout>
            }
          />
          {/* Ruta para manejar 404 - No encontrado */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </GoogleOAuthProvider>
  );
}
// Componente Layout para incluir Navar
function Layout({ children }) {
  return (
    <>
      <Navar />
      {children}
    </>
  );
}
function NotFound() {
  return <div>Error 404: Página no encontrada</div>;
}

export default App;
