import { useEffect, useMemo, useState } from "react";

import * as Yup from 'yup';
import { Box, Button, InputAdornment, MenuItem, Stack } from "@mui/material"
import { useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

import { eventos, lotes } from "@prisma/client";
import { subastaAPI } from 'custom/api'

import FormProvider, {
    RHFSelect, RHFTextField,
} from 'src/components/hook-form';

import { handleErrorsAxios } from "utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { UltimaPuja } from "@types";
import { ModalLotes } from '../';

interface Lote {
    id_lote: string;
    id_evento: number;
    codigo_lote: string;
    puja_inicial: string;
    incremento: number;
    subastado: string;
}

interface LoteMartillador {
    loteActivo?: lotes;
    ultimaPuja?: UltimaPuja | null;
    evento: eventos;
}

type FormProps = Lote;

export const LoteAdminMartillador = ({ loteActivo, ultimaPuja, evento }: LoteMartillador) => {
    const { enqueueSnackbar } = useSnackbar();
    const [openModal, setOpenModal] = useState(false);
    const handleCloseModal = () => setOpenModal(false);
    const handleOpenModal = () => setOpenModal(true);

    useEffect(() => {
        reset(defaultValues);
    }, [loteActivo]);

    const SubastaSchema = Yup.object().shape({
        puja_inicial: Yup
            .number()
            .required('La puja inicial es requerida')
            .min(0.005, 'El valor base debe ser mayor a 0.005')
            .typeError('Solo se adminite valores numéricos'),
        incremento: Yup
            .number()
            .required('El incremento es requerido')
            .min(0.005, 'El incremento debe ser mayor a 0.005')
            .typeError('Solo se adminite valores numéricos'),
    });

    const defaultValues = useMemo<FormProps>(() => ({
        id_lote: loteActivo?.id_lote.toString() || "",
        codigo_lote: loteActivo?.codigo_lote || "",
        id_evento: loteActivo?.id_evento || 0,
        puja_inicial: Number(loteActivo?.puja_inicial || 0).toFixed(2),
        incremento: Number(loteActivo?.incremento || 0),
        subastado: loteActivo?.subastado?.toString() || "",
    }), [loteActivo]);

    const methods = useForm<FormProps>({
        resolver: yupResolver(SubastaSchema),
        defaultValues,
    });
    const {
        reset,
        handleSubmit,
        setValue,
        watch,
    } = methods;

    // Obtiene los valores de los campos del formulario cuando cambian
    const values = watch();

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

    const eliminarUltimaPuja = async () => {
        try {
            await subastaAPI.delete(`/subastas/pujas?id_lote=${values.id_lote}`);
            enqueueSnackbar("Última puja eliminada", { variant: 'success' });
        }
        catch (error) {
            console.error(error);
            enqueueSnackbar(handleErrorsAxios(error), { variant: 'error' });
        }
    }

    return (
        <>
            {openModal && <ModalLotes
                open={openModal}
                handleClose={handleCloseModal}
                evento={evento}
            />}

            <FormProvider methods={methods} onSubmit={handleSubmit(guardarLote)}>
                <Box
                    gap={2}
                    display="grid"
                >
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={handleOpenModal}
                    >
                        Ver lotes
                    </Button>

                    <RHFTextField
                        name="codigo_lote"
                        label="Numero de lote"
                        size='small'
                        fullWidth
                        InputProps={{
                            readOnly: true,
                        }}
                        InputLabelProps={{ style: { fontSize: 18, color: 'black', fontWeight: "500" }, shrink: true }}
                    />

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
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            style: { fontSize: 15 },
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
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            color="success"
                            disabled={values.incremento <= 0 || Number(values.puja_inicial) <= 0}
                        >
                            Guardar
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            fullWidth
                            color="secondary"
                            disabled={values.incremento <= 0}
                            onClick={partirPuja}
                        >
                            Partir incremento
                        </Button>
                    </Stack>

                    <Button
                        type="button"
                        variant="contained"
                        fullWidth
                        color="error"
                        onClick={eliminarUltimaPuja}
                        disabled={ultimaPuja ? false : true}
                    >
                        Cancelar puja
                    </Button>
                </Box>

            </FormProvider>
        </>
    )
}
