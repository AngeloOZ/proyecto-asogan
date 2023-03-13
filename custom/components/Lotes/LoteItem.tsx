import { Button, Card, CardActions, CardContent, Chip, Typography } from "@mui/material";
import { lote } from "@prisma/client"
import { subastaAPI } from "custom/api";
import { useSnackbar } from 'src/components/snackbar';
import { useLotes, useObtenerLotes } from "./hooks";

type Props = {
	lote: lote,
	disabledButton?: boolean
}

export const LoteItem = ({ lote, disabledButton = false }: Props) => {
	const { activarEstado } = useLotes();
	const { enqueueSnackbar } = useSnackbar();

	const activarLote = async () => {
		try {
			activarEstado(lote.loteid);
			enqueueSnackbar('Actualizado', { variant: 'success' });
		} catch (error) {
			enqueueSnackbar('Error', { variant: 'error' });
			console.log(error);
		}
	}

	return (
		<Card sx={{ minWidth: 275, mb: 2, boxShadow: "0 0 5px rgba(0,0,0,0.2)" }}>
			<CardContent>
				<Typography component="span" mr={2}>Estado: </Typography>
				{
					lote.estado === 0 ?
						<Chip label="Cerrado" color="error" /> :
						<Chip label="Abierto" color="success" />
				}
				<Typography variant="body2" mt={1}>
					{lote.descripcion}
				</Typography>
			</CardContent>
			{
				!disabledButton &&
				<CardActions>
					<Button size="small" variant="contained" onClick={activarLote}>Activar</Button>
				</CardActions>
			}
		</Card>
	);

}
