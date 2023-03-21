import { Box, Button, Card, Stack } from '@mui/material'
import { CardInfo } from '../Monitor';

import css from '../../styles/cliente.module.css';

import { LoteMonitor } from '@types';
import { imagenes } from '@prisma/client';
import { calcularSubasta } from 'utils';
import { TabVideos } from './TabVideos';
import { VideoPlayer } from './VideoPlayer';

type Props = {
    loteActual: LoteMonitor
    banners: imagenes[]
}
export const VistaLoteCliente = ({ loteActual, banners }: Props) => {
    const { lote, ultimaPuja } = loteActual;
    const newLote = calcularSubasta(lote);

    return (
        <Box className={css.container} component='div' width='100%' height='calc(100vh - 120px)'>

            <Card className={css.banner}>
                banner
            </Card>

            <CardInfo
                title='Paleta'
                value={ultimaPuja?.codigo_paleta || ''}
                className={css.numero_paleta}
                bgColorCustom='#278ac6'
                textColorCustom='#fff'
            />

            <CardInfo
                title='#lote'
                value={''}
                className={css.lote}
                bgColorCustom='#6bb73b'
            />
            <CardInfo
                title='Cantidad'
                value={newLote.cantidadAnimalesText}
                className={css.cantidad}
                bgColorCustom='#6bb73b'
            />
            <CardInfo
                title='Procedencia'
                value={lote?.procedencia || ''}
                className={css.procedencia}
                bgColorCustom='#6bb73b'
                fontSizeCustom='30px'
            />
            <CardInfo
                title='Peso prom'
                value={newLote.pesoPromedio.toFixed(2) + 'LB'}
                className={css.peso_prom}
                bgColorCustom='#6bb73b'
            />
            <CardInfo
                title='Hora pesaje'
                value={newLote.horaPesaje}
                className={css.hora_pesaje}
                bgColorCustom='#6bb73b'
            />
            <CardInfo
                title='incremento'
                value={'$' + newLote.valorPuja.toFixed(2)}
                className={css.incremento}
                bgColorCustom='#ebeb3d'
            />
            <CardInfo
                title='valor base'
                value={'$' + newLote.valorBase.toFixed(2)}
                className={css.valor_base}
                bgColorCustom='#ebeb3d'
            />
            <CardInfo
                title='Valor final'
                value={'$' + newLote.valorFinal.toFixed(2)}
                className={css.valor_final}
                bgColorCustom='#ef440c'
                textColorCustom='#fff'
            />
            <CardInfo
                title='valor animal'
                value={'$' + (newLote.pesoPromedio * newLote.valorFinal).toFixed(2)}
                className={css.valor_animal}
                bgColorCustom='#ebeb3d'
            />
            <CardInfo
                title='valor total'
                value={'$' + (newLote.pesoTotal * newLote.valorFinal).toFixed(2)}
                className={css.valor_total}
                bgColorCustom='#fabf25'
            />
            <Card className={css.video_puja} >
                <Box className={css.video} >
                    <TabVideos
                        urlTransmisionEnVivo='https://www.youtube.com/watch?v=7sDY4m8KNLc'
                        urlVideoDemostracion='https://www.youtube.com/watch?v=7sDY4m8KNLc'
                    />
                </Box>
                <Box className={css.button} textAlign='center'>
                    <Button variant='contained' size='large'>Pujar</Button>
                </Box>
            </Card>
        </Box>
    )
}
