'use client';

import { useState, FormEvent } from 'react';
import { Task, CreateTaskData } from '@/queries/useTaskQueries';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, ReactElement, Ref } from 'react';

const SlideTransition = forwardRef(function Transition(
    props: TransitionProps & { children: ReactElement },
    ref: Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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
        <Dialog
            open
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            slots={{ transition: SlideTransition }}
            slotProps={{
                paper: {
                    sx: {
                        border: 1,
                        borderColor: 'divider',
                    },
                },
            }}
        >
            <Box component="form" onSubmit={handleSubmit}>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    {task ? 'Edit Task' : 'New Task'}
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '16px !important' }}>
                    <TextField
                        label="Task Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                        required
                    />
                    <TextField
                        label="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={3}
                    />
                    <TextField
                        label="Status"
                        select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'pending' | 'completed')}
                    >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                    </TextField>
                    <TextField
                        label="Due Date"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={onClose} variant="outlined" color="inherit">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? 'Saving...' : task ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
