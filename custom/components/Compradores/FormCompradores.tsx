
import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';

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
    RHFSwitch,
    RHFTextField,
} from '../../../src/components/hook-form';

import { compradores as IComprador } from '@prisma/client';
import { useCompradores } from './Hooks';
import Link from 'next/link';
import prisma from 'database/prismaClient';
import { PATH_DASHBOARD } from 'src/routes/paths';

type FormValuesProps = IComprador;
type Props = {
    esEditar?: boolean;
    compradorEditar?: IComprador;
}

export function FormCompradores({ esEditar = false, compradorEditar }: Props) {

    const { push } = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { agregarComprador, actualizarComprador } = useCompradores();

    
    useEffect(() => {
        if (esEditar && compradorEditar) {
            reset(defaultValues);
        }

        if (!esEditar) {
            reset(defaultValues);
        }

    }, [esEditar, compradorEditar]);

    // Validaciones de los campos
    const CompradorEsquema = Yup.object().shape({
        identificacion: Yup.string().required('La identificacion es requerido'),
        nombres: Yup.string().required('El nombre es requerido').max(300, 'El nombre no puede tener mas de 300 caracteres'),
        codigo_paleta: Yup.string().required('El numero de paleta es requerido').max(5, 'El numero de paleta no puede tener mas de 5 caracteres'),
        calificacion_bancaria: Yup.string().required('La calificacion bancaria es requerida').max(5, 'La calificacion bancaria no puede tener mas de 5 caracteres'),
    });


    

    // Se carga los valores en caso de que sea editar
    const defaultValues = useMemo<IComprador>(() => ({

        
        id_comprador : compradorEditar?.id_comprador || 0,
        codigo_paleta: compradorEditar?.codigo_paleta || '',
        calificacion_bancaria: compradorEditar?.calificacion_bancaria || '',
        antecedentes_penales: compradorEditar?.antecedentes_penales || false,
        procesos_judiciales: compradorEditar?.procesos_judiciales || false,
        estado: compradorEditar?.estado || false,
        usuarioid: compradorEditar?.usuarioid || 0,

    }), [compradorEditar]);



    // funciones para el hook useForm
    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(CompradorEsquema),
        defaultValues,
    });

    const {
        reset,
        watch,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data: FormValuesProps) => {

        try {
            if (!esEditar) {
                await agregarComprador(data);
                enqueueSnackbar('Proveedor agregado correctamente', { variant: 'success' });
                push(PATH_DASHBOARD.compradores.root);
            } else {
                await actualizarComprador(data);
                enqueueSnackbar('Proveedor actualizado correctamente', { variant: 'success' });
                push(PATH_DASHBOARD.compradores.root);
            }
            reset();
        } catch (error) {
            console.error(error.message);
            enqueueSnackbar("Oops... hubo un error " + error.message, { variant: 'error' });
        }
    }

    return (<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
        <Card sx={{ p: 3, boxShadow: "0 0 2px rgba(0,0,0,0.2)" }}>
            <Stack spacing={2}>

                <RHFTextField
                    name="identificacion"
                    label="Identificación"
                    size='small'
                />
                <RHFTextField
                    name="nombres"
                    label="Nombres"
                    size='small'
                />

                <RHFTextField
                    name="codigo_paleta"
                    label="Número de paleta"
                    size='small'
                />

                <RHFTextField
                    name="calificacion_bancaria"
                    label="Calificación Bancaria"
                    size='small'
                />
                <Stack direction="row" spacing={2}>
                    <RHFSwitch
                        name="antecedentes_penales"
                        label="Antecedentes penales"
                        labelPlacement="end"

                    />
                    <RHFSwitch
                        name="procesos_judiciales"
                        label="Procesos Judiciales"
                        labelPlacement="end"

                    />
                    <RHFSwitch
                        name="estado"
                        label="Estado"
                        labelPlacement="end"

                    />
                </Stack>
                <Stack direction="row" spacing={1.5} maxWidth={400} margin="auto" mt={5} >

                    <Link href={PATH_DASHBOARD.compradores.root} passHref legacyBehavior>
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
            </Stack>
        </Card>



    </FormProvider>)
}