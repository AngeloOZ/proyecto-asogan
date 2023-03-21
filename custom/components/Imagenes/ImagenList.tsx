import { Box, BoxProps, Skeleton, Typography } from "@mui/material"
import { imagenes } from "@prisma/client"
import { ImagenItem } from "."

interface Props extends BoxProps {
    imagenes: imagenes[],
    isLoading: boolean
}

export const ImagenList = ({ imagenes, isLoading }: Props) => {
    if (imagenes.length === 0 && !isLoading) {
        return (
            <Box width="100%" textAlign="center" style={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="h5" component="span">No hay imagenes disponibles</Typography>
            </Box>)
    }
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
        >
            {isLoading ?
                // Mostrar el skeleton si isLoading es verdadero
                <>
                    <Skeleton variant="rectangular" width="100%" height={350} animation="wave" />
                    <Skeleton variant="rectangular" width="100%" height={350} animation="wave" />
                    <Skeleton variant="rectangular" width="100%" height={350} animation="wave" />
                </>
                :
                imagenes.map((imagen) => <ImagenItem key={imagen.id_imagen} imagenes={imagen} />)}
        </Box >
    )

}
