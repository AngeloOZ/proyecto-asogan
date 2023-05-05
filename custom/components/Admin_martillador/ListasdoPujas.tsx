import { Stack } from '@mui/material'
import { ChatList } from '../'
import { lotes } from '@prisma/client';
import { useObtenerTodasPujas } from 'custom/hooks';

export const ListasdoPujas = ({ lote }: { lote: lotes }) => {
    const { listadoPujas } = useObtenerTodasPujas(lote);  

    return (
        <Stack flexGrow={1}>
            <Stack
                direction="row"
                flexGrow={1}
                sx={{
                    overflow: 'hidden',
                    borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
                }}
            >
                <Stack flexGrow={1}>
                    <ChatList pujas={listadoPujas} />
                </Stack>
            </Stack>
        </Stack>
    )
}
