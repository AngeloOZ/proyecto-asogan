import { useState } from "react";
import {
  ListItemText,
  ListItem,
  Typography,
  List,
  Container,
} from "@mui/material";
import { subastaAPI } from "custom/api";
import { compradores } from "@prisma/client";
import { useInterval } from "usehooks-ts";

export const UsuariosConectados = () => {
  const [conectados, setConectados] = useState<compradores[]>([]);

  useInterval(() => {
    useObtenerConectados();
  }, 3000);

  async function useObtenerConectados() {
    const { data } = await subastaAPI.get("/compradores/conectados");
    setConectados(data);
  }

  return (
    <>
      <Container
        maxWidth={false}
        sx={{ height: "500px", marginBottom:'30px'}}
      >
        <List
          sx={{
            backgroundColor: "#fff",
            borderRadius: "5px",
            maxHeight: "100%",
            overflowY: "auto",
            padding:'30px',
          }}

        >
          <Typography variant="subtitle1" sx={{paddingBottom:'15px'}}>Compradores Conectados</Typography>

          {conectados.map((conectado: any) => (
            <ListItem
              key={conectado.id_comprador}
              sx={{
                mt: "10px",
                borderRadius: "5px",
                border: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <ListItemText primary={conectado.usuario.nombres} />
            </ListItem>
          ))}
        </List>
      </Container>
    </>
  );
};
