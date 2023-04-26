import * as Yup from 'yup';
import { useMemo } from 'react';
// next
import { useRouter } from 'next/router';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Button } from '@mui/material';

// components
import { useSnackbar } from '../../../src/components/snackbar';
import FormProvider, {
    RHFTextField,
} from '../../../src/components/hook-form';

import { useNotificaciones } from '.';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { Notificaciones } from '@types';
import Link from 'next/link';
import { handleErrorsAxios } from 'utils';

type FormValuesProps = Notificaciones;


export function FormNotificaciones() {
    const { enqueueSnackbar } = useSnackbar();
    const { agregarNotificacion } = useNotificaciones();


    // Validaciones de los campos
    const ImagenEsquema = Yup.object().shape({
        descripcion: Yup.string().required('La descripción es requerida'),
        titulo: Yup.string().required('El título es requerido'),
    });

    // Se carga los valores en caso de que sea editar
    const defaultValues = useMemo<Notificaciones>(() => ({
        id: 0,
        titulo: '',
        uuid_evento: '',
        descripcion: '',
    }), []);

    // funciones para el hook useForm
    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(ImagenEsquema),
        defaultValues,
    });

    const {
        reset,
        watch,
        handleSubmit,
        setValue,
        formState: { isSubmitting },
    } = methods;

    // Funcion para enviar el formulario
    const onSubmit = async (data: FormValuesProps) => {
        try {
            await agregarNotificacion(data);
            enqueueSnackbar('Notificacion enviada correctamente', { variant: 'success' });
            reset();
        } catch (error) {
            console.error(error);
            enqueueSnackbar(`Oops... ${handleErrorsAxios(error)}`, { variant: 'error' });
        }
    };


    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Card sx={{ p: 3, boxShadow: "0 0 2px rgba(0,0,0,0.2)" }}>
                <Stack spacing={2}>
                    <RHFTextField
                        name="titulo"
                        label="Titulo"
                        size='small'
                        autoComplete='off'
                    />
                    <RHFTextField
                        name="descripcion"
                        label="Descripción"
                        size='small'
                        autoComplete='off'
                    />
                </Stack>

                <Stack direction="row" spacing={1.5} maxWidth={400} margin="auto" mt={2}>

                    <LoadingButton
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="medium"
                        loading={isSubmitting}
                    >
                        Enviar
                    </LoadingButton>

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

                </Stack>
            </Card>
        </FormProvider>
    );
}
