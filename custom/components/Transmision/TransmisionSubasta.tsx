/* eslint-disable no-undef */
import { useState, useRef, useEffect } from "react";
import { Box, Stack, Button, Grid, MenuItem, FormControl, InputLabel, Select } from "@mui/material";

import { UsuariosConectados } from "./UsuariosConectados";
import { subastaAPI } from 'custom/api'
import { useBroadcast } from "custom/hooks/live";
import { getSocket } from "utils/socketClient";
import { DataChannelMap, PeerConnectionMap } from "@types";

interface Props {
  uuid: string;
  descripcion: string;
}

export function TransmisionSubasta({ uuid }: Props) {
  const [contador, setContador] = useState(0);
  const [conectados, setConectados] = useState<any[]>([]);

  const socket = getSocket();
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionsRef = useRef<PeerConnectionMap>({});
  const dataChannelsRef = useRef<DataChannelMap>({});

  const {
    isBroadcasting,
    toggleBroadcast,
    audioDevices,
    videoDevices,
    selectedDevices,
    changeAudioDevice,
    changeVideoDevice,
    numberConnectedPeers
  } = useBroadcast({
    videoRef,
    broadcastID: uuid,
    peerConnections: peerConnectionsRef.current,
    dataChannels: dataChannelsRef.current,
    socket
  });

  useEffect(() => {
    if (!isBroadcasting) return;
    // TODO: revisar
    const handleBeforeunload = (event: BeforeUnloadEvent) => {
      if (isBroadcasting) return;
      event.preventDefault();
      event.returnValue = '¿Estás seguro de que quieres salir?';
    };

    window.addEventListener('beforeunload', handleBeforeunload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeunload);
    }

  }, [isBroadcasting]);

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <UsuariosConectados data={conectados} cantidad={numberConnectedPeers} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box component="div">
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Listado de dispositivos de video</InputLabel>
                <Select
                  value={selectedDevices.video || ''}
                  label="Listado de dispositivos de video"
                  onChange={changeVideoDevice}
                  disabled={isBroadcasting}
                >
                  <MenuItem value='' disabled>Seleccione un dispositivo</MenuItem>
                  {
                    videoDevices.map((device, index) => <MenuItem key={device.deviceId} value={device.deviceId} >Video: {device.label}</MenuItem>)
                  }
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Listado de dispositivos de audio</InputLabel>
                <Select
                  value={selectedDevices.audio || ''}
                  label="Listado de dispositivos de audio"
                  onChange={changeAudioDevice}
                  disabled={isBroadcasting}
                >
                  <MenuItem value='' disabled>Seleccione un dispositivo</MenuItem>
                  {
                    audioDevices.map((device, index) => <MenuItem key={device.deviceId} value={device.deviceId} >Audio: {device.label}</MenuItem>)
                  }
                </Select>
              </FormControl>
            </Stack>

            {
              isBroadcasting &&
              <Stack
                component='div'
                justifyContent='center'
                width='100%'
                height='350px'
                marginTop={2}
                style={{ backgroundColor: '#222' }}>
                <video
                  poster={`${process.env.NEXT_PUBLIC_URL_APP}/img/loader.gif`}
                  ref={videoRef}
                  style={{ maxHeight: '100%', width: "100%" }}
                />
              </Stack>
            }

            <Stack
              direction="row-reverse"
              spacing={2}
              justifyContent="center"
              marginTop={2}
            >
              <Button
                color="success"
                variant="contained"
                disabled={isBroadcasting}
                onClick={toggleBroadcast}
              >
                Iniciar Transmisión
              </Button>
              <Button
                color="error"
                variant="contained"
                disabled={!isBroadcasting}
                onClick={toggleBroadcast}
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