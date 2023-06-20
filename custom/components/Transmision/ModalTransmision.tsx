import React, { useRef } from 'react';
import Link from 'next/link';
import { PATH_DASHBOARD_CLEINTE } from 'src/routes/paths';
import { Modal, Button, Box } from '@mui/material';
type Props = {
    open: boolean;
    rol: string
}
export const ModalTransmision = ({ open, rol }: Props) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const timer = setTimeout(() => {
        if (buttonRef.current)
            buttonRef.current.click();
            
    }, 5000);


    return (
        <Modal aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={rol == "comprador" ? open : false} >
            <Box sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 3,
            }}>
                <h2>La transmisión ha terminado</h2>
                <Link href={PATH_DASHBOARD_CLEINTE.root} passHref legacyBehavior>
                    <Button
                        ref={buttonRef}
                        fullWidth
                        color="inherit"
                        variant="outlined"
                        size="medium"
                    >
                        Regresar al inicio
                    </Button>
                </Link>
            </Box>
        </Modal>
    );
};