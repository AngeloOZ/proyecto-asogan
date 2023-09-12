import { set } from 'lodash';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';


interface IUseViewerProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    broadcastID: string;
    username: string;
    socket: Socket
}

export const useViewer = ({ videoRef, broadcastID, username, socket }: IUseViewerProps) => {
    const [showDialogAudio, setShowDialogAudio] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    let peerConnection: RTCPeerConnection;
    let dataChannel: RTCDataChannel;

    useEffect(() => {
        window.addEventListener('unload', unloadHandler);
        window.addEventListener('beforeunload', unloadHandler);

        return () => {
            window.removeEventListener('unload', unloadHandler);
            window.removeEventListener('beforeunload', unloadHandler);
        }
    }, []);

    socket.on('offer', (id, description, iceServers) => {
        try {

            peerConnection = new RTCPeerConnection({ iceServers: iceServers });

            handleDataChannel();

            peerConnection.onconnectionstatechange = (event) => { };

            peerConnection
                .setRemoteDescription(description)
                .then(() => peerConnection.createAnswer())
                .then((sdp) => peerConnection.setLocalDescription(sdp))
                .then(() => socket.emit('answer', id, peerConnection.localDescription))
                .catch(handleError);

            peerConnection.ontrack = (event) => {
                attachStream(event.streams[0]);
                if (event.track.kind === 'audio') {
                    setShowDialogAudio(true);
                }
            };

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) socket.emit('candidate', id, event.candidate);
            };
        }
        catch (err) {

        }
    });

    socket.on('candidate', (id, candidate) => {
        if (!peerConnection) return;
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch(handleError);
    });

    socket.on('connect', () => {
        socket.emit('viewer', broadcastID, username);
    });

    socket.on('broadcaster', () => {
        socket.emit('viewer', broadcastID, username);
    });

    socket.on('broadcasterDisconnect', () => {
        console.log('broadcasterDisconnect');

        if (typeof window !== 'undefined' && window.location) {
            window.location.reload();
        } else {
            console.log('broadcasterDisconnect but not reload');
        }
    });


    function handleError(error: any) {
        console.log('Error', error);
        //popupMessage('warning', 'Ops', error);
    }

    // =====================================================
    // Handle RTC Data Channel
    // =====================================================

    function handleDataChannel() {
        if (!peerConnection) return;
        dataChannel = peerConnection.createDataChannel('mt_bro_dc');
        dataChannel.binaryType = 'arraybuffer'; // blob

        dataChannel.onopen = (event) => { };

        dataChannel.onclose = (event) => { };

        dataChannel.onerror = (event) => { };

        peerConnection.ondatachannel = (event) => {
            event.channel.onmessage = (message) => {
                let data = {};
                try {
                    data = JSON.parse(message.data);
                    handleDataChannelMessage(data);
                    console.log('Incoming dc data', data);
                } catch (err) {
                    console.log('Datachannel error', err);
                }
            };
        };
    }

    function handleDataChannelMessage(data: any) {
        switch (data.method) {
            case 'disconnect':
                openURL('/');
                break;
            default:
                console.error('Data channel message not handled', data);
                break;
        }
    }

    function attachStream(stream: MediaStream) {
        const video = videoRef.current;

        if (!video) return;

        video.srcObject = stream;
        video.playsInline = true;
        video.autoplay = true;
        video.muted = true;
        video.controls = false;
    }

    const unloadHandler = () => {
        socket.close();
        if (peerConnection) {
            peerConnection.close();
        }
    };

    const toggleAudio = (state?: boolean) => {
        if (!videoRef.current) return;

        if (showDialogAudio) setShowDialogAudio(false);

        if (state === undefined) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
            return;
        }
        videoRef.current.muted = state;
        setIsMuted(state);
    };

    return { showDialogAudio, toggleAudio, isMuted }
}


function openURL(url: string, blank = false) {
    blank ? window.open(url, '_blank') : (window.location.href = url);
}