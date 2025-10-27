
import React from 'react';
import { Home, Compass, PlusSquare, Bell, User as UserIcon, Search, Menu, Video, MessageCircle } from 'lucide-react';
import { User, Page } from '../types';

interface NavItemProps {
    icon: React.ReactNode;
    activeIcon?: React.ReactNode;
    label: string;
    active?: boolean;
    onClick: () => void;
    hasNotification?: boolean;
    notificationCount?: number;
}

const NavItem: React.FC<NavItemProps> = ({ icon, activeIcon, label, active, onClick, hasNotification, notificationCount }) => (
    <button 
        onClick={onClick} 
        className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ease-out hover:bg-secondary group ${active ? 'bg-secondary' : ''}`}
    >
        <div className="relative w-7 h-7 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200 ease-out">
            {active && activeIcon ? activeIcon : icon}
            {hasNotification && <span className="absolute top-0.5 right-0.5 block h-2 w-2 rounded-full bg-red-500 ring-1 ring-background"></span>}
            {notificationCount && notificationCount > 0 && 
                <span className="absolute -top-1 -right-2 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
                    {notificationCount}
                </span>
            }
        </div>
        <span className={`ml-4 text-base transform group-hover:scale-105 transition-transform duration-200 ease-out origin-left ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </button>
);

interface SideNavProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    onOpenCreatePost: () => void;
    onOpenProfile: (user: User) => void;
    currentUser: User;
    isProfileActive?: boolean;
}

export const SideNav: React.FC<SideNavProps> = ({ currentPage, onNavigate, onOpenCreatePost, onOpenProfile, currentUser, isProfileActive }) => {
    
    const handleNavClick = (pageOrAction: Page | 'create' | 'profile') => {
        if (pageOrAction === 'create') {
            onOpenCreatePost();
        } else if (pageOrAction === 'profile') {
            onOpenProfile(currentUser);
        } else {
            onNavigate(pageOrAction);
        }
    };

    return (
        <nav className="hidden md:flex flex-col h-full w-[244px] border-r border-border/50 p-3">
             <div className="py-6 px-2">
                <h1 className="text-2xl font-bold tracking-tighter">IdeaX</h1>
            </div>

            <div className="flex-1 flex flex-col space-y-1">
                <NavItem 
                    icon={<Home size={26} strokeWidth={2} />}
                    activeIcon={<Home size={26} strokeWidth={2.5} fill="currentColor" />} 
                    label="Home" 
                    active={currentPage === 'feed'} 
                    onClick={() => handleNavClick('feed')} 
                />
                <NavItem 
                    icon={<Search size={26} strokeWidth={2} />}
                    activeIcon={<Search size={26} strokeWidth={2.5} />}
                    label="Search" 
                    active={currentPage === 'search'}
                    onClick={() => handleNavClick('search')} 
                />
                <NavItem 
                    icon={<Compass size={26} strokeWidth={2} />} 
                    activeIcon={<Compass size={26} strokeWidth={2.5} fill="currentColor" />} 
                    label="Explore"
                    active={currentPage === 'explore'} 
                    onClick={() => handleNavClick('explore')} 
                />
                <NavItem 
                    icon={<Video size={26} strokeWidth={2} />} 
                    activeIcon={<Video size={26} strokeWidth={2.5} fill="currentColor" />}
                    label="Reels" 
                    active={currentPage === 'reels'}
                    onClick={() => handleNavClick('reels')} 
                />
                <NavItem 
                    icon={<MessageCircle size={26} strokeWidth={2} />} 
                    activeIcon={<MessageCircle size={26} strokeWidth={2.5} fill="currentColor" />}
                    label="Messages"
                    active={currentPage === 'messages'}
                    onClick={() => handleNavClick('messages')} 
                    notificationCount={7} 
                />
                <NavItem 
                    icon={<Bell size={26} strokeWidth={2} />} 
                    activeIcon={<Bell size={26} strokeWidth={2.5} fill="currentColor" />}
                    label="Notifications" 
                    active={currentPage === 'notifications'}
                    onClick={() => handleNavClick('notifications')} 
                    hasNotification 
                />
                <NavItem icon={<PlusSquare size={26} strokeWidth={2} />} label="Create" onClick={() => handleNavClick('create')} />
                <NavItem 
                    icon={<img src={currentUser.avatarUrl} className="h-7 w-7 rounded-full object-cover"/>}
                    activeIcon={<img src={currentUser.avatarUrl} className="h-7 w-7 rounded-full object-cover ring-2 ring-foreground"/>}
                    label="Profile" 
                    active={isProfileActive}
                    onClick={() => handleNavClick('profile')} 
                />
            </div>
            <div className="flex flex-col space-y-1">
                 <NavItem icon={<Menu size={26} strokeWidth={2} />} label="More" onClick={() => console.log('more')} />
            </div>
        </nav>
    );
};
