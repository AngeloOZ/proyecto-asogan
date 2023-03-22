import { Box, BoxProps, Skeleton } from "@mui/material"
import { useEffect, useState } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";


interface VideoPlayerProps extends BoxProps {
  // other?: BoxProps
  playerProps?: ReactPlayerProps
}
export const VideoPlayer = ({ playerProps, ...other }: VideoPlayerProps) => {
  const [play, setPlay] = useState(false)

  useEffect(() => {
    setPlay(true);
  }, [play])

  if (!play) return <Skeleton variant="rectangular" width="100%" height="100%" style={{ minHeight: "200px", height: '100%' }} />;

  return (
    <Box {...other}
      component="div"
      width="100%"
      height="100%"
      style={{
        position: "relative",
      }}
    >
      <ReactPlayer
        playing={play}
        width="100%"
        height="100%"
        onReady={() => setPlay(true)}
        style={{
          aspectRatio: "16/9",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        {...playerProps}
      />
    </Box>
  )
}
