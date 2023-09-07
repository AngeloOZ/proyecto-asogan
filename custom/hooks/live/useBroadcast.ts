import { useState, useEffect, ChangeEvent } from 'react';
import io, { Socket } from 'socket.io-client';

import { useSnackbar } from '../../../src/components/snackbar';

interface ISelectedDevice {
    audio: string | undefined;
    video: string | undefined;
}

interface IUseBroadcastProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    broadcastID: string;
    username?: string;
    peerConnections: PeerConnectionMap;
    dataChannels: DataChannelMap;
    socket: Socket
}

interface PeerConnectionMap {
    [id: string]: RTCPeerConnection;
}

interface DataChannelMap {
    [id: string]: RTCDataChannel;
}

const WIDTH_CONSTRAINT = 640;
const HEIGHT_CONSTRAINT = 480;
const FPS_CONSTRAINT = 30;

export const useBroadcast = ({ videoRef, broadcastID, peerConnections, dataChannels, socket }: IUseBroadcastProps) => {
    const { enqueueSnackbar } = useSnackbar();

    const [numberConnectedPeers, setNumberconnectedPeers] = useState(0)
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
    const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<ISelectedDevice>({
        audio: undefined,
        video: undefined,
    });

    let broadcastStream: MediaStream | null = null;

    useEffect(() => {
        getDevices();
    }, []);

    useEffect(() => {
        if (!isBroadcasting) {
            stopBroadcastStream();
            stopWindowStream();
            return;
        };
        getStream();
    }, [isBroadcasting]);

    // ========================================================================================

    socket.on('answer', (id, description) => {
        if (!peerConnections[id]) return;
        console.log(description);
        peerConnections[id].setRemoteDescription(description);
    });

    socket.on('viewer', (id, iceServers) => {
        const peerConnection = new RTCPeerConnection({ iceServers: iceServers });

        peerConnections[id] = peerConnection;

        handleDataChannels(id);

        setNumberconnectedPeers(Object.keys(peerConnections).length);

        peerConnection.onconnectionstatechange = (event) => { };

        const stream = videoRef.current?.srcObject as MediaStream;

        stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) socket.emit('candidate', id, event.candidate);
        };

        peerConnection
            .createOffer()
            .then((sdp) => peerConnection.setLocalDescription(sdp))
            .then(() => socket.emit('offer', id, peerConnection.localDescription))
            .catch((e) => console.error(e));
    });

    socket.on('candidate', (id, candidate) => {
        if (!peerConnections[id]) return;

        peerConnections[id]
            .addIceCandidate(new RTCIceCandidate(candidate)).catch((e: any) => console.error(e));
    });

    socket.on('disconnectPeer', (id) => {
        if (!peerConnections[id]) return;
        peerConnections[id].close();
        delete peerConnections[id];
        delete dataChannels[id];
        setNumberconnectedPeers(Object.keys(peerConnections).length);
    });

    // =====================================================
    // Handle RTC Data Channels
    // =====================================================

    function handleDataChannels(id: any) {
        dataChannels[id] = peerConnections[id].createDataChannel('mt_bro_dc');
        dataChannels[id].binaryType = 'arraybuffer'; // blob

        dataChannels[id].onopen = (event: any) => { };

        dataChannels[id].onclose = (event: any) => { };

        dataChannels[id].onerror = (event: any) => { };

        peerConnections[id].ondatachannel = (event: any) => {
            event.channel.onmessage = (message: any) => {
                console.log('onmessage', message);
                let data = {};
                try {
                    data = JSON.parse(message.data);
                    // appendMessage(data.username, data.message);
                } catch (err) {
                    console.log('Datachannel error', err);
                }
            };
        };
    }


    // ========================================================================================

    const getDevices = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            const devices = await navigator.mediaDevices.enumerateDevices();

            const audioDevices = devices.filter(device => device.kind === 'audioinput');
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            setAudioDevices(audioDevices);
            setVideoDevices(videoDevices);

            enqueueSnackbar('Devices loaded', { variant: 'success' });
        } catch (error) {
            console.error('Error getting devices:', error);
        }
    };

    const selectedAudioDevice = (e: ChangeEvent<HTMLSelectElement>) => {
        const deviceId = e.target.value === "" ? undefined : e.target.value;
        setSelectedDevice({ ...selectedDevice, audio: deviceId });
    }

    const selectedVideoDevice = (e: ChangeEvent<HTMLSelectElement>) => {
        const deviceId = e.target.value === "" ? undefined : e.target.value;
        setSelectedDevice({ ...selectedDevice, video: deviceId });
    }

    const toggleBroadcast = () => {
        setIsBroadcasting(prev => !prev);
    };

    const getStream = async () => {
        try {
            if (!selectedDevice.audio && !selectedDevice.video) {
                toggleBroadcast();
                return enqueueSnackbar('Seleccione un dispositivo de audio y video', { variant: 'error' });
            }

            const cameraConstraints = {
                audio: { deviceId: selectedDevice.audio ? { exact: selectedDevice.audio } : undefined },
                video: { deviceId: selectedDevice.video ? { exact: selectedDevice.video } : undefined },
            }

            const stream = await navigator.mediaDevices.getUserMedia(cameraConstraints);
            await gotStream(stream);
            await applyVideoConstraints();
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Error getting stream', { variant: 'error' });
        }
    };

    const gotStream = (stream: MediaStream) => {
        stopBroadcastStream();
        stopWindowStream();
        window.stream = stream;
        broadcastStream = stream;
        attachStream(stream);
        socket.emit('broadcaster', broadcastID);
    }

    function attachStream(stream: MediaStream) {
        if (!videoRef.current) return;
        const video = videoRef.current;
        video.srcObject = stream;
        video.playsInline = true;
        video.autoplay = true;
        video.muted = true;
        video.volume = 0;
        video.controls = false;
    }

    function stopBroadcastStream() {
        if (broadcastStream) {
            broadcastStream.getTracks().forEach((track) => {
                track.stop();
            });
        }
    }

    function stopWindowStream() {
        if (window.stream) {
            window.stream.getTracks().forEach((track) => {
                track.stop();
            });
        }
    }

    function applyVideoConstraints() {
        if (!window.stream) return;

        const videoConstraints = {
            width: { ideal: WIDTH_CONSTRAINT },
            height: { ideal: HEIGHT_CONSTRAINT },
            frameRate: { ideal: FPS_CONSTRAINT },
        };

        window.stream
            .getVideoTracks()[0]
            .applyConstraints(videoConstraints)
            .catch((error) => {
                console.error('setVideoQuality', error);
                enqueueSnackbar('Error setting video quality', { variant: 'error' });
            });
    }

    return {
        // state
        audioDevices,
        videoDevices,
        isBroadcasting,
        numberConnectedPeers,

        // methods
        toggleBroadcast,
        selectedAudioDevice,
        selectedVideoDevice,
    };
};
