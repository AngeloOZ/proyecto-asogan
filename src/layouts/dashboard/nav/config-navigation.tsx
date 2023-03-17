import { Inventory } from '@mui/icons-material';
import { MdPointOfSale } from 'react-icons/md';
import { HiTruck, HiCalendar } from 'react-icons/hi';
import { FaCubes } from 'react-icons/fa';
// import { HiTruck, HiShoppingCart} from 'react-icons/hi';
// routes
import { PATH_DASHBOARD, PATH_DASHBOARD_CLEINTE } from '../../../routes/paths';


// https://react-icons.github.io/react-icons
// https://mui.com/material-ui/material-icons/

const navConfig = [
  {
    subheader: 'Productos',
    items: [
      {
        title: 'Subastas cliente',
        path: PATH_DASHBOARD_CLEINTE.root,
        icon: <MdPointOfSale />,
        roles: ['comprador'],
      },
      {
        title: 'Subastas',
        path: PATH_DASHBOARD.eventos.listado,
        icon: <MdPointOfSale />,
        roles: ['admin',],
      },
      {
        title: 'Proveedores',
        path: PATH_DASHBOARD.proveedores.root,
        icon: <HiTruck />,
        roles: ['admin',],
      },
      {
        title: 'Compradores',
        path: PATH_DASHBOARD.compradores.root,
        icon: <HiTruck />,
        roles: ['admin',],
      },
      {
        title: 'Lotes',
        path: PATH_DASHBOARD.lotes.root,
        icon: <FaCubes />,
        roles: ['admin',],
      },
      {
        title: 'Usuarios',
        path: PATH_DASHBOARD.usuarios.root,
        icon: <Inventory />,
        roles: ['admin',],
      },
      {
        title: 'Eventos',
        path: PATH_DASHBOARD.eventos.root,
        icon: <HiCalendar />,
        roles: ['admin',],
      },
    ],
  },
];

export default navConfig;