import { Grid, useTheme } from '@mui/material'
import { LoteMonitor } from '@types'
import css from '../../styles/monitor.module.css';
import { CardInfo } from '.';
import moment from 'moment-timezone';
import { SliderAds } from './SliderAds';

export const MainMonitor = ({ datos }: { datos: LoteMonitor }) => {
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
                <SliderAds />
            </Grid>
            <Grid item xs={8} height="100%" className={css.container}>

                <CardInfo
                    title='#lote'
                    value={lote?.codigo_lote || ''}
                    className={css.lote}
                />

                <CardInfo
                    title='Cantidad'
                    value={cantidadAnimalesText}
                    className={css.cantidad}
                />

                <CardInfo
                    title='Peso prom'
                    value={pesoPromedio.toFixed(2)+'Lb' }
                    className={css.peso_prom}
                />

                <CardInfo
                    title='Procedencia'
                    value={lote?.procedencia || ''}
                    className={css.procedencia}
                />

                <CardInfo
                    title='valor base'
                    value={'$ ' + valorBase.toFixed(2)}
                    className={css.valor_base}
                />

                <CardInfo
                    title='Puja'
                    value={'$ ' + valorPuja.toFixed(2)}
                    className={css.puja}
                />

                <CardInfo
                    title='Hora de pesaje'
                    value={moment(lote?.fecha_pesaje).format('HH:mm:ss')}
                    className={css.hora_pesaje}
                />

                <CardInfo
                    title='Valor Final'
                    value={'$' + valorFinal.toFixed(2)}
                    className={css.valor_final}
                />

                <CardInfo
                    title='Valor animal'
                    value={'$' + (pesoPromedio * valorFinal2).toFixed(2)}
                    className={css.valor_animal}
                />

                <CardInfo
                    title='Valor Total'
                    value={'$' + valorFinalTotal.toFixed(2)}
                    className={css.valor_total}
                />

                <CardInfo
                    title='Paleta'
                    value={ultimaPuja?.codigo_paleta || ''}
                    className={css.numero_paleta}
                    bgColorCustom={theme.palette.secondary.dark}
                    textColorCustom={theme.palette.secondary.contrastText}
                />

            </Grid>
        </Grid>
    )
}
