import { NavLink } from '@/components/NavLink';
import { Film, Calendar, Ticket, LayoutGrid } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Movies', icon: Film },
  { to: '/shows', label: 'Shows', icon: Calendar },
  { to: '/bookings', label: 'Bookings', icon: Ticket },
];

export function Navbar() {
  return (
    <nav className="glass sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CineBook</span>
          </div>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
                activeClassName="text-primary bg-secondary"
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
