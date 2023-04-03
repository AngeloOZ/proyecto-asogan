import { forwardRef } from 'react';
// next
import NextLink from 'next/link';
// @mui
// import { useTheme } from '@mui/material/styles';
import { Box, Link, BoxProps } from '@mui/material';
// import { Image } from '@mui/icons-material';
import { PATH_DASHBOARD } from 'src/routes/paths';
import Image from '../image/Image';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
  image?: string;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, image = '/favicon/logo.png', sx, ...other }, ref) => {

    const logo = (
      <Box
        ref={ref}
        component="div"
        sx={{
          width: 120,
          height: 30,
          display: 'inline-flex',
          ...sx,
        }}
      /*   {...other} */
      >
        <Image
          alt="logo"
          src={image}
          sx={{ width: "100%", height: "100%" }}
        />

      </Box>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={NextLink} href={PATH_DASHBOARD.root} sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
