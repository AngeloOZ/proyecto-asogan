
import * as Yup from 'yup';
import { useEffect, useMemo,useState } from 'react';

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

import { compradores as IComprador , usuario as IUsuario } from '@prisma/client';
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
    const { validarIdentificacion,consultarIdentificacion } = useGlobales();
    const [validacionI, setValidacionI ]= useState(false);
    const [nombresV, setNombres] = useState<string>();
   
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
        nombres: Yup.string().when('nombresV',{ 
            is: () => nombresV != "" ? false : true,
             then: Yup.string().required('El nombre es requerido')
             } 
            ),
        codigo_paleta: Yup.string().required('El numero de paleta es requerido').max(5, 'El numero de paleta no puede tener mas de 5 caracteres'),
        calificacion_bancaria: Yup.string().required('La calificacion bancaria es requerida').max(5, 'La calificacion bancaria no puede tener mas de 5 caracteres'),
    });


    // Se carga los valores en caso de que sea editar
    const defaultValues = useMemo<IComprador>(() => {

            setNombres(compradorEditar?.usuario?.nombres || '');
            esEditar && setValidacionI(true);
        
        return {
          id_comprador: compradorEditar?.id_comprador || 0,
          codigo_paleta:
            compradorEditar?.codigo_paleta ||
            (Math.floor(Math.random() * (99999 - 10000 + 1) + 10000)).toString(),
          calificacion_bancaria: compradorEditar?.calificacion_bancaria || "",
          antecedentes_penales: compradorEditar?.antecedentes_penales || false,
          procesos_judiciales: compradorEditar?.procesos_judiciales || false,
          estado: compradorEditar?.estado || true,
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
      
        formState: { isSubmitting },
    } = methods;
    

    const onSubmit = async (data: FormValuesProps) => {
        try {
        
            if (validacionI == true) {
                if (!esEditar) {
                 
                    await agregarComprador({...data, nombres: nombresV});
                    enqueueSnackbar('Comprador agregado correctamente', { variant: 'success' });
                    push(PATH_DASHBOARD.compradores.root);
                } else {
                    await actualizarComprador({...data, nombres: nombresV});
                    enqueueSnackbar('Comprador actualizado correctamente', { variant: 'success' });
                    push(PATH_DASHBOARD.compradores.root);
                }
                reset();
            }else{
                enqueueSnackbar("La identificacion ingresada es incorrecta", { variant: 'error' });
            }
            
        } catch (error) {

            enqueueSnackbar(`Oops... ${handleErrorsAxios(error)}`, { variant: 'error' });
        }
    }

    const verificarIdentificacion = async (identificacion:string) => {

        const validacion = validarIdentificacion(identificacion)
        
        if (validacion){
            const nombres = await consultarIdentificacion(identificacion);
            setNombres(nombres.razon_social);
            setValidacionI(true);
        }else {
            setValidacionI(false);
            enqueueSnackbar("La identificacion ingresada es incorrecta", { variant: 'error' });
        }

      
    }

    return (<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
        <Card sx={{ p: 3, boxShadow: "0 0 2px rgba(0,0,0,0.2)" }}>
            <Stack spacing={2} >

                <RHFTextField
                    name="identificacion"
                    label="Identificación"
                    size='small'
                    disabled={esEditar}
                    onBlur={(e) => verificarIdentificacion(e.target.value)}
                />
                <RHFTextField
                    name="nombres"
                    label="Nombres"
                    size='small'
                    value={nombresV}
                    onChange={(e) => {setNombres(e.target.value)}}
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
            <Stack direction="row" spacing={1.5} maxWidth={400} margin="auto" mt={5}>

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

        </Card>



    </FormProvider>)
}