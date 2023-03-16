import { Inventory, Category } from '@mui/icons-material';
import { MdLoyalty, MdPointOfSale } from 'react-icons/md';
import { HiTruck, HiCalendar } from 'react-icons/hi';
import { FaCubes, FaHammer } from 'react-icons/fa';
// import { HiTruck, HiShoppingCart} from 'react-icons/hi';
// routes
import { PATH_DASHBOARD, PATH_DASHBOARD_CLEINTE } from '../../../routes/paths';


// https://react-icons.github.io/react-icons
// https://mui.com/material-ui/material-icons/

const navConfig = [
  {
    // subheader: 'Productos',
    items: [
      // Angello
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
        roles: ['admin', 'editor'],
      },
      {
        title: 'Lotes',
        path: PATH_DASHBOARD.lotes.root,
        icon: <FaCubes />,
        roles: ['admin', 'editor'],
      },
      {
        title: 'Martillador',
        path: PATH_DASHBOARD.martillador.root,
        icon: <FaHammer />,
        roles: ['admin','martillador'],
      },
      // Leidy


      { 
        title:'Usuarios',
        path: PATH_DASHBOARD.usuarios.root,
        icon: <Inventory />,
        roles: ['admin', 'editor'],
      },







      // Jhusep

      {
        title: 'Eventos',
        path: PATH_DASHBOARD.eventos.root,
        icon: <HiCalendar />,
        roles: ['admin', 'editor'],
      },









    ],
  },

];

export default navConfig;