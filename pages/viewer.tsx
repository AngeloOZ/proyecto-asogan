import { useRef } from 'react';

import Head from 'next/head';

import { useViewer } from 'custom/hooks/live/useViewer';

import { getSocket } from 'utils/socketClient';
import { ModalActivarAudio } from 'custom/components';

export default function Index() {
    const socket = getSocket();
    const videoRef = useRef<HTMLVideoElement>(null);

    const { showDialogAudio, toggleAudio, isMuted } = useViewer({
        videoRef,
        broadcastID: 'e1f36dc0-d632-4ab3-9e00-4f8fa13c047e',
        username: 'Angello_Beta_MIDEV',
        socket,
    });
    
    return <>
        <Head><title>Viewer Video</title></Head>
        <h1>Viewer Video:</h1>
        <div>
            {/* eslint-disable-next-line */}

            <video 
                ref={videoRef}
                poster={`${process.env.NEXT_PUBLIC_URL_APP}/img/loader.gif`}
                style={{ height: 400, width: 400 }}
                muted
            />

            <button type='button' onClick={() => toggleAudio()}>
                {isMuted ? 'Activar audio' : 'Desactivar audio'}
            </button>
        </div>
        {
            showDialogAudio && <ModalActivarAudio toggle={toggleAudio} />
        }
    </>
}


