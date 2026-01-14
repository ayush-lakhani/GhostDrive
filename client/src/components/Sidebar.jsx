import { Plus, HardDrive, Clock, Trash2, Cloud, Monitor, Users } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const Sidebar = ({ onNewClick }) => {
    const location = useLocation();
    
    const NavItem = ({ icon: Icon, label, path, active }) => (
        <Link 
            to={path}
            className={`flex items-center gap-3 px-4 py-1.5 rounded-l-full text-sm font-medium ml-3 transition-colors ${
                active 
                ? 'bg-ghost-accent/10 text-ghost-accent' 
                : 'text-gray-300 hover:bg-dark-800 hover:text-white'
            }`}
        >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
        </Link>
    );

    return (
        <aside className="w-64 flex flex-col pt-4 pb-4 h-full">
            {/* New Button */}
            <div className="px-4 mb-6">
                <button 
                    onClick={onNewClick}
                    className="flex items-center gap-3 bg-white text-dark-900 px-5 py-4 rounded-2xl shadow hover:shadow-lg transition-all hover:bg-gray-50 active:scale-95 group"
                >
                    <Plus className="w-6 h-6 text-ghost-accent group-hover:rotate-90 transition-transform duration-300" />
                    <span className="font-semibold text-sm tracking-wide">New Ghost</span>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
                <NavItem icon={HardDrive} label="My Drive" path="/" active={location.pathname === '/'} />
                <NavItem icon={Monitor} label="Computers" path="/computers" />
                <NavItem icon={Users} label="Shared with me" path="/shared" />
                <NavItem icon={Clock} label="Recent" path="/recent" active={location.pathname === '/recent'} />
                <NavItem icon={Trash2} label="Trash" path="/trash" />
            </nav>

            {/* Storage (Mock) */}
            <div className="px-6 mt-auto">
                <div className="border-t border-dark-700 pt-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <Cloud className="w-4 h-4" />
                        <span className="text-xs font-medium">Storage</span>
                    </div>
                    <div className="h-1 w-full bg-dark-800 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-ghost-accent w-[15%]"></div>
                    </div>
                    <p className="text-[10px] text-gray-500">2.6 GB of 15 GB used</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
