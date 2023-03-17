import { Card, Grid, InputAdornment, TextField } from "@mui/material"
import { lotes } from "@prisma/client";
import useSWR from "swr";

import moment from "moment-timezone";

interface LoteCliente {
    loteActual: lotes | undefined;
}

export const LoteCliente = ({ loteActual }: LoteCliente) => {

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
                        label="Fecha de pesaje"
                        value={loteActual?.fecha_pesaje ? moment(loteActual.fecha_pesaje).format('DD/MM/YYYY') : ''}
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
                        value={loteActual?.cantidad_animales || ''}
                        size="small"
                        variant="outlined"
                        fullWidth
                        InputProps={{ inputProps: { readOnly: true } }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Tipo de animal"
                        value={loteActual?.tipo_animales || ''}
                        size="small"
                        variant="outlined"
                        fullWidth
                        InputProps={{ inputProps: { readOnly: true } }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />
                </Grid>

                {/* <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Calidad de animales"
                        value={loteActual?.calidad_animales || ''}
                        size="small"
                        variant="outlined"
                        fullWidth
                        InputProps={{ inputProps: { readOnly: true } }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />
                </Grid> */}

                {/* <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Sexo"
                        value={loteActual ? loteActual.sexo == '1' ? 'Macho' : 'Hembra' : ''}
                        size="small"
                        variant="outlined"
                        fullWidth
                        InputProps={{ inputProps: { readOnly: true } }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />
                </Grid> */}

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Crias hembras"
                        value={loteActual?.crias_hembras || '0'}
                        size="small"
                        variant="outlined"
                        fullWidth
                        InputProps={{ inputProps: { readOnly: true } }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />
                </Grid>

                <Grid item xs={12} md={4} lg={3}>
                    <TextField
                        label="Crias machos"
                        value={loteActual?.crias_machos || '0'}
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
                            startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
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
