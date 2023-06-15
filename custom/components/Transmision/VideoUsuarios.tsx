/* eslint-disable no-undef */
import { useEffect, useState, useRef, useContext } from "react";
import { ModalTransmision } from "./ModalTransmision";
import { AuthContext } from 'src/auth';

export function TransmisionUsuarios(props: any) {
    const { ancho, alto, rol } = props
    const videoRef = useRef<HTMLVideoElement>(null);
    const [selectedAudioDevice] = useState("");
    const [selectedVideoDevice] = useState("");
    const [visualizarI, setVisualizarI] = useState("block");
    const [visualizarV, setVisualizarV] = useState("none");
    const [showModal, setShowModal] = useState(false);
    const { user } = useContext(AuthContext);
    var allRecordedBlobs: any = [];

    let verificar = false;
    useEffect(() => {
        if (!showModal) {
            // @ts-ignore
            const connection = new RTCMultiConnection();
            connection.iceServers = [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:stun1.l.google.com:19302",
                        "stun:stun2.l.google.com:19302",
                        "stun:stun.l.google.com:19302?transport=udp",
                    ],
                },
            ];
            connection.enableScalableBroadcast = true;
            connection.maxRelayLimitPerUser = 3;
            connection.autoCloseEntireSession = true;
            connection.socketURL = process.env.NEXT_PUBLIC_PORT_SOCKETS;
            connection.socketMessageEvent = "transmisiones";

            connection.connectSocket(function (socket: any) {

                socket.on("clienteTransmision", function () {
                    window.location.reload()
                });
                
                socket.emit("conectados", connection.userid, user?.usuarioid)

                socket.on("logs", function (log: any) {
                    //console.log(log);
                });

                socket.on("join-broadcaster", function (hintsToJoinBroadcast: any) {


                    connection.session = hintsToJoinBroadcast.typeOfStreams;
                    connection.sdpConstraints.mandatory = {
                        OfferToReceiveVideo: !!connection.session.video,
                        OfferToReceiveAudio: !!connection.session.audio,
                    };
                    connection.broadcastId = hintsToJoinBroadcast.broadcastId;
                    connection.join(hintsToJoinBroadcast.userid);
                });

                socket.on("rejoin-broadcast", function (broadcastId: any) {


                    connection.attachStreams = [];
                    socket.emit("check-broadcast-presence", broadcastId, function (
                        isBroadcastExists: any
                    ) {
                        if (!isBroadcastExists) {
                            connection.userid = broadcastId;
                        }

                        socket.emit("join-broadcast", {
                            broadcastId: broadcastId,
                            userid: connection.userid,
                            typeOfStreams: connection.session,
                        });
                    });
                });

                socket.on("broadcast-stopped", function () {
                    setVisualizarI("block")
                    setVisualizarV("none")
                    setShowModal(true);
                });

            })

            connection.onstream = function (event: any) {
                if (connection.isInitiator && event.type !== "local") {
                    return;
                }

                connection.isUpperUserLeft = false;

                if (videoRef.current) {
                    videoRef.current.srcObject = event.stream;
                    videoRef.current.dataset.userid = event.userId;
                    if (event.type === "local") {
                        videoRef.current.muted = true;
                    }
                    videoRef.current.play();
                }

                if (connection.isInitiator === false && event.type === "remote") {
                    connection.dontCaptureUserMedia = true;
                    connection.attachStreams = [event.stream];
                    connection.sdpConstraints.mandatory = {
                        OfferToReceiveAudio: false,
                        OfferToReceiveVideo: false,
                    };

                    connection.getSocket(function (socket: any) {
                        socket.emit("can-relay-broadcast");

                        if (connection.DetectRTC.browser.name === "Chrome") {
                            connection.getAllParticipants().forEach(function (p: any) {
                                if (p + "" !== event.userid + "") {
                                    var peer = connection.peers[p].peer;
                                    peer.getLocalStreams().forEach(function (localStream: any) {
                                        peer.removeStream(localStream);
                                    });
                                    event.stream.getTracks().forEach(function (track: any) {
                                        peer.addTrack(track, event.stream);
                                    });
                                    connection.dontAttachStream = true;
                                    connection.renegotiate(p);
                                    connection.dontAttachStream = false;
                                }
                            });
                        }

                        if (connection.DetectRTC.browser.name === "Firefox") {
                            connection.getAllParticipants().forEach(function (p: any) {
                                if (p + "" !== event.userid + "") {
                                    connection.replaceTrack(event.stream, p);
                                }
                            });
                        }


                    });
                }

                localStorage.setItem(connection.socketMessageEvent, connection.sessionid);
            };

            connection.onstreamended = function () { };

            connection.onleave = function (event: any) {
                if (videoRef.current) {
                    const currentVideo = videoRef.current;
                    if (event.userid !== currentVideo.dataset.userid) return;

                    connection.getSocket(function (socket: any) {
                        socket.emit("can-not-relay-broadcast");

                        connection.isUpperUserLeft = true;

                        if (allRecordedBlobs.length) {
                            var lastBlob = allRecordedBlobs[allRecordedBlobs.length - 1];
                            currentVideo.src = URL.createObjectURL(lastBlob);
                            currentVideo.play();


                            allRecordedBlobs = [];
                        } else if (connection.currentRecorder) {
                            var recorder = connection.currentRecorder;
                            connection.currentRecorder = null;
                            recorder.stopRecording(function () {
                                if (!connection.isUpperUserLeft) return;

                                currentVideo.src = URL.createObjectURL(recorder.getBlob());
                                currentVideo.play();
                            });
                        }

                        if (connection.currentRecorder) {
                            connection.currentRecorder.stopRecording();
                            connection.currentRecorder = null;
                        }
                    });
                }
            };


            if (localStorage.getItem(connection.socketMessageEvent)) {
                broadcastId = localStorage.getItem(connection.socketMessageEvent);
            } else {
                broadcastId = connection.token();
            }

            localStorage.setItem(connection.socketMessageEvent, "hola");

            var broadcastId: any = "hola";
            connection.extra.broadcastId = broadcastId;

            connection.session = {
                audio: true,
                video: true,
                oneway: true,
            };

            connection.mediaConstraints = {
                audio: {
                    mandatory: {},
                    optional: [
                        {
                            sourceId: selectedAudioDevice,
                        },
                    ],
                },
                video: {
                    mandatory: {},
                    optional: [
                        {
                            sourceId: selectedVideoDevice,
                        },
                    ],
                },
            };
            connection.getSocket(function (socket: any) {
                socket.emit("check-broadcast-presence", broadcastId, function (
                    isBroadcastExists: any
                ) {
                    verificar = isBroadcastExists;
                    if (verificar) {
                        setVisualizarI("none")
                        setVisualizarV("block")
                        socket.emit("join-broadcast", {
                            broadcastId: broadcastId,
                            userid: connection.userid,
                            typeOfStreams: connection.session,
                        });
                    } else {
                        setVisualizarI("block")
                        setVisualizarV("none")
                    }
                });
            });
            return () => {

                connection.closeSocket();

            }
        }

    }, [])

    return (
        <>

            <ModalTransmision open={showModal} rol={rol} />

            <img src='https://www.creativefabrica.com/wp-content/uploads/2020/07/06/Video-Camera-Icon-Graphics-4551757-1.jpg' width={ancho} height={alto} style={{ display: visualizarI }}></img>

            <video ref={videoRef} id="video-preview" width={ancho} height={alto} style={{ display: visualizarV }}  loop controls={true} ></video>

        </>
    );
}