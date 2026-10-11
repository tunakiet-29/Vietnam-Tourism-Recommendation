
import { NavLink } from "react-router-dom";
import { ClipboardList, MapPinned } from "lucide-react";

const adminLinks = [
  {
    to: "/admin/tours",
    label: "Tour Management",
    Icon: MapPinned,
  },
  {
    to: "/admin/bookings",
    label: "Booking Management",
    Icon: ClipboardList,
  },
];

function AdminNavigation() {
  return (
    <div className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <div className="shrink-0">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#df6951]">
            Vietinerary
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Administration
          </p>
        </div>

        <nav
          className="flex flex-wrap gap-2"
          aria-label="Admin navigation"
        >
          {adminLinks.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#df6951]/10 text-[#df6951]"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default AdminNavigation;
