import socket from "utils/sockets";
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
  const peerConnections: { [id: string]: RTCPeerConnection } = {};
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(dispositivos);
  }, []);

  useEffect(() => {
    getStream();
  }, [selectedAudioDevice, selectedVideoDevice]);

  //////////////////////////////////////////////////
  useEffect(() => {
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
        stream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, stream!));
      }

      peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate) {
          socket.emit("candidate", id, event.candidate);
        }
      };

      peerConnection
        .createOffer()
        .then((sdp) => peerConnection.setLocalDescription(sdp))
        .then(() => {
          socket.emit("offer", id, peerConnection.localDescription);
        });
    });

    socket.on("candidate", (id, candidate) => {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("disconnectPeer", (id) => {
      if (id) {
        peerConnections[id].close();
        delete peerConnections[id];
      }
    });
    const handleUnload = () => {
      socket.close();
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [socket]);
  //////////////////

  ////Terminar

  function terminarTransmision() {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream | null;

      if (stream instanceof MediaStream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      videoRef.current.srcObject = null;
    }

    for (const peerConnectionId in peerConnections) {
      peerConnections[peerConnectionId].close();
      delete peerConnections[peerConnectionId];
    }

    if (socket && socket.connected) {
      socket.disconnect();
    }
  }
  function generarNuevoId() {
    // Generar un ID único utilizando el timestamp actual
    return Date.now().toString();
  }
  function iniciarTransmision() {
    if (selectedAudioDevice && selectedVideoDevice) {
      if (socket.connected != true) {
        socket.connect();
        console.log('conectado')
      }

      const newPeerConnectionId = generarNuevoId();
      const newPeerConnection = new RTCPeerConnection();
      peerConnections[newPeerConnectionId] = newPeerConnection;
      socket.emit("broadcaster");
    } else {
      enqueueSnackbar("Escoja un dispositivo de Audio y Video", {
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
      <Stack direction="row" mt="20px" spacing={2}>
        <Button
          color="success"
          variant="contained"
          onClick={iniciarTransmision}
        >
          Iniciar Transmisión
        </Button>

        <Button color="error" variant="contained" onClick={terminarTransmision}>
          Terminar Transmisión
        </Button>
        <Button color="secondary" variant="contained" onClick={getStream}>
          Mostrar
        </Button>
      </Stack>
    </Box>
  );
}
