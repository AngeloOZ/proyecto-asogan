
import { Backdrop, Box, Modal, Fade, Card, CardContent, Grid, Stack, Button, TextField, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { lotes, eventos } from '@prisma/client';
import { tiendaApi } from 'custom/api';
import { calcularSubasta } from 'utils';
import { Fila } from './InformacionLote';

const style = {
    position: 'absolute' as 'absolute',
    width: '100%',
    maxWidth: 900,
    bgcolor: 'background.paper',
    borderRadius: '12px',
    boxShadow: 24,
    p: 4,
};

type Props = {
    open: boolean;
    handleClose: () => void;
    evento: eventos;
}

export function ModalLotes({ open, handleClose, evento }: Props) {
    const [loader, setLoader] = useState(false);
    const [numeroLote, setNumeroLote] = useState('');
    const [lotes, setLotes] = useState<lotes[]>([])
    const [lotesBase, setLotesBase] = useState<lotes[]>([])

    useEffect(() => {
        obtenerListadoLotes();

        return () => {
            obtenerListadoLotes();
        }
    }, [])

    const obtenerListadoLotes = async () => {
        setLoader(true);
        const { data } = await tiendaApi.get(`/lotes/${evento.id_evento}`);
        setLotes(data);
        setLotesBase(data);
        setLoader(false);
    }

    const handleBuscarLote = async (e: any) => {
        const num = e.target.value;
        setNumeroLote(num);

        if (num.length === 0) {
            setLotes(lotesBase);
        } else {
            const lotesFiltrados = lotesBase.filter(lote => lote.codigo_lote?.includes(num));
            setLotes(lotesFiltrados);
        }
    }

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            sx={{ display: 'flex', justifyContent: 'center', paddingTop: 5 }}
        >
            <Fade in={open}>
                <Box sx={{
                    ...style,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}>
                    {
                        loader ?
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <span>Cargando...</span>
                                <CircularProgress sx={{ ml: 1.5 }} />
                            </Box>
                            :
                            <Stack spacing={2.5}>
                                <TextField
                                    label='Buscar número de lote'
                                    variant='outlined'
                                    value={numeroLote}
                                    onChange={handleBuscarLote}
                                />
                                {lotes.map((lote) => <InformacionLoteModal lote={lote} key={lote.id_lote} />)}
                            </Stack>
                    }
                </Box>
            </Fade>
        </Modal>
    );
}

const InformacionLoteModal = ({ lote }: { lote: lotes }) => {
    const loteAux = calcularSubasta(lote, undefined);

    return (
        <Card style={{ height: '100%' }} sx={{ boxShadow: '0 0 8px rgba(0,0,0,0.4)' }}>
            <CardContent>
                <Grid container spacing={1}>
                    <Fila
                        title={'Lote'}
                        value={lote?.codigo_lote || '-'}
                    />
                    <Fila
                        title={'Cantidad'}
                        value={loteAux.cantidadAnimalesText || '-'}
                    />
                </Grid>

                <Grid container spacing={1}>
                    <Fila
                        title={'Hora de pesaje'}
                        value={loteAux.horaPesaje || '-'}
                    />
                    <Fila
                        title={'Peso Promedio'}
                        value={loteAux.pesoPromedio.toFixed(2) || '-'}
                    />
                </Grid>

                <Grid container spacing={1}>
                    <Fila
                        title={'Peso Total'}
                        value={lote?.peso_total || '-'}
                    />
                    <Fila
                        title={'Origen'}
                        value={lote?.procedencia || '-'}
                    />
                </Grid>

                {
                    (lote?.crias_hembras || 0 > 0 || lote?.crias_machos || 0 > 0) && (
                        <Grid container spacing={1}>
                            <Fila
                                title={'Crias Hembras'}
                                value={lote?.crias_hembras || '-'}
                            />
                            <Fila
                                title={'Criasa Machos'}
                                value={lote?.crias_machos || '-'}
                            />
                        </Grid>
                    )
                }

                <Grid container spacing={1}>
                    <Fila
                        title={'Valor Base'}
                        value={lote?.puja_inicial || '0'}
                    />
                    <Fila
                        title={'Puja Actual'}
                        value={loteAux.pujaActualText || ''}
                    />
                </Grid>

                <Grid container spacing={1}>
                    <Fila
                        title={'incremento'}
                        value={lote?.incremento || ''}
                    />
                    <Fila
                        title={'Observación'}
                        value={lote?.observaciones || ''}
                    />
                </Grid>

                <Box component='div' display='flex' justifyContent='center' mt={2}>
                    <Button variant='contained' size='large'>Activar lote</Button>
                </Box>
            </CardContent>
        </Card>
    )
}