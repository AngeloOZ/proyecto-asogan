import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
// next
import { useRouter } from 'next/router';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Grid, Card, Stack, Button, Typography, MenuItem } from '@mui/material';

// components
import { useSnackbar } from '../../../src/components/snackbar';
import FormProvider, {
    RHFSwitch,
    RHFEditor,
    RHFUpload,
    RHFTextField,
    RHFSelect,
} from '../../../src/components/hook-form';

import { useProveedores } from '.';
import { IProducto } from '../../../interfaces';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { LinearProgressBar } from '../LinearProgressBar';
import { proveedores as IProveedor } from '@prisma/client';
import { useObtenerCategories } from '../Categorias';


type FormValuesProps = IProveedor;

type Props = {
    esEditar?: boolean;
    proveedoraEditar?: IProveedor;
}

export function FormAgregarEditarProducto({ esEditar = false, proveedoraEditar }: Props) {
    const { push } = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { isLoading, categories } = useObtenerCategories();
    const { agregarProveedor, actualizarProveedor } = useProveedores();

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
        formState: { isSubmitting },
    } = methods;
    const values = watch();

    // Funcion para enviar el formulario
    const onSubmit = async (data: FormValuesProps) => {
        try {
            if (esEditar) {
                await actualizarProveedor(data);
                enqueueSnackbar('Producto actualizado correctamente', { variant: 'success' });
                push(PATH_DASHBOARD.productos.root);
                return;
            }
            await agregarProveedor(data);
            enqueueSnackbar('Producto agregado correctamente', { variant: 'success' });
            push(PATH_DASHBOARD.productos.root);
            reset();
        } catch (error) {
            console.error(error.message);
            enqueueSnackbar("No se pudo ingresar el producto: " + error.message, { variant: 'error' });
        }
    };

    if (isLoading) return <LinearProgressBar />

    const renderButtons = () => {
        return <>
            <Button
                fullWidth
                color="inherit"
                variant="outlined"
                size="large"
                onClick={() => push(PATH_DASHBOARD.productos.root)}
            >
                Cancelar
            </Button>

            <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}
            >
                Guardar
            </LoadingButton>
        </>
    }

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            {/* <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={8}>
                    <Card sx={{ p: 3 }}>
                        <Stack spacing={2}>
                            <Typography variant='subtitle1' component='h1'>{esEditar ? "Editar" : "Agregar"} producto</Typography>

                            <RHFSwitch
                                name="status"
                                label={values.status ? 'Producto disponible' : 'Producto no disponible'}
                                labelPlacement="start"
                                sx={{ mb: 1, mx: 0, width: 1, }}
                            />

                            <RHFTextField name="name" label="Titulo" />

                            <RHFSelect name='category' placeholder='Categoria' label='Categoria'>
                                <MenuItem value="" disabled>Seleccione una categoria</MenuItem>
                                {categories.map((category) => <MenuItem key={category.id} value={category.id}>{category.nombre}</MenuItem>)}
                            </RHFSelect>

                            <RHFTextField name="price" label="Precio" type='number' />

                            <RHFTextField name="stock" label="Stock" type='number' />

                            <RHFSelect name='rating' placeholder='Calificación' label='Calificación'>
                                <MenuItem value="5">5 puntos</MenuItem>
                                <MenuItem value="4">4 puntos</MenuItem>
                                <MenuItem value="3">3 puntos</MenuItem>
                                <MenuItem value="2">2 puntos</MenuItem>
                                <MenuItem value="1">1 punto</MenuItem>
                            </RHFSelect>

                            <Stack spacing={1}>
                                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                    Descripcion
                                </Typography>
                                <RHFEditor simple style={{ height: 400 }} placeholder='Detalle del producto' name="description" />
                            </Stack>

                        </Stack>

                        <Stack direction="row" spacing={1.5} sx={{ mt: 2, display: { xs: "none", md: "flex" } }}>
                            {renderButtons()}
                        </Stack>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Card sx={{ p: 3 }}>
                        <Stack spacing={{ xs: 2, md: 1 }}>
                            <Stack spacing={1}>
                                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                    Imagen principal
                                </Typography>
                                <RHFUpload
                                    name="cover"
                                    maxSize={3145728}
                                    onDrop={handleDrop}
                                    onDelete={handleRemoveFile}
                                    onRemove={handleRemoveFile}
                                />
                            </Stack>

                            <Stack>
                                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                    Imagenes
                                </Typography>
                                <RHFUpload
                                    name="images"
                                    thumbnail
                                    multiple
                                    maxSize={3145728}
                                    onDrop={handleDrop2}
                                    onRemove={handleRemoveSpecificFile}
                                />
                                {!!values.images.length && (
                                    <Button variant="outlined" color="error" onClick={handleRemoveAllFiles}>
                                        Remover todos los archivos
                                    </Button>
                                )}
                            </Stack>

                            <Stack direction="row" spacing={1.5} sx={{ mt: 2, display: { xs: "flex", md: "none" } }}>
                                {renderButtons()}
                            </Stack>
                        </Stack>
                    </Card>
                </Grid>
            </Grid> */}
        </FormProvider>
    );
}
