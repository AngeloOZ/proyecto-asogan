/* eslint-disable no-undef */
import { useRef } from "react";

import { useViewer } from "custom/hooks/live";
import { getSocket } from "utils/socketClient";
import { ModalActivarAudio } from ".";

interface Props {
    ancho: number | string;
    alto: number | string;
    uuid: string;
    username: string;
}

export function TransmisionUsuarios({ alto, ancho, username, uuid }: Props) {
    const socket = getSocket();
    const videoRef = useRef<HTMLVideoElement>(null);

    const { showDialogAudio, toggleAudio, isMuted } = useViewer({
        videoRef,
        broadcastID: uuid,
        username,
        socket,
    });

    return (
        <>
            <div style={{
                width: ancho,
                height: alto,
                backgroundColor: '#191919',
            }}>
                <video
                    ref={videoRef}
                    poster={`${process.env.NEXT_PUBLIC_URL_APP}/img/loader.gif`}
                    style={{ height: '100%', width: '100%' }}
                    muted
                />
            </div>
            {
                showDialogAudio && <ModalActivarAudio toggle={toggleAudio} />
            }
        </>
    );
}