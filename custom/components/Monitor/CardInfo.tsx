import { Box, BoxProps, Card, CardContent, Typography } from '@mui/material'
import React from 'react'

interface Props extends BoxProps {
    title: string;
    value: string;
    color?: string;
}
export const CardInfo = ({ title, value, color, ...other }: Props) => {
    return (
        <Box component="div" {...other} >
            <Card sx={{ height: "100%" }}>
                <CardContent>
                    <Box>
                        <Typography component='h3' fontWeight='bold' fontSize='25px' textTransform='uppercase'>{title}</Typography>
                    </Box>
                    <Typography component='p' fontWeight='bold' fontSize='35px' textTransform='uppercase'>{value}</Typography>
                </CardContent>
            </Card>
        </Box>
    )
}
