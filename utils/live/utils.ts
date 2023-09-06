export const isMobileDevice = isMobile();
export const isTabletDevice = isTablet();
export const isIPadDevice = isIpad();
export const isDesktopDevice = isDesktop();

export const broadcastID = new URLSearchParams(window.location.search).get('id');
export const username = new URLSearchParams(window.location.search).get('name');
export const roomURL = window.location.origin + '/home?id=' + broadcastID;


export function popupMessage(icon: string, title: string, message: string, position = 'center', timer = 3000) {

}

export function popupEnableAudio() {

}


export function openURL(url: string, blank = false) {
    blank ? window.open(url, '_blank') : (window.location.href = url);
}

export function elementDisplay(element: any, display: any, mode = 'block') {
    element.style.display = display ? mode : 'none';
}

export function elementDisable(element: any, disable: any) {
    element.disabled = disable;
}

export function elementSetColor(elem: any, color: any) {
    elem.style.color = color;
}

export function getTime() {
    const date = new Date();
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}

export function getDataTimeString() {
    const d = new Date();
    const date = d.toISOString().split('T')[0];
    const time = d.toTimeString().split(' ')[0];
    return `${date}-${time}`;
}

export function secondsToHms(d: number) {
    d = Number(d);
    let h = Math.floor(d / 3600);
    let m = Math.floor((d % 3600) / 60);
    let s = Math.floor((d % 3600) % 60);
    let hDisplay = h > 0 ? h + 'h' : '';
    let mDisplay = m > 0 ? m + 'm' : '';
    let sDisplay = s > 0 ? s + 's' : '';
    return hDisplay + ' ' + mDisplay + ' ' + sDisplay;
}

export function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export function isPIPSupported() {
    return !isMobile() && document.pictureInPictureEnabled;
}

export function isMobile() {
    const userAgent = navigator.userAgent || '';
    return !!/Android|webOS|iPhone|iPad|iPod|BB10|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(userAgent || '');
}

export function isTablet() {
    const userAgent = navigator.userAgent || '';

    return /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
        userAgent,
    );
}

export function isIpad() {
    const userAgent = navigator.userAgent || '';

    return /macintosh/.test(userAgent) && 'ontouchend' in document;
}

export function isDesktop() {
    return !isMobileDevice && !isTabletDevice && !isIPadDevice;
}

export function getUUID4(): string {
    return ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    ) as string;
}

export function hasAudioTrack(mediaStream: MediaStream) {
    const audioTracks = mediaStream.getAudioTracks();
    return audioTracks.length > 0;
}

export function hasVideoTrack(mediaStream: MediaStream) {
    const videoTracks = mediaStream.getVideoTracks();
    return videoTracks.length > 0;
}

export function saveDataToFile(dataURL: string, fileName: string) {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = dataURL;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(dataURL);
    }, 100);
}

export function saveAllMessages(messages: any[]) {
    const fileName = getDataTimeString() + '-messages.txt';
    let a = document.createElement('a');
    a.style.display = 'none';
    a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(messages, null, 1));
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    playSound('download');
}

export function saveAllViewers(messages: any[]) {
    const fileName = getDataTimeString() + '-viewers.txt';
    let a = document.createElement('a');
    a.style.display = 'none';
    a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(messages, null, 1));
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    playSound('download');
}

export function copyRoomURL() {
    const tmpInput = document.createElement('input');
    document.body.appendChild(tmpInput);
    tmpInput.style.display = 'none';
    tmpInput.value = roomURL;
    tmpInput.select();
    tmpInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(tmpInput.value).then(() => {
        document.body.removeChild(tmpInput);
        // TODO: popupMessage
        popupMessage('toast', 'Invite viewer', 'Viewer invite link copied', 'top', 2000);
    });
}

export function shareRoomQR() {
    popupMessage(
        'clean',
        'Invite viewers',
        `<div class="qrRoomContainer">
            <canvas id="qrRoom"></canvas>
        </div>
        <p>No need for apps, simply capture the QR code with your mobile camera Or Invite viewers to join your live broadcast by sending them the following URL</p>
        <p style="color:#2196f3;">${roomURL}</p>`,
    );
    // makeRoomQR();
}

// export function makeRoomQR() {
//     let qr = new QRious({
//         element: document.getElementById('qrRoom'),
//         value: roomURL,
//     });
//     qr.set({
//         size: 256,
//     });
// }

export async function shareRoomNavigator() {
    try {
        await navigator.share({ url: roomURL });
    } catch (err) {
        console.error('[Error] navigator share', err);
    }
}

export function isFullScreenSupported() {
    return (
        document.fullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.msFullscreenEnabled
    );
}

export function isFullScreen() {
    const elementFullScreen =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement ||
        null;
    if (elementFullScreen === null) return false;
    return true;
}

export function togglePictureInPicture(element: any) {
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
    } else if (document.pictureInPictureEnabled) {
        element.requestPictureInPicture().catch((error: any) => {
            console.error('Failed to enter Picture-in-Picture mode', error);
        });
    }
}

export function goInFullscreen(element: any) {
    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.msRequestFullscreen) element.msRequestFullscreen();
    else popupMessage('info', 'Full screen', 'Full screen mode not supported by this browser on this device.');
}

export function goOutFullscreen() {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
}

export function logStreamSettingsInfo() {
    const stream = window.stream;
    let streamInfo = [];
    if (stream.getVideoTracks()[0]) {
        streamInfo.push({
            video: {
                label: stream.getVideoTracks()[0].label,
                settings: stream.getVideoTracks()[0].getSettings(),
            },
        });
    }
    if (stream.getAudioTracks()[0]) {
        streamInfo.push({
            audio: {
                label: stream.getAudioTracks()[0].label,
                settings: stream.getAudioTracks()[0].getSettings(),
            },
        });
    }
    console.log('StreamInfo', streamInfo);
}

export async function playSound(name: string) {
    const sound = '../assets/sounds/' + name + '.mp3';
    const audioToPlay = new Audio(sound);
    try {
        audioToPlay.volume = 0.5;
        await audioToPlay.play();
    } catch (e) {
        return false;
    }
}

export const broadcastSettings = {
    buttons: {
        copyRoom: true,
        shareRoom: true,
        screenShareStart: true,
        recordingStart: true,
        messagesOpenForm: true,
        viewersOpenForm: true,
        fullScreenOn: true,
        pictureInPicture: true,
    },
};

export const viewerSettings = {
    buttons: {
        snapshot: true,
        recordingStart: true,
        fullScreenOn: true,
        message: true,
        pictureInPicture: true,
    },
};
