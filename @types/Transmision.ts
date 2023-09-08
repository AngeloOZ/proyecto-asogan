import { Socket } from "socket.io-client";

export interface PeerConnectionMap {
    [id: string]: RTCPeerConnection;
}

export interface DataChannelMap {
    [id: string]: RTCDataChannel;
}


export interface ISelectedDevice {
    audio: string | undefined;
    video: string | undefined;
}

export interface IUseBroadcastProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    broadcastID: string;
    username?: string;
    peerConnections: PeerConnectionMap;
    dataChannels: DataChannelMap;
    socket: Socket
}
