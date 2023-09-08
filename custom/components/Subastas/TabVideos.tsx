import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Tabs, Tab, Box, BoxProps, Skeleton, } from '@mui/material';

import { VideoPlayer } from '.';
import { TransmisionUsuarios } from '../Transmision';
import { AuthContext } from 'src/auth';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            style={{
                padding: 6,
                width: '100%',
                height: '100%',
            }}
        >
            <Box height='100%'>
                {children}
            </Box>
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

interface TabVideosProps extends BoxProps {
    urlVideoDemostracion?: string;
    urlTransmisionEnVivo?: string;
}

export function TabVideos({ urlVideoDemostracion = '' }: TabVideosProps) {
    const { user } = useContext(AuthContext);
    const { query } = useRouter();
    const uuid  = query.uuid as string;
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', padding: 0, height: 'calc(100% - 60px)' }} >
            <Box sx={{ borderBottom: 1, borderColor: 'divider', py: 0, my: 0 }} height={60} paddingX={2}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Transmisión en vivo" {...a11yProps(0)} />
                    <Tab label="Video demostración" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                {
                    uuid && user?.nombres && (
                        <TransmisionUsuarios 
                            ancho="100%"
                            alto="100%"
                            uuid={uuid}
                            username={user.nombres}
                        />
                    )
                }
            </TabPanel>
            <TabPanel value={value} index={1}>
                {
                    urlVideoDemostracion === '' ?
                        <Skeleton variant="rectangular" width="100%" style={{ minHeight: 150, height: '100%' }} />
                        :
                        <VideoPlayer
                            playerProps={{
                                url: urlVideoDemostracion,
                                muted: true,
                                controls: true,
                                loop: true,
                            }}
                        />
                }
            </TabPanel>
        </Box>
    );
}
