// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

// const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
};

export const DEFAULT_VENDEDOR = 1;

export const PATH_ADMIN = '/admin';

export const PATH_DASHBOARD_CLEINTE = {
  root: path(PATH_ADMIN, '/cliente'),
  subastas: path(PATH_ADMIN, '/cliente/subastas'),
}

export const PATH_DASHBOARD = {
  root: PATH_ADMIN,
  subastas: {
    root: path(PATH_ADMIN, '/subastas'),
  },
  martillador: {
    root: path(PATH_ADMIN, '/martillador'),
    agregar: path(PATH_ADMIN, '/martillador/agregar'),
    editar: path(PATH_ADMIN, '/martillador/editar'),
  },
  lotes: {
    root: path(PATH_ADMIN, '/lotes'),
    agregar: path(PATH_ADMIN, '/lotes/agregar'),
    editar: path(PATH_ADMIN, '/lotes/editar'),
  },
  proveedores: {
    root: path(PATH_ADMIN, '/proveedores'),
    agregar: path(PATH_ADMIN, '/proveedores/agregar'),
    editar: path(PATH_ADMIN, '/proveedores/editar'),
  },
  eventos: {
    root: path(PATH_ADMIN, '/eventos'),
    agregar: path(PATH_ADMIN, '/eventos/agregar'),
    editar: path(PATH_ADMIN, '/eventos/editar'),
    listado: path(PATH_ADMIN, '/eventos/listado'),
  },
  productos: {
    root: path(PATH_ADMIN, '/productos'),
    agregar: path(PATH_ADMIN, '/productos/agregar'),
    editar: path(PATH_ADMIN, '/productos/editar'),
  },
  categorias: {
    root: path(PATH_ADMIN, '/categorias'),
    agregar: path(PATH_ADMIN, '/categorias/agregar'),
    editar: path(PATH_ADMIN, '/categorias/editar'),
  },
  ventas: {
    root: path(PATH_ADMIN, '/ventas'),
    editar: path(PATH_ADMIN, '/ventas/editar'),
  },
  compradores: {
    root: path(PATH_ADMIN, '/compradores'),
    agregar: path(PATH_ADMIN, '/compradores/agregar'),
    editar: path(PATH_ADMIN, '/compradores/editar'),
  },
  usuarios: {
    root: path(PATH_ADMIN, '/usuarios'),
    agregar: path(PATH_ADMIN, '/usuarios/agregar'),
    editar: path(PATH_ADMIN, '/usuarios/editar'),
    cambiar: path(PATH_ADMIN, '/usuarios/cambiar'),
  }
};

export const PATH_TIENDA = '/tienda';

export const PATH_PAGE_TIENDA = {
  tienda: {
    root: PATH_TIENDA,
    resumen: path(PATH_TIENDA, '/resumen'),
    finalizar: path(PATH_TIENDA, '/resumen/finalizar'),
  }
};
