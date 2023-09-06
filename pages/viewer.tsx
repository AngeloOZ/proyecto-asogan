import { useRef } from 'react';

import Head from 'next/head';

import { useViewer } from 'custom/hooks/live/useViewer';

import { getSocket } from 'utils/socketClient';

export default function Index() {
    const socket = getSocket();
    const videoRef = useRef<HTMLVideoElement>(null);

    useViewer({
        videoRef,
        broadcastID: '123',
        username: 'Angello_Beta_MIDEV',
        socket,
    });

    const toggleAudio = () => {
        if (!videoRef.current) return;

        videoRef.current.muted = !videoRef.current.muted;
    }

    return <>
        <Head><title>Viewer Video</title></Head>
        <h1>Viewer Video:</h1>
        <div>
            {/* eslint-disable-next-line */}
            <video ref={videoRef} width={400} height={400} poster={`${process.env.NEXT_PUBLIC_URL_APP}/img/loader.gif`} />

            <button type='button' onClick={toggleAudio}>
                Audio
            </button>
        </div>
    </>
}
