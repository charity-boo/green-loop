'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { CollectorTask } from '@/types';

/**
 * Hook to fetch and sync a single active waste collection job.
 * Handles real-time updates and status transitions.
 * 
 * @param jobId The unique identifier of the waste schedule.
 * @returns An object containing job data, loading state, error, and actions.
 */
export function useActiveJob(jobId: string | undefined) {
    const [job, setJob] = useState<CollectorTask | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOffline, setIsOffline] = useState(false);
    const [hasPendingWrites, setHasPendingWrites] = useState(false);

    useEffect(() => {
        if (!jobId) {
            setJob(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const docRef = doc(db, 'waste', jobId);

            const unsubscribe = onSnapshot(
                docRef,
                { includeMetadataChanges: true },
                (snapshot) => {
                    if (snapshot.exists()) {
                        setJob({
                            id: snapshot.id,
                            ...snapshot.data(),
                            hasPendingWrites: snapshot.metadata.hasPendingWrites,
                        } as unknown as (CollectorTask & { hasPendingWrites: boolean }));
                    } else {
                        setJob(null);
                        setError('Job not found');
                    }
                    setLoading(false);
                    setIsOffline(snapshot.metadata.fromCache);
                    setHasPendingWrites(snapshot.metadata.hasPendingWrites);
                },
                (err) => {
                    console.error('Error in useActiveJob snapshot:', err);
                    setError(err.message);
                    setLoading(false);
                }
            );

            return () => unsubscribe();
        } catch (err) {
            console.error('Error setting up useActiveJob listener:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
            setLoading(false);
        }
    }, [jobId]);

    const startJob = async () => {
        if (!jobId || !db) return;
        const docRef = doc(db, 'waste', jobId);
        return updateDoc(docRef, {
            status: 'active',
            startedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    };

    const updateJob = async (updates: Partial<CollectorTask>) => {
        if (!jobId || !db) return;
        const docRef = doc(db, 'waste', jobId);
        return updateDoc(docRef, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });
    };

    const completeJob = async (weight: number) => {
        if (!jobId) return;
        const response = await fetch(`/api/collector/tasks/${jobId}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ weight }),
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to complete job' }));
            throw new Error(error.message || 'Failed to complete job');
        }
        
        return response.json();
    };

    return {
        job,
        loading,
        error,
        isOffline,
        hasPendingWrites,
        startJob,
        updateJob,
        completeJob
    };
}
