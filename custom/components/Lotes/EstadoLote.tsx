import Label from "src/components/label/Label"

export const EstadoLote = ({ estado }: { estado: number }) => {
    switch (estado) {
        case 1:
            return <Label color="info" variant="filled">
                Cerrado
            </Label>
        case 2:
            return <Label color="success" variant="filled">
                Abierto
            </Label>
        case 3:
            return <Label color="error" variant="filled">
                Finalizado
            </Label>
        default:
            return null
    }
}