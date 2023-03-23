import { useState } from 'react';

import { Tabs, Tab, Typography, Box, BoxProps, Card, Skeleton, } from '@mui/material';

import { VideoPlayer } from '.';

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
                padding: 5,
                height: '100%',
            }}
        >
            {value === index && (
                <Box height='100%'>
                    {children}
                </Box>
            )}
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

export function TabVideos({ urlTransmisionEnVivo = '', urlVideoDemostracion = '' }: TabVideosProps) {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', padding: 0, height: 'calc( 100% - 60px)' }} >
            <Box sx={{ borderBottom: 1, borderColor: 'divider', py: 0, my: 0 }} height={60} paddingX={2}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Video demostración" {...a11yProps(0)} />
                    <Tab label="Transmisión en vivo" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                {
                    urlVideoDemostracion === '' ?
                        <Skeleton variant="rectangular" width="100%" style={{ minHeight: 130, height: '100%' }} />
                        :
                        <VideoPlayer
                            playerProps={{
                                url: urlVideoDemostracion,
                                muted: true,
                            }}
                        />

                }
            </TabPanel>
            <TabPanel value={value} index={1}>
                {
                    urlTransmisionEnVivo === '' ?
                        <Skeleton variant="rectangular" width="100%" style={{ minHeight: 130, height: '100%' }} />
                        :
                        <VideoPlayer
                            playerProps={{
                                url: urlTransmisionEnVivo,
                                muted: true,
                            }}
                        />

                }
            </TabPanel>
        </Box>
    );
}