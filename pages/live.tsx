
import { useBroadcast } from 'custom/hooks/live/useBroadcast';
import Head from 'next/head';
import { useRef } from 'react';
import { getSocket } from 'utils/socketClient';

interface PeerConnectionMap {
    [id: string]: RTCPeerConnection;
}

interface DataChannelMap {
    [id: string]: RTCDataChannel;
}


export default function Index() {
    const socket = getSocket();
    const videoRef = useRef<HTMLVideoElement>(null);

    // const peerConnections: PeerConnectionMap = {};
    // const dataChannels: DataChannelMap = {};

    const peerConnectionsRef = useRef<PeerConnectionMap>({});
    const dataChannelsRef = useRef<DataChannelMap>({});


    const {
        isBroadcasting,
        toggleBroadcast,
        audioDevices,
        videoDevices,
        changeAudioDevice,
        changeVideoDevice,
        numberConnectedPeers
    } = useBroadcast({
        videoRef,
        broadcastID: '123',
        peerConnections: peerConnectionsRef.current,
        dataChannels: dataChannelsRef.current,
        socket
    });

    return <>
        <Head><title>Live Video</title></Head>
        <h1>Live Video</h1>
        <h2>Numero de visitantes {numberConnectedPeers}</h2>
        <div>
            {/* eslint-disable-next-line */}
            <video ref={videoRef} width={300} height={200} />
        </div>
        {/* eslint-disable-next-line */}
        <label htmlFor="video">Dispositivos video</label>
        <select name="video" defaultValue="" id="video" onChange={changeVideoDevice}>
            <option value="" disabled>Seleccione un dispositivo</option>
            {
                videoDevices.map((device, index) => <option key={device.deviceId} value={device.deviceId} >Video: {device.label}</option>)
            }
        </select>

        <br /><br />
        {/* eslint-disable-next-line */}
        <label htmlFor="">Dispositivos audio</label>
        <select name="audio" id="audio" defaultValue="" onChange={changeAudioDevice}>
            <option value="audio" disabled>Seleccione un dispositivo</option>
            {
                audioDevices.map((device, index) => <option key={device.deviceId} value={device.deviceId} >Audio: {device.label}</option>)
            }
        </select>

        <br /><br /><br />
        <button type='button' onClick={toggleBroadcast}>
            {
                isBroadcasting ? 'Detener' : 'Iniciar'
            }
        </button>
    </>
}
