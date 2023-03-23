import { Box, Button, Card, Grid, InputAdornment, MenuItem, Stack, TextField } from "@mui/material"
import { lotes } from "@prisma/client";
import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react";
import { subastaAPI } from 'custom/api'
import FormProvider, {
    RHFSelect,
} from 'src/components/hook-form';
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";


interface Lote {
    id_lote?: number | string;
    id_evento?: number;
    puja_inicial?: number | string;
    incremento?: number | string;
    subastado?: string | number;
}

interface LoteMartillador {
    listadoLotes?: lotes[];
}

type FormProps = Lote;
export const LoteAdminMartillador = ({ listadoLotes = [] }: LoteMartillador) => {

    const { enqueueSnackbar } = useSnackbar();
    const [loteActual, setLoteActual] = useState<Lote>()

    const defaultValues = useMemo<FormProps>(() => ({
        id_lote: loteActual?.id_lote || "",
        subastado: loteActual?.subastado || "",
        puja_inicial: Number(loteActual?.puja_inicial) || 0,
        incremento: Number(loteActual?.incremento) || 0,
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
                id_lote: data.id_lote,
                id_evento: loteActual?.id_evento,
                puja_inicial: data.puja_inicial,
                incremento: data.incremento,
                subastado: data.subastado,
            };
            console.log(loteModificado)
            await subastaAPI.post(`/subastas/loteAdminMartillador`, loteModificado);

            // Restablece los valores del formulario a sus valores predeterminados
            reset(defaultValues);
            enqueueSnackbar("Lote modificado correctamente", { variant: 'success' });
        } catch (error) {
            console.error(error);

            // Aquí puedes agregar el código para mostrar una notificación de error
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

                <TextField
                    name="puja_inicial"
                    label="Valor base"
                    size='small'
                    //type='number'
                    fullWidth
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        style: { fontSize: 15 }
                    }}
                    InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                />

                <TextField
                    name="incremento"
                    label="Puja"
                    size='small'
                    // type='number'
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
