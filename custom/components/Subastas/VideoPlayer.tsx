import { Box, BoxProps } from "@mui/material"


interface VideoPlayerProps extends BoxProps {
  // other?: BoxProps
}
export const VideoPlayer = ({ ...other }: VideoPlayerProps) => {
  return (
    <Box {...other} component="div" style={{ backgroundColor: "royalblue" }} width="100%" height="100%" >VideoPlayer</Box>
  )
}
