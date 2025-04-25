const ChatSearchBar = () => {
    return (
        <div className="px-4 pt-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full rounded-22 bg-[#1E75BC] placeholder-white px-4 py-2 pl-10 outline-none"
                />
                <svg
                    className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
            </div>
            <hr className="border-gray-300/30 mt-4" />
        </div>
    );
};

export default ChatSearchBar;
