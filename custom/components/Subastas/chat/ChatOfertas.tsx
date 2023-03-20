import { useState, useEffect } from 'react';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Button, Drawer, IconButton, IconButtonProps, Stack, Typography } from '@mui/material';
// hooks
import useResponsive from 'src/hooks/useResponsive';

import Iconify from 'src/components/iconify';

import { useSnackbar } from 'src/components/snackbar';

import { Puja } from '@types';
import { ItemOferta } from '.';
import { lotes } from '@prisma/client';
import { subastaAPI } from 'custom/api';
import { handleErrorsAxios } from 'utils';


const StyledToggleButton = styled((props) => (
    <IconButton disableRipple {...props} />
))<IconButtonProps>(({ theme }) => ({
    right: 0,
    zIndex: 9,
    width: 32,
    height: 32,
    position: 'absolute',
    top: theme.spacing(1),
    boxShadow: theme.customShadows.z8,
    backgroundColor: theme.palette.background.paper,
    border: `solid 1px ${theme.palette.divider}`,
    borderRight: 0,
    borderRadius: `12px 0 0 12px`,
    transition: theme.transitions.create('all'),
    '&:hover': {
        backgroundColor: theme.palette.background.neutral,
    },
}));

// ----------------------------------------------------------------------

const NAV_WIDTH = 240;

type Props = {
    ofetas: Puja[];
    loteActual: lotes;
}
export function ChatOfertas({ ofetas = [], loteActual }: Props) {
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isDesktop = useResponsive('up', 'lg');
    const [openNav, setOpenNav] = useState(true);

    const onOpenNav = () => {
        setOpenNav(true);
    };

    const onCloseNav = () => {
        setOpenNav(false);
    };

    useEffect(() => {
        if (!isDesktop) {
            onCloseNav();
        } else {
            onOpenNav();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDesktop]);


    const handleClickButtons = async (accion: string) => {
        try {
            const { data } = await subastaAPI.put('subastas/terminar', {
                id_lote: loteActual.id_lote,
                accion
            }) as { data: { message: string } };

            enqueueSnackbar(`Genial, ${data.message}`, { variant: 'success' });

        } catch (error) {
            enqueueSnackbar(`Oops... ${handleErrorsAxios(error)}`, { variant: 'error' });
        }
    }

    return (
        <Box sx={{ position: 'relative' }}>
            <StyledToggleButton
                onClick={() => setOpenNav(!openNav)}
                sx={{
                    ...(openNav &&
                        isDesktop && {
                        right: NAV_WIDTH,
                    }),
                }}
            >
                <Iconify
                    width={16}
                    icon={openNav ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'}
                />
            </StyledToggleButton>

            <Drawer
                open={openNav}
                anchor="right"
                variant="persistent"
                PaperProps={{
                    sx: {
                        width: 1,
                        position: 'static',
                    },
                }}
                sx={{
                    height: 1,
                    width: NAV_WIDTH,
                    transition: theme.transitions.create('width'),
                    ...(!openNav && {
                        width: 0,
                    }),
                }}
            >
                <Stack spacing={1} p={1} justifyContent="center" width="100%">

                    <Typography component="h3" variant='subtitle1' textAlign="center" sx={{ fontWeight: 700 }}>
                        Mejores Pujas
                    </Typography>
                    {
                        ofetas.map(puja => <ItemOferta puja={puja} key={puja.id_puja} />)
                    }
                    <Stack spacing={1}>
                        <Button onClick={() => handleClickButtons('subastado')} variant='contained' color='success' >Subastado</Button>
                        <Button onClick={() => handleClickButtons('rechazado')} variant='contained' color='error' >Pendiente</Button>
                    </Stack>
                </Stack>
            </Drawer>
        </Box>
    );
}
