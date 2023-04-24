import { Box, Card, CardContent, Grid, Typography, useTheme } from '@mui/material'

import { UltimaPuja } from '@types'
import { eventos, lotes } from '@prisma/client'

import css from '../../styles/admin_martillador.module.css';

import { calcularSubasta } from 'utils';

import { CardInfo } from '../Monitor';
import { PujaMartillador, useLotesSubasta, VideoPlayer } from '../Subastas';
import { LoteAdminMartillador } from '../Subastas/LoteAdminMartillador';
import { SecondLoader } from '../SecondLoader';
import { useState } from 'react';

type Props = {
    lote?: lotes,
    ultimaPuja?: UltimaPuja,
    evento: eventos
}

export const MainAdminMartillador = ({ evento, lote, ultimaPuja }: Props) => {
    const [showLoader, setShowLoader] = useState(false);

    const theme = useTheme();
    const { lotes } = useLotesSubasta(evento.id_evento);
    const newLote = calcularSubasta(lote, ultimaPuja);

    const handleShowLoader = (state: boolean = false) => {
        setShowLoader(state);
    }

    return (
        <Grid height="100%" className={css.container}>
            <Box component="div" className={css.lote}>
                <Card sx={{ height: "100%", p: 2 }}>
                    <Box component='div' width="100%" height="100%" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <LoteAdminMartillador listadoLotes={lotes} loteEnSubasta={lote} />
                    </Box>
                </Card>
            </Box>

            {
                showLoader && <SecondLoader />
            }

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
                            {(lote && evento.abierto === 2) && (
                                <PujaMartillador lote={lote!} ultimaPuja={ultimaPuja} setLoader={handleShowLoader} />
                            )
                            }
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
                value={newLote.cantidadAnimalesText}
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
                value={newLote.pesoPromedio.toFixed(2)}
                className={css.peso_promedio}
                bgColorCustom='#6bb73b'
                fontSizeCustom='60px'
                fontSizeTitleCustom='25px'
            />

            <CardInfo
                title='Hora de pesaje'
                value={newLote.horaPesaje}
                className={css.hora_pesaje}
                fontSizeCustom='60px'
                bgColorCustom='#6bb73b'
                fontSizeTitleCustom='25px'
            />

            <CardInfo
                title='Incremento'
                value={'$ ' + newLote.valorPuja}
                className={css.incremento}
                bgColorCustom='#ebeb3d'
                fontSizeCustom='60px'
                fontSizeTitleCustom='25px'
            />

            <CardInfo
                title='valor base'
                value={'$ ' + newLote.valorBase.toFixed(2)}
                className={css.valor_base}
                fontSizeCustom='68px'
                bgColorCustom='#ebeb3d'
            />

            <CardInfo
                title='Puja Actual'
                value={'$' + newLote.pujaActualText}
                className={css.puja_actual}
                fontSizeCustom='68px'
                bgColorCustom='#ef440c'
                textColorCustom='#fff'
            />

            <CardInfo
                title='Valor Promedio animal'
                value={'$' + (newLote.pesoPromedio * newLote.valorFinal).toFixed(2)}
                className={css.valor_promedio_animal}
                fontSizeCustom='68px'
                bgColorCustom='#ebeb3d'
            />

            <CardInfo
                title='Valor Total'
                value={'$' + newLote.valorFinalTotal.toFixed(2)}
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
                        url: evento.url_video || '',
                        muted: true,
                    }}
                />
            </Box>
        </Grid>
    )
}
