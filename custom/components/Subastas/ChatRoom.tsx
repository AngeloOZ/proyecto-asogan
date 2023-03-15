import { useState, useEffect } from 'react';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, Drawer, IconButton, IconButtonProps } from '@mui/material';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// @types
// components
import Iconify from 'src/components/iconify';


// ----------------------------------------------------------------------

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


export default function ChatRoom({ }) {
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

            {isDesktop ? (
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
                </Drawer>
            ) : (
                <Drawer
                    anchor="right"
                    open={openNav}
                    onClose={onCloseNav}
                    ModalProps={{ keepMounted: true }}
                    PaperProps={{
                        sx: {
                            width: NAV_WIDTH,
                        },
                    }}
                >  
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo quod, magni natus dolore ratione veniam delectus, fugiat recusandae, blanditiis libero nulla reprehenderit quos eveniet temporibus eum. Autem voluptatum aspernatur harum.

                </Drawer>
            )}
        </Box>
    );
}
