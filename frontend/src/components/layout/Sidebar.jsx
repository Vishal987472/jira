import {
    LayoutDashboard,
    ListTodo,
    X
} from "lucide-react";

import { NavLink } from "react-router-dom";

const links = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard
    },
    {
        name: "Tasks",
        path: "/tasks",
        icon: ListTodo
    }
];

export default function Sidebar() {

    return (
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:block">

            <div className="flex h-16 items-center border-b border-slate-200 px-6">

                <div className="flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
                        J
                    </div>

                    <span className="text-lg font-bold">
                        Jira Tasks
                    </span>

                </div>

            </div>

            <nav className="space-y-1 p-4">

                {links.map((link) => {

                    const Icon = link.icon;

                    return (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                    isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-slate-600 hover:bg-slate-100"
                                }`
                            }
                        >
                            <Icon size={18} />
                            {link.name}
                        </NavLink>
                    );

                })}

            </nav>

        </aside>
    );
}