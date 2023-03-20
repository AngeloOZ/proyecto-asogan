import { Box, BoxProps } from "@mui/material"
import { imagenes } from "@prisma/client"
import { ImagenItem } from "."

interface Props extends BoxProps {
    imagenes: imagenes[]
}

export const ImagenList = ({ imagenes, ...other }: Props) => {
    return (
        <Box
            gap={2}
            display="grid"
            gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
            }}
            {...other}
        >
            {imagenes.map((imagen) => <ImagenItem key={imagen.id_imagen} imagenes={imagen} />)}
        </Box>
    )
}
