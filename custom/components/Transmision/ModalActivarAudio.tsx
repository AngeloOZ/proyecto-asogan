import { CSSProperties, useEffect, useState } from "react";


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
        width: "400px",
        height: "150px",
        backgroundColor: "white",
        borderRadius: "20px",
        transition: 'opacity 1s ease, transform 0.5s ease',
        opacity: isActive ? 1 : 0,
        transform: `translateY(${isActive ? '0' : '-100%'})`,
        textAlign: 'center',

    };

    useEffect(() => {
        setTimeout(() => {
            setIsActive(true);
        }, 500);
    }, []);

    return (
        <div style={modalContainerStyles}>
            <div style={modalStyles}>
                <h2>Desea activar el audio</h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                    <button type='button' onClick={() => toggle(false)}>Si</button>
                    <button type='button' onClick={() => toggle(true)}>No</button>
                </div>
            </div>
        </div>
    );
}