import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
// next
import { useRouter } from 'next/router';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Grid, Card, Stack, Button, MenuItem, InputAdornment, Typography, TextField } from '@mui/material';

// components
import { useSnackbar } from '../../../src/components/snackbar';
import FormProvider, {
    RHFTextField,
    RHFSelect,
} from '../../../src/components/hook-form';

import { useObtenerProveedores } from '../Proveedores';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { LinearProgressBar } from '../LinearProgressBar';
import Link from 'next/link';
import { LoteForm, LoteEditar } from '@types';
import { lotes, tipo_animales } from '@prisma/client';
import { useObtenerEventos } from '../Eventos';
import { useLotes } from './hooks';
import { handleErrorsAxios } from 'utils';
import { IconPeso } from '../Subastas';
import moment from 'moment-timezone';
import { subastaAPI } from 'custom/api';

type FormValuesProps = LoteForm;

type Evento = {
    id_evento: number;
    descripcion: string;
    uuid: string;
}

type Props = {
    esEditar?: boolean;
    loteEditar?: LoteEditar;
    soloVer?: boolean;
    evento?: Evento;
}

export function FormLotes({ esEditar = false, loteEditar, soloVer = false, evento }: Props) {
    const { push } = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [lotesAnteriores, setLotesAnteriores] = useState<lotes[]>([]);
    const { eventos, isLoading: isLoadingEventos } = useObtenerEventos();
    const { proveedores, isLoading: isLoadingProve } = useObtenerProveedores();
    const [codigoLote, setCodigoLote] = useState(generateUniqueNumber());
    const [tipoAnimales, setTipoAnimales] = useState<tipo_animales[]>([]);
    const { agregarLote, actualizarLote } = useLotes();

    useEffect(() => {
        if (esEditar && loteEditar) {
            reset(defaultValues);
        }

        if (!esEditar) {
            reset(defaultValues);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [esEditar, loteEditar]);

    useEffect(() => {
        obtenerLotesTotales();
        obtenerTipoAnimales();
    }, []);

    useEffect(() => {
        if (lotesAnteriores.length > 0 && esEditar) {
            const filter = lotesAnteriores.filter((lote) => lote.id_lote !== loteEditar?.id_lote);
            setLotesAnteriores(filter);
        }
    }, [lotesAnteriores]);

    function generateUniqueNumber(): string {
        const min = 1000;
        const max = 9999;
        const uniqueNumber = Math.floor(Math.random() * (max - min + 1) + min);
        return uniqueNumber.toString().slice(-6);
    }


    // Validaciones de los campos
    const ProveedorEsquema = Yup.object().shape({
        fecha_pesaje: Yup.string().required('La fecha es requerida'),
        codigo_lote: Yup.string()
            .required('El código es requerido')
            .test('unique', 'El número de paleta ya está ocupado', function (value) {
                const evento = watch('id_evento');
                const result = lotesAnteriores.some((lote) => (
                    lote.codigo_lote === value && lote.id_evento === evento));
                return !result;
            }),
        cantidad_animales: Yup.number().required('La cantidad es requerida').min(1, 'La cantidad debe ser mayor a 0'),
        tipo_animales: Yup.string().required('El tipo es requerido'),
        calidad_animales: Yup.string().required('La calidad es requerida'),
        sexo: Yup.string().required('El sexo es requerido'),
        procedencia: Yup.string().required('La procedencia es requerida'),
        crias_hembras: Yup.number().min(0, 'Las crias hembras deben ser mayor a 0').default(0).typeError('Solo se adminite valores numéricos'),
        crias_machos: Yup.number().min(0, 'Las crias machos deben ser mayor a 0').default(0).typeError('Solo se adminite valores numéricos'),
        peso_total: Yup.number().required('El peso total es requerido').min(1, 'El peso total debe ser mayor a 0').typeError('El peso total debe ser un valor numérico'),
        id_evento: Yup.string().required('El evento es requerido'),
        id_proveedor: Yup.string().required('El proveedor es requerido'),
        puja_inicial: Yup.number().required('La puja inicial es requerida').min(0.0001, 'La puja inicial debe ser mayor a 0').typeError('La puja debe ser un valor numérico'),
        incremento: Yup.number().required('La puja inicial es requerida').min(0.0001, 'La puja inicial debe ser mayor a 0').typeError('La puja debe ser un valor numérico'),
        url_video: Yup.string().required('La url del video es requerida').url('La url del video debe ser válida'),
    });

    // Se carga los valores en caso de que sea editar
    const defaultValues = useMemo<LoteForm>(() => ({
        id_lote: loteEditar?.id_lote || 0,
        fecha_pesaje: moment(loteEditar?.fecha_pesaje || new Date()).format('HH:mm'),
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
        id_evento: loteEditar?.id_evento || evento!.id_evento.toString() || '',
        id_proveedor: loteEditar?.id_proveedor || '',
        puja_inicial: Number(loteEditar?.puja_inicial) || 0,
        incremento: Number(loteEditar?.incremento) || 0,
        url_video: loteEditar?.url_video || '',
        subastado: loteEditar?.subastado?.toString() || '0',
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
        formState: { isSubmitting },
    } = methods;

    // Funcion para enviar el formulario
    const onSubmit = async (data: FormValuesProps) => {
        try {
            if (!esEditar) {
                await agregarLote(data);
                setCodigoLote(generateUniqueNumber());
                enqueueSnackbar('Lote agregado correctamente', { variant: 'success' });
            } else {
                await actualizarLote(data);
                enqueueSnackbar('Lote actualizado correctamente', { variant: 'success' });
                push(PATH_DASHBOARD.lotes.root);
            }
            reset();
        } catch (error) {
            console.error(error);
            enqueueSnackbar(`Oops... ${handleErrorsAxios(error)}`, { variant: 'error' });
        }
    };

    async function obtenerLotesTotales() {
        const { data } = await subastaAPI.get('/lotes');
        setLotesAnteriores(data);
    }

    async function obtenerTipoAnimales() {
        const { data } = await subastaAPI.get('/lotes/tipoanimal');
        setTipoAnimales(data);
    }

    if (isLoadingEventos || isLoadingProve) return <LinearProgressBar />

    function renderDatosCompra() {
        const valorCompra = Number(loteEditar?.puja_final) * Number(loteEditar?.peso_total);
        return (
            <Card sx={{ p: 2, boxShadow: "0 0 2px rgba(0,0,0,0.2)", mb: 2 }}>
                <Stack spacing={2} >
                    <Typography variant='subtitle1'>Datos de la compra</Typography>

                    <RHFTextField
                        name=""
                        label="Nombre comprador"
                        defaultValue={loteEditar!.compradores.usuario.nombres}
                        size='small'
                        inputProps={{
                            readOnly: true,
                        }}
                    />

                    <RHFTextField
                        name=""
                        label="Identificación comprador"
                        defaultValue={loteEditar!.compradores.usuario.identificacion}
                        size='small'
                        inputProps={{
                            readOnly: true,
                        }}
                    />

                    <RHFTextField
                        name=""
                        label="Número de paleta"
                        defaultValue={loteEditar!.paleta_comprador}
                        size='small'
                        inputProps={{
                            readOnly: true,
                        }}
                    />

                    <RHFTextField
                        name=""
                        label="Puja final de compra"
                        defaultValue={Number(loteEditar!.puja_final).toFixed(2)}
                        size='small'
                        inputProps={{
                            readOnly: true,
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                    />

                    <RHFTextField
                        name=""
                        label="Valor de compra"
                        defaultValue={valorCompra.toFixed(2)}
                        size='small'
                        inputProps={{
                            readOnly: true,
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                    />

                </Stack>
            </Card>)
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                    <Card sx={{ p: 2, boxShadow: "0 0 2px rgba(0,0,0,0.2)" }}>
                        <Stack spacing={2} mb={2}>
                            <Typography variant='subtitle1'>Evento</Typography>
                            <RHFSelect name='id_evento' label='' size='small'
                                inputProps={{
                                    readOnly: true,
                                }}>
                                {eventos.map((evento) => <MenuItem key={evento.id_evento} value={evento.id_evento}>{evento.descripcion}</MenuItem>)}
                            </RHFSelect>
                        </Stack>
                        <Stack spacing={2}>
                            <Typography variant='subtitle1'>Datos del lote</Typography>

                            <RHFSelect name='id_proveedor' label='Proveedores' size='small'
                                inputProps={{
                                    readOnly: soloVer,
                                }}>
                                {proveedores.map((provedor) => <MenuItem key={provedor.id_proveedor} value={provedor.id_proveedor}>{provedor.nombres}</MenuItem>)}
                            </RHFSelect>

                            <RHFTextField
                                name="codigo_lote"
                                label="Código de lote"
                                type='number'
                                size='small'
                                inputProps={{
                                    readOnly: soloVer,
                                }}
                            />
                            <RHFTextField
                                name="fecha_pesaje"
                                label="Hora de pesaje"
                                type='time'
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
                            <RHFSelect name="tipo_animales" label="Tipo de animales" size='small'
                                inputProps={{
                                    readOnly: soloVer,
                                }}>
                                {tipoAnimales.map((tipoA) => <MenuItem value={tipoA.codigoanimal}>{tipoA.descripcionanimal}</MenuItem>)}
                            </RHFSelect>

                            <RHFSelect
                                name="calidad_animales"
                                label="Calidad de animales"
                                size='small'
                                inputProps={{
                                    readOnly: soloVer,
                                }}
                            >
                                <MenuItem value="Excelente">Excelente</MenuItem>
                                <MenuItem value="Muy Buena">Muy Buena</MenuItem>
                                <MenuItem value="Buena">Buena</MenuItem>
                                <MenuItem value="Regular">Regular</MenuItem>
                                <MenuItem value="Mala">Mala</MenuItem>

                            </RHFSelect>

                            <RHFSelect name='sexo' label='Sexo' size='small'
                                inputProps={{
                                    readOnly: soloVer,
                                }}>
                                <MenuItem value="1">Macho</MenuItem>
                                <MenuItem value="0">Hembra</MenuItem>
                            </RHFSelect>

                            {
                                watch('sexo') === '0' && (<>
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
                                </>)
                            }

                            <RHFTextField
                                name="procedencia"
                                label="Procedencia"
                                size='small'
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
                                    startAdornment: <InputAdornment position="start"><IconPeso /></InputAdornment>,
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
                    {
                        loteEditar?.id_comprador && renderDatosCompra()
                    }

                    <Card sx={{ p: 2, boxShadow: "0 0 2px rgba(0,0,0,0.2)" }}>
                        <Stack spacing={2}>

                            <RHFTextField
                                name="url_video"
                                label="Url del video"
                                size='small'
                                multiline
                                maxRows={3}
                                inputProps={{
                                    readOnly: soloVer,
                                }}
                            />

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

                            {
                                esEditar && (
                                    <RHFSelect name='subastado' label='Estado' size='small'
                                        inputProps={{
                                            readOnly: soloVer,
                                        }}>
                                        <MenuItem value='0'>No subastado</MenuItem>
                                        <MenuItem value='1'>En subasta</MenuItem>
                                        <MenuItem value='2'>Postergado</MenuItem>
                                        <MenuItem value='3'>Subastado</MenuItem>
                                    </RHFSelect>
                                )
                            }
                        </Stack>

                        {!soloVer && (
                            <Stack direction="row" spacing={1.5} maxWidth={400} margin="auto" mt={2}>
                                <Link legacyBehavior href={PATH_DASHBOARD.lotes.root}>
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
