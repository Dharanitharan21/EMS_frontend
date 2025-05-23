import { Link, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Home,
  Building2,
  Calendar,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import '../Styles/Adminlayout.css'

function Adminlayout( {children}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const name= localStorage.getItem("name")
  const role = localStorage.getItem("role");
  if (role !== "admin") {
    return <Navigate to="/" />;
  }

  const handleLogout = (e) => {
   e.stopPropagation(); 
    localStorage.clear();
    navigate('/');
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <Home className="icon" /> },
    { name: 'Departments', path: '/admin/departments', icon: <Building2 className="icon" /> },
    { name: 'Leave Types', path: '/admin/leave-types', icon: <Calendar className="icon" /> },
    { name: 'Employees', path: '/admin/employees', icon: <Users className="icon" /> },
    { name: 'Leave Applications', path: '/admin/leave-applications', icon: <ClipboardList className="icon" /> },
    {
      name: 'Settings',
      icon: <Settings className="icon" />,
      children: [
        { name: 'Change Password', path: '/admin/settings/change-password' },
      ],
    }

  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));
  };
const handleDropdownToggle = (name) => {
  setOpenDropdown((prev) => (prev === name ? null : name));
};
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h1 className="admin-logo">Leave Management</h1>
        </div>
        <nav className="admin-nav-menu">
          {navItems.map((item, index) => (
            item.children ? (
              <div key={index} className="admin-nav-dropdown">
                <button
                  className={`admin-nav-link ${isActive('/admin/settings') ? 'active' : ''}`}
                  onClick={() => handleDropdownToggle(item.name)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
                {openDropdown === item.name && (
                  <div className="admin-dropdown-children">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`admin-nav-sublink ${isActive(child.path) ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setOpenDropdown(null);
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            )
          ))}


        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">{name?.charAt(0).toUpperCase()}</div>
            <div>
              <p className="admin-user-name">{name}</p>
              <p className="admin-user-role">Administrator</p>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut className="admin-icon" />
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-main-section">
        <header className="admin-mobile-header">
          <button className="admin-menu-btn" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="admin-icon" /> : <Menu className="admin-icon" />}
          </button>
          <h1 className="admin-mobile-logo">Leave Management</h1>
          <div className="admin-user-avatar-mobile">{name?.charAt(0).toUpperCase()}</div>
        </header>

        {isMobileMenuOpen && (
          <div className="admin-mobile-menu-overlay" onClick={toggleMobileMenu}>
            <div className="admin-mobile-menu" onClick={e => e.stopPropagation()}>
              <div className="admin-mobile-menu-header">
                <h1 className="admin-logo">Leave Management</h1>
                <button  onClick={toggleMobileMenu}><X className="admin-icon" /></button>
              </div>
              <nav className="admin-nav-menu">
                {navItems.map((item ,index) => (
                  item.children ? (
              <div key={index} className="admin-nav-dropdown">
                <button
                  className={`admin-nav-link ${isActive('/admin/settings') ? 'active' : ''}`}
                  onClick={() => handleDropdownToggle(item.name)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
                {openDropdown === item.name && (
                  <div className="admin-dropdown-children">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`admin-nav-sublink ${isActive(child.path) ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`admin-nav-link ${isActive(item.path) ? 'active' : ''}`}
                    onClick={toggleMobileMenu}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
            )
                ))}
              </nav>
              <div className="admin-sidebar-footer">
                <div className="admin-user-info">
                  <div className="admin-user-avatar">{name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <p className="admin-user-name">{name}</p>
                    <p className="admin-user-role">Administrator</p>
                  </div>
                </div>
                <button className="admin-logout-btn" onClick={(e) => { handleLogout(e); toggleMobileMenu() }}>
                  <LogOut className="admin-icon" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
      {children}
    </div>
  );
}

export default Adminlayout;
