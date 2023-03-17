export function handleErrorsPrisma(error: string) {
    let mensaje: string = "Ha ocurrido un error";
    switch (error) {
        case "P2025":
            mensaje = "No se puede eliminar el registro porque tiene referencias en otras tablas.";
            break;

        default:
            break;
    }
    return mensaje;
}