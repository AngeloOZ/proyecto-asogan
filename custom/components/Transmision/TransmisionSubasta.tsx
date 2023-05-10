import socket from 'utils/sockets';
import css from "../../styles/martillador.module.css";
import { Box, Stack, MenuItem, Select, Button } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useSnackbar } from "../../../src/components/snackbar";
import io from 'socket.io-client';

const config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
    // {
    //   "urls": "turn:TURN_IP?transport=tcp",
    //   "username": "TURN_USERNAME",
    //   "credential": "TURN_CREDENTIALS"
    // }
  ],
};

export function TransmisionSubasta() {
  const [dispositivoAudio, setdispositivoAudio] = useState<MediaDeviceInfo[]>(
    []
  );
  const [dispositivoVideo, setdispositivoVideo] = useState<MediaDeviceInfo[]>(
    []
  );
  const [selectedAudioDevice, setSelectedDispositivoAudio] = useState<
    string | null
  >("");
  const [selectedVideoDevice, setSelectedDispositivoVideo] = useState<
    string | null
  >("");
  const [stream, setStream] = useState(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  let peerConnections: { [id: string]: RTCPeerConnection } = {};
  const { enqueueSnackbar } = useSnackbar();
  const [botonIniciar, setBotonIniciar] = useState(false);
  const [botonTerminar, setBotonTerminar] = useState(true);

  useEffect(() => {
    const pedirPermisos = async () => {
      try {
     

        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        navigator.mediaDevices.enumerateDevices().then(dispositivos);
      } catch (error) {
        console.error('Error al solicitar permisos:', error);
      }
    };
  
    pedirPermisos();

  }, []);

  useEffect(() => {
    getStream();
  }, [selectedAudioDevice, selectedVideoDevice]);

  //////////////////////////////////////////////////

  useEffect(() => {

    socket.connect();

    socket.on("answer", (id, description) => {
      peerConnections[id].setRemoteDescription(description);
    });

    socket.on("watcher", (id: string) => {

      const peerConnection = new RTCPeerConnection(config);
      peerConnections[id] = peerConnection;

      let stream: MediaStream | null = null;
      if (videoRef.current) {
        stream = videoRef.current.srcObject as MediaStream;
      }

      if (stream != null) {
        const existingTracks = peerConnection.getSenders().map((sender) => sender.track);
        stream.getTracks().forEach((track) => {
          if (!existingTracks.includes(track)) {
            peerConnection.addTrack(track, stream!);
          }
        });
      }

      peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {

        if (event.candidate) {

          socket.emit("candidate", id, event.candidate);
        }
      };

      if (peerConnection.signalingState !== "closed") {

        peerConnection.createOffer()
          .then((sdp) => peerConnection.setLocalDescription(sdp))
          .then(() => {
            socket.emit("offer", id, peerConnection.localDescription);
          });
      }
    });

    socket.on("candidate", (id, candidate) => {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("disconnectPeer", (id) => {

      if (id) {
        if (peerConnections[id]) {

          peerConnections[id].close();
          delete peerConnections[id];
        }
      }
    });

    const handleUnload = () => {
      socket.close();
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  ////Terminar

  function terminarTransmision() {
    
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream | null;
      if (stream instanceof MediaStream) {
        stream.getTracks().forEach((track) => {
          track.stop();
          stream.removeTrack(track);
        });
      }
      videoRef.current.srcObject = null;
    }
    socket.emit("video")
    socket.emit("disconnectPeer")

    if (socket && socket.connected) {
      socket.close();
    }
    peerConnections = {};
    window.location.reload()
  }

  function generarNuevoId() {

    return Date.now().toString();
  }

  function iniciarTransmision() {
    
    const videoElement = videoRef.current;
    if (selectedAudioDevice && selectedVideoDevice && videoElement?.srcObject != null) {
      if (socket.connected != true) {
        socket.connect();
   
      }

      const newPeerConnectionId = generarNuevoId();
      const newPeerConnection = new RTCPeerConnection(config);
      peerConnections[newPeerConnectionId] = newPeerConnection;
      socket.emit("broadcaster");
  
      setBotonIniciar(true)
      setBotonTerminar(false)
    } else {
      enqueueSnackbar("Escoja un dispositivo de Audio y Video hasta que se previsualice", {
        variant: "error",
      });
    }

  }

  ///////////////////////////////Microfono y Camara
  const dispositivos = (devices: MediaDeviceInfo[]) => {
    const updatedAudioDevices = [...dispositivoAudio]; // Crear una copia del array existente

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

    /*  setSelectedDispositivoAudio(
      dispositivoAudio.length ? dispositivoAudio[0].deviceId : null
    );
    setSelectedDispositivoVideo(
      dispositivoVideo.length ? dispositivoVideo[0].deviceId : null
    ); */

   
  };

  const getStream = () => {
    if (selectedAudioDevice != "" && selectedVideoDevice != "") {
      const constraints = {
        audio: {
          deviceId: selectedAudioDevice
            ? { exact: selectedAudioDevice }
            : undefined,
        },
        video: {
          deviceId: selectedVideoDevice
            ? { exact: selectedVideoDevice }
            : undefined,
        },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(gotStream)
        .catch(handleError);
    } else {
      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement.srcObject = null;
      }
    }
  };

  const gotStream = (stream: any) => {
    const videoElement = videoRef.current;
    setSelectedDispositivoAudio(selectedAudioDevice || null);
    setSelectedDispositivoVideo(selectedVideoDevice || null);
    setStream(stream);
    if (videoElement) {
      videoElement.srcObject = stream;
    }
  };

  const handleError = (error: any) => {
    console.error(error);
  };

  const cambiarAudio = (event: any) => {
    setSelectedDispositivoAudio(event.target.value);
  };

  const cambiarVideo = (event: any) => {
    setSelectedDispositivoVideo(event.target.value);
  };

  return (
    <Box component="div" className={css.video} mx="auto">
      <Stack>
        <label>Dispositivos de Audio: </label>
        {dispositivoAudio.length > 0 ? (
          <select
            id="audioSource"
            value={selectedAudioDevice || ""}
            onChange={cambiarAudio}
            style={{ width: "100%", height: "40px" }}
          >
            <option value="">Escoja un Audio</option>
            {dispositivoAudio.map((device: any) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || ""}
              </option>
            ))}
          </select>
        ) : (
          <p>Cargando dispositivos...</p>
        )}
      </Stack>

      <Stack style={{ marginTop: "10px" }}>
        <label>Dipositivos de Video: </label>

        <select
          id="videoSource"
          onChange={cambiarVideo}
          style={{ width: "100%", height: "35px" }}
        >
          <option value="">Escoja un Video</option>
          {dispositivoVideo.map((device: any) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || ""}
            </option>
          ))}
        </select>
      </Stack>

      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        width="100%"
        height="350px"
        style={{ marginTop: "35px" }}
      ></video>
      <Stack direction="row" mt="20px" spacing={2} mx="17%">
        <Button
          color="success"
          variant="contained"
          onClick={iniciarTransmision}
          disabled={botonIniciar}
        >
          Iniciar Transmisión
        </Button>

        <Button color="error" variant="contained" onClick={terminarTransmision} disabled={botonTerminar} >
          Terminar Transmisión
        </Button>
        <Button color="secondary" variant="contained" onClick={getStream} >
          Mostrar
        </Button>
      </Stack>
    </Box>
  );
}
