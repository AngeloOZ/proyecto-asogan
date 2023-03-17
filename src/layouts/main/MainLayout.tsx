// next
import { useRouter } from 'next/router';
// @mui
import { Box, Divider, Drawer } from '@mui/material';
//
// import Footer from './Footer';
import { useState } from 'react';
import Header from './Header';



// ----------------------------------------------------------------------

type Props = {
  children?: React.ReactNode;
  showCart?: boolean;
};

export default function MainLayout({ showCart = true, children }: Props) {
  const { pathname } = useRouter();
  const isHome = pathname === '/';

  const [stateViewCart, setStateViewCart] = useState(false);
  const handleShowCart = () => {
    setStateViewCart(!stateViewCart);
  };


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 1,
        fillOpacity: 10
      }}
    >
      <Header showButtonsCart={showCart} totalItems={0} onShowCart={handleShowCart} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ...(!isHome && {
            pt: { xs: 8, md: 11 },
          }),
        }}
      >
        <Divider sx={{ color: 'inherit' }} />

        {
          showCart && (<Drawer
            anchor="right"
            open={stateViewCart}
            onClose={handleShowCart}
            PaperProps={{
              sx: {
                width: {
                  xs: '100%',
                  md: '100%',
                  xl: '85%',
                  lg: '85%',
                },
              },
            }}
          />)
        }

        {children}
      </Box>
    </Box>
  );
}
