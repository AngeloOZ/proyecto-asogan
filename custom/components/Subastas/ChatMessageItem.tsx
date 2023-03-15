import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import { Avatar, Typography, Stack } from '@mui/material';

// TODO: revisar id user actual
const CURRENT_USER_ID = '8864c717-587d-472a-929a-8e5f298024da-0';

type Props = {
    message: any;
    conversation: any;\
};

export default function ChatMessageItem({ message, conversation }: Props) {
    
    const sender = conversation.participants.find(
        (participant) => participant.id === message.senderId
    );

    const senderDetails =
        message.senderId === CURRENT_USER_ID
            ? {
                type: 'me',
            }
            : {
                avatar: sender?.avatar,
                name: sender?.name,
            };

    const currentUser = senderDetails.type === 'me';

    const firstName = senderDetails.name && senderDetails.name.split(' ')[0];

    return (
        <Stack direction="row" justifyContent={currentUser ? 'flex-end' : 'unset'} sx={{ mb: 3 }}>
            <Stack spacing={1} alignItems="flex-end">
                <Typography
                    noWrap
                    variant="caption"
                    sx={{
                        color: 'text.disabled',
                        ...(!currentUser && {
                            mr: 'auto',
                        }),
                    }}
                >
                    {!currentUser && `${firstName},`} &nbsp;
                    {formatDistanceToNowStrict(new Date(message.createdAt), {
                        addSuffix: true,
                    })}
                </Typography>

                <Stack
                    sx={{
                        p: 1.5,
                        minWidth: 48,
                        maxWidth: 320,
                        borderRadius: 1,
                        overflow: 'hidden',
                        typography: 'body2',
                        bgcolor: 'background.neutral',
                        ...(currentUser && {
                            color: 'grey.800',
                            bgcolor: 'primary.lighter',
                        }),
                    }}
                >
                </Stack>
            </Stack>
        </Stack>
    );
}
