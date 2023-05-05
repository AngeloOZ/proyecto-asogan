import { useEffect, useRef } from 'react';
import Scrollbar from 'src/components/scrollbar';
import { pujas } from '@prisma/client';
import { ChatItem } from './ChatItem';


type Props = {
    pujas: pujas[];
};

export function ChatList({ pujas = [] }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollMessagesToBottom = () => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        };
        scrollMessagesToBottom();
    }, [pujas]);

    return (
        <>
            <Scrollbar
                scrollableNodeProps={{
                    ref: scrollRef,
                }}
                sx={{ px: 2, pt: 2, height: 1 }}
            >
                {pujas.map((puja) => (
                    <ChatItem
                        key={puja.id_puja}
                        puja={puja}
                    />
                ))}
            </Scrollbar>
        </>
    );
}
