import { Card, Grid, InputAdornment, TextField } from "@mui/material"

import { lotes } from "@prisma/client";

import moment from "moment-timezone";
import { IconPeso } from ".";

interface LoteCliente {
    loteActual: lotes | undefined;
}

export const LoteCliente = ({ loteActual }: LoteCliente) => {

    const cantidadAnimales = loteActual?.cantidad_animales || 0;
    const pesoTotal = Number(loteActual?.peso_total || 0);
    const pesoPromedio: number = pesoTotal / cantidadAnimales;

    const valorBase = Number(loteActual?.puja_inicial) || 0;
    const valorPuja = Number(loteActual?.incremento) || 0;
    const valorFinal = Number(loteActual?.puja_final) || 0;
    const valorFinal2 = valorFinal + valorPuja;
    const valorFinalTotal = valorFinal2 * Number(loteActual?.peso_total || 0);

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
                        InputProps={{ inputProps: { readOnly: true } }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Fecha y hora de pesaje"
                        value={loteActual?.fecha_pesaje ? moment(loteActual.fecha_pesaje).format('DD/MM/YYYY H:i:s') : ''}
                        size="small"
                        variant="outlined"
                        fullWidth
                        InputProps={{ inputProps: { readOnly: true } }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Cantidad de animales"
                        value={`${loteActual?.cantidad_animales} ${loteActual?.tipo_animales?.toUpperCase()}` || ''}
                        size="small"
                        variant="outlined"
                        fullWidth
                        InputProps={{ inputProps: { readOnly: true } }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Procedencia"
                        value={loteActual?.procedencia || ''}
                        size="small"
                        variant="outlined"
                        fullWidth
                        InputProps={{ inputProps: { readOnly: true } }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Peso total"
                        value={loteActual?.peso_total || 0}
                        size="small"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            inputProps: { readOnly: true },
                            startAdornment: <InputAdornment position="start"><IconPeso /></InputAdornment>,
                        }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Peso promedio"
                        value={pesoPromedio.toFixed(2)}
                    size="small"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        inputProps: { readOnly: true },
                        startAdornment: <InputAdornment position="start"><IconPeso /></InputAdornment>,
                    }}
                    InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2} mt={0.5}>
                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        name="puja_inicial"
                        label="Valor base"
                        size='small'
                        type='number'
                        fullWidth
                        value={valorBase.toFixed(2)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            readOnly: true,
                            style: { fontSize: 20 }
                        }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Puja"
                        size='small'
                        type='number'
                        fullWidth
                        value={valorPuja.toFixed(2)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            readOnly: true,
                            style: { fontSize: 20 }
                        }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Valor Final"
                        size='small'
                        type='number'
                        fullWidth
                        value={valorFinal2.toFixed(2) || 0}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            readOnly: true,
                            style: { fontSize: 20 }
                        }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Valor Total"
                        size='small'
                        type='number'
                        value={valorFinalTotal.toFixed(2) || 0}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            readOnly: true,
                            style: { fontSize: 20 }
                        }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />
                </Grid>

            </Grid>
        </Card >
    )
}
