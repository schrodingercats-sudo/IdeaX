
import React from 'react';
import { Home, Search, PlusSquare, User as UserIcon } from 'lucide-react';
import { User, Page } from '../types';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center space-y-1 transition-colors ${active ? 'text-white' : 'text-muted-foreground hover:text-white'}`}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
    </button>
);

interface BottomNavProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    onOpenCreatePost: () => void;
    onOpenProfile: (user: User) => void;
    currentUser: User;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate, onOpenCreatePost, onOpenProfile, currentUser }) => {
    
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
        <div className="md:hidden bg-background/80 backdrop-blur-lg border-t border-border px-4 py-2">
            <div className="flex items-center justify-around">
                <NavItem icon={<Home size={24} />} label="Home" active={currentPage === 'feed'} onClick={() => handleNavClick('feed')} />
                <NavItem icon={<Search size={24} />} label="Search" active={currentPage === 'search'} onClick={() => handleNavClick('search')} />
                <NavItem icon={<PlusSquare size={24} />} label="Create" onClick={() => handleNavClick('create')} />
                <NavItem icon={<UserIcon size={24} />} label="Profile" onClick={() => onOpenProfile(currentUser)} />
            </div>
        </div>
    );
};