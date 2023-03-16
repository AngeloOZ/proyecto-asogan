import { useRouter } from "next/router";

import { Box, BoxProps, Card, Grid, InputAdornment, MenuItem, Stack, TextField } from "@mui/material"
import { lotes } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useSWR from "swr";

import FormProvider, {
    RHFSwitch,
    RHFEditor,
    RHFUpload,
    RHFTextField,
    RHFSelect,
    RHFAutocomplete,
} from 'src/components/hook-form';
import { useForm } from "react-hook-form";
import moment from "moment-timezone";
import { LoadingButton } from "@mui/lab";


interface LoteMartillador extends BoxProps {
    // other?: BoxProps
    setLoteActualRoot: Dispatch<SetStateAction<lotes | undefined>>
}

type FormProps = {
    id_lote: string | number;
    puja_inicial: number;
    incremento: number;

}
export const LoteMartillador = ({ setLoteActualRoot }: LoteMartillador) => {
    const { query } = useRouter();
    const [idEventoActual, setIdEventoActual] = useState(3)
    const [loteActual, setLoteActual] = useState<lotes>()
    const [listadoLotes, setListadoLotes] = useState<lotes[]>([])

    const { data: lotes } = useSWR(`/lotes/${idEventoActual}`) as { data: lotes[] };

    // TODO: activar lote para compradores

    const defaultValues = {
        id_lote: loteActual?.id_lote || '',
        puja_inicial: Number(loteActual?.puja_inicial) || 0,
        incremento: Number(loteActual?.incremento) || 0,
    }
    const methods = useForm<FormProps>({
        defaultValues
    });

    const {
        reset,
        watch,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;
    const values = watch();


    const onSubmit = (data: FormProps) => {
        console.log(data)
    }

    useEffect(() => {
        if (query.id) {

        }
    }, [query])

    useEffect(() => {
        if (lotes) {
            setListadoLotes(lotes)
        }
    }, [lotes])

    useEffect(() => {
        if (values.id_lote) {
            setLoteActual(lotes.find(lote => lote.id_lote == values.id_lote))
        }
    }, [values.id_lote]);

    useEffect(() => {
        reset(defaultValues)
        setLoteActualRoot(loteActual)
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
                        <RHFTextField
                            name="puja_inicial"
                            label="Puja inicial"
                            size='small'
                            type='number'
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            inputProps={{
                                step: "any",
                            }}
                        />


                    </Grid>

                    <Grid item xs={12} md={4} lg={3}>
                        <RHFTextField
                            name="incremento"
                            label="Incremento"
                            size='small'
                            type='number'
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