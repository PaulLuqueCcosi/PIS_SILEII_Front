import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import Escudo from "../assets/imagenes/login_back.png";
import DocumentForm from "../componentes/DocumentForm";


function add_users() {
  return (
    <Container 
      maxWidth="lg"
      disableGutters
      sx={{
        marginTop: "8%"
      }}>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        direction="row"
        justifyContent="center"
        alignItems="center"
        style ={{
          /* border: "1px solid red" */
        }}
      >
        {/* Columna Izquierda (Formulario) */}
        <Grid item xs={6} sm={6} md={6} lg={7}>
          <Paper
            elevation={3}
            style={{
              padding: "30px",
              width: '100%',
              maxWidth: '600px'
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              align="left"
              style={{ color: "#64001D", fontWeight: "bold", marginBottom: "20px" }}
            >
              Editar Documentos
            </Typography>
            <DocumentForm />
          </Paper>
        </Grid>

        {/* Columna Derecha (Imagen) */}
        <Grid item xs={6} sm={6} md={6} lg={5}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <img
              src={Escudo}
              alt="Logo-Sileii"
              style={{ width: "50%" ,heigth: "auto" }}
            />
          </Box>
        </Grid>

      </Grid>
    </Container>
  );
}

export default add_users;
