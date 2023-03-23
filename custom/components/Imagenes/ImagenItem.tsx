import { useState } from 'react';
// @mui
import { Card, Stack, Button, MenuItem, IconButton, CardContent, CardMedia, Typography } from '@mui/material';

// @prisma
import { imagenes } from '@prisma/client';

// components
import { useSnackbar } from '../../../src/components/snackbar';
import Iconify from '../../../src/components/iconify';
import MenuPopover from '../../../src/components/menu-popover';
import ConfirmDialog from '../../../src/components/confirm-dialog';
import { useRouter } from 'next/router';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { useObtenerImagenes, useImagenes } from '.';
import Image from 'next/image'

type Props = {
    imagenes: imagenes;
}

export const ImagenItem = ({ imagenes }: Props) => {
    const { eliminarImagen } = useImagenes();
    const [openPopover, setOpenPopover] = useState<HTMLElement | null>(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();


    const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
        setOpenPopover(event.currentTarget);
    };

    const handleClosePopover = () => {
        setOpenPopover(null);
    };

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    // const handleClickEdit = () => {
    //     router.push(`${PATH_DASHBOARD.banner.editar}/${imagenes.id_imagen}`);
    // }

    const handleClickDelete = async () => {
        try {
            handleCloseConfirm();
            await eliminarImagen(imagenes);
            enqueueSnackbar('Imagen Eliminada', { variant: 'success' });
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error al eliminar la imagen: ' + error.message, { variant: 'error' });
        }
    }

    return (
        <>
            <Card
                sx={{
                    bgcolor: 'background.default',
                }}
            >
                <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
                    <IconButton sx={{ backgroundColor: "rgba(0,0,0,0.25)" }} color='default' onClick={handleOpenPopover}>
                        <Iconify color="#fff" icon="eva:more-vertical-fill" />
                    </IconButton>
                </Stack>

                {/* <CardMedia
                    component="img"
                    height="150"
                    image="img/imagen.jpg"
                /> */}
                <Image src={imagenes.ruta!} alt='Logo' width="350" height="350" />

            </Card>

            <MenuPopover
                open={openPopover}
                onClose={handleClosePopover}
                arrow="right-top"
                sx={{ width: 160 }}
            >
                <MenuItem
                    sx={{ color: 'error.main' }}
                    onClick={() => {
                        handleOpenConfirm();
                        handleClosePopover();
                    }}
                >
                    <Iconify icon="eva:trash-2-outline" />
                    Eliminar
                </MenuItem>
            </MenuPopover>

            <ConfirmDialog
                open={openConfirm}
                onClose={handleCloseConfirm}
                title="Eliminar imagen"
                content="¿Estas seguro de eliminar la imagen?"
                action={
                    <Button variant="contained" color="error" onClick={handleClickDelete}>
                        Eliminar
                    </Button>
                }
            />
        </>
    );
};