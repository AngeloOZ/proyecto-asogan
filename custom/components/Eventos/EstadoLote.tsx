import Label from "src/components/label/Label"


export const EstadoLote = ({ estado }: { estado: number }) => {
    switch (estado) {
        case 0:
            return <Label color="info" variant="filled">
                Sin subastar
            </Label>
        case 1:
            return <Label color="success" variant="filled">
                En subasta
            </Label>
        case 2:
            return <Label color="warning" variant="filled">
                Postergado
            </Label>
        case 3:
            return <Label color="error" variant="filled">
                Subastado
            </Label>
        default:
            return null
    }
}
