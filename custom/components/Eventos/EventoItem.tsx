import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Card, CardContent, Typography, Box, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';

import { LotesEventos } from '@types';

import { PATH_DASHBOARD, PATH_DASHBOARD_CLEINTE } from 'src/routes/paths'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AuthContext } from 'src/auth';
import { ContenedorLotes } from './ContenedorLotes';
import moment from 'moment-timezone';

type Props = {
	eventos: LotesEventos;
}


export const EventoItem = ({ eventos }: Props) => {
	const { rol: [rolLogged] } = useContext(AuthContext)

	const renderEstado = () => {
		switch (eventos.abierto) {
			case 1:
				return <Typography variant="subtitle2" color="royalblue" component="span">Cerrado</Typography>
			case 2:
				return <Typography variant="subtitle2" color="green" component="span">Abierto</Typography>
			case 3:
				return <Typography variant="subtitle2" color="red" component="span">Finalizado</Typography>
			default:
				return <Typography variant="subtitle2" color="red" component="span">S/N</Typography>
		}
	}

	return (
		<>
			<Card>
				<CardContent>
					<TableContainer>
						<Table size="small">
							<TableBody>
								<TableRow>
									<TableCell colSpan={2} align="center">
										<Typography variant="h5" >{eventos.descripcion}</Typography>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<Typography variant="body2" fontWeight="bold" component="span">Fecha: </Typography>
									</TableCell>
									<TableCell>
										<Typography variant="body2" component="span">{eventos.fecha ? moment(eventos.fecha).format('DD/MM/YYYY') : 'Fecha no disponible'}</Typography>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<Typography variant="body2" fontWeight="bold" component="span">Lugar: </Typography>
									</TableCell>
									<TableCell>
										<Typography variant="body2" component="span">{eventos.lugar}</Typography>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<Typography variant="body2" fontWeight="bold" component="span">Tipo: </Typography>
									</TableCell>
									<TableCell>
										<Typography variant="body2" component="span">{eventos.tipo}</Typography>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>
										<Typography variant="body2" fontWeight="bold" component="span">Estado: </Typography>
									</TableCell>
									<TableCell>
										{renderEstado()}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>

					<Divider sx={{ marginTop: 1 }} />

					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography variant='subtitle1' fontSize={18}>Listado de lotes</Typography>
						</AccordionSummary>
						<AccordionDetails sx={{ p: 0 }}>
							<ContenedorLotes lotes={eventos.lotes} isEventOpen={eventos.abierto === 1 ? true : false} />
						</AccordionDetails>
					</Accordion>

					{
						eventos.abierto === 1 && (rolLogged === 'comprador') && (
							<Link href={`${PATH_DASHBOARD_CLEINTE.subastas}/otra/${eventos.uuid}`} passHref legacyBehavior>
								<a target='_blank' style={{ textDecoration: 'none' }}>
									<Button
										fullWidth
										color="primary"
										variant='contained'
										size="medium"
									>
										Ver
									</Button>
								</a>
							</Link>
						)
					}

					{
						(rolLogged === 'admin' || rolLogged === 'admin-martillador') && (
							<>
								<Link href={`${PATH_DASHBOARD.subastas.admin_martillador}/${eventos.uuid}`} target='_blank' passHref legacyBehavior>
									<a target='_blank' style={{ textDecoration: 'none' }}>
										<Button
											fullWidth
											color="primary"
											variant='contained'
											size="medium"
											style={{ marginTop: 10 }}
										>
											Ver auxiliar Martillador
										</Button>
									</a>
								</Link>

								<Link href={`${PATH_DASHBOARD.subastas.root}/martillador/${eventos.uuid}`} passHref legacyBehavior>
									<a target='_blank' style={{ textDecoration: 'none' }}>
										<Button
											fullWidth
											color="secondary"
											variant='contained'
											size="medium"
											style={{ marginTop: 10 }}
										>
											ver martillador
										</Button>
									</a>
								</Link>

								<Link href={`${PATH_DASHBOARD.subastas.monitor}/${eventos.uuid}`} target='_blank' passHref legacyBehavior>
									<a target='_blank' style={{ textDecoration: 'none' }}>
										<Button
											fullWidth
											color="warning"
											variant='contained'
											size="medium"
											style={{ marginTop: 10 }}
										>
											Ver en monitor
										</Button>
									</a>
								</Link>
							</>
						)
					}
				</CardContent>
			</Card >
		</>
	);
};
