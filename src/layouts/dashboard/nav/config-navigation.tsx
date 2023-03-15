import { Inventory, Category } from '@mui/icons-material';
import { MdLoyalty } from 'react-icons/md';
import { HiTruck, HiCalendar } from 'react-icons/hi';
import { FaCubes } from 'react-icons/fa';
// import { HiTruck, HiShoppingCart} from 'react-icons/hi';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';


// https://react-icons.github.io/react-icons
// https://mui.com/material-ui/material-icons/

const navConfig = [
  {
    subheader: 'Productos',
    items: [
      {
        title: 'Subastas',
        path: PATH_DASHBOARD.eventos.listado,
        icon: <MdPointOfSale />,
        roles: ['admin', 'editor'],
      },
      {
        title: 'Proveedores',
        path: PATH_DASHBOARD.proveedores.root,
        icon: <HiTruck />,
        roles: ['admin', 'editor'],
      },
      {
        title: 'Compradores',
        path: PATH_DASHBOARD.compradores.root,
        icon: <HiTruck />,
        roles: ['admin','editor'],
      },
      {
        title: 'Lotes',
        path: PATH_DASHBOARD.lotes.root,
        icon: <FaCubes />,
        roles: ['admin', 'editor'],
      },
      // {
      //   title: 'categorias',
      //   path: PATH_DASHBOARD.categorias.root,
      //   icon: <Category />,
      //   roles: ['admin','editor'],
      //   children: [
      //     { title: 'Listar', path: PATH_DASHBOARD.categorias.root, },
      //     { title: 'Agregar', path: PATH_DASHBOARD.categorias.agregar },
      //   ]
      // },
    ],
  },
  {
    subheader: 'Ventas',
    items: [
      {
        roles: ['admin', 'vendedor'],
        title: 'Ventas',
        path: PATH_DASHBOARD.ventas.root,
        icon: <MdLoyalty />,
      },
    ],
  },

];

export default navConfig;