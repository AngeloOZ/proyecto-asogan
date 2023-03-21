export function handleErrorsPrisma(error: any) {
    let mensaje: string = "Ha ocurrido un error";

    switch (error.code) {
        case "P2003":
            mensaje = "No se pudo eliminar el registro porque está siendo utilizado por otra parte de la aplicación.";
            break;

        case "P2016":
            mensaje = "No se pudo crear el registro porque ya existe un registro con la misma información.";
            break;

        case "P2017":
            mensaje = "No se pudo actualizar el registro porque ya existe otro registro con la misma información.";
            break;

        case "P2025":
            mensaje = "Se ha producido un error al intentar realizar la operación solicitada. Por favor, revise los datos e intente de nuevo.";
            break;

        case "P2027":
            mensaje = "No se pudo guardar la información porque se ha producido un conflicto con otra parte de la aplicación.";
            break;

        case "P2028":
            mensaje = "No se pudo eliminar el registro porque está siendo utilizado por otra parte de la aplicación.";
            break;

        default:
            break;
    }

    return mensaje;
}
