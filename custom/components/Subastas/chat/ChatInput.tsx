import { useState } from 'react';
// @mui
import { InputBase, IconButton, InputAdornment } from '@mui/material';

// components
import Iconify from 'src/components/iconify';


export function ChatInput() {
    const [message, setMessage] = useState('');

    return (
        <>
            <InputBase
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Type a message"
                startAdornment={
                    <InputAdornment position="start">
                        <IconButton size="small">
                            <Iconify icon="eva:smiling-face-fill" />
                        </IconButton>
                    </InputAdornment>
                }

                sx={{
                    pl: 1,
                    height: 56,
                    flexShrink: 0,
                    borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
                    // ...sx,
                }}
            // {...other}
            />
        </>
    );
}
