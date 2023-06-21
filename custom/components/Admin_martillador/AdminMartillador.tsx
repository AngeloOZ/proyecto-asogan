import { useState } from "react";
import {
    Box,
    Card,
    Grid,
    Typography,
} from "@mui/material";

import { UltimaPuja } from "@types";
import { eventos, lotes } from '@prisma/client';

import { PujaMartillador } from '../Subastas';
import { LoteAdminMartillador } from '../Subastas/LoteAdminMartillador';
import { SecondLoader } from '../SecondLoader';


import { InformacionLote, ListasdoPujas } from './';

type Props = {
    lote?: lotes,
    ultimaPuja?: UltimaPuja,
    evento: eventos
}

const HEIGHT_CARD = 440;
const HEIGHT_TITLE = 70;

export const AdminMartillador = ({ evento, lote, ultimaPuja }: Props) => {
    const [showLoader, setShowLoader] = useState(false);

    const handleShowLoader = (state: boolean = false) => {
        setShowLoader(state);
    }

    return (
        <>
            {
                showLoader && <SecondLoader />
            }
            <Box component='main' p={1.5} height='100vh'>
                <Box component='header' textAlign='center' mb={2} height={HEIGHT_TITLE}>
                    <Typography component='h1' variant="h4">{evento.descripcion}</Typography>
                    <Typography component='h2' variant="h5" mt={0} textTransform='capitalize'>{evento.lugar}</Typography>
                </Box>
                <Grid container spacing={1.5} height={`calc(100% - ${HEIGHT_TITLE}px)`} >
                    <Grid item xs={12} md={12} lg={6} maxHeight={HEIGHT_CARD}>
                        <InformacionLote lote={lote} />
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} maxHeight={HEIGHT_CARD}>
                        <Card sx={{ height: '100%', display: 'flex' }}>
                            {lote && <ListasdoPujas lote={lote} />}
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} maxHeight={HEIGHT_CARD}>
                        <Card style={{ height: '100%' }} sx={{ p: 2 }}>
                            <LoteAdminMartillador evento={evento} loteActivo={lote} ultimaPuja={ultimaPuja} />
                        </Card>
                    </Grid>
                    <Grid item xs={12} height={`calc(100% - ${HEIGHT_CARD}px)`}>
                        <Card style={{ height: '100%' }}>
                            {(lote && evento.abierto === 2) && (
                                <PujaMartillador lote={lote!} ultimaPuja={ultimaPuja} setLoader={handleShowLoader} />
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};
