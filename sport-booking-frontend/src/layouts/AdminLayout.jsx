import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Header from '../shared/components/Header';
import Sidebar from '../shared/components/Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        role={user?.role} 
      />
      
      <div className="lg:ml-64 transition-all duration-300">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="p-6">
          {/* Nơi nội dung của các trang con (Dashboard, ManageFields...) hiển thị */}
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;