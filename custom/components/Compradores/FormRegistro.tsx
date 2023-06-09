
import * as Yup from 'yup';
import { useMemo, useState } from 'react';


import Head from "next/head"
import { Box, Typography, Stack, Card,Button } from "@mui/material"
import { LoadingButton } from '@mui/lab';
import Image from "src/components/image/Image";
// import { AuthContext } from ".";

import FormProvider, {
    RHFSwitch,
    RHFTextField,
} from '../../../src/components/hook-form';
import { useSnackbar } from '../../../src/components/snackbar';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { compradores as IComprador } from '@prisma/client';
import RegistroLayout from './Hooks/RegistroLayout';
import { useGlobales } from '../Globales';
import { useCompradores } from './Hooks';
import { handleErrorsAxios } from 'utils';
import Link from 'next/link';
import { PATH_AUTH} from 'src/routes/paths';

type FormValuesProps = IComprador;


export const Registro = () => {

    const { validarIdentificacion, consultarIdentificacion, soloDigitos, soloLetras } = useGlobales();
    const { enqueueSnackbar } = useSnackbar();
    const { agregarComprador } = useCompradores();
    const [validacionI, setValidacionI] = useState(false);
    const [nombresV, setNombres] = useState<string>('');
    const [identificacionV, setIdentificacionV] = useState<string>('');

    const CompradorEsquema = Yup.object().shape({
        identificacion: Yup.string().when('identificacionV', {
            is: () => identificacionV != "" ? false : true,
            then: Yup.string().required('La identificacion es requerida ')
        }).max(13, 'La identificacion no puede tener mas de 13 caracteres'),
        nombres: Yup.string().when('nombresV', {
            is: () => nombresV != "" ? false : true,
            then: Yup.string().required('El nombre es requerido')
        }
        ),
        celular: Yup.string().required('El celular es requerido').min(7, 'El celular no puede tener menos de 7 caracteres').max(10, 'El celular no puede tener mas de 10 caracteres'),
        correo: Yup.string().required('El correo es requerido').email('El correo no es valido'),
    });

    const defaultValues = useMemo<IComprador>(() => {


        return {
            id_comprador: 0,
            codigo_paleta: '',
            calificacion_bancaria: "",
            antecedentes_penales: false,
            procesos_judiciales: false,
            estado: false,
            usuarioid: 0,
            nombres: nombresV,
            identificacion: "",
            correo: "",
            celular: "",
        };
    }, []);

    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(CompradorEsquema),
        defaultValues
    });


    const {
        reset,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data: FormValuesProps) => {
        try {
            if (validacionI == true) {

                await agregarComprador({ ...data, nombres: nombresV, identificacion: identificacionV, registro: 1 });
                enqueueSnackbar('Registrado Correctamente', { variant: 'success' });
                reset();
                setNombres('');
                setIdentificacionV('');
                setValue('codigo_paleta', '');
            } else {
                enqueueSnackbar("La identificacion ingresada es incorrecta", { variant: 'error' });
            }

        } catch (error) {

            enqueueSnackbar(`Oops... ${handleErrorsAxios(error)}`, { variant: 'error' });
        }
    }


    const verificarIdentificacion = async (identificacion: string) => {

        const validacion = validarIdentificacion(identificacion)

        if (validacion) {
            const data = await consultarIdentificacion(identificacion);
            setNombres(data.razon_social);
            setValue('celular', data.telefono2);
            setValue('correo', data.correo);
            setValidacionI(true);
        } else {
            setValidacionI(false);
            enqueueSnackbar("La identificacion ingresada es incorrecta", { variant: 'error' });
        }


    }


    return (

        <RegistroLayout illustration="/logo/logo.webp">
            <Head>
                <title>Registro</title>
            </Head>
            <Box component="div" >

                <Box
                    component='div'
                    display={{ xs: 'flex', md: 'none' }}
                    justifyContent='center'
                    mb={2}
                >
                    <Image
                        disabledEffect
                        visibleByDefault
                        alt="auth"
                        src='/logo/logo.webp'
                        sx={{ maxWidth: 250, width: '100%' }}
                    />
                </Box>

                <Typography component="h1" variant="h4" mb={4} align="center">Registro de Compradores</Typography>

                <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}  >

                    <Card sx={{ p: 2, boxShadow: "0 0 2px rgba(0,0,0,0.2)" }}>
                        <Stack spacing={1.5} >

                            <RHFTextField
                                name="identificacion"
                                label="Cédula o RUC"
                                size='small'
                                value={identificacionV}
                                onChange={(e) => { setIdentificacionV(e.target.value); ((e.target.value).length == 10 || (e.target.value).length == 13) ? verificarIdentificacion(e.target.value) : setValidacionI(false); }}
                                onKeyPress={(e)=>{soloDigitos(e)} }
                            />
                            <RHFTextField
                                name="nombres"
                                label="Nombres"
                                size='small'
                                value={nombresV}
                                onChange={(e) => { setNombres(e.target.value) }}
                                onKeyPress={(e)=>{soloLetras(e)} }
                            />


                            <RHFTextField
                                name="celular"
                                label="Número de celular"
                                size="small"
                                type='text'
                                inputProps={{  pattern: "[0-9]*",inputMode: "numeric" }}
                                onKeyPress={(e)=>{soloDigitos(e)} }
                            />
                            <RHFTextField
                                name="correo"
                                label="Correo"
                                size='small'
                                type='email'
                            />

                        </Stack>

                        <Stack direction="row" spacing={1.5} maxWidth={400} margin="auto" mt={2}>

                            <LoadingButton
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                               color="secondary"
                                loading={isSubmitting}
                            >
                                Registrarse
                            </LoadingButton>
                           
                        </Stack>
                        <Stack direction="row"  justifyContent="right" mt={3} >
                        <Link color="yellow"  href={PATH_AUTH.login} passHref legacyBehavior  >
                            <Button type='button' color='secondary'>
                              Regresar al login

                            </Button>
                            </Link>
                        </Stack>

                    </Card>

                </FormProvider>


            </Box>



        </RegistroLayout>


    )
}
