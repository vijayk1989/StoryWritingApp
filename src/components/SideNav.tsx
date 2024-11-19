import { useState, useEffect } from 'react';
import { HiChevronRight, HiX, HiBookOpen, HiCog, HiChat, HiHome } from 'react-icons/hi';

interface SideNavProps {
  storyId?: string;
}

const SideNav = ({ storyId }: SideNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  // Move path detection to useEffect to ensure client-side only
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const menuItems = [
    ...(storyId ? [
      { name: 'Chapters', icon: <HiBookOpen className="w-5 h-5" />, path: `/story/${storyId}` },
      { name: 'Lorebook', icon: <HiBookOpen className="w-5 h-5" />, path: `/story/${storyId}/lorebook` },
      { name: 'AI Settings', icon: <HiCog className="w-5 h-5" />, path: `/story/${storyId}/settings` },
      { name: 'Prompts', icon: <HiChat className="w-5 h-5" />, path: `/story/${storyId}/prompts` },
      { name: 'Chats', icon: <HiChat className="w-5 h-5" />, path: `/story/${storyId}/chats` },
    ] : []),
    { name: 'My Stories', icon: <HiHome className="w-5 h-5" />, path: '/' }
  ];

  return (
    <>
      <nav className={`
        fixed top-0 left-0 h-screen bg-white z-[50]
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:w-[20%] lg:sticky lg:z-30
        w-[280px] ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        border-r border-gray-200
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center p-4 border-b border-gray-100">
            <h1 className="text-lg font-semibold text-gray-900">Story Writer</h1>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 transition-colors
                  ${currentPath === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <span className="w-6 text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          lg:hidden fixed z-[60] text-gray-700
          ${isOpen
            ? 'top-[12px] left-[240px]'
            : 'top-[12px] left-[16px]'
          }
          transition-all duration-200 ease-in-out
        `}
      >
        {isOpen ? <HiX size={24} /> : <HiChevronRight size={24} />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[40]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SideNav; 