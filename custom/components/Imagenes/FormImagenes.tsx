import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
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
    RHFUpload
} from '../../../src/components/hook-form';

import { useImagenes } from '.';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { ImagenBaner } from '@types';
import Link from 'next/link';
import { handleErrorsAxios } from 'utils';
import { imagenes } from '@prisma/client';

type FormValuesProps = ImagenBaner;


export function FormImagenes() {
    const { push } = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { agregarImagen } = useImagenes();


    // Validaciones de los campos
    const ImagenEsquema = Yup.object().shape({
        descripcion: Yup.string().required('La descripción de la imagén es requerido'),
        imagen: Yup.mixed().required('La imagén es requerida'),
    });

    // Se carga los valores en caso de que sea editar
    const defaultValues = useMemo<ImagenBaner>(() => ({
        id_imagen: 0,
        descripcion: '',
        imagen: '',
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
            await agregarImagen(data);
            enqueueSnackbar('Imagen agregada correctamente', { variant: 'success' });
            push(PATH_DASHBOARD.banner.root);
            reset();
        } catch (error) {
            console.error(error);
            enqueueSnackbar(`Oops... ${handleErrorsAxios(error)}`, { variant: 'error' });
        }
    };

    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];

            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

            if (file) {
                setValue('imagen', newFile, { shouldValidate: true });
            }
        },
        [setValue]
    );

    const handleRemoveFile = () => {
        setValue('imagen', null);
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Card sx={{ p: 3, boxShadow: "0 0 2px rgba(0,0,0,0.2)" }}>
                <Stack spacing={2}>
                    <RHFTextField
                        name="descripcion"
                        label="Descripción"
                        fullWidth
                    />
                    <RHFUpload
                        name="imagen"
                        maxSize={1048576}
                        onDrop={handleDrop}
                        onDelete={handleRemoveFile}
                        onRemove={handleRemoveFile}
                    />
                </Stack>

                <Stack direction="row" spacing={1.5} maxWidth={400} margin="auto" mt={2}>
                    <Link href={PATH_DASHBOARD.banner.root} passHref legacyBehavior>
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
