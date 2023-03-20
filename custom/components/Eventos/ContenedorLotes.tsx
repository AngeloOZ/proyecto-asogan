import { Typography } from "@mui/material"
import { Lote } from "@types"
import { ItemLote } from "./ItemLote"
import { useState } from "react"

type Props = {
    lotes: Lote[]
    isEventOpen: boolean
}

export const ContenedorLotes = ({ lotes, isEventOpen = false }: Props) => {

    const [expanded, setExpanded] = useState<number | false>(false);


    if (lotes.length === 0) {
        return <Typography my={2}>No hay lotes registrados</Typography>
    }

    return (
        <>
            {lotes.map((lote) => (
                <ItemLote 
                    key={lote.id_lote} 
                    lote={lote} 
                    expanded={expanded} 
                    setExpanded={setExpanded} 
                    isEventActive={isEventOpen}
                />
            ))}
        </>
    )
}
