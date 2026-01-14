import { Search, HelpCircle, Settings, LayoutGrid } from 'lucide-react';

const DriveHeader = () => {
    return (
        <header className="h-16 flex items-center justify-between px-4 py-2 border-b border-dark-700/50">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-500 group-focus-within:text-white transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search in Drive"
                        className="block w-full pl-10 pr-3 py-2.5 border-none rounded-full leading-5 bg-dark-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:bg-white focus:text-dark-900 focus:placeholder-gray-600 focus:ring-0 transition-all shadow-inner"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-dark-800 transition-colors">
                    <HelpCircle className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-dark-800 transition-colors">
                    <Settings className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-dark-800 transition-colors">
                    <LayoutGrid className="w-5 h-5" />
                </button>
                <div className="w-8 h-8 rounded-full bg-ghost-accent flex items-center justify-center text-white text-sm font-bold ml-2 cursor-pointer hover:ring-2 ring-offset-2 ring-offset-dark-900 ring-ghost-accent">
                    A
                </div>
            </div>
        </header>
    );
};

export default DriveHeader;
