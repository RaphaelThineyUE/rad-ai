import { PropsWithChildren, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, Menu, MenuItem } from "../../lib/mui";
import { LogOut, User } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Patients", href: "/patients" },
  { label: "Analytics", href: "/analytics" },
  { label: "How-To", href: "/how-to" }
];

const Layout = ({ children }: PropsWithChildren) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("radreport_token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-rose-100 text-slate-900">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-rose-600">
            RadReport AI
          </Link>
          <nav className="flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? "text-rose-600" : "text-slate-600"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div>
            <Button
              variant="outlined"
              startIcon={<User size={16} />}
              onClick={(event) => setMenuAnchor(event.currentTarget)}
            >
              Account
            </Button>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => {
                  setMenuAnchor(null);
                  handleLogout();
                }}
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </MenuItem>
            </Menu>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
};

export default Layout;
