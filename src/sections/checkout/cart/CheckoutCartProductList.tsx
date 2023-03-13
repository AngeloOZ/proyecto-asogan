// @mui
import { Table, TableBody, TableContainer } from '@mui/material';
// @types
import { ICheckoutCartItem } from '../../../@types/product';
// components
import Scrollbar from '../../../components/scrollbar';
import { TableHeadCustom } from '../../../components/table';
//
import CheckoutCartProduct from './CheckoutCartProduct';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'product', label: 'Producto' },
  { id: 'price', label: 'Precio', align: 'center' },
  { id: 'quantity', label: 'Cantidad' , align: 'center'},
  { id: 'totalPrice', label: 'Precio Total', align: 'center' },
  { id: '' },
];

// ----------------------------------------------------------------------

type Props = {
  products: ICheckoutCartItem[];
  onDelete: (id: string) => void;
  onDecreaseQuantity: (id: string) => void;
  onIncreaseQuantity: (id: string) => void;
};

export default function CheckoutCartProductList({
  products,
  onDelete,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: Props) {
  return (
    <TableContainer sx={{ overflow: 'unset' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHeadCustom headLabel={TABLE_HEAD} />

          <TableBody>
            {products.map((row) => (
              <CheckoutCartProduct
                key={row.id}
                row={row}
                onDelete={() => onDelete(row.id)}
                onDecrease={() => onDecreaseQuantity(row.id)}
                onIncrease={() => onIncreaseQuantity(row.id)}
              />
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
}
