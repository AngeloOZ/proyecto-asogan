/* eslint-disable no-undef */
import { useEffect, useState, useRef } from "react";
import { Box, Stack, Button, Grid } from "@mui/material";
import { useSnackbar } from "../../../src/components/snackbar";
import { UsuariosConectados } from "./UsuariosConectados";
import { subastaAPI } from 'custom/api'

export function TransmisionSubasta() {
  const { enqueueSnackbar } = useSnackbar();
  const [contador, setContador] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const botonRef = useRef<HTMLButtonElement>(null);

  var allRecordedBlobs: any = [];
  var broadcastId = "";
  let verificar = false;
  const [dispositivoAudio, setdispositivoAudio] = useState<MediaDeviceInfo[]>(
    []
  );
  const [dispositivoVideo, setdispositivoVideo] = useState<MediaDeviceInfo[]>(
    []
  );
  const [selectedAudioDevice, setSelectedDispositivoAudio] = useState("");
  const [selectedVideoDevice, setSelectedDispositivoVideo] = useState("");
  const [botonIniciar, setBotonIniciar] = useState(false);
  const [botonFinalizar, setBotonFinalizar] = useState(true);
  const [conectados, setConectados] = useState<any[]>([]);

  const cambiarAudio = (event: any) => {
    setSelectedDispositivoAudio(event.target.value);
  };

  const cambiarVideo = (event: any) => {
    setSelectedDispositivoVideo(event.target.value);
  };

  useEffect(() => {

  }, [selectedAudioDevice, selectedVideoDevice, conectados]);


  useEffect(() => {

    navigator.mediaDevices.getUserMedia({audio:true, video:true});
    navigator.mediaDevices.enumerateDevices().then(dispositivos);
    

  }, []);

  const dispositivos = (devices: MediaDeviceInfo[]) => {


    const updatedAudioDevices = [...dispositivoAudio];

    devices.forEach((device) => {
      if (device.kind === "audioinput") {
        if (!updatedAudioDevices.find((d) => d.deviceId === device.deviceId)) {
          updatedAudioDevices.push(device);
        }
      } else if (device.kind === "videoinput") {
        if (!dispositivoVideo.find((d) => d.deviceId === device.deviceId)) {
          dispositivoVideo.push(device);
        }
      }
    });

    setdispositivoAudio(updatedAudioDevices);
    setdispositivoVideo(dispositivoVideo);
  };
  const botonClick = () => {

    if (selectedAudioDevice && selectedVideoDevice) {
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
      connection.maxRelayLimitPerUser = 2;
      connection.autoCloseEntireSession = true;
      connection.socketURL = process.env.NEXT_PUBLIC_PORT_SOCKETS;
      connection.socketMessageEvent = "transmisiones";
      connection.connectSocket(function (socket: any) {

        socket.on("logs", function (log: any) {
          // console.log(log);
        });

        socket.on("conectadosTransmision", async function (
          conectadoid: string,
          usuarioid: string
        ) {
          if (conectadoid && Number(usuarioid) > 0 ) {
            await fetch(
              `/api/compradores/conectados?usuarioid=${usuarioid}&conectado=1&conexionid=${conectadoid}`,
              { method: "PUT" }
            );
          }

          const respuesta = await subastaAPI.get(`/compradores/conectados`);
          const usuariosCon = respuesta.data
          setConectados(usuariosCon)
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

        socket.on("start-broadcasting", function (typeOfStreams: any) {

          connection.sdpConstraints.mandatory = {
            OfferToReceiveVideo: false,
            OfferToReceiveAudio: false,
          };
          connection.session = typeOfStreams;

          connection.open(connection.userid);
          setBotonIniciar(true)
          setBotonFinalizar(false)
        });
      });

      connection.onstream = function (event: any) {
        if (connection.isInitiator && event.type !== "local") {
          return;
        }

        connection.isUpperUserLeft = false;

        if (videoRef.current) {
          videoRef.current.srcObject = event.stream;
          videoRef.current.play();
          videoRef.current.dataset.userid = event.userId;
          if (event.type === "local") {
            videoRef.current.muted = true;
          }
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

      connection.onNumberOfBroadcastViewersUpdated = function (event: any) {
        if (!connection.isInitiator) return;

        setContador(event.numberOfBroadcastViewers);


      };

      connection.onUserStatusChanged = async function (event: any) {
        if (event.status == "offline") {

          await fetch(
            `/api/compradores/conectados?usuarioid=0&conectado=0&conexionid=${event.userid}`,
            { method: "PUT" }
          );

          const respuesta = await subastaAPI.get(`/compradores/conectados`);
          const usuariosCon = respuesta.data
          setConectados(usuariosCon)
        }
      };

      var broadcastId: any = "hola";
      connection.extra.broadcastId = broadcastId;

      connection.session = {
        audio: true,
        video: true,
        oneway: true,
      };

      connection.mediaConstraints = {
        audio: {
          deviceId: selectedAudioDevice,
        
        },
        video: {
          deviceId: selectedVideoDevice,
         
        },
      };
      connection.getSocket(function (socket: any) {
        socket.emit("check-broadcast-presence", broadcastId, function (
          isBroadcastExists: any
        ) {
          verificar = isBroadcastExists;
          if (!isBroadcastExists) {

            connection.userid = broadcastId;
            verificar = true;
            socket.emit("cliente");

          }
          if (verificar) {
            socket.emit("join-broadcast", {
              broadcastId: broadcastId,
              userid: connection.userid,
              typeOfStreams: connection.session,
            });
          }
        });
      });
    } else {
      enqueueSnackbar("Escoja un dispositivo de Audio y Video para iniciar la Transmisión", {
        variant: "error",
      });
    }


  };

  const cerrarTrans = async () => {

    await fetch(
      `/api/compradores/conectados?usuarioid=0&conectado=0`,
      { method: "PUT" }
    );
    window.location.reload()
  }
  return (
    <>
      <Grid container spacing={1} padding="60px">
        <Grid item xs={12} sm={5}>
          <UsuariosConectados data={conectados} cantidad={contador} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box component="div" mx="auto">
            <Stack>
              <label>Dispositivos de Audio: </label>

              <select
                id="audioSource"
                onChange={cambiarAudio}
                style={{ width: "100%", height: "40px" }}
                disabled={botonIniciar}
              >
                <option value="">Escoja un Audio</option>
                {dispositivoAudio.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || ""}
                  </option>
                ))}
              </select>
            </Stack>

            <Stack style={{ marginTop: "10px" }}>
              <label>Dipositivos de Video: </label>

              <select
                id="videoSource"
                onChange={cambiarVideo}
                style={{ width: "100%", height: "35px" }}
                disabled={botonIniciar}
              >
                <option value="">Escoja un Video</option>
                {dispositivoVideo.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || ""}
                  </option>
                ))}
              </select>
            </Stack>
            <video
              ref={videoRef}
              id="video-preview"
              width="100%"
              height="350px"
              style={{ marginTop: "35px" }}
              controls={false}
              loop
            ></video>

            <Stack
              direction="row"
              mt="20px"
              spacing={2}
              justifyContent="center"
            >
              <Button
                ref={botonRef}
                id="open-or-join"
                color="success"
                variant="contained"
                onClick={botonClick}
                disabled={botonIniciar}
              >
                Iniciar Transmisión
              </Button>
              <Button
                color="error"
                variant="contained"
                onClick={cerrarTrans}
                disabled={botonFinalizar}
              >
                Cerrar Transmisión
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}