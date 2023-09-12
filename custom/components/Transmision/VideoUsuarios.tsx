import { CardMedia } from "@mui/material";

interface Props {
    ancho: number | string;
    alto: number | string;
    uuid: string;
    username: string;
    audio?: 'noaudio' | ''
}

export function TransmisionUsuarios({ alto, ancho, username, uuid, audio = '' }: Props) {
    const url = `${process.env.NEXT_PUBLIC_URL_APP}video/${uuid}/${encodeURIComponent(username)}/${audio}`
    return (
        <div style={{
            width: ancho,
            height: alto,
            backgroundColor: '#191919',
        }}>
            <CardMedia
                component="iframe"
                src={url}
                width="100%"
                height="100%"
                loading="lazy"
            />
        </div>

    );
}