import { Box, Button, Card, Grid, InputAdornment, MenuItem, Stack, TextField } from "@mui/material"
import { lotes } from "@prisma/client";
import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react";
import { subastaAPI } from 'custom/api'
import FormProvider, {
    RHFSelect, RHFTextField,
} from 'src/components/hook-form';
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";


interface Lote {
    id_lote: string;
    id_evento: number;
    puja_inicial: string;
    incremento: string;
    subastado: string;
}

interface LoteMartillador {
    listadoLotes?: lotes[];
}

type FormProps = Lote;
export const LoteAdminMartillador = ({ listadoLotes = [] }: LoteMartillador) => {

    const { enqueueSnackbar } = useSnackbar();
    const [loteActual, setLoteActual] = useState<lotes>()

    const defaultValues = useMemo<FormProps>(() => ({
        id_lote: loteActual?.id_lote.toString() || "",
        id_evento: loteActual?.id_evento || 0,
        puja_inicial: Number(loteActual?.puja_inicial || 0).toFixed(2),
        incremento: Number(loteActual?.incremento || 0).toFixed(2),
        subastado: loteActual?.subastado?.toString() || "",
    }), [loteActual]);

    const methods = useForm<FormProps>({
        defaultValues
    });

    const {
        reset,
        handleSubmit,
        watch,
    } = methods;

    // Obtiene los valores de los campos del formulario cuando cambian
    const values = watch();

    useEffect(() => {
        const cargarDatosLote = async () => {
            try {
                const { data } = await subastaAPI.get(`/subastas/loteAdminMartillador?id=${values.id_lote}`);
                setLoteActual(data);
            } catch (error) {
                console.error(error);
            }
        };

        if (values.id_lote) {
            cargarDatosLote();
        }

    }, [values.id_lote])

    useEffect(() => {
        if (loteActual) {
            reset(defaultValues);
        }
    }, [loteActual])

    const guardarLote = async (data: FormProps) => {
        try {

            const loteModificado = {
                id_lote: Number(data.id_lote),
                id_evento: Number(data.id_evento),
                puja_inicial: data.puja_inicial,
                incremento: data.incremento,
                subastado: data.subastado,
            }

            await subastaAPI.post(`/subastas/loteAdminMartillador`, loteModificado);
            enqueueSnackbar("Lote modificado correctamente", { variant: 'success' });
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(guardarLote)}>
            <Box
                gap={1.5}
                display="grid"
                padding={1}
            >

                <RHFSelect
                    name='id_lote'
                    label='Listado de lotes'
                    placeholder="Lotes"
                    size='small'
                    InputLabelProps={{
                        style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true
                    }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">#</InputAdornment>,
                        style: { fontSize: 15 }
                    }}
                >
                    {
                        listadoLotes.length == 0 ?
                            <MenuItem value="">No hay lotes</MenuItem>
                            : listadoLotes.map((lote) => <MenuItem key={lote.id_lote} value={lote.id_lote}>{lote.codigo_lote}</MenuItem>)
                    }
                </RHFSelect>

                <RHFSelect name='subastado' label='Seleccione Estado' size='small'>
                    <MenuItem value='0'>No subastado</MenuItem>
                    <MenuItem value='1'>En subasta</MenuItem>
                    <MenuItem value='2'>Postergado</MenuItem>
                    <MenuItem value='3'>Subastado</MenuItem>
                </RHFSelect>

                <RHFTextField
                    name="puja_inicial"
                    label="Valor base"
                    size='small'
                    fullWidth
                    defaultValue={values.puja_inicial}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        style: { fontSize: 15 }
                    }}
                    InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                />

                <RHFTextField
                    name="incremento"
                    label="Puja"
                    size='small'
                    fullWidth
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        style: { fontSize: 15 }
                    }}
                    InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                />

                <Button type="submit" variant="contained" color="success" style={{ flex: 1, marginRight: 8 }}>
                    Guardar
                </Button>

            </Box>

        </FormProvider>

    )
}
