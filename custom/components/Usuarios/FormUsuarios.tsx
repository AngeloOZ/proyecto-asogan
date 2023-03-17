
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';

// next
import { useRouter } from 'next/router';

// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack, Button, MenuItem } from '@mui/material';

// components
import { useSnackbar } from '../../../src/components/snackbar';
import FormProvider, {
    RHFSelect,
    RHFTextField,
} from '../../../src/components/hook-form';

import { usuario as IUsuario } from '@prisma/client';
import { useUsuario } from './Hooks';
import Link from 'next/link';

import { PATH_DASHBOARD } from 'src/routes/paths';


import prisma from 'database/prismaClient';
import { useGlobales } from '../Globales';

type FormValuesProps = IUsuario;
type Props = {
    esEditar?: boolean;
    usuariosEditar?: IUsuario;
}

export function FormUsuarios({ esEditar = false, usuariosEditar }: Props) {

    const { push } = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { agregarUsuario, actualizarUsuario } = useUsuario();
    const { consultarIdentificacion } = useGlobales();
    
    

    useEffect(() => {
        if (esEditar && usuariosEditar) {
            reset(defaultValues);
        }

        if (!esEditar) {
            reset(defaultValues);
        }

    }, [esEditar, usuariosEditar]);


    // Validaciones de los campos
    const UsuariosEsquema = Yup.object().shape({
        identificacion: Yup.string().required('La identificacion es requerido').min(10, 'La identificacion no puede tener menos de 10 caracteres').max(13, 'La identificacion no puede tener mas de 13 caracteres'),
        nombres: Yup.string().required('El nombre es requerido').max(300, 'El nombre no puede tener mas de 300 caracteres'),
        clave: Yup.string().max(10, 'La clave no puede tener mas de 10 digitos'),
        rol: Yup.string().required('El rol es requerido'),
        verificacion_clave: Yup.string().oneOf([Yup.ref('clave'),null], 'Las claves no coinciden'),
    });




    // Se carga los valores en caso de que sea editar
    const defaultValues = useMemo<IUsuario>(() => ({
        usuarioid: usuariosEditar?.usuarioid || 0,
        nombres: usuariosEditar?.nombres || '',
        identificacion: usuariosEditar?.identificacion || '',
        clave: '' ,
        verificacion_clave: '',
        rol: JSON.parse(usuariosEditar?.rol || `[""]`)[0],
        tipo: usuariosEditar?.tipo || 1,
    }), [usuariosEditar]);


    // funciones para el hook useForm
    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(UsuariosEsquema),
        defaultValues,
        

    });

    const {
        reset,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data: FormValuesProps) => {
      
        try {
            if (!esEditar) {
                await agregarUsuario(data);
                enqueueSnackbar('Usuario agregado correctamente', { variant: 'success' });
                push(PATH_DASHBOARD.usuarios.root);
            } else {
                await actualizarUsuario(data);
                enqueueSnackbar('Usuario actualizado correctamente', { variant: 'success' });
                push(PATH_DASHBOARD.usuarios.root);
            }
            reset();
        } catch (error) {

            enqueueSnackbar("Oops... hubo un error " + error.response.data.message, { variant: 'error' });
        }
    }

    const verificarIdentificacion = async () => {
        const data = await consultarIdentificacion(watch("identificacion"));
        setValue('nombres',data);
    }


    return (<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
        <Card sx={{ p: 3, boxShadow: "0 0 2px rgba(0,0,0,0.2)" }}>
            <Stack spacing={2} >

                <RHFTextField
                    name="identificacion"
                    label="Identificación"
                    size='small'
                    disabled={esEditar}
                    onBlur={verificarIdentificacion}
                    
                />
                <RHFTextField
                    name="nombres"
                    label="Nombres"
                    size='small'
                
                />

                <RHFTextField
                    name="clave"
                    label="Clave"
                    size='small'
                    type='password'
                    inputProps={{ autoComplete: "new-password" }}
                />

                <RHFTextField
                    name="verificacion_clave"
                    label="Verificación de clave"
                    size='small'
                    type='password'
                />
                <RHFSelect name='rol' label='Rol' size='small'>

                    <MenuItem value="admin">Administrador</MenuItem>
                    <MenuItem value="martillador">Martillador</MenuItem>
                    <MenuItem value="contabilidad">Contabilidad</MenuItem>
                </RHFSelect>
            </Stack>

            <Stack direction="row" spacing={1.5} maxWidth={400} margin="auto" mt={5}>

                <Link href={PATH_DASHBOARD.usuarios.root} passHref legacyBehavior>
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

    </FormProvider>)
}
