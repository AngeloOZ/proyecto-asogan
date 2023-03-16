import { useState } from 'react';
// @mui
import { InputBase, IconButton, InputAdornment, Stack, Button } from '@mui/material';

// components
import Iconify from 'src/components/iconify';
import { lotes } from '@prisma/client';

type Props = {
    lote: lotes;
}
export function ChatInput({ lote }: Props) {
    const incremento = Number(lote.incremento);

    return (
        <Stack direction='row' justifyContent='center' spacing={2} p={1} borderTop="1px dashed #ccc">
            <Button variant='contained' color='success'>+{incremento.toFixed(2)}</Button>
            <Button variant='contained' color='warning'>+{(incremento * 2).toFixed(2)}</Button>
            <Button variant='contained' color='error'>+{(incremento * 3).toFixed(2)}</Button>
        </Stack>
    );
}
