import { Box, Card, Grid, InputAdornment, MenuItem, Stack, TextField } from "@mui/material"
import { lotes } from "@prisma/client";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

import FormProvider, {
    RHFTextField,
    RHFSelect,
} from 'src/components/hook-form';
import { useForm } from "react-hook-form";
import moment from "moment-timezone";
import { LoadingButton } from "@mui/lab";
import { subastaAPI } from "custom/api";
import { IconPeso } from ".";
import { AuthContext } from "src/auth";


interface LoteMartillador {
    setLoteActual?: Dispatch<SetStateAction<lotes | undefined>>;
    listadoLotes?: lotes[];
    loteActual: lotes | undefined;
}

type FormProps = {
    id_lote: string | number;
    incremento: number | string;

}
export const LoteMartillador = ({ loteActual, setLoteActual = () => { }, listadoLotes = [] }: LoteMartillador) => {

    const { rol: [rolLogged] } = useContext(AuthContext)

    const cantidadAnimales = loteActual?.cantidad_animales || 0;
    const pesoTotal = Number(loteActual?.peso_total || 0);
    const pesoPromedio = pesoTotal / cantidadAnimales || 0;
    const tipoAniilaes = loteActual?.tipo_animales || '';
    const cantidadAnimalesText = `${cantidadAnimales} ${tipoAniilaes.toUpperCase()}`

    const valorBase = Number(loteActual?.puja_inicial) || 0;
    const valorPuja = Number(loteActual?.incremento) || 0;
    const valorFinal = Number(loteActual?.puja_final) || 0;
    const valorFinal2 = valorFinal + valorPuja;
    const valorFinalTotal = valorFinal * pesoTotal;

    const defaultValues = {
        id_lote: loteActual?.id_lote || '',
    }
    const methods = useForm<FormProps>({
        defaultValues
    });

    const {
        reset,
        watch,
    } = methods;
    const values = watch();

    useEffect(() => {
        if (values.id_lote && listadoLotes) {
            setLoteActual(listadoLotes.find(lote => lote.id_lote == values.id_lote))
        }

    }, [values.id_lote, listadoLotes]);


    useEffect(() => {
        reset(defaultValues)
        setLoteActual(loteActual)

        if (loteActual && loteActual.id_lote && loteActual.id_evento) {
            subastaAPI.post('subastas/lotes', {
                id_lote: loteActual?.id_lote,
                id_evento: loteActual?.id_evento,
            });
        }
    }, [loteActual])

    const renderCodigoLote = () => {
        if (rolLogged === 'comprador') {
            return (
                <TextField
                    label="Código de lote"
                    value={loteActual?.codigo_lote || ''}
                    size="small"
                    variant="outlined"
                    fullWidth
                    InputProps={{ inputProps: { readOnly: true }, style: { fontSize: 17 } }}
                    InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                />
            )
        } else {
            return (
                <RHFSelect
                    name='id_lote'
                    label='Listado de lotes'
                    placeholder="Lotes"
                    size='small'
                    InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                >
                    {
                        listadoLotes.length == 0 ?
                            <MenuItem value="">No hay lotes</MenuItem>
                            : listadoLotes.map((lote) => <MenuItem key={lote.id_lote} value={lote.id_lote}>{lote.codigo_lote}</MenuItem>)
                    }
                </RHFSelect>
            )
        }
    }

    const renderInfoLoteMartillador = () => {
        return <>
            <TextField
                label="Calidad"
                value={loteActual?.calidad_animales || ''}
                multiline
                maxRows={4}
                size="small"
                variant="outlined"
                fullWidth
                InputProps={{
                    inputProps: { readOnly: true },
                }}
                InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
            />

            <TextField
                label="Observaciones"
                value={loteActual?.observaciones || ''}
                multiline
                maxRows={4}
                size="small"
                variant="outlined"
                fullWidth
                InputProps={{
                    inputProps: { readOnly: true },
                }}
                InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
            />

            <TextField
                label="Crias hembras"
                value={loteActual?.crias_hembras || 0}
                multiline
                maxRows={4}
                size="small"
                variant="outlined"
                fullWidth
                InputProps={{
                    inputProps: { readOnly: true },
                }}
                InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
            />

            <TextField
                label="Crias machos"
                value={loteActual?.crias_machos || 0}
                multiline
                maxRows={4}
                size="small"
                variant="outlined"
                fullWidth
                InputProps={{
                    inputProps: { readOnly: true },
                }}
                InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
            />

        </>
    }

    return (
        <Card sx={{ p: 2.5 }}>
            <FormProvider methods={methods} >
                <Box
                    gap={1.5}
                    display="grid"
                    gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(3, 1fr)',
                        md: 'repeat(4, 1fr)',
                    }}
                >

                    {renderCodigoLote()}

                    <TextField
                        label="Fecha y hora de pesaje"
                        value={loteActual?.fecha_pesaje ? moment(loteActual.fecha_pesaje).format('H:mm - DD/MM/YYYY') : ''}
                        size="small"
                        variant="outlined"
                        fullWidth
                        InputProps={{ inputProps: { readOnly: true } }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />

                    <TextField
                        label="Cantidad de animales"
                        value={cantidadAnimalesText}
                        size="small"
                        variant="outlined"
                        fullWidth
                        InputProps={{ inputProps: { readOnly: true } }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />

                    <TextField
                        label="Procedencia"
                        value={loteActual?.procedencia || ''}
                        size="small"
                        variant="outlined"
                        fullWidth
                        InputProps={{ inputProps: { readOnly: true } }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />

                    {rolLogged !== 'comprador' && renderInfoLoteMartillador()}

                    <TextField
                        label="Peso total"
                        value={pesoTotal.toFixed(2)}
                        size="small"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                            inputProps: { readOnly: true },
                            startAdornment: <InputAdornment position="start"><IconPeso /></InputAdornment>,
                        }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />

                    <TextField
                        label="Precio base"
                        size='small'
                        type='number'
                        fullWidth
                        value={(pesoTotal * valorBase).toFixed(2)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            readOnly: true,
                        }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />

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

                    <TextField
                        label="Precio base promedio"
                        size='small'
                        type='number'
                        fullWidth
                        value={(pesoPromedio * valorBase).toFixed(2)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            readOnly: true,
                        }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />

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

                    <TextField
                        label="Proximo puja"
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

                </Box>

            </FormProvider>
        </Card >
    )
}
