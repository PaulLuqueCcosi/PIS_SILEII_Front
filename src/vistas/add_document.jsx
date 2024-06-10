import { Container, Grid, Paper, Typography, Box } from "@mui/material";
import Escudo from "../assets/imagenes/login_back.png";
import DocumentForm from "../componentes/DocumentForm";


function add_users() {
  return (
    <Container 
      maxWidth="lg"
      disableGutters
      sx={{
        marginTop: "8%",
        /* border: "1px solid yellow", */
        /* overflowX: "hidden" */
      }}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        style ={{
          /* border: "1px solid red", */
          /* overflowX: "hidden" */
        }}
      >
        {/* Columna Izquierda (Formulario) */}
        <Grid item xs={6} sm={6} md={0} lg={0} /* style={{border:'1px solid black'}} */>
          <Paper
            elevation={3}
            style={{
              padding: "30px",
              width: '80%',
              /* overflow: 'hidden' */
              /* maxWidth: '600px' */
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              align="left"
              style={{ color: "#64001D", fontWeight: "bold", marginBottom: "30px" }}
            >
              Subir Documento
            </Typography>
            <DocumentForm />
          </Paper>
        </Grid>

        {/* Columna Derecha (Imagen) */}
        <Grid item xs={6} sm={6} md={0} lg={0} /* style={{border:'1px solid black'}} */>
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
