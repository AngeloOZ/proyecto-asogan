import { Box, BoxProps, Skeleton, Typography } from "@mui/material"
import { EventoItem } from "."
import { LotesEventos } from "@types"

interface Props extends BoxProps {
    eventos: LotesEventos[],
    isLoading: boolean
}

export const EventoList = ({ eventos, isLoading }: Props) => {

    if (eventos.length === 0 && !isLoading) {
        return (
            <Box width="100%" textAlign="center" style={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="h5" component="span">No hay eventos disponibles</Typography>
            </Box>)
    }

    return (
        <Box
            gap={2}
            display="grid"
            gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
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
                // Mostrar la lista de eventos si isLoading es falso
                eventos.map((evento) => <EventoItem key={evento.id_evento} eventos={evento} />)
            }
        </Box>
    )
}
