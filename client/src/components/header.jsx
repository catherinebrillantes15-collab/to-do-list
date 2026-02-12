import { useNavigate } from "react-router-dom";

function header({ onLogout, listTitle, showBackButton, onBack }) {
    const navigate = useNavigate();
    
    const handleLogoutClick = async () => {
        await onLogout();
    };

    const handleBackClick = () => {
        if (onBack) {
            onBack();
        }
    };
    
    return (
        <div className="w-full bg-gradient-to-r from-pink-600 to-pink-500 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {showBackButton && (
                <button
                  onClick={handleBackClick}
                  className="bg-white text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-full font-bold transition"
                >
                  ← Back
                </button>
              )}
              <h1 className="text-3xl font-bold text-white">
                {listTitle || "To-Do List App"}
              </h1>
            </div>
            {onLogout && (
              <button
                onClick={handleLogoutClick}
                className="bg-white text-pink-600 hover:bg-pink-50 px-6 py-2 rounded-full font-bold transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
    );
}

export default header;