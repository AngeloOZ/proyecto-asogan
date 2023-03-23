import { Box, Button, Card, Grid, InputAdornment, MenuItem, Stack, TextField } from "@mui/material"
import { lotes } from "@prisma/client";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { subastaAPI } from 'custom/api'
import FormProvider, {
    RHFSelect,
} from 'src/components/hook-form';
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";


interface Lote {
    puja_inicial: number;
    incremento: number;
    id_lote: number;
    subastado: number;
}

interface LoteMartillador {
    setLoteActual?: Dispatch<SetStateAction<lotes | undefined>>;
    listadoLotes?: lotes[];
    loteActual: lotes | undefined;
}

type FormProps = {
    id_lote: string | number;
    incremento: number | string;
    lote: Lote;

}
export const LoteAdminMartillador = ({ loteActual, setLoteActual = () => { }, listadoLotes = [] }: LoteMartillador) => {

    const { enqueueSnackbar } = useSnackbar();
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

    const guardarLote = async () => {
        try {
            const loteModificado = {
                id_lote: values.id_lote,
                id_evento: loteActual?.id_evento,
                puja_inicial: values.lote.puja_inicial,
                incremento: values.lote.incremento,
                subastado: values.lote.subastado,
            };

            await subastaAPI.put(`/subastas/lotes`, loteModificado);

            // Restablece los valores del formulario a sus valores predeterminados
            reset(defaultValues);
            enqueueSnackbar("Lote modificado correctamente", { variant: 'success' });
            // Aquí puedes agregar el código para mostrar una notificación de éxito
        } catch (error) {
            console.error(error);

            // Aquí puedes agregar el código para mostrar una notificación de error
        }
    };


    const [selectedLote, setSelectedLote] = useState("");
    const [loteData, setLoteData] = useState<Lote>({
        puja_inicial: 0,
        incremento: 0,
        id_lote: 0,
        subastado: 0,
    });

    const fetchLoteData = async (loteId: string) => {
        try {
            const { data } = await subastaAPI.get(`/lotes?id=${loteId}`);
            console.log(data)
            setLoteData(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (selectedLote) {
            fetchLoteData(selectedLote);
        }
    }, [selectedLote]);

    return (

        <FormProvider methods={methods} >
            <Box
                gap={1.5}
                display="grid"
                padding={1}
            >

                <RHFSelect
                    onChange={(e) => setSelectedLote(e.target.value)}
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
                    value={selectedLote} // agregado

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
                    type='number'
                    fullWidth
                    value={loteData?.puja_inicial}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        style: { fontSize: 15 }
                    }}
                    InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                />

                <TextField
                    label="Puja"
                    size='small'
                    type='number'
                    fullWidth
                    value={loteData?.incremento}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        style: { fontSize: 15 }
                    }}
                    InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                />

                <Button onClick={() => guardarLote()} variant="contained" color="success" style={{ flex: 1, marginRight: 8 }}>
                    Guardar
                </Button>

            </Box>

        </FormProvider>

    )
}
