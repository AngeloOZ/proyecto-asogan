import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const config = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302',
        },
        // { 
        //   "urls": "turn:TURN_IP?transport=tcp",
        //   "username": "TURN_USERNAME",
        //   "credential": "TURN_CREDENTIALS"
        // }
    ],
};

export function TransmisionUsuarios(props: any) {
    const { ancho, alto, audio } = props
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const socket = io('http://localhost:3000');
        let pc = new RTCPeerConnection(config);
        socket.on("offer", (id, description) => {

            if (pc.connectionState == "closed") {
                pc = new RTCPeerConnection(config);
            }
            if (pc.signalingState !== "closed") {

                pc.setRemoteDescription(description)
                    .then(() => pc.createAnswer())
                    .then(sdp => pc.setLocalDescription(sdp))
                    .then(() => {
                        socket.emit("answer", id, pc.localDescription);
                    });
                pc.ontrack = event => {
                    if (videoRef && videoRef.current) {
                        videoRef.current.srcObject = event.streams[0];
                    }
                };
                pc.onicecandidate = event => {
                    if (event.candidate) {
                        socket.emit("candidate", id, event.candidate);
                    }
                };
            }
        });
        socket.on("candidate", (id, candidate) => {
            if (pc) {
                console.log('entroo')
                if (pc.signalingState !== "closed") {

                    pc.addIceCandidate(new RTCIceCandidate(candidate))
                        .catch(e => console.error(e));
                }
            }
        });


        socket.on("broadcaster", () => {
            socket.emit("watcher");

        });
        socket.on("connect", () => {
            socket.emit("watcher");

        });


        return () => {
            if (pc) {
                pc.close();
            }

        };
    }, []);


    return (
        <>
            <video ref={videoRef} autoPlay muted={true} width={ancho} height={alto} controls={audio} />

        </>
    );
}
