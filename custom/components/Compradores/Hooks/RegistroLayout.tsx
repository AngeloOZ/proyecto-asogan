// @mui
import { Stack } from '@mui/material';
import Image from '../../../../src/components/image';
import { StyledRoot, StyledSectionBg, StyledSection, StyledContent } from './styles';

type Props = {
  title?: string;
  illustration?: string;
  children: React.ReactNode;
};


export default function RegistroLayout({ children, illustration, title }: Props) {
    return (
      <StyledRoot>
        <StyledSection>
          <Image
            disabledEffect
            visibleByDefault
            alt="auth"
            src={illustration || '/assets/illustrations/illustration_dashboard.png'}
            sx={{ maxWidth: 700 }}
          />
          <StyledSectionBg />
        </StyledSection>
  
        <StyledContent>
          <Stack sx={{ width: 1 }}> {children} </Stack>
        </StyledContent>
      </StyledRoot>
    );
  }