import { Grid, useTheme } from '@mui/material'
import { LoteMonitor } from '@types'
import css from '../../styles/monitor.module.css';
import { CardInfo } from '.';
import moment from 'moment-timezone';
import { SliderAds } from './SliderAds';
import { imagenes } from '@prisma/client';

export const MainMonitor = ({ datos, banners }: { datos: LoteMonitor, banners: imagenes[] }) => {
    const theme = useTheme();

    const { lote, ultimaPuja } = datos;

    const cantidadAnimales = lote?.cantidad_animales || 0;
    const pesoTotal = Number(lote?.peso_total || 0);
    const pesoPromedio = pesoTotal / cantidadAnimales || 0;
    const tipoAnimales = lote?.tipo_animales || '';
    const cantidadAnimalesText = `${cantidadAnimales} ${tipoAnimales.toUpperCase()}`

    const valorBase = Number(lote?.puja_inicial) || 0;
    const valorPuja = Number(lote?.incremento) || 0;
    const valorFinal = Number(lote?.puja_final) || 0;
    const valorFinal2 = valorFinal + valorPuja;
    const valorFinalTotal = valorFinal * pesoTotal;

    return (
        <Grid container height="100%" width="100%">
            <Grid item xs={4} height="100%" bgcolor='rosybrown'>
                <SliderAds banners={banners} />
            </Grid>
            <Grid item xs={8} height="100%" className={css.container}>

                <CardInfo
                    title='#lote'
                    value={lote?.codigo_lote || ''}
                    className={css.lote}
                    bgColorCustom='#6bb73b'
                    fontSizeCustom='60px'
                />

                <CardInfo
                    title='Cantidad'
                    value={cantidadAnimalesText}
                    className={css.cantidad}
                    bgColorCustom='#6bb73b'
                    fontSizeCustom='60px'
                />

                <CardInfo
                    title='Procedencia'
                    value={lote?.procedencia || ''}
                    className={css.procedencia}
                    bgColorCustom='#6bb73b'
                    fontSizeCustom='35px'
                />

                <CardInfo
                    title='Peso prom (Lbs)'
                    value={pesoPromedio.toFixed(2)}
                    className={css.peso_prom}
                    bgColorCustom='#6bb73b'
                    fontSizeCustom='60px'
                />

                <CardInfo
                    title='Hora de pesaje'
                    value={moment(lote?.fecha_pesaje).format('HH:mm')}
                    className={css.hora_pesaje}
                    fontSizeCustom='60px'
                    bgColorCustom='#6bb73b'
                />

                <CardInfo
                    title='Incremento'
                    value={'$ ' + valorPuja.toFixed(2)}
                    className={css.puja}
                    bgColorCustom='#ebeb3d'
                    fontSizeCustom='60px'
                />

                <CardInfo
                    title='valor base'
                    value={'$ ' + valorBase.toFixed(2)}
                    className={css.valor_base}
                    fontSizeCustom='68px'
                    bgColorCustom='#ebeb3d'
                />

                <CardInfo
                    title='Valor Final'
                    value={'$' + valorFinal.toFixed(2)}
                    className={css.valor_final}
                    fontSizeCustom='68px'
                    bgColorCustom='#ef440c'
                    textColorCustom='#fff'
                />

                <CardInfo
                    title='Valor animal'
                    value={'$' + (pesoPromedio * valorFinal2).toFixed(2)}
                    className={css.valor_animal}
                    fontSizeCustom='68px'
                    bgColorCustom='#ebeb3d'
                />

                <CardInfo
                    title='Valor Total'
                    value={'$' + valorFinalTotal.toFixed(2)}
                    className={css.valor_total}
                    fontSizeCustom='68px'
                    bgColorCustom='#fabf25'
                />

                <CardInfo
                    title='Paleta'
                    value={ultimaPuja?.codigo_paleta || ''}
                    className={css.numero_paleta}
                    fontSizeCustom='80px'
                    bgColorCustom='#278ac6'
                    textColorCustom={theme.palette.secondary.contrastText}
                />

            </Grid>
        </Grid>
    )
}
