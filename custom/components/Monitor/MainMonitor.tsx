import { Grid, useTheme } from '@mui/material'
import css from '../../styles/monitor.module.css';
import { CardInfo } from '.';
import { SliderAds } from './SliderAds';
import { imagenes, lotes, eventos } from '@prisma/client';
import { UltimaPuja } from '@types';
import { calcularSubasta } from 'utils';

type Props = {
    lote?: lotes,
    ultimaPuja?: UltimaPuja,
    banners: imagenes[]
    evento: eventos
}
export const MainMonitor = ({ lote, ultimaPuja, banners }: Props) => {
    const theme = useTheme();
    const newLote = calcularSubasta(lote, ultimaPuja);

    return (
        <Grid container height="100%" width="100%">
            <Grid item xs={4} height="100%" bgcolor='rosybrown'>
                <SliderAds banners={banners} />
            </Grid>
            <Grid item xs={8} height="100%" className={css.container}>

                <CardInfo
                    title='#lote'
                    value={lote?.codigo_lote || '-'}
                    className={css.lote}
                    bgColorCustom='#6bb73b'
                    fontSizeCustom='60px'
                />

                <CardInfo
                    title='Cantidad'
                    value={newLote.cantidadAnimalesText}
                    className={css.cantidad}
                    bgColorCustom='#6bb73b'
                    fontSizeCustom='60px'
                />

                <CardInfo
                    title='Procedencia'
                    value={lote?.procedencia || '-'}
                    className={css.procedencia}
                    bgColorCustom='#6bb73b'
                    fontSizeCustom='35px'
                />

                <CardInfo
                    title='Peso prom (Lbs)'
                    value={newLote.pesoPromedio.toFixed(2)}
                    className={css.peso_prom}
                    bgColorCustom='#6bb73b'
                    fontSizeCustom='60px'
                />

                <CardInfo
                    title='Hora de pesaje'
                    value={newLote.horaPesaje}
                    className={css.hora_pesaje}
                    fontSizeCustom='60px'
                    bgColorCustom='#6bb73b'
                />

                <CardInfo
                    title='Incremento'
                    value={'$' + newLote.valorPuja}
                    className={css.puja}
                    bgColorCustom='#ebeb3d'
                    fontSizeCustom='60px'
                />

                <CardInfo
                    title='valor base'
                    value={'$' + newLote.valorBase.toFixed(2)}
                    className={css.valor_base}
                    fontSizeCustom='68px'
                    bgColorCustom='#ebeb3d'
                />

                <CardInfo
                    title='Puja Actual'
                    value={'$' + newLote.pujaActualText}
                    className={css.valor_final}
                    fontSizeCustom='68px'
                    bgColorCustom='#ef440c'
                    textColorCustom='#fff'
                />

                <CardInfo
                    title='Valor Promedio animal'
                    value={'$' + (newLote.pesoPromedio * newLote.valorFinal).toFixed(2)}
                    className={css.valor_animal}
                    fontSizeCustom='68px'
                    bgColorCustom='#ebeb3d'
                />

                <CardInfo
                    title='Valor Total'
                    value={'$' + (newLote.pesoTotal * newLote.valorFinal).toFixed(2)}
                    className={css.valor_total}
                    fontSizeCustom='68px'
                    bgColorCustom='#fabf25'
                />

                <CardInfo
                    title='Paleta'
                    value={ultimaPuja?.codigo_paleta || '-'}
                    className={css.numero_paleta}
                    fontSizeCustom='80px'
                    bgColorCustom='#278ac6'
                    textColorCustom={theme.palette.secondary.contrastText}
                />

            </Grid>
        </Grid>
    )
}
