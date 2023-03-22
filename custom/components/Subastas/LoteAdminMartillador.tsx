import { Box, Button, Card, Grid, InputAdornment, MenuItem, Stack, TextField } from "@mui/material"
import { lotes } from "@prisma/client";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { subastaAPI } from 'custom/api'
import FormProvider, {
    RHFSelect,
} from 'src/components/hook-form';
import { useForm } from "react-hook-form";



interface LoteMartillador {
    setLoteActual?: Dispatch<SetStateAction<lotes | undefined>>;
    listadoLotes?: lotes[];
    loteActual: lotes | undefined;
}

type FormProps = {
    id_lote: string | number;
    incremento: number | string;

}
export const LoteAdminMartillador = ({ loteActual, setLoteActual = () => { }, listadoLotes = [] }: LoteMartillador) => {

    // const valorBase = Number(loteActual?.puja_inicial) || 0;
    // const valorPuja = Number(loteActual?.incremento) || 0;

    const defaultValues = {
        id_lote: loteActual?.id_lote || '',
    }
    const methods = useForm<FormProps>({
        defaultValues
    });

    const {
        watch,
    } = methods;
    const values = watch();

    const [selectedLote, setSelectedLote] = useState("");
    const [valorBase, setValorBase] = useState(0);
    const [valorPuja, setValorPuja] = useState(0);

    const fetchLoteData = async (loteId: string) => {
        try {
            const { data } = await subastaAPI.get(`/lotes?id=${loteId}`);
            setValorBase(data.valorBase);
            setValorPuja(data.valorPuja);
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
                >
                    {
                        listadoLotes.length == 0 ?
                            <MenuItem value="">No hay lotes</MenuItem>
                            : listadoLotes.map((lote) => <MenuItem key={lote.id_lote} value={lote.id_lote}>{lote.codigo_lote}</MenuItem>)
                    }
                </RHFSelect>

                <RHFSelect name='subastado' label='Estado' size='small'>
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
                    value={valorBase}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        readOnly: true,
                        style: { fontSize: 15 }
                    }}
                    InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                />

                <TextField
                    label="Puja"
                    size='small'
                    type='number'
                    fullWidth
                    value={valorPuja}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        readOnly: true,
                        style: { fontSize: 15 }
                    }}
                    InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                />

                <Button variant="contained" color="success" style={{ flex: 1, marginRight: 8 }}>
                    Guardar
                </Button>

            </Box>

        </FormProvider>

    )
}
