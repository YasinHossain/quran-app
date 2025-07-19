// app/components/IconSidebar.tsx
'use client';
import { FaHome, FaRegBookmark, FaTh } from './SvgIcons';

const IconSidebar = () => {
    const navItems = [
        { icon: FaHome, label: 'Home' },
        { icon: FaTh, label: 'All Surahs' },
        { icon: FaRegBookmark, label: 'Bookmarks' }
    ];

    return (
        // CHANGE: Removed the border-r class for a cleaner look
        <aside className="w-20 bg-[#F0FAF8] flex flex-col items-center py-4">
            <nav className="flex flex-col items-center space-y-2">
                {navItems.map((item, index) => (
                    <button key={index} title={item.label} className="p-3 rounded-lg hover:bg-gray-200 text-gray-600 hover:text-teal-600 transition-colors duration-200">
                        <item.icon className="h-6 w-6" />
                    </button>
                ))}
            </nav>
        </aside>
    );
}

export default IconSidebar;