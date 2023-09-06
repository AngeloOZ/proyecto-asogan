
import { useBroadcast } from 'custom/hooks/live/useBroadcast';
import Head from 'next/head';
import { useEffect, useRef } from 'react';
import { getSocket } from 'utils/socketClient';

interface PeerConnectionMap {
    [id: string]: RTCPeerConnection;
}

interface DataChannelMap {
    [id: string]: RTCDataChannel;
}


export default function Index() {
    const socket = getSocket();
    const videoRef = useRef<HTMLVideoElement>(null);
    let peerConnections: PeerConnectionMap = {};
    let dataChannels: DataChannelMap = {};

    const {
        isBroadcasting,
        toggleBroadcast,
        audioDevices,
        videoDevices,
        selectedAudioDevice,
        selectedVideoDevice,
        numberConnectedPeers
    } = useBroadcast({ videoRef, broadcastID: '123', peerConnections, dataChannels, socket });

    return <>
        <Head><title>Live Video</title></Head>
        <h1>Live Video</h1>
        <h2>Numero de visitantes {numberConnectedPeers}</h2>
        <div>
            <video ref={videoRef} width={300} height={200}></video>
            {/* 
            <div className="video-off">
                <img className="video-off" src={`/img/videoOff.png`} />
            </div> */}
        </div>
        <label htmlFor="">Dispositivos video</label>
        <select name="" id="" onChange={selectedVideoDevice}>
            <option value="" selected disabled>Seleccione un dispositivo</option>
            {
                videoDevices.map((device, index) => <option key={device.deviceId} value={device.deviceId} >Video: {device.label}</option>)
            }
        </select>

        <br /><br />

        <label htmlFor="">Dispositivos audio</label>
        <select name="" id="" onChange={selectedAudioDevice}>
            <option value="" selected disabled>Seleccione un dispositivo</option>
            {
                audioDevices.map((device, index) => <option key={device.deviceId} value={device.deviceId} >Audio: {device.label}</option>)
            }
        </select>

        <br /><br /><br />
        <button onClick={toggleBroadcast}>
            {
                isBroadcasting ? 'Detener' : 'Iniciar'
            }
        </button>
        <div className="broadcast-quality-fps">
            <select id="videoQualitySelect">
                <option value="default">Default</option>
                <option value="qvga">QVGA</option>
                <option value="vga">VGA</option>
                <option value="hd">HD</option>
                <option value="fhd">FULL HD</option>
                <option value="2k">2K</option>
                <option value="4k">4K</option>
            </select>
            <select id="videoFpsSelect">
                <option value="default">Default</option>
                <option value="60">60 fps</option>
                <option value="30">30 fps</option>
                <option value="25">25 fps</option>
                <option value="20">20 fps</option>
                <option value="15">15 fps</option>
                <option value="10">10 fps</option>
                <option value="5">5 fps</option>
            </select>
        </div>


        {/*<div id="broadcastForm" className="broadcast center fadeIn">
            <div id="broadcastFormHeader" className="broadcast-header not-selectable">
                <div className="broadcast-info">
                    <i className="fas fa-user"></i> <span id="myName">Broadcaster</span> <i className="fas fa-eye"></i
                    ><span id="connectedPeers">0</span> <i className="fas fa-clock"></i> <span id="sessionTime">0s</span>
                </div>
                <div className="broadcast-header-buttons">
                    <button id="goHome"><i className="fas fa-times"></i></button>
                </div>
            </div>
            <div className="container">
                <video className="not-selectable" poster="../assets/images/loader.gif"></video>
                <div className="video-off">
                    <img id="videoOff" className="video-off" src="../assets/images/videoOff.png" />
                </div>
            </div>
            <label id="recordingLabel" className="pulse">🔴 REC: <span id="recordingTime">0S</span></label>
            <div className="broadcast-buttons">
                <button id="settingsBtn"><i className="fa-solid fa-sliders"></i></button>
                <button id="fullScreenOn"><i className="fas fa-expand-alt"></i></button>
                <button id="fullScreenOff"><i className="fas fa-compress-alt"></i></button>
                <button id="togglePIP"><i className="fas fa-images"></i></button>
                <button id="viewersOpenForm"><i className="fas fa-eye"></i></button>
                <button id="messagesOpenForm"><i className="fas fa-message"></i></button>
                <button id="recordingStart"><i className="fas fa-record-vinyl"></i></button>
                <button id="recordingStop" className="color-red"><i className="fas fa-record-vinyl"></i></button>
                <button id="screenShareStart"><i className="fas fa-display"></i></button>
                <button id="screenShareStop"><i className="fa-solid fa-circle-stop"></i></button>
                <button id="videoBtn"><i className="fas fa-video"></i></button>
                <button id="shareRoom"><i className="fas fa-share-alt"></i></button>
                <button id="copyRoom"><i className="fas fa-copy"></i></button>
            </div>
            <div id="broadcasterSettingsForm" className="animate__animated animate__fadeInUp">
                <label className="not-selectable"><i className="fas fa-video"></i> Video source:</label>
                <select id="videoSelect"></select>
                <label className="not-selectable"><i className="fas fa-photo-film"></i> Video quality and fps:</label>
                <div className="broadcast-quality-fps">
                    <select id="videoQualitySelect">
                        <option value="default">Default</option>
                        <option value="qvga">QVGA</option>
                        <option value="vga">VGA</option>
                        <option value="hd">HD</option>
                        <option value="fhd">FULL HD</option>
                        <option value="2k">2K</option>
                        <option value="4k">4K</option>
                    </select>
                    <select id="videoFpsSelect">
                        <option value="default">Default</option>
                        <option value="60">60 fps</option>
                        <option value="30">30 fps</option>
                        <option value="25">25 fps</option>
                        <option value="20">20 fps</option>
                        <option value="15">15 fps</option>
                        <option value="10">10 fps</option>
                        <option value="5">5 fps</option>
                    </select>
                </div>
                <label className="not-selectable"><i className="fas fa-microphone"></i> Audio source:</label>
                <select id="audioSelect"></select>
            </div>
        </div> */}

    </>
}
