import { useState } from "react";
import {
    Box,
    Card,
    Grid,
    Typography,
} from "@mui/material";

import { UltimaPuja } from "@types";
import { eventos, lotes } from '@prisma/client';

import { PujaMartillador, useLotesSubasta } from '../Subastas';
import { LoteAdminMartillador } from '../Subastas/LoteAdminMartillador';
import { SecondLoader } from '../SecondLoader';


import { InformacionLote, ListasdoPujas } from './';

type Props = {
    lote?: lotes,
    ultimaPuja?: UltimaPuja,
    evento: eventos
}

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
            <Box component='main' p={2}>
                <Box component='header' textAlign='center' mb={2}>
                    <Typography component='h1' variant="h4">{evento.descripcion}</Typography>
                    <Typography component='h2' variant="h5" mt={1} textTransform='capitalize'>{evento.lugar}</Typography>
                </Box>
                <Grid container height={430} spacing={1}>
                    <Grid item xs={12} md={6} height='100%'>
                        <InformacionLote lote={lote} />
                    </Grid>
                    <Grid item xs={12} md={3} height='100%'>
                        <Card sx={{ height: '100%', display: 'flex' }}>
                            {lote && <ListasdoPujas lote={lote} />}
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3} height='100%'>
                        <Card style={{ height: '100%' }} sx={{ p: 2 }}>
                            <LoteAdminMartillador evento={evento} loteActivo={lote} ultimaPuja={ultimaPuja} />
                        </Card>
                    </Grid>
                </Grid>
                <Box mt={1}>
                    <Card style={{ height: '100%' }}>
                        {(lote && evento.abierto === 2) && (
                            <PujaMartillador lote={lote!} ultimaPuja={ultimaPuja} setLoader={handleShowLoader} />
                        )}
                    </Card>
                </Box>
            </Box>
        </>
    );
};
