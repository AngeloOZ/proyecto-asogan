import React, { useEffect, useRef, useState, useContext } from 'react';
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
    const [visualizarI, setVisualizarI] = useState("block");
    const [visualizarV, setVisualizarV] = useState("none");
    const videoRef = useRef<HTMLVideoElement>(null);
    const servidor: any = process.env.NEXT_PUBLIC_PORT_SOCKETS

    useEffect(() => {
        const socket = io(servidor);
        let pc = new RTCPeerConnection(config);
        socket.on("offer", (id, description) => {

            if (pc.connectionState == "closed") {
                pc = new RTCPeerConnection(config);
            }
            if (pc.signalingState !== "closed") {

                pc.setRemoteDescription(description)
                    .then(() => {
                        if (pc.signalingState === "have-remote-offer" || pc.signalingState === "have-local-pranswer") {
                            return pc.createAnswer();
                        }
                    })
                    .then(sdp => pc.setLocalDescription(sdp))
                    .then(() => {
                        socket.emit("answer", id, pc.localDescription);
                    }).catch(error => {

                        console.error(error);
                    });;
                pc.ontrack = event => {
                    setVisualizarI("none")
                    setVisualizarV("block")
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

        socket.on("video2", () => {

            if (videoRef && videoRef.current) {
                videoRef.current.srcObject = null
            }
            setVisualizarI("block")
            setVisualizarV("none")
            if (pc) {
                pc.close();
                
            }
            window.location.reload()
        });

        return () => {
            if (pc) {
                pc.close();
            }
        };


    }, []);

   

    return (
        <>

            <video ref={videoRef} autoPlay muted={true} width={ancho} height={alto} controls={audio} style={{ display: visualizarV }} />

            <img src='https://www.creativefabrica.com/wp-content/uploads/2020/07/06/Video-Camera-Icon-Graphics-4551757-1.jpg' width={ancho} height={alto} style={{ display: visualizarI }} ></img>

        </>
    );
}
