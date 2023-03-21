import { TableCell, TableRow } from "@mui/material";
import EditActionsButtons from "./EditActionsButtons";


type HeaderProp = {
    name: string;
    label: string;
    align?: 'left' | 'right' | 'center' | "inherit" | "justify";
    order?: boolean;
    type?: 'number' | 'string' | 'date' | 'boolean';
    serchable?: boolean;
}

type Props = {
    headers: HeaderProp[];
    row: any;
    listButton: boolean | undefined;
    buttonsActions?: {
        show?: boolean;
        edit?: boolean;
        delete?: boolean;
    };
    handleClickDelete: (item: any) => void;
    handleClickEdit: (item: any) => void;
    handleClickShow: (item: any) => void;
}

export const TableRowBody = ({
    headers,
    buttonsActions,
    row,
    handleClickDelete = (item: any) => { },
    handleClickEdit = (item: any) => { },
    handleClickShow = (item: any) => {}
}: Props) => {

    const renderText = (value: any, type = 'string') => {
        // if (type === 'date') return new Date(value).toLocaleDateString() + ' ' + new Date(value).toLocaleTimeString();
        if (type === 'number') return Number(value);
        return value;
    }


    return (
        <TableRow style={{ padding: 0 }} hover >
            {
                headers.map((header, i) => <TableCell key={header.name + i} align={header.align || 'left'}>{renderText(row[header.name], header?.type)}</TableCell>)
            }

            {buttonsActions &&
                <EditActionsButtons
                    buttonsActions={buttonsActions}
                    row={row}
                    handleClickDelete={handleClickDelete}
                    handleClickEdit={handleClickEdit}
                    handleClickShow={handleClickShow}
                />
            }
        </TableRow>
    )
}
