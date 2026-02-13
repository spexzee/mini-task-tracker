'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    useTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    Task,
    CreateTaskData,
} from '@/queries/useTaskQueries';
import TaskCard from '@/components/TaskCard';
import TaskFormModal from '@/components/TaskFormModal';
import styles from './dashboard.module.css';

export default function DashboardPage() {
    const { user, token, logout, loading: authLoading } = useAuth();
    const router = useRouter();

    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const { data: tasks, isLoading } = useTasksQuery();
    const createMutation = useCreateTaskMutation();
    const updateMutation = useUpdateTaskMutation();
    const deleteMutation = useDeleteTaskMutation();

    useEffect(() => {
        if (!authLoading && !token) {
            router.push('/login');
        }
    }, [authLoading, token, router]);

    if (authLoading || !token) return null;

    const handleCreate = (data: CreateTaskData) => {
        createMutation.mutate(data, {
            onSuccess: () => setShowModal(false),
        });
    };

    const handleUpdate = (data: CreateTaskData) => {
        if (!editingTask) return;
        updateMutation.mutate({ id: editingTask._id, ...data }, {
            onSuccess: () => {
                setEditingTask(null);
                setShowModal(false);
            },
        });
    };

    const handleToggle = (task: Task) => {
        updateMutation.mutate({
            id: task._id,
            status: task.status === 'completed' ? 'pending' : 'completed',
        });
    };

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id);
    };

    const openEdit = (task: Task) => {
        setEditingTask(task);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTask(null);
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1>My Tasks</h1>
                    <p>Welcome back, {user?.name}</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.addButton} onClick={() => setShowModal(true)}>
                        + New Task
                    </button>
                    <button className={styles.logoutButton} onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>

            <div className={styles.taskList}>
                {isLoading ? (
                    <p className={styles.loading}>Loading tasks...</p>
                ) : !tasks?.length ? (
                    <p className={styles.emptyState}>No tasks yet. Create your first task!</p>
                ) : (
                    tasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onToggle={handleToggle}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>

            {showModal && (
                <TaskFormModal
                    task={editingTask}
                    onSubmit={editingTask ? handleUpdate : handleCreate}
                    onClose={closeModal}
                    loading={createMutation.isPending || updateMutation.isPending}
                />
            )}
        </div>
    );
}
