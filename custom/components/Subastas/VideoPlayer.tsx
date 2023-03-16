import { Box, BoxProps, Skeleton } from "@mui/material"
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";


interface VideoPlayerProps extends BoxProps {
  // other?: BoxProps
}
export const VideoPlayer = ({ ...other }: VideoPlayerProps) => {
  const [play, setPlay] = useState(false)

  useEffect(() => {
    setPlay(true);
  }, [play])

  if (!play) return <Skeleton variant="rectangular" width="100%" height="100%" style={{ minHeight: "200px" }} />;

  return (
    <Box {...other} component="div" width="100%" height="100%">
      <ReactPlayer
        url="https://youtu.be/P_SYwtp1BJs"
        playing={play}
        width="100%"
        muted
        onReady={() => setPlay(true)}
        style={{
          aspectRatio: "16/9",
        }}
      />
    </Box>
  )
}
