
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
    RHFTextField,
} from '../../../src/components/hook-form';

import { usuario as IUsuario } from '@prisma/client';
import { useUsuario } from './Hooks';
import Link from 'next/link';

import { PATH_DASHBOARD, PATH_DASHBOARD_CLEINTE } from 'src/routes/paths';
import { handleErrorsAxios } from 'utils';


type FormValuesProps = IUsuario;

type Props = {

    usuariosEditar?: IUsuario;
}

export function FormCambiarClave({ usuariosEditar }: Props) {

    const { actualizarUsuario } = useUsuario();
    const { push } = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    // Validaciones de los campos
    const UsuariosEsquema = Yup.object().shape({

        clave: Yup.string().required('La clave es requerida').max(10, 'La clave no puede tener mas de 10 digitos'),
        verificacion_clave: Yup.string().required('La verificación de clave es requerida').max(10, 'La verificación de clave no puede tener mas de 10 digitos').oneOf([Yup.ref('clave'), null], 'Las claves no coinciden'),
    });



    // Se carga los valores en caso de que sea editar
    const defaultValues = useMemo<IUsuario>(() => ({


        usuarioid: usuariosEditar?.usuarioid || 0,
        nombres: usuariosEditar?.nombres || '',
        identificacion: usuariosEditar?.identificacion || '',
        clave: '',
        rol: JSON.parse(usuariosEditar?.rol || `[""]`)[0],
        tipo: usuariosEditar?.tipo || 1,
        correo: usuariosEditar?.correo || '',
        celular: usuariosEditar?.celular || ''

    }), [usuariosEditar]);


    // funciones para el hook useForm
    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(UsuariosEsquema),
        defaultValues,
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = methods;


    const onSubmit = async (data: FormValuesProps) => {
        try {
            await actualizarUsuario(data);
            enqueueSnackbar('Usuario actualizado correctamente', { variant: 'success' });
            push(PATH_DASHBOARD_CLEINTE.root);
        } catch (error) {
            enqueueSnackbar(`Oops... ${handleErrorsAxios(error)}`, { variant: 'error' });
        }
    }

    return (<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
        <Card sx={{ p: 3, boxShadow: "0 0 2px rgba(0,0,0,0.2)" }}>
            <Stack spacing={2} >


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

            </Stack>

            <Stack direction="row" spacing={1.5} maxWidth={400} margin="auto" mt={5}>

                <Link href={PATH_DASHBOARD.root} passHref legacyBehavior>
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
