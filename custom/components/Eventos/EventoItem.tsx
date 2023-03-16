import { Card, CardContent, Typography, CardActionArea, Box, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { PATH_DASHBOARD } from 'src/routes/paths'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from 'next/link';
import { LotesEventos } from '@types';

type Props = {
  eventos: LotesEventos;
}


export const EventoItem = ({ eventos }: Props) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState<number | false>(false);

  const handleChange =
    (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  return (
    <>
      <Card>
        <CardContent>
        {/* <CardActionArea> */}
          {/* Tabla de Eventos */}
          <TableContainer>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <Typography variant="h5" >{eventos.descripcion}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" component="span">Fecha: </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" component="span">{eventos.fecha ? eventos.fecha.toString() : 'Fecha no disponible'}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" component="span">Lugar: </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" component="span">{eventos.lugar}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" component="span">Tipo: </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" component="span">{eventos.tipo}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" component="span">Estado: </Typography>
                  </TableCell>
                  <TableCell>
                    {eventos.abierto ?
                      <Typography variant="body2" color="green" component="span">Abierto</Typography> :
                      <Typography variant="body2" color="red" component="span">Cerrado</Typography>}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        {/* </CardActionArea> */}

          <Divider sx={{ marginTop: 1 }} />

          <Typography align="center" variant="h5" mt={1} >Lotes</Typography>


          {eventos.lotes.map(lote => (

            <Accordion expanded={expanded === lote.id_lote} onChange={handleChange(lote.id_lote)}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Box>
                  <Typography variant="body2" fontWeight="bold" component="span">Código Lote: </Typography>
                  <Typography variant="body2" component="span">{lote.codigo_lote}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" component="span">Lote: </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" component="span">{lote.codigo_lote}</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" component="span">Tipo Animales: </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" component="span">{lote.tipo_animales}</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" component="span">Fecha Pesaje: </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" component="span">{lote.fecha_pesaje}</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" component="span">Cantidad Animales: </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" component="span">{lote.cantidad_animales}</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" component="span">Calidad Animales: </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" component="span">{lote.calidad_animales}</Typography>
                        </TableCell>
                      </TableRow>
                      {lote.crias_hembras > 0 && (
                        <TableRow>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold" component="span">Crías Hembras: </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" component="span">{lote.crias_hembras}</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                      {lote.crias_machos > 0 && (
                        <TableRow>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold" component="span">Crías Machos: </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" component="span">{lote.crias_machos}</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" component="span">Procedencia: </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" component="span">{lote.procedencia}</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" component="span">Puja Inicial: </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" component="span">{lote.puja_inicial}</Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" component="span">Peso Total: </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" component="span">{lote.peso_total}</Typography>
                        </TableCell>
                      </TableRow>
                      {lote.observaciones.length > 0 && (
                        <TableRow>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold" component="span">Observaciones: </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" component="span">{lote.observaciones}</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          ))}

          <Link href={`${PATH_DASHBOARD.subastas.root}/${eventos.uuid}`} passHref legacyBehavior>
            <Button
              fullWidth
              color="primary"
              variant='contained'
              size="medium"
            >
              Ver
            </Button>
          </Link>
        </CardContent>
      </Card>
    </>
  );
};
