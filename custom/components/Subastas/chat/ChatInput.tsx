import { useContext, useState } from 'react';
// @mui
import { InputBase, IconButton, InputAdornment, Stack, Button } from '@mui/material';

// components
import { useSnackbar } from 'src/components/snackbar';

import Iconify from 'src/components/iconify';

import { lotes } from '@prisma/client';

import { subastaAPI } from 'custom/api';
import { AuthContext } from 'src/auth';

import { useSWRConfig } from 'swr';

type Props = {
    lote: lotes;
}
export function ChatInput({ lote }: Props) {
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useContext(AuthContext);
    const { mutate } = useSWRConfig();

    const incremento = Number(lote.puja_final) + Number(lote.incremento);
    const incrementox2 = Number(lote.puja_final) + (Number(lote.incremento) * 2);
    const incrementox3 = Number(lote.puja_final) + (Number(lote.incremento) * 3);


    const handleClickButton = (incremento: number) => {
        if (user?.comprador) {
            handleClickPujaCliente(incremento);
        } else {
            // handleClickPuja(incremento);
        }
    }

    const handleClickPujaCliente = async (incremento: number) => {
        try {
            const body = {
                id_lote: lote.id_lote,
                id_usuario: user?.usuarioid,
                codigo_paleta: user?.comprador?.codigo_paleta!,
                puja: incremento,
            }
            await subastaAPI.put('subastas/registrar/cliente', body);
            enqueueSnackbar('Oferta registrada', { variant: 'success' });
            mutate(`/lotes/${lote.id_evento}`)
            mutate(`/subastas/pujas?lote=${lote.id_lote}`)
            mutate(`/subastas/lotes?id=${lote.id_evento}`)
        } catch (error) {
            enqueueSnackbar(`No se pudo registrar la oferta: ${error.message}`, { variant: 'error' });
        }
    }

    return (
        <Stack direction='row' justifyContent='center' spacing={2} p={1} borderTop="1px dashed #ccc">
            <Button variant='contained' onClick={() => handleClickButton(incremento)} color='success'>+{incremento.toFixed(2)}</Button>
            <Button variant='contained' onClick={() => handleClickButton(incrementox2)} color='warning'>+{incrementox2.toFixed(2)}</Button>
            <Button variant='contained' onClick={() => handleClickButton(incrementox3)} color='error'>+{incrementox3.toFixed(2)}</Button>
        </Stack>
    );
}
