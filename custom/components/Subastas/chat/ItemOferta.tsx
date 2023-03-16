import { useContext } from 'react'
import { Box, Stack, Typography, useTheme } from '@mui/material'

import { pujas } from '@prisma/client'
import { AuthContext } from 'src/auth'

type Props = {
    puja: pujas
}
export const ItemOferta = ({ puja }: Props) => {
    const theme = useTheme();

    return (
        <Stack direction="row" mb={2}>
            <Box
                component="div"
                padding={0.5}
                px={1}
                key={puja.id_puja}
                width="90%"
                maxWidth="200px"
                style={{
                    backgroundColor: theme.palette.success.main,
                    borderRadius: 5,
                }}
            >
                <Typography component="p" variant='subtitle2'>
                    Paleta:
                    <Typography component='strong' variant='button'> #{puja.codigo_paleta}</Typography>
                </Typography>
                <Typography component="p" variant='subtitle2'>
                    Oferta:
                    <Typography component='strong' variant='button'> ${Number(puja.puja).toFixed(2)}</Typography>
                </Typography>
            </Box>
        </Stack>

    )
}
