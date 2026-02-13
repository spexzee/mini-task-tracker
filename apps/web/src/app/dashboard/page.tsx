'use client';

import { useState, useMemo } from 'react';
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
import Navbar from '@/components/Navbar';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Fab from '@mui/material/Fab';
import Fade from '@mui/material/Fade';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import AddOutlined from '@mui/icons-material/AddOutlined';
import TaskAltOutlined from '@mui/icons-material/TaskAltOutlined';

type StatusFilter = 'all' | 'pending' | 'completed' | 'overdue' | 'today';
type SortOption = 'newest' | 'dueDate';

export default function DashboardPage() {
    const { user, token, logout, loading: authLoading } = useAuth();
    const router = useRouter();
    const theme = useTheme();

    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [sortBy, setSortBy] = useState<SortOption>('newest');

    const { data: tasks, isLoading } = useTasksQuery();
    const createMutation = useCreateTaskMutation();
    const updateMutation = useUpdateTaskMutation();
    const deleteMutation = useDeleteTaskMutation();

    const isDark = theme.palette.mode === 'dark';

    // Redirect if not authenticated
    if (!authLoading && !token) {
        router.push('/login');
    }

    const filteredTasks = useMemo(() => {
        if (!tasks) return [];
        let result = [...tasks];

        if (statusFilter === 'overdue') {
            const now = new Date();
            result = result.filter((t) => t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed');
        } else if (statusFilter === 'today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            result = result.filter((t) => {
                if (!t.dueDate) return false;
                const d = new Date(t.dueDate);
                return d >= today && d < tomorrow;
            });
        } else if (statusFilter !== 'all') {
            result = result.filter((t) => t.status === statusFilter);
        }

        if (sortBy === 'dueDate') {
            result.sort((a, b) => {
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            });
        } else {
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return result;
    }, [tasks, statusFilter, sortBy]);

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

    const pendingCount = tasks?.filter((t) => t.status === 'pending').length || 0;
    const completedCount = tasks?.filter((t) => t.status === 'completed').length || 0;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: isDark
                    ? 'linear-gradient(160deg, #0f0c29 0%, #1a1a2e 40%, #302b63 100%)'
                    : 'linear-gradient(160deg, #faf5ff 0%, #f5f3ff 40%, #ede9fe 100%)',
            }}
        >
            <Navbar userName={user?.name} onLogout={logout} showUserControls />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Stats + Filter Bar */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                        mb: 3,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                background: isDark
                                    ? 'linear-gradient(135deg, #f1f5f9 0%, #c4b5fd 100%)'
                                    : 'linear-gradient(135deg, #1e1b4b 0%, #7c3aed 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            My Tasks
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                            {pendingCount} pending · {completedCount} completed
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<AddOutlined />}
                        onClick={() => setShowModal(true)}
                        sx={{ display: { xs: 'none', sm: 'flex' } }}
                    >
                        New Task
                    </Button>
                </Box>

                {/* Filter Controls */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        mb: 3,
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    <ToggleButtonGroup
                        value={statusFilter}
                        exclusive
                        onChange={(_, val) => val && setStatusFilter(val)}
                        size="small"
                        sx={{
                            '& .MuiToggleButton-root': {
                                borderRadius: '10px !important',
                                px: 2,
                                fontWeight: 600,
                                textTransform: 'none',
                                border: '1px solid',
                                borderColor: 'divider',
                                '&.Mui-selected': {
                                    bgcolor: isDark ? 'rgba(167, 139, 250, 0.15)' : 'rgba(124, 58, 237, 0.08)',
                                    color: 'primary.main',
                                    borderColor: 'primary.main',
                                },
                            },
                        }}
                    >
                        <ToggleButton value="all">All</ToggleButton>
                        <ToggleButton value="pending">Pending</ToggleButton>
                        <ToggleButton value="completed">Completed</ToggleButton>
                        <ToggleButton value="overdue">Overdue</ToggleButton>
                        <ToggleButton value="today">Today</ToggleButton>
                    </ToggleButtonGroup>

                    <TextField
                        select
                        size="small"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        sx={{ minWidth: 150 }}
                        label="Sort by"
                    >
                        <MenuItem value="newest">Newest first</MenuItem>
                        <MenuItem value="dueDate">Due date</MenuItem>
                    </TextField>
                </Box>

                {/* Task Grid */}
                <Grid container spacing={2.5}>
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                                <Skeleton
                                    variant="rounded"
                                    height={160}
                                    sx={{ borderRadius: 4, bgcolor: isDark ? 'rgba(167,139,250,0.08)' : 'rgba(124,58,237,0.06)' }}
                                />
                            </Grid>
                        ))
                    ) : !filteredTasks.length ? (
                        <Grid size={{ xs: 12 }}>
                            <Fade in>
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        py: 8,
                                        color: 'text.secondary',
                                    }}
                                >
                                    <TaskAltOutlined sx={{ fontSize: 80, mb: 2, opacity: 0.2 }} />
                                    <Typography variant="h6" fontWeight={500}>
                                        {statusFilter === 'all'
                                            ? 'No tasks yet'
                                            : `No ${statusFilter} tasks`}
                                    </Typography>
                                    <Typography variant="body2" mt={1}>
                                        {statusFilter === 'all'
                                            ? 'Create your first task to get started!'
                                            : 'Try changing the filter.'}
                                    </Typography>
                                </Box>
                            </Fade>
                        </Grid>
                    ) : (
                        filteredTasks.map((task) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={task._id}>
                                <TaskCard
                                    task={task}
                                    onToggle={handleToggle}
                                    onEdit={openEdit}
                                    onDelete={handleDelete}
                                />
                            </Grid>
                        ))
                    )}
                </Grid>
            </Container>

            {/* Mobile FAB */}
            <Fab
                color="primary"
                onClick={() => setShowModal(true)}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    display: { xs: 'flex', sm: 'none' },
                    boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
                }}
            >
                <AddOutlined />
            </Fab>

            {showModal && (
                <TaskFormModal
                    task={editingTask}
                    onSubmit={editingTask ? handleUpdate : handleCreate}
                    onClose={closeModal}
                    loading={createMutation.isPending || updateMutation.isPending}
                />
            )}
        </Box>
    );
}
