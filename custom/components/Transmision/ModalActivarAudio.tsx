import { CSSProperties, useEffect, useState } from "react";
import { Button, Typography, Stack } from '@mui/material';

interface PropsModalActivarAudio {
    toggle: (state?: boolean) => void;
}

export const ModalActivarAudio = ({ toggle }: PropsModalActivarAudio) => {
    const [isActive, setIsActive] = useState(false);

    const modalContainerStyles: CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        overflow: 'hidden',
        display: 'grid',
        placeContent: 'center',
        zIndex: 9999999999 * 100,
    };

    const modalStyles: CSSProperties = {
        width: "320px",
        height: "130px",
        backgroundColor: "white",
        borderRadius: "20px",
        transition: 'opacity 1s ease, transform 0.5s ease',
        opacity: isActive ? 1 : 0,
        transform: `translateY(${isActive ? '0' : '-100%'})`,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    };

    useEffect(() => {
        setTimeout(() => {
            setIsActive(true);
        }, 500);
    }, []);

    return (
        <div style={modalContainerStyles}>
            <div style={modalStyles}>
                <Typography component='p' variant="h4">Desea activar el audio</Typography>
                <Stack spacing={2} direction='row' mt={1}>
                    <Button
                        onClick={() => toggle(false)}
                        variant="contained"
                        size="large"
                        color="success"
                    >
                        Si
                    </Button>
                    <Button
                        onClick={() => toggle(true)}
                        variant="contained"
                        color="error"
                        size="large"
                    >
                        No
                    </Button>
                </Stack>
            </div>
        </div>
    );
}