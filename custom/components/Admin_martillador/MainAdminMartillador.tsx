import { Card, CardContent, Grid, Typography, useTheme } from '@mui/material'
import { LoteMonitor } from '@types'
import css from '../../styles/admin_martillador.module.css';
import { CardInfo } from '../Monitor';
import moment from 'moment-timezone';
import { Box } from '@mui/system';
import { ChatInput, PujaMartillador, useLotesSubasta, useSubastas, VideoPlayer } from '../Subastas';
import { LoteAdminMartillador } from '../Subastas/LoteAdminMartillador';
import { useState } from 'react';
import { lotes } from '@prisma/client'

export const MainAdminMartillador = ({ datos, uuid }: { datos: LoteMonitor, uuid: string }) => {
    const theme = useTheme();
    const { evento } = useSubastas(uuid);
    const { lotes } = useLotesSubasta(evento?.id_evento || -1);
    const [loteActual, setLoteActual] = useState<lotes>()
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
        <Grid height="100%" className={css.container}>

            <Box component="div" className={css.lote}>
                <Card sx={{ height: "100%", boxShadow: '0 0 4px rgba(0,0,0,0.3)' }}>
                    <CardContent component='div' style={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }} >
                        <Box component='div' width="100%" height="100%" style={{ backgroundColor: '#e7ebf0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <LoteAdminMartillador loteActual={loteActual} setLoteActual={setLoteActual} listadoLotes={lotes} />
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            <CardInfo
                title='#lote'
                value={lote?.codigo_lote || ''}
                className={css.codigo_lote}
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
                className={css.peso_promedio}
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
                className={css.incremento}
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
                title='Puja Actual'
                value={'$' + valorFinal.toFixed(2)}
                className={css.puja_actual}
                fontSizeCustom='68px'
                bgColorCustom='#ef440c'
                textColorCustom='#fff'
            />

            <CardInfo
                title='Valor Promedio animal'
                value={'$' + (pesoPromedio * valorFinal2).toFixed(2)}
                className={css.valor_promedio_animal}
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
                className={css.paleta}
                fontSizeCustom='80px'
                bgColorCustom='#278ac6'
                textColorCustom={theme.palette.secondary.contrastText}
            />

            <Box component="div" className={css.video}>
                <VideoPlayer
                    playerProps={{
                        url: evento?.url_video || '',
                        muted: true,
                    }}
                />
            </Box>

            <Box component="div" className={css.input}>
                <Card sx={{ height: "100%", boxShadow: '0 0 4px rgba(0,0,0,0.3)' }}>
                    <CardContent component='div' style={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }} >
                        <Box style={{ textAlign: 'center', padding: 5, borderBottom: "1px #dad8db dashed" }}>
                            <Typography
                                component='h3'
                                fontWeight='bold'
                                fontSize="28px"
                                textTransform='uppercase'
                            >
                                Puja
                            </Typography>
                        </Box>
                        <Box component='div' width="100%" height="100%" style={{ backgroundColor: '#e7ebf0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            {lote && (
                                <PujaMartillador lote={lote!} />
                            )
                            }
                        </Box>
                    </CardContent>
                </Card>
            </Box>


        </Grid>
    )
}
