import { useEffect, useMemo, useState } from "react";

import { Box, Button, InputAdornment, MenuItem, Stack } from "@mui/material"
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

import { lotes } from "@prisma/client";

import { subastaAPI } from 'custom/api'

import FormProvider, {
    RHFSelect, RHFTextField,
} from 'src/components/hook-form';

interface Lote {
    id_lote: string;
    id_evento: number;
    puja_inicial: string;
    incremento: number;
    subastado: string;
}

interface LoteMartillador {
    listadoLotes?: lotes[];
    loteEnSubasta?: lotes;
}

type FormProps = Lote;

export const LoteAdminMartillador = ({ listadoLotes = [], loteEnSubasta }: LoteMartillador) => {

    const { enqueueSnackbar } = useSnackbar();
    const [loteActual, setLoteActual] = useState<lotes>()

    const defaultValues = useMemo<FormProps>(() => ({
        id_lote: loteActual?.id_lote.toString() || "",
        id_evento: loteActual?.id_evento || 0,
        puja_inicial: Number(loteActual?.puja_inicial || 0).toFixed(2),
        incremento: Number(loteActual?.incremento || 0),
        subastado: loteActual?.subastado?.toString() || "",
    }), [loteActual]);

    const idLoteActual = useMemo(() => {
        if (loteEnSubasta) {
            return loteEnSubasta.id_lote.toString();
        }
        return "";
    }, [loteEnSubasta])

    const methods = useForm<FormProps>({
        defaultValues
    });

    const {
        reset,
        handleSubmit,
        setValue,
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

    useEffect(() => {
        if (idLoteActual !== "") {
            setValue('id_lote', idLoteActual);
        }
    }, [idLoteActual])

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

    const partirPuja = () => {
        const mitad = Number(values.incremento) / 2;
        setValue('incremento', mitad);
        handleSubmit(guardarLote)();
    }

    const eliminarUltimaPuja = () => {
        // TODO: eliminar la ultima puja
        alert('eliminarUltimaPuja');
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(guardarLote)}>
            <Box
                gap={1.8}
                display="grid"
            // gridTemplateColumns="repeat(2, 1fr)"
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
                        style: { fontSize: 15 },
                        // TODO: habilitar si se aprueba la funcionalidad
                        // readOnly: idLoteActual === values.id_lote ? true : false,
                    }}
                    InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                />

                <RHFTextField
                    name="incremento"
                    label="Incremento"
                    size='small'
                    fullWidth
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        style: { fontSize: 15 }
                    }}
                    InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                />


                <Stack direction='row' spacing={1}>
                    <Button type="button" variant="contained" fullWidth color="secondary" onClick={partirPuja}>Partir puja</Button>
                    <Button type="submit" variant="contained" fullWidth color="success">Guardar</Button>
                </Stack>

                <Button type="button" variant="contained" fullWidth color="error" onClick={eliminarUltimaPuja}>Eliminar ultima puja</Button>
            </Box>

        </FormProvider>

    )
}
