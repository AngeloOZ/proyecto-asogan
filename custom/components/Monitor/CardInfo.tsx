import { Box, BoxProps, Card, CardContent, Typography } from '@mui/material'
interface Props extends BoxProps {
    title: string;
    value: string;
    bgColorCustom?: string;
    textColorCustom?: string;
    fontSizeCustom?: string;
}
export const CardInfo = ({ title, value, bgColorCustom = 'transparent', textColorCustom = "#000", fontSizeCustom = '40px', ...other }: Props) => {

    return (
        <Box component="div" {...other} >
            <Card sx={{ height: "100%", boxShadow: '0 0 4px rgba(0,0,0,0.3)' }}>
                <CardContent component='div' style={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }} >
                    <Box style={{ textAlign: 'center', padding: 5, borderBottom: "1px #0c0 dashed" }}>
                        <Typography
                            component='h3'
                            fontWeight='bold'
                            fontSize='28px'
                            textTransform='uppercase'
                        >
                            {title}
                        </Typography>
                    </Box>
                    <Box component='div'
                        style={{
                            backgroundColor: bgColorCustom,
                            color: textColorCustom,
                            textAlign: 'center',
                            padding: '0 10px',
                            flexGrow: 1,
                            display: 'grid',
                            placeContent: 'center',
                            overflow: 'hidden',
                        }}
                    >
                        <Typography
                            component='p'
                            fontWeight='bold'
                            fontSize={fontSizeCustom}
                            textTransform='uppercase'
                            textOverflow='ellipsis'
                        >
                            {value}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}
