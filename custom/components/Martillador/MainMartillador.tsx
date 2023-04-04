import { Card, CardContent, Grid, Typography, useTheme } from '@mui/material'
import { LoteMonitor } from '@types'
import css from '../../styles/martillador.module.css';
import { CardInfo } from '../Monitor';
import moment from 'moment-timezone';
import { useSubastas, VideoPlayer } from '../Subastas';
import { Box } from '@mui/system';
import { PujasRequest } from "@types";
import { subastaAPI } from "custom/api";
import useSWR from "swr";
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { eventos, lotes } from '@prisma/client';
import { UltimaPuja } from '@types';
import { calcularSubasta } from 'utils';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),

    color: theme.palette.text.secondary,
}));

const fetcher = (url: string) => subastaAPI.get(url).then(r => r.data)

type Props = {
    lote: lotes,
    ultimaPuja: UltimaPuja | null,
    evento: eventos,
}

export const MainMartillador = ({ lote, ultimaPuja, evento }: Props) => {

    const { data } = useSWR(`/subastas/pujas?lote=${lote?.id_lote}`, fetcher, { refreshInterval: 1500 }) as { data: PujasRequest };
    const newLote = calcularSubasta(lote, ultimaPuja);

    const proxValorAnimal = newLote.pesoPromedio * newLote.valorFinal2;
    const proxValorTotal = proxValorAnimal * newLote.cantidadAnimales;

    return (
        <Grid item height="100%" className={css.container}>
            <CardInfo
                title='#lote'
                value={lote?.codigo_lote || '-'}
                className={css.lote}
                bgColorCustom='#6bb73b'
                fontSizeTitleCustom='20px'
                fontSizeCustom='60px'
            />
            <CardInfo
                title='Cantidad'
                fontSizeTitleCustom='20px'
                value={newLote.cantidadAnimalesText}
                className={css.cantidad}
                bgColorCustom='#6bb73b'
                fontSizeCustom='60px'
            />
            <CardInfo
                title='Procedencia'
                fontSizeTitleCustom='20px'
                value={lote?.procedencia || '-'}
                className={css.procedencia}
                bgColorCustom='#6bb73b'
                fontSizeCustom='25px'
            />
            <CardInfo
                title='Nombre'
                fontSizeTitleCustom='20px'
                value={ultimaPuja?.usuario?.nombres || '-'}
                className={css.nombre}
                bgColorCustom='#278ac6'
                fontSizeCustom='25px'
            />
            <CardInfo
                title='Paleta'
                fontSizeTitleCustom='20px'
                value={ultimaPuja?.codigo_paleta || '-'}
                className={css.numero_paleta}
                bgColorCustom='#278ac6'
                fontSizeCustom='80px'
                textColorCustom="#fff"
            />

            <Box component="div" className={css.video}>
                <VideoPlayer
                    playerProps={{
                        url: evento?.url_video || '',
                        muted: true,
                    }}
                />
            </Box>

            <CardInfo
                title='Peso Prom (Lbs)'
                fontSizeTitleCustom='20px'
                value={newLote.pesoPromedio.toFixed(2)}
                className={css.peso_promedio}
                bgColorCustom='#6bb73b'
            />
            <CardInfo
                title='Hora Pesaje'
                fontSizeTitleCustom='20px'
                value={newLote.horaPesaje}
                className={css.hora_pesaje}
                bgColorCustom='#6bb73b'
            />
            <CardInfo
                title='Incremento'
                fontSizeTitleCustom='20px'
                value={'$' + newLote.valorPuja}
                className={css.incremento}
                bgColorCustom='#ebeb3d'
                fontSizeCustom='50px'
            />
            <CardInfo
                title='Valor base'
                fontSizeTitleCustom='20px'
                value={'$' + newLote.valorBase.toFixed(2)}
                className={css.valor_base}
                bgColorCustom='#ebeb3d'
                fontSizeCustom='50px'
            />
            <CardInfo
                title='Puja Actual'
                fontSizeTitleCustom='20px'
                value={'$' + newLote.pujaActualText}
                className={css.valor_final}
                bgColorCustom='#ef440c'
                textColorCustom='#fff'
                fontSizeCustom='50px'
            />
            <CardInfo
                title='Proxima Puja'
                fontSizeTitleCustom='20px'
                value={'$ ' + newLote.valorFinal2.toFixed(2)}
                className={css.proxima_puja}
                bgColorCustom='#fabf25'
                fontSizeCustom='50px'
            />
            <CardInfo
                title='Observaciones'
                fontSizeTitleCustom='20px'
                value={lote?.observaciones || 'S/N'}
                className={css.observaciones}
                bgColorCustom='#e7ebf0'
                fontSizeCustom='25px'
            />
            <CardInfo
                title='Valor Promedio Animal'
                fontSizeTitleCustom='20px'
                value={'$' + (newLote.pesoPromedio * newLote.valorFinal).toFixed(2)}
                className={css.valor_por_animal}
                bgColorCustom='#ef440c'
                textColorCustom='#fff'
                fontSizeCustom='50px'
            />
            <CardInfo
                title='Proximo Valor Promedio Animal'
                fontSizeTitleCustom='20px'
                value={'$' + (proxValorAnimal).toFixed(2)}
                className={css.proximo_valor_por_animal}
                bgColorCustom='#fabf25'
                fontSizeCustom='50px'
            />
            <Box component="div" className={css.pujas_realizadas}>
                <Card sx={{ height: "100%", boxShadow: '0 0 4px rgba(0,0,0,0.3)' }}>
                    <CardContent component='div' style={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }} >
                        <Box style={{ textAlign: 'center', padding: 5, borderBottom: "1px #dad8db dashed" }}>
                            <Typography
                                component='h3'
                                fontWeight='bold'
                                fontSize="20px"
                                textTransform='uppercase'
                            >
                                Pujas Realizadas
                            </Typography>
                        </Box>
                        <Box component='div' width="100%" height="100%" style={{ backgroundColor: '#e7ebf0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            {data && data.mejoresPujas && data.mejoresPujas.length > 0 ? (
                                <Stack spacing={0.5}>
                                    {data.mejoresPujas.map((puja) => (
                                        <Item key={puja.id_puja} sx={{ fontSize: '11px' }}>
                                            <strong >PALETA:</strong> {puja.codigo_paleta} <br />
                                            <strong>USUARIO:</strong> {puja?.usuario?.nombres}<br />
                                            <strong>VALOR:</strong> {'$' + parseFloat(puja.puja).toFixed(2)}
                                        </Item>
                                    ))}

                                </Stack>
                            ) : (
                                <div>No hay datos de pujas disponibles.</div>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            <CardInfo
                title='Valor Total'
                fontSizeTitleCustom='20px'
                value={'$' + (newLote.pesoTotal * newLote.valorFinal).toFixed(2)}
                className={css.valor_total}
                bgColorCustom='#ef440c'
                textColorCustom='#fff'
                fontSizeCustom='50px'
            />
            <CardInfo
                title='Proximo Valor Total'
                fontSizeTitleCustom='20px'
                value={'$' + proxValorTotal.toFixed(2)}
                className={css.proximo_valor_total}
                bgColorCustom='#fabf25'
                fontSizeCustom='50px'
            />
        </Grid >
    )
}

