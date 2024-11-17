import { useState } from 'react';

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Editor', icon: '📝' },
    { name: 'Chapters', icon: '📚' },
    { name: 'Lorebook', icon: '📖' },
    { name: 'AI Settings', icon: '⚙️' },
    { name: 'Prompts', icon: '💭' },
    { name: 'Chats', icon: '💬' },
  ];

  return (
    <>
      {/* Sidebar */}
      <nav className={`
        fixed top-0 left-0 h-screen bg-white z-[50]
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:w-[20%] lg:sticky lg:z-30
        w-[280px] ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        border-r border-gray-200
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center p-4 border-b border-gray-100">
            <h1 className="text-lg font-semibold text-gray-900">Story Writer</h1>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => (
              <button
                key={item.name}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span className="w-6 text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          lg:hidden fixed z-[60] p-2 hover:bg-gray-100 rounded-md text-gray-700
          ${isOpen 
            ? 'top-[5px] left-[240px]' // When open, position near right edge of sidebar
            : 'top-[5px] left-[5px]'   // When closed, stay at left edge
          }
          transition-all duration-200 ease-in-out
        `}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Overlay */}
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