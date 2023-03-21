import { ReactElement } from "react";
import { SkeletonTable } from "../skeletons";
import { TableCell, TableRow } from "@mui/material";
import { TableRowBody } from ".";

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
    isLoading: boolean | undefined;
    buttonsActions?: {
        show?: boolean;
        edit?: boolean;
        delete?: boolean;
    };
    rowsPerPage: number;
    page: number;
    pagination: boolean;
    listButton: boolean;
    allData: any[];
    handleClickDelete: (item: any) => void;
    handleClickEdit: (item: any) => void;
    handleClickShow: (item: any) => void;
}

export const RenderTableBody = ({
    headers,
    buttonsActions,
    isLoading,
    listButton,
    page,
    pagination,
    rowsPerPage,
    allData,
    handleClickDelete = (item: any) => { },
    handleClickEdit = (item: any) => { },
    handleClickShow = (item: any) => { },
}: Props): ReactElement => {

    if (isLoading) return <SkeletonTable columns={headers.length + 1} rows={rowsPerPage} />

    if (allData.length === 0) return <TableRow><TableCell colSpan={headers.length + 1} align="center">No hay datos registrados</TableCell></TableRow>

    const data = pagination ? allData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : allData;

    return (
        <>
            {data.map((row: any, index) => (
                <TableRowBody
                    handleClickDelete={handleClickDelete}
                    handleClickEdit={handleClickEdit}
                    handleClickShow={handleClickShow}
                    headers={headers}
                    buttonsActions={buttonsActions}
                    listButton={listButton}
                    row={row}
                    key={index}
                />
            ))}
        </>)
}
