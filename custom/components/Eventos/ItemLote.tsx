import { Dispatch, SetStateAction, useContext } from "react";

import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material"

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Lote } from "@types"

import { useSnackbar } from 'src/components/snackbar';

import { calcularSubasta, handleErrorsAxios } from "utils";

import { EstadoLote } from "./EstadoLote";

import { subastaAPI } from "custom/api";
import { AuthContext } from "src/auth";
import { useSWRConfig } from "swr";

type Props = {
    lote: Lote,
    setExpanded: Dispatch<SetStateAction<number | false>>,
    expanded: number | false
    isEventActive: boolean
}

export const ItemLote = ({ lote, expanded, setExpanded, isEventActive }: Props) => {
    const { enqueueSnackbar } = useSnackbar();
    const { mutate } = useSWRConfig();
    const newLote = calcularSubasta(lote);
    const { rol: [rolLogged], user } = useContext(AuthContext);


    const handleChange =
        (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };


    const handleClickOfertar = async () => {
        try {
            const { data } = await subastaAPI.put('subastas/terminar', {
                id_lote: lote.id_lote,
                id_comprador: user?.comprador?.id_comprador || 0,
                accion: 'oferta',

            }) as { data: { message: string } };
            mutate('/eventos/hoy');
            enqueueSnackbar(`Genial, ${data.message}`, { variant: 'success' });

        } catch (error) {
            enqueueSnackbar(`Oops... ${handleErrorsAxios(error)}`, { variant: 'error' });
        }
    }

    return (

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
                                    <Typography variant="body2" fontWeight="bold" component="span">Estado: </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" component="span">
                                        <EstadoLote estado={lote.subastado} />
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold" component="span">Fecha Pesaje: </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" component="span">{newLote.horaPesaje}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold" component="span">Cantidad Animales: </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" component="span">{newLote.cantidadAnimalesText}</Typography>
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
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold" component="span">Peso Total: </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" component="span">{newLote.pesoTotal.toFixed(2)}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold" component="span">Peso Promedio: </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" component="span">{newLote.pesoPromedio.toFixed(2)}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold" component="span">Valor base: </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" component="span">{newLote.valorBase.toFixed(2)}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold" component="span">Puja Inicial: </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" component="span">{newLote.valorPuja.toFixed(2)}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold" component="span">Valor total: </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" component="span">{newLote.valorFinalTotal.toFixed(2)}</Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                {
                    isEventActive && lote.subastado === 2 && rolLogged === 'comprador' && (
                        <Button variant="contained" color="secondary" onClick={handleClickOfertar} fullWidth>Ofertar</Button>
                    )
                }
            </AccordionDetails>
        </Accordion>

    )
}
