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

  if (!play) return <Skeleton variant="rectangular" width="100%" height="100%" style={{ minHeight: "200px" }} />;

  return (
    <Box {...other} component="div" width="100%" height="100%">
      <ReactPlayer
        playing={play}
        width="100%"
        height="267px"
        onReady={() => setPlay(true)}
        style={{
          aspectRatio: "16/9",
        }}
        {...playerProps}
      />
    </Box>
  )
}
