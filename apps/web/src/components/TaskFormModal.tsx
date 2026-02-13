'use client';

import { useState, FormEvent } from 'react';
import { Task, CreateTaskData } from '@/queries/useTaskQueries';
import styles from '@/app/dashboard/dashboard.module.css';

interface TaskFormModalProps {
    task?: Task | null;
    onSubmit: (data: CreateTaskData) => void;
    onClose: () => void;
    loading: boolean;
}

export default function TaskFormModal({ task, onSubmit, onClose, loading }: TaskFormModalProps) {
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [status, setStatus] = useState<'pending' | 'completed'>(task?.status || 'pending');
    const [dueDate, setDueDate] = useState(task?.dueDate?.split('T')[0] || '');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({
            title,
            description: description || undefined,
            status,
            dueDate: dueDate || undefined,
        });
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2>{task ? 'Edit Task' : 'New Task'}</h2>
                <form onSubmit={handleSubmit} className={styles.modalForm}>
                    <input
                        type="text"
                        placeholder="Task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.modalInput}
                        autoFocus
                        required
                    />
                    <textarea
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={styles.modalTextarea}
                        rows={3}
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'pending' | 'completed')}
                        className={styles.modalSelect}
                    >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className={styles.modalInput}
                    />
                    <div className={styles.modalActions}>
                        <button type="button" className={styles.modalCancel} onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.modalSubmit} disabled={loading}>
                            {loading ? 'Saving...' : task ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
