import { useRef } from 'react';

import { GetServerSideProps } from 'next'
import Head from 'next/head';

import { useViewer } from 'custom/hooks/live/useViewer';

import { getSocket } from 'utils/socketClient';
import { ModalActivarAudio } from 'custom/components';
import { IconButton } from '@mui/material';
import { VolumeUp, VolumeOff } from '@mui/icons-material';

interface Props {
  broadcastID: string;
  username: string;
  noAudio: boolean;
}

export default function Index({ broadcastID, username, noAudio }: Props) {
  const socket = getSocket();
  const videoRef = useRef<HTMLVideoElement>(null);

  const { isMuted, showDialogAudio, toggleAudio } = useViewer({
    videoRef,
    broadcastID,
    username,
    socket,
  });

  return (
    <>
      <Head><title>Viewer Video</title></Head>
      <div style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        backgroundColor: 'black',
        overflow: 'hidden',
      }}>
        {/* eslint-disable-next-line */}
        <video
          ref={videoRef}
          poster={`${process.env.NEXT_PUBLIC_URL_APP}/img/loader.gif`}
          style={{
            width: '100%',
            height: '100%',
          }}
        />

        <IconButton
          aria-label="delete"
          size="large"
          onClick={() => toggleAudio()}
          style={{
            position: 'absolute',
            top: 10,
            right: 20,
          }}
          color={!isMuted ? 'primary' : 'error'}
          sx={{ display: noAudio ? 'none' : 'block' }}
        >
          {
            !isMuted ? <VolumeUp fontSize="inherit" /> : <VolumeOff fontSize="inherit" />
          }
        </IconButton>
      </div >
      {
        showDialogAudio && !noAudio && <ModalActivarAudio toggle={toggleAudio} />
      }
    </>
  )
}



export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug } = query as { slug: string[] };
  let noAudio = false;
  console.log(slug.length);

  if (slug.length < 2) {
    return {
      notFound: true,
    }
  }

  if (slug[2] === "noaudio") {
    noAudio = true;
  }

  return {
    props: {
      broadcastID: slug[0],
      username: slug[1],
      noAudio,
    }
  }
}