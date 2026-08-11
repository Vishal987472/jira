import { useEffect, useState } from "react";

import {
    CheckCircle2,
    CircleDot,
    Clock3,
    Eye,
    ListTodo,
    Lightbulb
} from "lucide-react";

import { getDashboard } from "../services/dashboardService";

const cards = [
    {
        key: "totalTasks",
        label: "Total Tasks",
        icon: ListTodo
    },
    {
        key: "ideaTasks",
        label: "Ideas",
        icon: Lightbulb
    },
    {
        key: "todoTasks",
        label: "To Do",
        icon: CircleDot
    },
    {
        key: "inProgressTasks",
        label: "In Progress",
        icon: Clock3
    },
    {
        key: "inReviewTasks",
        label: "In Review",
        icon: Eye
    },
    {
        key: "completedTasks",
        label: "Completed",
        icon: CheckCircle2
    }
];

export default function Dashboard() {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const data = await getDashboard();

            setStats(data);

        } finally {

            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    Dashboard
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Overview of your tasks
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {cards.map((card) => {

                    const Icon = card.icon;

                    return (
                        <div
                            key={card.key}
                            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                        >

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        {card.label}
                                    </p>

                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {stats?.[card.key] ?? 0}
                                    </p>
                                </div>

                                <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                                    <Icon size={22} />
                                </div>

                            </div>

                        </div>
                    );

                })}

            </div>

        </div>
    );
}