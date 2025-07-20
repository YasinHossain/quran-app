// app/components/IconSidebar.tsx
'use client';
import { FaHome, FaRegBookmark, FaTh } from './SvgIcons';
import { useTranslation } from 'react-i18next';
import Link from 'next/link'; // Import Link

const IconSidebar = () => {
    const { t } = useTranslation();
    const navItems = [
        { icon: FaHome, label: t('home'), href: '/' }, // Added href
        { icon: FaTh, label: t('all_surahs'), href: '/surahs' }, // Added href (assuming /surahs is the path for all surahs)
        { icon: FaRegBookmark, label: t('bookmarks'), href: '/bookmarks' } // Added href
    ];

    return (
        // CHANGE: Removed the border-r class for a cleaner look and centered content vertically
        <aside className="w-20 bg-[#F0FAF8] flex flex-col justify-center py-4">
            <nav className="flex flex-col items-center space-y-2">
                {navItems.map((item, index) => (
                    <Link key={index} href={item.href} title={item.label}>
                        <button
                            aria-label={item.label}
                            className="p-3 rounded-lg hover:bg-gray-200 text-gray-600 hover:text-teal-600 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                        >
                            <item.icon className="h-6 w-6" />
                        </button>
                    </Link>
                ))}
            </nav>
        </aside>
    );
}

export default IconSidebar;