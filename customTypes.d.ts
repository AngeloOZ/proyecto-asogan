export { };

declare global {
    interface Navigator {
        mediaDevices: {
            getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
        };
    }

    interface Window {
        stream?: MediaStream;
        deviceInfos?: MediaDeviceInfo[]
    }
}
