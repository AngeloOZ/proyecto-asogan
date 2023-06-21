import { useEffect, useRef, useState } from 'react';
import { InputBase, IconButton, InputAdornment, Button, Modal, Typography } from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
import { IoHandRight } from 'react-icons/io5';
import { TbEditCircle } from 'react-icons/tb';
import { subastaAPI } from 'custom/api';
import { handleErrorsAxios } from 'utils';
import { Box } from '@mui/system';
import { lotes } from '@prisma/client';
import { UltimaPuja } from '@types';

type Props = {
    lote: lotes;
    ultimaPuja?: UltimaPuja;
    setLoader: (state: boolean) => void;
}
export function PujaMartillador({ lote, ultimaPuja, setLoader }: Props) {
    
    const buttonPujar = useRef<HTMLButtonElement>(null)
    const { enqueueSnackbar } = useSnackbar();
    const [paleta, setPaleta] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    let incremento = Number(lote?.puja_final || 0);
    if (ultimaPuja) {
        incremento = Number(ultimaPuja?.puja || 0);
    }
    incremento = incremento + Number(lote.incremento);

    useEffect(() => {
        function handleKeyUp(e: KeyboardEvent) {
            if (e.key === 'Enter') {
                buttonPujar.current?.click();
            }
        }

        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keyup', handleKeyUp);
        }
    }, []);

    const terminarSubasta = async (accion: string) => {
        try {
            if (accion === 'subastado') {
                if (!ultimaPuja) {
                    enqueueSnackbar(`No se puede finalizar la subasta, no hay pujas registradas`, { variant: 'error' });
                    return;
                }

                const datos = await subastaAPI.get(`/subastas/ultima-puja?id=${lote.id_lote}`)
                if (datos.data.codigo_paleta === 'P') {
                    setIsOpen(true);
                    return;
                }
            }

            const { data } = await subastaAPI.put('subastas/terminar', {
                id_lote: lote?.id_lote,
                accion,
            }) as { data: { message: string } };

            enqueueSnackbar(`${data.message}`, { variant: 'success' });

        } catch (error) {
            enqueueSnackbar(`Oops... ${handleErrorsAxios(error)}`, { variant: 'error' });
        }
    }

    const registrarPujaMartillador = async (incremento: number) => {
        try {
            if (isOpen) return;
            setLoader(true);
            const body = {
                id_lote: lote.id_lote,
                puja: incremento,
                codigo_paleta: 'P',
            }
            await subastaAPI.put('subastas/registrar/martillador', body);
            setLoader(false);
            enqueueSnackbar('Oferta registrada', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar(`Oops... ${handleErrorsAxios(error)}`, { variant: 'error' });
        } finally {
            setPaleta("");
        }
    }

    const onSubmitPresencial = async () => {
        try {
            await subastaAPI.put('subastas/loteAdminMartillador', {
                id_lote: lote?.id_lote,
                codigo_paleta: paleta,
            })

            const { data } = await subastaAPI.put('subastas/terminar', {
                id_lote: lote?.id_lote,
                accion: 'subastado',
            }) as { data: { message: string } };
            enqueueSnackbar(`${data.message}`, { variant: 'success' });
            setIsOpen(false);
        } catch (error) {
            enqueueSnackbar(`Oops... ${handleErrorsAxios(error)}`, { variant: 'error' });
        } finally {
            setPaleta("");
        }
    };

    return (
        <>
            <Box style={{ display: 'flex', height: "100%" }} p={1}>
                <Button
                    onClick={() => terminarSubasta('rechazado')}
                    variant="contained"
                    color="error"
                    style={{ flex: 1, marginRight: 8, width: '100%', height: '100%', fontSize: "20px" }}>
                    Pendiente
                </Button>
                <Button
                    ref={buttonPujar}
                    variant='contained'
                    onClick={() => registrarPujaMartillador(incremento)}
                    color='secondary'
                    startIcon={<IoHandRight />}
                    style={{ flex: 1, marginRight: 8, width: "100%", height: "100%", fontSize: "20px" }}
                >
                    Pujar
                </Button>
                <Button
                    onClick={() => terminarSubasta('subastado')}
                    variant="contained"
                    color="success"
                    style={{ flex: 1, marginRight: 8, width: '100%', height: '100%', fontSize: "20px" }}>
                    Vendido
                </Button>
            </Box>

            <Modal open={isOpen} onClose={() => setIsOpen(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 3,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        La última puja registrada es presencial ingrese el numero de paleta
                    </Typography>

                    <InputBase
                        sx={{ backgroundColor: "white", borderRadius: "10px", flexGrow: 1 }}
                        onChange={(event) => setPaleta(event.target.value)}
                        value={paleta}
                        placeholder="Número de paleta"
                        type='number'
                        startAdornment={
                            <InputAdornment position="start">
                                <IconButton size="medium" disabled >
                                    <TbEditCircle />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        style={{ flex: 1, marginRight: 8 }}
                        onClick={onSubmitPresencial}
                    >
                        Guardar
                    </Button>
                </Box>
            </Modal>
        </>
    );
}
