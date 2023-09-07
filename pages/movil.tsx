import { useRef } from 'react';

import Head from 'next/head';

import { useViewer } from 'custom/hooks/live/useViewer';

import { getSocket } from 'utils/socketClient';
import { ModalActivarAudio } from 'custom/components';

export default function Index() {
    const socket = getSocket();
    const videoRef = useRef<HTMLVideoElement>(null);

    const { isMuted, showDialogAudio, toggleAudio } = useViewer({
        videoRef,
        broadcastID: '123',
        username: 'VISTA_MOVIL',
        socket,
    });

    return (
        <>
            <Head><title>Viewer Video</title></Head>
            <div style={{
                width: '100%',
                height: '100vh',
                position: 'relative',
                backgroundColor: 'black',
                overflow: 'hidden',
            }}>
                {/* eslint-disable-next-line */}
                <video
                    ref={videoRef}
                    poster={`${process.env.NEXT_PUBLIC_URL_APP}/img/loader.gif`}
                    style={{
                        width: '100%',
                        height: '100%',
                        // objectFit: 'cover',
                    }}
                />

                <button onClick={() => toggleAudio} type='button' >
                    Activar audio
                </button>

                <button type='button' onClick={() => toggleAudio()} style={{
                    position: 'absolute',
                    top: 10,
                    right: 20,
                }}>
                    {isMuted ? 'Activar audio' : 'Desactivar audio'}
                </button>
            </div>
            {
                showDialogAudio && <ModalActivarAudio toggle={toggleAudio} />
            }
        </>
    )
}
