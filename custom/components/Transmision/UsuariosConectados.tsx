
import {
  ListItemText,
  ListItem,
  Typography,
  List,
  Container,
} from "@mui/material";

export const UsuariosConectados = (props: any) => {
  const { data, cantidad } = props

  return (
    <>
      <Container
        maxWidth={false}
        sx={{ height: "500px", marginBottom: '30px' }}
      >
        <List
          sx={{
            backgroundColor: "#fff",
            borderRadius: "5px",
            maxHeight: "100%",
            overflowY: "auto",
            padding: '30px',
          }}

        >
          <Typography variant="subtitle1" sx={{ paddingBottom: '15px' }}>Compradores Conectados ({cantidad})</Typography>

          {cantidad > 0 && (data
            .filter((conectado: any) => conectado.conectado !== null)
            .map((conectado: any) => (
              <ListItem
                key={conectado.conectado}
                sx={{
                  mt: "10px",
                  borderRadius: "5px",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                }}
              >
                <ListItemText primary={conectado.nombres} />
              </ListItem>
            ))
          )}
        </List>
      </Container>
    </>
  );
};

