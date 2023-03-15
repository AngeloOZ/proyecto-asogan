import { useEffect, useState, useRef } from 'react';

//
import Scrollbar from 'src/components/scrollbar';
//
import ChatMessageItem from './ChatMessageItem';

// ----------------------------------------------------------------------
export type IChatTextMessage = {
  id: string;
  body: string;
  contentType: 'text';
  // attachments: IChatAttachment[];
  createdAt: Date;
  senderId: string;
};

export type IChatMessage = IChatTextMessage;

export type IChatConversation = {
  id: string;
  participants: any;
  type: string;
  unreadCount: number;
  messages: IChatMessage[];
};



type Props = {
  conversation: IChatConversation;
};



export default function ChatMessageList({ }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const conversation = {
    id: '1',
    messages: [
      {
        id: '1',
        body: 'Hi, I’m interested in this product. Could you please send me more information about it?',
        contentType: 'text',
        createdAt: new Date(),
        senderId: '2'
      },
      {
        id: '2',
        body: 'Hi, Could you please send me more information about it?',
        contentType: 'text',
        createdAt: new Date(),
        senderId: '2'
      },
      {
        id: '3',
        body: 'Hi, I’m inyou please send me more information about it?',
        contentType: 'text',
        createdAt: new Date(),
        senderId: '2'
      }
    ]
  }

  const [selectedImage, setSelectedImage] = useState<number>(-1);

  useEffect(() => {
    const scrollMessagesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    scrollMessagesToBottom();
  }, [conversation.messages]);

  return (
    <Scrollbar
      scrollableNodeProps={{
        ref: scrollRef,
      }}
      sx={{ p: 3, height: 1 }}
    >
      {conversation.messages.map((message) => (
        <ChatMessageItem
          key={message.id}
          message={message}
          conversation={conversation}
        />
      ))}
    </Scrollbar>
  );
}
