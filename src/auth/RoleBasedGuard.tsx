import { useContext } from 'react';

import { m } from 'framer-motion';
// @mui
import { Box, Button, Container, Typography } from '@mui/material';
import { AuthContext } from './context';
// components
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { ForbiddenIllustration } from '../assets/illustrations';
import Link from 'next/link';
import { PATH_DASHBOARD } from 'src/routes/paths';
//

// ----------------------------------------------------------------------

type RoleBasedGuardProp = {
  hasContent?: boolean;
  roles?: string[];
  children: React.ReactNode;
};

export default function RoleBasedGuard({ hasContent, roles, children }: RoleBasedGuardProp) {
  const { user } = useContext(AuthContext);

  // Rol del usuario logueado
  const currentRole = user?.rol || [];
  let isAllowed = false;

  currentRole.forEach((rol) => {
    if (roles?.includes(rol)) {
      isAllowed = true;
    }
  });


  if (typeof roles !== 'undefined' && !isAllowed) {
    return hasContent ? (
      <Box component="div" sx={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Container component={MotionContainer} sx={{ textAlign: 'center' }}>
          <m.div variants={varBounce().in}>
            <Typography variant="h2" paragraph>
              Oops
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Typography sx={{ color: 'text.secondary' }} fontSize={18} variant='subtitle1'>
              Parece que te has perdido, y entraste a un lugar sin permiso, te recomendamos regresar a un lugar seguro. 
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
          </m.div>

          <Link href={PATH_DASHBOARD.root} passHref legacyBehavior>
            <Button variant='contained' size='large' style={{ textTransform: 'initial' }}>Regresar a un lugar seguro</Button>
          </Link>
        </Container>
      </Box>
    ) : null;
  }

  return <> {children} </>;
}
