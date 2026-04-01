"use client";

import { CollectorTask } from "@/types";
import { TaskCard } from "./task-card";
import { ClipboardList, Filter, Search } from "lucide-react";
import { motion } from "framer-motion";

interface TaskQueueProps {
    tasks: CollectorTask[];
}

export default function TaskQueue({ tasks }: TaskQueueProps) {
    return (
        <div className="flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden shadow-sm transition-all hover:border-emerald-200">
            {/* Queue Header */}
            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl shadow-sm border border-emerald-100/50">
                        <ClipboardList className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-foreground tracking-tight uppercase">Active Tasks</h2>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mt-1">
                            {tasks.length} collections pending
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-all text-muted-foreground">
                        <Search size={16} />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-all text-muted-foreground">
                        <Filter size={16} />
                    </button>
                </div>
            </div>

            {/* Queue List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar bg-background/50">
                {tasks.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-4">
                            <ClipboardList size={32} className="text-muted-foreground/30" />
                        </div>
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No Active Tasks</h3>
                        <p className="text-[10px] text-muted-foreground font-medium mt-2 max-w-[150px] mx-auto uppercase tracking-wider">
                            All sectors clear. Awaiting new requests.
                        </p>
                    </div>
                ) : (
                    tasks.map((task, index) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <TaskCard task={task} />
                        </motion.div>
                    ))
                )}
            </div>

            {/* Queue Footer */}
            <div className="p-5 bg-muted/50 border-t border-border">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Queue Load</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                        {tasks.length > 5 ? 'High Demand' : 'Normal Load'}
                    </span>
                </div>
                <div className="h-1 w-full bg-emerald-100 dark:bg-emerald-900/30 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (tasks.length / 10) * 100)}%` }}
                        className="h-full bg-emerald-500 rounded-full"
                    />
                </div>
            </div>
        </div>
    );
}
