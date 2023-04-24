import ReactPlayer from "react-player";
import css from "../../styles/martillador.module.css";
import { Box } from "@mui/material";

export const TransmisionSubasta = () => {
  return (
    <Box component="div" className={css.video}>
      
        <ReactPlayer url='https://www.youtube.com/watch?v=Y5aLsxblY90'  width='100%'
        height='500px'/>
      
   
    </Box>
  );
};
