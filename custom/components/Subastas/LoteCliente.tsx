import { Card, Grid, InputAdornment, TextField } from "@mui/material"
import { lotes } from "@prisma/client";
import useSWR from "swr";

import moment from "moment-timezone";

interface LoteCliente {
    loteActual: lotes | undefined;
}

export const LoteCliente = ({ loteActual }: LoteCliente) => {

    return (
        <Card sx={{ p: 2.5 }}>
            <Grid container spacing={2}>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Número de lote"
                        value={loteActual?.codigo_lote || ''}
                        size="small"
                        variant="outlined"
                        fullWidth
                        disabled
                        InputProps={{ inputProps: { readOnly: true } }}
                    />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Fecha de pesaje"
                        value={loteActual?.fecha_pesaje ? moment(loteActual.fecha_pesaje).format('DD/MM/YYYY') : ''}
                        size="small"
                        variant="outlined"
                        fullWidth
                        disabled
                        InputProps={{ inputProps: { readOnly: true } }}
                    />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Cantidad de animales"
                        value={loteActual?.cantidad_animales || ''}
                        size="small"
                        variant="outlined"
                        fullWidth
                        disabled
                        InputProps={{ inputProps: { readOnly: true } }}
                    />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Tipo de animal"
                        value={loteActual?.tipo_animales || ''}
                        size="small"
                        variant="outlined"
                        fullWidth
                        disabled
                        InputProps={{ inputProps: { readOnly: true } }}
                    />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Calidad de animales"
                        value={loteActual?.calidad_animales || ''}
                        size="small"
                        variant="outlined"
                        fullWidth
                        disabled
                        InputProps={{ inputProps: { readOnly: true } }}
                    />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Sexo"
                        value={loteActual ? loteActual.sexo == '1' ? 'Macho' : 'Hembra' : ''}
                        size="small"
                        variant="outlined"
                        fullWidth
                        disabled
                        InputProps={{ inputProps: { readOnly: true } }}
                    />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Crias hembras"
                        value={loteActual?.crias_hembras || '0'}
                        size="small"
                        variant="outlined"
                        fullWidth
                        disabled
                        InputProps={{ inputProps: { readOnly: true } }}
                    />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Crias machos"
                        value={loteActual?.crias_machos || '0'}
                        size="small"
                        variant="outlined"
                        fullWidth
                        disabled
                        InputProps={{ inputProps: { readOnly: true } }}
                    />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Procedencia"
                        value={loteActual?.procedencia || ''}
                        size="small"
                        variant="outlined"
                        fullWidth
                        disabled
                        InputProps={{ inputProps: { readOnly: true } }}
                    />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Peso total"
                        value={loteActual?.peso_total || 0}
                        size="small"
                        variant="outlined"
                        fullWidth
                        disabled
                        InputProps={{
                            inputProps: { readOnly: true },
                            startAdornment: <InputAdornment position="start">Lb</InputAdornment>,
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        name="puja_inicial"
                        label="Puja inicial"
                        size='small'
                        type='number'
                        value={loteActual?.puja_final || 0}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            readOnly: true,
                        }}
                    />


                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        name="incremento"
                        label="Incremento"
                        size='small'
                        type='number'
                        value={loteActual?.incremento || 0}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            readOnly: true,
                        }}
                    />
                </Grid>
            </Grid>
        </Card >
    )
}
