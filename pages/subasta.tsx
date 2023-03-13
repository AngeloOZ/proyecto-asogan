import { LoteItem, useObtenerLotesActivos } from 'custom/components'
import React from 'react'

const subasta = () => {
    const { lotes, isLoading } = useObtenerLotesActivos();
    return (
        <div>
            {
                isLoading ? <div>Cargando lote</div> :
                    <LoteItem lote={lotes} disabledButton />
            }
        </div>
    )
}

export default subasta