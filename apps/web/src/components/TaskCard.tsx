'use client';

import { Task } from '@/queries/useTaskQueries';
import styles from '@/app/dashboard/dashboard.module.css';

interface TaskCardProps {
    task: Task;
    onToggle: (task: Task) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
    const isCompleted = task.status === 'completed';
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });

    return (
        <div className={styles.taskCard}>
            <button
                className={isCompleted ? styles.checkboxCompleted : styles.checkbox}
                onClick={() => onToggle(task)}
                aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
            >
                {isCompleted ? '✓' : ''}
            </button>
            <div className={styles.taskContent}>
                <p className={isCompleted ? styles.taskTitleCompleted : styles.taskTitle}>
                    {task.title}
                </p>
                {task.description && (
                    <p className={styles.taskDescription}>{task.description}</p>
                )}
                <div className={styles.taskMeta}>
                    {task.dueDate && (
                        <span className={isOverdue ? styles.dueDateOverdue : ''}>
                            Due: {formatDate(task.dueDate)}
                        </span>
                    )}
                    <span>Created: {formatDate(task.createdAt)}</span>
                </div>
            </div>
            <div className={styles.taskActions}>
                <button className={styles.editButton} onClick={() => onEdit(task)}>
                    Edit
                </button>
                <button className={styles.deleteButton} onClick={() => onDelete(task._id)}>
                    Delete
                </button>
            </div>
        </div>
    );
}
