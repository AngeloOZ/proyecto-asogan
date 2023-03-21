import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEventos } from '.';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Button } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import FormProvider, { RHFSwitch, RHFTextField } from '../../../src/components/hook-form';
import { useSnackbar } from '../../../src/components/snackbar';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { eventos } from '@prisma/client';
import moment from 'moment';


type FormValuesProps = eventos;

type Props = {
    esEditar?: boolean;
    eventoEditar?: eventos;
}


export function FormEventos({ esEditar = false, eventoEditar }: Props) {
    const { push } = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { agregarEvento, actualizarEvento } = useEventos();

    useEffect(() => {
        if (esEditar && eventoEditar) {
            reset(defaultValues);
        }

        if (!esEditar) {
            reset(defaultValues);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [esEditar, eventoEditar]);

    // Validaciones de los campos
    const EventoEsquema = Yup.object().shape({
        fecha: Yup.string().required('La fecha es requerida'),
        lugar: Yup.string().required('El lugar es requerido'),
        tipo: Yup.string().required('La tipo es requerido'),
    });

    // Se carga los valores en caso de que sea editar
    const defaultValues = useMemo<eventos>(() => ({
        id_evento: eventoEditar?.id_evento || 0,
        descripcion: eventoEditar?.descripcion || '',
        fecha: eventoEditar?.fecha || moment().format('YYYY-MM-DD HH:mm') as unknown as Date,
        lugar: eventoEditar?.lugar || '',
        tipo: eventoEditar?.tipo || '',
        abierto: eventoEditar?.abierto || true,
        url_video: eventoEditar?.url_video || '',
        uuid: eventoEditar?.uuid || '',
    }), [eventoEditar]);

    // funciones para el hook useForm
    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(EventoEsquema),
        defaultValues,
    });
    const {
        reset,
        watch,
        handleSubmit,
        formState: { isSubmitting },
        control,
    } = methods;

    const values = watch();

    // Funcion para enviar el formulario
    const onSubmit = async (data: FormValuesProps) => {
        try {
            if (!esEditar) {
                await agregarEvento(data);
                enqueueSnackbar('Evento agregado correctamente', { variant: 'success' });
                push(PATH_DASHBOARD.eventos.root);
            } else {
                await actualizarEvento(data);
                enqueueSnackbar('Evento actualizado correctamente', { variant: 'success' });
                push(PATH_DASHBOARD.eventos.root);
            }
            reset();
        } catch (error) {
            const errorMessage = error.response.data.message || error.message;
            console.error(errorMessage);
            enqueueSnackbar(`${errorMessage}`, { variant: 'error' });
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Card sx={{ p: 3, boxShadow: "0 0 2px rgba(0,0,0,0.2)" }}>
                <Stack spacing={2}>
                    <RHFTextField
                        name="descripcion"
                        label="Descripcion"
                        size='small'
                        autoComplete='off'
                    />
                    <RHFTextField
                        name="fecha"
                        label="Fecha"
                        size='small'
                        type={'datetime-local'}
                    />
                    <RHFTextField
                        name="lugar"
                        label="Lugar"
                        size='small'
                        autoComplete='off'
                    />
                    <RHFTextField
                        name="url_video"
                        label="URL Video"
                        size='small'
                        autoComplete='off'
                    />
                    <RHFTextField
                        name="tipo"
                        label="Tipo"
                        size='small'
                        autoComplete='off'
                    />

                    <RHFSwitch
                        name="abierto"
                        label="Abierto"
                        sx={{ mb: 1, mx: 0, width: 1, }}
                    />

                </Stack>

                <Stack direction="row" spacing={1.5} maxWidth={400} margin="auto" mt={2}>
                    <Link href={PATH_DASHBOARD.eventos.root} passHref legacyBehavior>
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
            </Card>
        </FormProvider>
    );
}
