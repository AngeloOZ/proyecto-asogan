import { MdSell } from 'react-icons/md';

import { FaCalendarAlt, FaCubes, FaHandHoldingUsd, FaTruckLoading, FaUsers } from 'react-icons/fa';
// routes
import { PATH_DASHBOARD, PATH_DASHBOARD_CLEINTE } from '../../../routes/paths';



// https://react-icons.github.io/react-icons
// https://mui.com/material-ui/material-icons/

const navConfig = [
  {
    subheader: '',
    items: [
      {
        title: 'Usuarios',
        path: PATH_DASHBOARD.usuarios.root,
        icon: <FaUsers size={20} />,
        roles: ['admin',],
      },
      {
        title: 'Proveedores',
        path: PATH_DASHBOARD.proveedores.root,
        icon: <FaTruckLoading size={20} />,
        roles: ['admin',],
      },
      {
        title: 'Compradores',
        path: PATH_DASHBOARD.compradores.root,
        icon: <MdSell size={20} />,
        roles: ['admin',],
      },
      {
        title: 'Eventos',
        path: PATH_DASHBOARD.eventos.root,
        icon: <FaCalendarAlt size={20} />,
        roles: ['admin',],
      },
      {
        title: 'Lotes',
        path: PATH_DASHBOARD.lotes.root,
        icon: <FaCubes size={20} />,
        roles: ['admin',],
      },
      {
        title: 'Subastas',
        path: PATH_DASHBOARD.eventos.listado,
        icon: <FaHandHoldingUsd size={20} />,
        roles: ['admin',],
      },
    ],
  },
  {
    subheader: '',
    items: [
      {
        title: 'Lotes Comprados',
        path: PATH_DASHBOARD.lotes.comprados,
        icon: <FaCubes size={20} />,
        roles: ['comprador',],
      },
      {
        title: 'Subastas',
        path: PATH_DASHBOARD_CLEINTE.root,
        icon: <FaHandHoldingUsd size={20} />,
        roles: ['comprador'],
      },
    ],
  }
];

export default navConfig;