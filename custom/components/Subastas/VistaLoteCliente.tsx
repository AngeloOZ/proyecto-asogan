import { useContext } from 'react';
import { Box, Button, Card, Typography } from '@mui/material'
import { useSWRConfig } from 'swr';
import { IoHandRight } from 'react-icons/io5';

import css from '../../styles/cliente.module.css';

import { useSnackbar } from 'src/components/snackbar';


import { UltimaPuja } from '@types';
import { eventos, imagenes, lotes } from '@prisma/client';

import { subastaAPI } from 'custom/api';
import { calcularSubasta, handleErrorsAxios } from 'utils';

import { TabVideos } from './TabVideos';
import { AuthContext } from 'src/auth';
import { CardInfo } from '../Monitor';
import { SliderAds } from '../Monitor/SliderAds';

type Props = {
    lote: lotes,
    ultimaPuja: UltimaPuja | null,
    banners: imagenes[]
    evento: eventos
}

export const VistaLoteCliente = ({ lote, ultimaPuja, banners, evento }: Props) => {
    const { enqueueSnackbar } = useSnackbar();
    const { mutate } = useSWRConfig();
    const { user } = useContext(AuthContext);

    const newLote = calcularSubasta(lote, ultimaPuja);

    let incremento = Number(lote?.puja_final || 0);

    if (ultimaPuja) {
        incremento = Number(ultimaPuja?.puja || 0);
    }
    incremento = incremento + Number(lote?.incremento || 0);

    const registrarPujaComprador = async () => {
        try {
            const body = {
                id_lote: lote!.id_lote,
                id_usuario: user?.usuarioid,
                codigo_paleta: user?.comprador?.codigo_paleta!,
                puja: incremento,
            }
            await subastaAPI.put('subastas/registrar/cliente', body);
            enqueueSnackbar('Oferta registrada', { variant: 'success' });
            mutate(`/lotes/${evento.id_evento}`)
            mutate(`/subastas/pujas?lote=${lote!.id_lote}`)
            mutate(`/subastas/lotes?id=${lote!.id_evento}`)
        } catch (error) {
            enqueueSnackbar(`Oops... ${handleErrorsAxios(error)}`, { variant: 'error' });
        }
    }

    return (
        <Box className={css.container} component='div' width='100%' height='calc(100vh - 120px)'>

            <Card className={css.banner}>
                <SliderAds banners={banners} />
            </Card>

            <CardInfo
                title='Paleta'
                value={ultimaPuja?.codigo_paleta || '-'}
                className={css.numero_paleta}
                bgColorCustom='#278ac6'
                textColorCustom='#fff'
                fontSizeTitleCustom='20px'
                fontSizeCustom='55px'
            />

            <CardInfo
                title='#lote'
                value={lote?.codigo_lote || '-'}
                className={css.lote}
                bgColorCustom='#6bb73b'
                fontSizeTitleCustom='20px'
                fontSizeCustom='50px'
            />
            <CardInfo
                title='Cantidad'
                value={newLote.cantidadAnimalesText}
                className={css.cantidad}
                bgColorCustom='#6bb73b'
                fontSizeTitleCustom='20px'
                fontSizeCustom='40px'
            />
            <CardInfo
                title='Procedencia'
                value={lote?.procedencia || '-'}
                className={css.procedencia}
                bgColorCustom='#6bb73b'
                fontSizeTitleCustom='20px'
                fontSizeCustom='30px'
            />
            <CardInfo
                title='Peso prom (lbs)'
                value={newLote.pesoPromedio.toFixed(2) + 'LB'}
                className={css.peso_prom}
                bgColorCustom='#6bb73b'
                fontSizeTitleCustom='20px'
                fontSizeCustom='45px'
            />
            <CardInfo
                title='Hora de pesaje'
                value={newLote.horaPesaje}
                className={css.hora_pesaje}
                bgColorCustom='#6bb73b'
                fontSizeTitleCustom='20px'
                fontSizeCustom='50px'
            />
            <CardInfo
                title='incremento'
                value={'$' + newLote.valorPuja}
                className={css.incremento}
                bgColorCustom='#ebeb3d'
                fontSizeTitleCustom='20px'
                fontSizeCustom='50px'
            />
            <CardInfo
                title='valor base'
                value={'$' + newLote.valorBase.toFixed(2)}
                className={css.valor_base}
                bgColorCustom='#ebeb3d'
                fontSizeTitleCustom='20px'
                fontSizeCustom='55px'
            />
            <CardInfo
                title='Puja actual'
                value={'$' + newLote.pujaActualText}
                className={css.valor_final}
                bgColorCustom='#ef440c'
                textColorCustom='#fff'
                fontSizeTitleCustom='20px'
                fontSizeCustom='55px'
            />
            <CardInfo
                title='valor promedio animal'
                value={'$' + (newLote.pesoPromedio * newLote.valorFinal).toFixed(2)}
                className={css.valor_animal}
                bgColorCustom='#ebeb3d'
                fontSizeTitleCustom='20px'
                fontSizeCustom='55px'
            />
            <CardInfo
                title='valor total'
                value={'$' + (newLote.pesoTotal * newLote.valorFinal).toFixed(2)}
                className={css.valor_total}
                bgColorCustom='#fabf25'
                fontSizeTitleCustom='20px'
                fontSizeCustom='55px'
            />
            <Card className={css.video_puja} >
                <Box height='100%' width='100%' style={{ height: '100%' }}>
                    <TabVideos
                        urlTransmisionEnVivo={evento.url_video || ''}
                        urlVideoDemostracion={lote?.url_video || ''}
                        height='100%'
                    />
                </Box>
            </Card>
            <Box className={css.button} textAlign='center'>
                <Button
                    variant='contained'
                    onClick={registrarPujaComprador}
                    color='primary'
                    style={{ width: '100%', height: '100%' }}
                    disabled={lote ? false : true}
                    size='large'
                    startIcon={<IoHandRight size={50} />}
                >
                    <Typography fontSize={55} variant='subtitle1'>Pujar</Typography>
                </Button>
            </Box>
        </Box>
    )
}
