import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
// next
import { useRouter } from 'next/router';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Grid, Card, Stack, Button, MenuItem, InputAdornment } from '@mui/material';

// components
import { useSnackbar } from '../../../src/components/snackbar';
import FormProvider, {
    RHFSwitch,
    RHFEditor,
    RHFUpload,
    RHFTextField,
    RHFSelect,
    RHFAutocomplete,
} from '../../../src/components/hook-form';

import { useObtenerProveedores } from '../Proveedores';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { LinearProgressBar } from '../LinearProgressBar';
import Link from 'next/link';
import { LoteForm } from '@types';
import { lotes } from '@prisma/client';
import { useObtenerEventos } from '../Eventos';
import { useLotes } from './hooks';


type FormValuesProps = LoteForm;

type Props = {
    esEditar?: boolean;
    loteEditar?: lotes;
    soloVer?: boolean;
}

export function FormLotes({ esEditar = false, loteEditar, soloVer = false }: Props) {
    const { push } = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { eventos, isLoading: isLoadingEventos } = useObtenerEventos();
    const { proveedores, isLoading: isLoadingProve } = useObtenerProveedores();
    const { agregarLote, actualizarLote } = useLotes();
    const [codigoLote, setCodigoLote] = useState(generateUniqueNumber());

    function generateUniqueNumber(): string {
        const min = 10000;
        const max = 99999;
        const uniqueNumber = Math.floor(Math.random() * (max - min + 1) + min);
        return uniqueNumber.toString().slice(-6);
    }

    useEffect(() => {
        if (esEditar && loteEditar) {
            reset(defaultValues);
        }

        if (!esEditar) {
            reset(defaultValues);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [esEditar, loteEditar]);

    // Validaciones de los campos
    const ProveedorEsquema = Yup.object().shape({
        fecha_pesaje: Yup.string().required('La fecha es requerida'),
        codigo_lote: Yup.string().required('El código es requerido'),
        cantidad_animales: Yup.number().required('La cantidad es requerida').min(1, 'La cantidad debe ser mayor a 0'),
        tipo_animales: Yup.string().required('El tipo es requerido'),
        calidad_animales: Yup.string().required('La calidad es requerida'),
        sexo: Yup.string().required('El sexo es requerido'),
        procedencia: Yup.string().required('La procedencia es requerida'),
        crias_hembras: Yup.number().min(0, 'Las crias hembras deben ser mayor a 0').default(0),
        crias_machos: Yup.number().min(0, 'Las crias machos deben ser mayor a 0').default(0),
        peso_total: Yup.number().required('El peso total es requerido').min(1, 'El peso total debe ser mayor a 0').typeError('El peso total debe ser un valor numérico'),
        id_evento: Yup.string().required('El evento es requerido'),
        id_proveedor: Yup.string().required('El proveedor es requerido'),
        puja_inicial: Yup.number().required('La puja inicial es requerida').min(0.0001, 'La puja inicial debe ser mayor a 0').typeError('La puja debe ser un valor numérico'),
        incremento: Yup.number().required('La puja inicial es requerida').min(0.0001, 'La puja inicial debe ser mayor a 0').typeError('La puja debe ser un valor numérico'),
    });

    // Se carga los valores en caso de que sea editar
    const defaultValues = useMemo<LoteForm>(() => ({
        id_lote: loteEditar?.id_lote || 0,
        fecha_pesaje: new Date(loteEditar?.fecha_pesaje || new Date()).toISOString().slice(0, 10),
        codigo_lote: loteEditar?.codigo_lote || codigoLote,
        cantidad_animales: loteEditar?.cantidad_animales || 0,
        tipo_animales: loteEditar?.tipo_animales || '',
        calidad_animales: loteEditar?.calidad_animales || '',
        sexo: loteEditar?.sexo || '',
        procedencia: loteEditar?.procedencia || '',
        crias_hembras: loteEditar?.crias_hembras || 0,
        crias_machos: loteEditar?.crias_machos || 0,
        peso_total: Number(loteEditar?.peso_total) || 0,
        observaciones: loteEditar?.observaciones || '',
        id_evento: loteEditar?.id_evento || '',
        id_proveedor: loteEditar?.id_proveedor || '',
        puja_inicial: Number(loteEditar?.puja_inicial) || 0,
        incremento: Number(loteEditar?.incremento) || 0,
    }), [loteEditar]);

    // funciones para el hook useForm
    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(ProveedorEsquema),
        defaultValues,
    });

    const {
        reset,
        watch,
        handleSubmit,
        setValue,
        formState: { isSubmitting },
    } = methods;
    const values = watch();

    // Funcion para enviar el formulario
    const onSubmit = async (data: FormValuesProps) => {
        try {
            if (!esEditar) {
                data.codigo_lote = data.id_evento + '-' + data.codigo_lote;
                await agregarLote(data);
                enqueueSnackbar('Lote agregado correctamente', { variant: 'success' });
            } else {
                await actualizarLote(data);
                enqueueSnackbar('Lote actualizado correctamente', { variant: 'success' });
            }
            push(PATH_DASHBOARD.lotes.root);
            reset();
        } catch (error) {
            console.error(error);
            enqueueSnackbar("Oops... hubo un error " + error.message, { variant: 'error' });
        }
    };

    if (isLoadingEventos || isLoadingProve) return <LinearProgressBar />

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                    <Card sx={{ p: 2, boxShadow: "0 0 2px rgba(0,0,0,0.2)" }}>
                        <Stack spacing={2}>
                            <RHFTextField
                                name="codigo_lote"
                                label="Código de lote"
                                size='small'
                                inputProps={{
                                    readOnly: true,
                                }}
                            />
                            <RHFTextField
                                name="fecha_pesaje"
                                label="Fecha de pesaje"
                                type='date'
                                size='small'
                                inputProps={{
                                    readOnly: soloVer,
                                }}
                            />
                            <RHFTextField
                                name="cantidad_animales"
                                label="Cantidad de animales"
                                type='number'
                                size='small'
                                inputProps={{
                                    readOnly: soloVer,
                                }}
                            />
                            <RHFTextField
                                name="tipo_animales"
                                label="Tipo de animales"
                                size='small'
                                inputProps={{
                                    readOnly: soloVer,
                                }}
                            />
                            <RHFTextField
                                name="calidad_animales"
                                label="Calidad de animales"
                                size='small'
                                inputProps={{
                                    readOnly: soloVer,
                                }}
                            />

                            <RHFSelect name='sexo' label='Sexo' size='small'
                                inputProps={{
                                    readOnly: soloVer,
                                }}>
                                <MenuItem value="1">Macho</MenuItem>
                                <MenuItem value="0">Hembra</MenuItem>
                            </RHFSelect>

                            <RHFTextField
                                name="procedencia"
                                label="Procedencia"
                                size='small'
                                inputProps={{
                                    readOnly: soloVer,
                                }}
                            />
                            <RHFTextField
                                name="crias_hembras"
                                label="Número de crías hembras"
                                size='small'
                                type='number'
                                inputProps={{
                                    readOnly: soloVer,
                                }}
                            />
                            <RHFTextField
                                name="crias_machos"
                                label="Número de crías machos"
                                size='small'
                                type='number'
                                inputProps={{
                                    readOnly: soloVer,
                                }}
                            />
                            <RHFTextField
                                name="peso_total"
                                label="Peso total"
                                size='small'
                                type='number'
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">Lb</InputAdornment>,
                                }}
                                inputProps={{
                                    step: "any",
                                    readOnly: soloVer,
                                }}
                            />

                            <RHFTextField
                                name="observaciones"
                                label="Observaciones"
                                size='small'
                                multiline
                                maxRows={3}
                                inputProps={{
                                    readOnly: soloVer,
                                }}
                            />

                        </Stack>
                    </Card>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Card sx={{ p: 2, boxShadow: "0 0 2px rgba(0,0,0,0.2)" }}>
                        <Stack spacing={2}>

                            <RHFSelect name='id_evento' label='Eventos' size='small'
                                inputProps={{
                                    readOnly: soloVer,
                                }}>
                                {eventos.map((evento) => <MenuItem key={evento.id_evento} value={evento.id_evento}>{evento.descripcion}</MenuItem>)}
                            </RHFSelect>

                            <RHFSelect name='id_proveedor' label='Proveedores' size='small'
                                inputProps={{
                                    readOnly: soloVer,
                                }}>
                                {proveedores.map((provedor) => <MenuItem key={provedor.id_proveedor} value={provedor.id_proveedor}>{provedor.nombres}</MenuItem>)}
                            </RHFSelect>

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
                                    readOnly: soloVer,
                                }}
                            />

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
                                    readOnly: soloVer,
                                }}
                            />
                        </Stack>

                        {!soloVer && (
                            <Stack direction="row" spacing={1.5} maxWidth={400} margin="auto" mt={2}>
                                <Link href={PATH_DASHBOARD.lotes.root} passHref legacyBehavior>
                                    <Button
                                        fullWidth
                                        color="inherit"
                                        variant="outlined"
                                        size="medium"
                                    >
                                        Cancelar
                                    </Button>
                                </Link>

                                <LoadingButton
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    size="medium"
                                    loading={isSubmitting}
                                >
                                    Guardar
                                </LoadingButton>
                            </Stack>
                        )}
                    </Card>
                </Grid>

            </Grid>
        </FormProvider>
    );
}
