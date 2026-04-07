"use client";

import { useAuth } from "@/hooks/use-auth";
import { useCollectorTasks } from "@/hooks/use-collector-tasks";
import InteractiveMap from "@/components/dashboard/collector/interactive-map";
import { useMemo } from "react";
import { motion } from "framer-motion";

export default function OverviewClient() {
    const { user } = useAuth();
    const { tasks } = useCollectorTasks(user?.uid || '');

    const activeTasks = useMemo(() => tasks.filter(t => t.status !== 'completed'), [tasks]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Interactive Map */}
                <div className="xl:col-span-12">
                    <InteractiveMap tasks={tasks} activeTasks={activeTasks} />
                </div>
            </div>
        </motion.div>
    );
}
