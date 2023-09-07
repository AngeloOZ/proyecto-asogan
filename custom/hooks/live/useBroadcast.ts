import { useState, useEffect, ChangeEvent, useRef } from 'react';
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
    const isInitTransmision = useRef(false);
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

        window.addEventListener('unload', unloadHandler);
        window.addEventListener('beforeunload', unloadHandler);

        return () => {
            window.removeEventListener('unload', unloadHandler);
            window.removeEventListener('beforeunload', unloadHandler);
        }
    }, []);

    useEffect(() => {
        if (!isBroadcasting) {
            stopBroadcastStream();
            stopWindowStream();

            if (isInitTransmision.current) {
                window.location.reload();
            }

            return;
        };
        getStream();
    }, [isBroadcasting]);

    // ========================================================================================

    socket.on('answer', (id, description) => {
        peerConnections[id]
            .setRemoteDescription(description)
            .catch(handleError);
    });

    socket.on('viewer', (id, iceServers) => {
        if (peerConnections[id]) return;

        const peerConnection = new RTCPeerConnection({ iceServers: iceServers });
        peerConnections[id] = peerConnection;
        handleDataChannels(id);
        setNumberconnectedPeers(Object.keys(peerConnections).length);

        peerConnection.onconnectionstatechange = (event) => {
            console.log('RTCPeerConnection', {
                socketId: id,
                // @ts-ignore
                connectionStatus: event.currentTarget.connectionState,
                // @ts-ignore
                signalingState: event.currentTarget.signalingState,
            });
        };

        const stream = videoRef.current?.srcObject as MediaStream;

        stream.getTracks()
            .forEach((track) => peerConnection.addTrack(track, stream));

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) socket.emit('candidate', id, event.candidate);
        };

        peerConnection
            .createOffer()
            .then((sdp) => peerConnection.setLocalDescription(sdp))
            .then(() => socket.emit('offer', id, peerConnection.localDescription))
            .catch(handleError);
    });

    socket.on('candidate', (id, candidate) => {
        if (!peerConnections[id]) return;

        peerConnections[id]
            .addIceCandidate(new RTCIceCandidate(candidate)).catch(handleError);
    });

    socket.on('disconnectPeer', (id) => {
        if (peerConnections[id]) return;
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

        dataChannels[id].onopen = (event: any) => {
            console.log('DataChannels open', event);
            sendToViewersDataChannel('video', { visibility: '' });
        };

        dataChannels[id].onclose = (event: any) => {
            console.log('DataChannels close', event);
        };

        dataChannels[id].onerror = (event: any) => {
            console.log('DataChannel error', event);
        };

        peerConnections[id].ondatachannel = (event: any) => {
            event.channel.onmessage = (message: any) => {
                console.log('onmessage', message);
                let data = {};
                try {
                    data = JSON.parse(message.data);
                } catch (err) {
                    handleError(err);
                }
            };
        };
    }

    function sendToViewersDataChannel(method: any, action = {}, peerId = '*') {
        for (let id in dataChannels) {
            if (id == socket.id) continue; // bypass myself

            if (peerId != '*') {
                sendTo(peerId); // send to specified viewer
                break;
            } else {
                sendTo(id); // send to all connected viewers
            }
        }
        function sendTo(id: any) {
            if (dataChannels[id].readyState !== 'open')
                return console.log('DataChannel not ready', id);

            dataChannels[id].send(
                JSON.stringify({
                    method: method,
                    action: action,
                }),
            );
        }
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

            enqueueSnackbar('Dispositivos cargados correctamente', { variant: 'success' });
        } catch (error) {
            handleError(error);
            enqueueSnackbar('No se pudo obtener dispositivos, puede ser devido a permisos', { variant: 'error' });
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

        if (!isBroadcasting) {
            isInitTransmision.current = false;
        }
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
            isInitTransmision.current = true;
        } catch (error) {
            handleError(error);
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
                handleError(error);
                enqueueSnackbar('Error setting video quality', { variant: 'error' });
            });
    }

    function handleError(error: any) {
        console.clear();
        console.log('Error', error);
        //popupMessage('warning', 'Ops', error);
    }

    function thereIsPeerConnections() {
        return Object.keys(peerConnections).length === 0 ? false : true;
    }

    const unloadHandler = () => {
        socket.close();
        if (thereIsPeerConnections()) {
            for (let id in peerConnections) {
                peerConnections[id].close();
            }
            peerConnections = {};
            dataChannels = {};
        }
    };

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
