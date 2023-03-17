import { BoxProps, Card, Grid, InputAdornment, MenuItem, Stack, TextField } from "@mui/material"
import { lotes } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import FormProvider, {
    RHFTextField,
    RHFSelect,
} from 'src/components/hook-form';
import { useForm } from "react-hook-form";
import moment from "moment-timezone";
import { LoadingButton } from "@mui/lab";
import { subastaAPI } from "custom/api";


interface LoteMartillador {
    setLoteActual: Dispatch<SetStateAction<lotes | undefined>>;
    listadoLotes: lotes[];
    loteActual: lotes | undefined;
}

type FormProps = {
    id_lote: string | number;
    incremento: number | string;

}
export const LoteMartillador = ({ loteActual, setLoteActual, listadoLotes }: LoteMartillador) => {

    const defaultValues = {
        id_lote: loteActual?.id_lote || '',
        incremento: Number(loteActual?.incremento).toFixed(2) || 0,
    }
    const methods = useForm<FormProps>({
        defaultValues
    });

    const {
        reset,
        watch,
        handleSubmit,
        setValue,
        formState: { isSubmitting },
    } = methods;
    const values = watch();


    const onSubmit = (data: FormProps) => {
        console.log(data)
    }

    useEffect(() => {
        if (values.id_lote) {
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

    return (
        <Card sx={{ p: 2.5 }}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4} lg={3}>
                        <RHFSelect name='id_lote' label='Listado de lotes' placeholder="Lotes" size='small'>
                            {
                                listadoLotes.length == 0 ?
                                    <MenuItem value="">No hay lotes</MenuItem>
                                    : listadoLotes.map((lote) => <MenuItem key={lote.id_lote} value={lote.id_lote}>{lote.codigo_lote}</MenuItem>)
                            }
                        </RHFSelect>
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

                    <Grid item xs={12} md={4} lg={3}>
                        <TextField
                            label="Calidad de animales"
                            value={loteActual?.calidad_animales || ''}
                            size="small"
                            variant="outlined"
                            fullWidth
                            InputProps={{ inputProps: { readOnly: true } }}
                            InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12} md={4} lg={3}>
                        <TextField
                            label="Sexo"
                            value={loteActual ? loteActual.sexo == '1' ? 'Macho' : 'Hembra' : ''}
                            size="small"
                            variant="outlined"
                            fullWidth
                            InputProps={{ inputProps: { readOnly: true } }}
                            InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                        />
                    </Grid>

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

                    <Grid item xs={12} md={4} lg={3}>
                        <TextField
                            label="Valor inicial"
                            value={loteActual?.puja_inicial || 0}
                            size="small"
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                inputProps: { readOnly: true },
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                        />
                    </Grid>

                    <Grid item xs={12} md={4} lg={3}>
                        <RHFTextField
                            name="incremento"
                            label="Incremento"
                            size='small'
                            type='number'
                            InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            inputProps={{
                                step: "any",
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Stack direction="row" justifyContent="flex-end">
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                size="medium"
                                loading={isSubmitting}
                            >
                                Guardar
                            </LoadingButton>
                        </Stack>
                    </Grid>
                </Grid>
            </FormProvider>
        </Card >
    )
}
