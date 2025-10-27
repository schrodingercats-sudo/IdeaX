
import React from 'react';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';

// Mock data for notifications
const mockNotifications = [
  {
    id: 1,
    type: 'follow',
    user: { name: 'Sarah Drasner', avatar: 'https://i.pravatar.cc/150?u=sarah_codes' },
    time: '2m ago',
  },
  {
    id: 2,
    type: 'like',
    user: { name: 'Chris Romano', avatar: 'https://i.pravatar.cc/150?u=chris' },
    postTitle: 'FinWise: A Gamified Financial Literacy App...',
    time: '15m ago',
  },
  {
    id: 3,
    type: 'comment',
    user: { name: 'Jenna', avatar: 'https://i.pravatar.cc/150?u=jenna' },
    comment: 'This is a game-changer! 🔥',
    time: '1h ago',
  },
  {
    id: 4,
    type: 'like',
    user: { name: 'David Chen', avatar: 'https://i.pravatar.cc/150?u=david' },
    postTitle: 'AI-Powered Email Assistant for Busy Founders',
    time: '3h ago',
  },
  {
    id: 5,
    type: 'follow',
    user: { name: 'Anna Thiel', avatar: 'https://i.pravatar.cc/150?u=anna' },
    time: 'yesterday',
  },
  {
    id: 6,
    type: 'comment',
    user: { name: 'Fallback Developer', avatar: 'https://i.pravatar.cc/150?u=fallback1' },
    comment: 'Great idea! Have you considered...',
    time: 'yesterday',
  },
];

const NotificationIcon: React.FC<{ type: string }> = ({ type }) => {
    switch (type) {
        case 'like':
            return <div className="h-8 w-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center"><Heart size={16} /></div>;
        case 'comment':
            return <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center"><MessageCircle size={16} /></div>;
        case 'follow':
            return <div className="h-8 w-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center"><UserPlus size={16} /></div>;
        default:
            return null;
    }
};

const NotificationItem: React.FC<{ notification: typeof mockNotifications[0] }> = ({ notification }) => {
    return (
        <div className="flex items-start p-4 space-x-4 hover:bg-secondary/50 transition-colors rounded-lg cursor-pointer">
            <img src={notification.user.avatar} alt={notification.user.name} className="h-10 w-10 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1">
                <p className="text-sm">
                    <span className="font-bold">{notification.user.name}</span>
                    {notification.type === 'follow' && ' started following you.'}
                    {notification.type === 'like' && ` liked your post: "${notification.postTitle}"`}
                    {notification.type === 'comment' && ` commented: "${notification.comment}"`}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{notification.time}</p>
            </div>
            <NotificationIcon type={notification.type} />
        </div>
    );
}

export const NotificationsPage: React.FC = () => {
    return (
        <div className="h-full w-full flex flex-col">
            <div className="p-4 border-b border-border/50">
                 <h1 className="text-2xl font-bold">Notifications</h1>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="divide-y divide-border/50">
                    {mockNotifications.map(n => <NotificationItem key={n.id} notification={n} />)}
                </div>
            </div>
        </div>
    );
};
