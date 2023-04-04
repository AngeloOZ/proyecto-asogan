import * as Yup from 'yup';
import { useCallback, useEffect, useMemo,useState } from 'react';
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

import { useProveedores } from '.';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { proveedores as IProveedor } from '@prisma/client';
import Link from 'next/link';
import { handleErrorsAxios } from 'utils';
import { useGlobales } from '../Globales';

type FormValuesProps = IProveedor;

type Props = {
    esEditar?: boolean;
    proveedoraEditar?: IProveedor;
}

export function FormProveedores({ esEditar = false, proveedoraEditar }: Props) {
    const { push } = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { agregarProveedor, actualizarProveedor } = useProveedores();
    const { validarIdentificacion,consultarIdentificacion } = useGlobales();
    const [validacionI, setValidacionI ]= useState(esEditar);
    useEffect(() => {
        if (esEditar && proveedoraEditar) {
            reset(defaultValues);
        }

        if (!esEditar) {
            reset(defaultValues);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [esEditar, proveedoraEditar]);

    // Validaciones de los campos
    const ProveedorEsquema = Yup.object().shape({
        nombres: Yup.string().required('El nombre es requerido'),
        identificacion: Yup.string().required('La identificación requerido').min(10, 'La identificación al menos tener 10 caracteres'),
        direccion: Yup.string().required('La dirección es requerido'),
        correo: Yup.string().required('El correo es requerido').email('El correo no es valido'),
        telefono: Yup.string().required('El teléfono es requerido'),
    });

    // Se carga los valores en caso de que sea editar
    const defaultValues = useMemo<IProveedor>(() => ({
        id_proveedor: proveedoraEditar?.id_proveedor || 0,
        nombres: proveedoraEditar?.nombres || '',
        identificacion: proveedoraEditar?.identificacion || '',
        direccion: proveedoraEditar?.direccion || '',
        correo: proveedoraEditar?.correo || '',
        telefono: proveedoraEditar?.telefono || '',
        estado: proveedoraEditar?.estado || 1,
    }), [proveedoraEditar]);

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

    // Funcion para enviar el formulario
    const onSubmit = async (data: FormValuesProps) => {
        try {
            if (validacionI){
                if (!esEditar) {
                    await agregarProveedor(data);
                    enqueueSnackbar('Proveedor agregado correctamente', { variant: 'success' });
                    push(PATH_DASHBOARD.proveedores.root);
                } else {
                    await actualizarProveedor(data);
                    enqueueSnackbar('Proveedor actualizado correctamente', { variant: 'success' });
                    push(PATH_DASHBOARD.proveedores.root);
                }
                reset();
            }else{
                enqueueSnackbar("La identificacion ingresada es incorrecta", { variant: 'warning' });
            }
           
        } catch (error) {
            console.error(error);
            enqueueSnackbar(`Oops... ${handleErrorsAxios(error)}`, { variant: 'error' });
        }
    };

    // if (isLoading) return <LinearProgressBar />
    const verificarIdentificacion = async () => {

        const validacion = validarIdentificacion(watch("identificacion"))
        
        if (validacion){
            
            const data = await consultarIdentificacion(watch("identificacion"));
            
            setValue('nombres',data.razon_social);
            setValue('direccion',data.direccion);
            setValue('correo',data.correo);
            setValue('telefono',data.telefono2);
            setValidacionI(true);
        }else {
            setValidacionI(false);
            enqueueSnackbar("La identificacion ingresada es incorrecta", { variant: 'warning' });
        }

      
    }
    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Card sx={{ p: 3, boxShadow: "0 0 2px rgba(0,0,0,0.2)" }}>
                <Stack spacing={2}>
                    <RHFTextField
                        name="identificacion"
                        label="Identificación"
                        size='small'
                        disabled={esEditar}
                        onBlur={verificarIdentificacion}
                    />
                    <RHFTextField
                        name="nombres"
                        label="Nombres y Apellidos"
                        size='small'
                    />
                    <RHFTextField
                        name="direccion"
                        label="Dirección"
                        size='small'
                    />
                    <RHFTextField
                        name="correo"
                        type='email'
                        label="Correo Electrónico"
                        size='small'
                    />
                    <RHFTextField
                        name="telefono"
                        type='tel'
                        label="WhatsApp"
                        size='small'
                    />
                </Stack>

                <Stack direction="row" spacing={1.5} maxWidth={400} margin="auto" mt={2}>
                    <Link href={PATH_DASHBOARD.proveedores.root} passHref legacyBehavior>
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
