'use client';

import { Task } from '@/queries/useTaskQueries';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined';
import Fade from '@mui/material/Fade';

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
        <Fade in timeout={400}>
            <Card
                variant="outlined"
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderColor: isOverdue ? 'error.main' : 'divider',
                    opacity: isCompleted ? 0.75 : 1,
                    backdropFilter: 'blur(12px)',
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'dark'
                            ? 'rgba(26, 26, 46, 0.6)'
                            : 'rgba(255, 255, 255, 0.7)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: isCompleted
                            ? 'linear-gradient(90deg, #34d399, #10b981)'
                            : isOverdue
                                ? 'linear-gradient(90deg, #fb7185, #ef4444)'
                                : 'linear-gradient(90deg, #a78bfa, #7c3aed)',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                    },
                    '&:hover': {
                        boxShadow: (theme) =>
                            theme.palette.mode === 'dark'
                                ? '0 8px 32px rgba(167, 139, 250, 0.15)'
                                : '0 8px 32px rgba(124, 58, 237, 0.1)',
                        '&::before': { opacity: 1 },
                    },
                    '&:hover .task-actions': {
                        opacity: 1,
                    },
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2.5, '&:last-child': { pb: 2.5 } }}>
                    {/* Header: checkbox + title + actions */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                        <Checkbox
                            checked={isCompleted}
                            onChange={() => onToggle(task)}
                            sx={{
                                mt: -0.5,
                                color: 'text.secondary',
                                '&.Mui-checked': { color: 'secondary.main' },
                            }}
                        />
                        <Typography
                            variant="body1"
                            fontWeight={600}
                            sx={{
                                flex: 1,
                                textDecoration: isCompleted ? 'line-through' : 'none',
                                color: isCompleted ? 'text.secondary' : 'text.primary',
                                lineHeight: 1.4,
                            }}
                        >
                            {task.title}
                        </Typography>
                        <Box
                            className="task-actions"
                            sx={{
                                display: 'flex',
                                gap: 0.25,
                                opacity: { xs: 1, md: 0 },
                                transition: 'opacity 0.2s',
                            }}
                        >
                            <Tooltip title="Edit">
                                <IconButton size="small" onClick={() => onEdit(task)} color="primary">
                                    <EditOutlined fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton size="small" onClick={() => onDelete(task._id)} color="error">
                                    <DeleteOutline fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* Description */}
                    {task.description && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                mb: 1.5,
                                pl: 5.5,
                                lineHeight: 1.6,
                            }}
                        >
                            {task.description}
                        </Typography>
                    )}

                    {/* Spacer to push chips to bottom */}
                    <Box sx={{ flex: 1 }} />

                    {/* Chips */}
                    <Stack direction="row" spacing={0.75} sx={{ pl: 5.5, flexWrap: 'wrap', gap: 0.5 }}>
                        <Chip
                            label={isCompleted ? 'Completed' : 'Pending'}
                            size="small"
                            color={isCompleted ? 'success' : 'warning'}
                            variant={isCompleted ? 'filled' : 'outlined'}
                            sx={{ fontSize: '0.7rem', height: 24 }}
                        />
                        {task.dueDate && (
                            <Chip
                                icon={<CalendarTodayOutlined sx={{ fontSize: '0.8rem !important' }} />}
                                label={formatDate(task.dueDate)}
                                size="small"
                                color={isOverdue ? 'error' : 'default'}
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 24 }}
                            />
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Fade>
    );
}
