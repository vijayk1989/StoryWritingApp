const TopNav = () => {
  return (
    <nav className="h-12 border-b border-gray-200 flex items-center px-4 bg-white">
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
          <span className="text-sm">Plan</span>
        </button>
        <button className="p-2 bg-gray-800 text-white rounded-md">
          <span className="text-sm">Write</span>
        </button>
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
          <span className="text-sm">Chat</span>
        </button>
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
          <span className="text-sm">Review</span>
        </button>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
          <span className="text-sm">Format</span>
        </button>
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
          <span className="text-sm">Focus</span>
        </button>
      </div>
    </nav>
  );
};

export default TopNav; 