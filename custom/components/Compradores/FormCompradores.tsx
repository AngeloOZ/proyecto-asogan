
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';

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

import { PATH_DASHBOARD } from 'src/routes/paths';
import { ICompradores } from '../../../interfaces';
import { useGlobales } from '../Globales';

import { handleErrorsAxios } from 'utils';

type FormValuesProps = IComprador;
type Props = {
    esEditar?: boolean;
    compradorEditar?: ICompradores;

}

export function FormCompradores({ esEditar = false, compradorEditar }: Props) {

    const { push } = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { agregarComprador, actualizarComprador } = useCompradores();
    const { validarIdentificacion, consultarIdentificacion, enviarCorreoClave, soloDigitos, soloLetras } = useGlobales();
    
    const [nombresV, setNombres] = useState<string>();
    const [botonCorreo, setBotonCorreo] = useState(false);
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
        identificacion: Yup.string().required('La identificacion es requerido').min(10, 'La identificacion no puede tener menos de 10 caracteres').max(13, 'La identificacion no puede tener mas de 13 caracteres'),
        nombres: Yup.string().when('nombresV', {
            is: () => nombresV != "" ? false : true,
            then: Yup.string().required('El nombre es requerido')
        }
        ),
        correo: Yup.string().required('El correo es requerido').email('El correo ingresado es invalido'),
        celular: Yup.string().required('El celular es requerido').length(10, 'El número de celular debe tener 10 digitos'),

        codigo_paleta: Yup.string().max(3, 'El numero de paleta no puede tener mas de 3 caracteres'),
        calificacion_bancaria: Yup.string().required('La calificacion bancaria es requerida').max(4, 'La calificacion bancaria no puede tener mas de 4 caracteres') .test('max-value', 'La calificación bancaria no puede ser mayor que 1000', value => Number(value) <= 1000),
    });


    // Se carga los valores en caso de que sea editar
    const defaultValues = useMemo<IComprador>(() => {

        setNombres(compradorEditar?.usuario?.nombres || '');
        esEditar;

        return {
            id_comprador: compradorEditar?.id_comprador || 0,
            codigo_paleta: (esEditar == true) ?
                (compradorEditar?.codigo_paleta || '') : (Math.floor(Math.random() * (Number(process.env.NEXT_PUBLIC_STMP_PALETA) - Number(process.env.NEXT_PUBLIC_STMP_PALETA_HASTA) + 1) +  Number(process.env.NEXT_PUBLIC_STMP_PALETA_HASTA))).toString(),
            calificacion_bancaria: compradorEditar?.calificacion_bancaria || "0",
            antecedentes_penales: compradorEditar?.antecedentes_penales || false,
            procesos_judiciales: compradorEditar?.procesos_judiciales || false,
            estado: (esEditar == true) ? (compradorEditar?.estado || false) : true,
            usuarioid: compradorEditar?.usuarioid || 0,
            nombres: nombresV,
            identificacion: compradorEditar?.usuario?.identificacion || "",
            correo: compradorEditar?.correo || "",
            celular: compradorEditar?.celular || "",
        };
    }, [compradorEditar]);



    // funciones para el hook useForm
    const methods = useForm<FormValuesProps>({
        resolver: yupResolver(CompradorEsquema),
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        setValue,
        formState: { isSubmitting },
    } = methods;


    const onSubmit = async (data : FormValuesProps ) => {
        try {
          
            let identificacion:string = ''
            if ('identificacion' in data) {
                 identificacion  = data.identificacion as string;
              } 
          
           
            const validacion = !esEditar ? validarIdentificacion(identificacion)  : true;

            if (validacion ) {
                if (!esEditar) {

                    await agregarComprador({ ...data, nombres: nombresV?.trim(), registro: 0 });
                    enqueueSnackbar('Comprador agregado correctamente', { variant: 'success' });
                    push(PATH_DASHBOARD.compradores.root);
                    reset();
                } else {
                    await actualizarComprador({ ...data, nombres: nombresV?.trim() });
                    enqueueSnackbar('Comprador actualizado correctamente', { variant: 'success' });

                }

            } else {
                enqueueSnackbar("La identificacion ingresada es incorrecta", { variant: 'error' });
            }

        } catch (error) {

            enqueueSnackbar(`Oops... ${handleErrorsAxios(error)}`, { variant: 'error' });
        }
    }

    const verificarIdentificacion = async (identificacion: string) => {

        if (isSubmitting)
            return;
        
        const nombres = await consultarIdentificacion(identificacion);
        
            if (nombres){

                setNombres(nombres.razon_social);
                setValue('correo', nombres.correo);
                setValue('celular', nombres.telefono2);
                
            }
       


    }

    const enviarCorreo = async (data: any) => {
        try {
            setBotonCorreo(true);
            data.nombres = nombresV?.trim()
            await actualizarComprador(data)
            const correo = await enviarCorreoClave(data)
            setBotonCorreo(false);
            enqueueSnackbar(`${correo.message}`);
        } catch (error) {
            setBotonCorreo(false);
            enqueueSnackbar(`Oops... ${handleErrorsAxios(error)}`, { variant: 'error' });
        }

    }

    return (<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
        <Card sx={{ p: 3, boxShadow: "0 0 2px rgba(0,0,0,0.2)" }}>
            <Stack spacing={2} >

                <RHFTextField
                    name="identificacion"
                    label="Cédula o RUC"
                    size='small'
                    disabled={esEditar}
                    onBlur={(e) => verificarIdentificacion(e.target.value)}
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
                    name="correo"
                    label="Correo"
                    size='small'
                />

                <RHFTextField
                    name="celular"
                    label="Celular"
                    size='small'
                    onKeyPress={(e)=>{soloDigitos(e)} }
                />
                <RHFTextField
                    name="codigo_paleta"
                    label="Número de paleta"
                    size='small'
                    onKeyPress={(e)=>{soloDigitos(e)} }

                />


                <RHFTextField
                    name="calificacion_bancaria"
                    label="Calificación Bancaria"
                    size='small'
                    onKeyPress={(e)=>{soloDigitos(e)} }
                />
            </Stack>
            <Stack direction="row" spacing={2} mt={3}>
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
            <Stack direction="row" spacing={1.5} maxWidth={750} margin="auto" mt={5}>

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

                {

                    (esEditar) &&
                    <Button
                        fullWidth
                        color="inherit"
                        variant="outlined"
                        size="medium"
                        disabled = {botonCorreo}
                        onClick={() => enviarCorreo(methods.getValues())}
                    >
                        Guardar y Enviar Correo
                    </Button>
                }





            </Stack>

        </Card>



    </FormProvider>)
}