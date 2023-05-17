import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { lotes } from '@prisma/client';
import { calcularSubasta } from 'utils'

type Props = {
    lote?: lotes,
}

type PropsFile = {
    title: string,
    value: any
}

export const Fila = ({ title, value }: PropsFile) => {
    return (
        <Grid item xs={12} md={6}>
            <Stack direction='row' spacing={1} mb={2}>
                <Typography component='p' variant='h5'>{title}:</Typography>
                <Typography component='p' variant='h5' fontWeight={500}>{value}</Typography>
            </Stack>
        </Grid>
    )
}

export const LabelInformation = ({ text, bgcolor = 'primary.main' }: { text: string, bgcolor?: string }) => {
    return (
        <Box
            component='div'
            sx={{
                bgcolor: bgcolor,
                color: 'white',
                borderRadius: '5px',
                p: 1,
                textAlign: 'center',
                width: '100%',
            }}
        >
            <Typography
                component='p'
                variant='h4'
                fontWeight={500}
                dangerouslySetInnerHTML={{ __html: text }}
            />
        </Box>
    )
}

export const InformacionLote = ({ lote }: Props) => {

    const loteAux = calcularSubasta(lote, undefined);

    return (
        <Card style={{ height: '100%' }}>
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
                        value={loteAux.valorBase || '0'}
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

                <Stack direction="row" spacing={1.5} flexWrap={{ xs: 'wrap', sm: 'nowrap' }}>
                    <LabelInformation
                        bgcolor='warning.main'
                        text={`Valor promedio <strong>${(loteAux.pesoPromedio * loteAux.valorFinal).toFixed(2)}</strong>`} 
                    />
                    <LabelInformation 
                        text={`Valor total ${(loteAux.pesoTotal * loteAux.valorFinal).toFixed(2)}`}
                    />
                </Stack>
            </CardContent>
        </Card>
    )
}
