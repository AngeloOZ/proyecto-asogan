import { useState } from 'react';
import { InputBase, IconButton, InputAdornment, Stack, Button } from '@mui/material';
import { useSWRConfig } from 'swr';
import { useSnackbar } from 'src/components/snackbar';
import { IoHandRight } from 'react-icons/io5';
import { TbEditCircle } from 'react-icons/tb';
import { subastaAPI } from 'custom/api';
import { handleErrorsAxios } from 'utils';
import { Box } from '@mui/system';
import { LoteA } from '@types'

type Props = {
    lote: LoteA;
}
export function PujaMartillador({ lote }: Props) {
    const { enqueueSnackbar } = useSnackbar();
    const { mutate } = useSWRConfig();
    const [paleta, setPaleta] = useState("");

    const incremento = Number(lote.puja_final) + Number(lote.incremento) || 0;


    const handleClickButton = (incremento: number) => {
        registrarPujaMartillador(incremento);
    }

    const handleClickButtons = async (accion: string) => {
        try {
            const { data } = await subastaAPI.put('subastas/terminar', {
                id_lote: lote?.id_lote,
                accion
            }) as { data: { message: string } };

            enqueueSnackbar(`${data.message}`, { variant: 'success' });

        } catch (error) {
            enqueueSnackbar(`Oops... ${handleErrorsAxios(error)}`, { variant: 'error' });
        }
    }

    const registrarPujaMartillador = async (incremento: number) => {
        try {
            const body = {
                id_lote: lote.id_lote,
                codigo_paleta: paleta,
                puja: incremento,
            }
            await subastaAPI.put('subastas/registrar/martillador', body);
            enqueueSnackbar('Oferta registrada', { variant: 'success' });
            mutate(`/lotes/${lote.id_evento}`)
            mutate(`/subastas/pujas?lote=${lote.id_lote}`)
            mutate(`/subastas/lotes?id=${lote.id_evento}`)
        } catch (error) {
            enqueueSnackbar(`Oops... ${handleErrorsAxios(error)}`, { variant: 'error' });
        } finally {
            setPaleta("");
        }
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Evita que el formulario se envíe
            handleClickButton(incremento); // Llama al controlador de eventos onClick del botón "Pujar"
        }
    }

    return (
        <>
            {/* <Stack direction='row' justifyContent='center' spacing={2} p={1}> */}
            {/* <InputBase
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
                    onKeyDown={handleKeyDown}
                /> */}

            {/* </Stack> */}
            <Box style={{ display: 'flex', justifyContent: 'center', height: "100%" }} p={1}>
                <Button
                    variant='contained'
                    onClick={() => handleClickButton(incremento)}
                    color='secondary'
                    // disabled={paleta.length === 0}
                    startIcon={<IoHandRight />}
                    style={{ flex: 1, marginRight: 8, width: "100%", height: "100%", fontSize: "20px" }}
                >
                    Pujar
                </Button>
                <Button
                    onClick={() => handleClickButtons('subastado')}
                    variant="contained"
                    color="success"
                    style={{ flex: 1, marginRight: 8, width: '100%', height: '100%', fontSize: "20px" }}>
                    Vendido
                </Button>
                <Button
                    onClick={() => handleClickButtons('rechazado')}
                    variant="contained"
                    color="error"
                    style={{ flex: 1, marginRight: 8, width: '100%', height: '100%', fontSize: "20px" }}>
                    Pendiente
                </Button>
            </Box>
        </>
    );
}
