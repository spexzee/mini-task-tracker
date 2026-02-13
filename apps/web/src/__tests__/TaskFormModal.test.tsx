import { render, screen, fireEvent } from '@testing-library/react';
import TaskFormModal from '@/components/TaskFormModal';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

const wrap = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('TaskFormModal', () => {
    const mockSubmit = jest.fn();
    const mockClose = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    it('renders "New Task" title when no task is provided', () => {
        wrap(
            <TaskFormModal onSubmit={mockSubmit} onClose={mockClose} loading={false} />,
        );
        expect(screen.getByText('New Task')).toBeTruthy();
    });

    it('renders "Edit Task" title when a task is provided', () => {
        const task = {
            _id: '1',
            title: 'Existing Task',
            description: 'Desc',
            status: 'pending' as const,
            dueDate: '2026-06-15T00:00:00.000Z',
            owner: 'user1',
            createdAt: '2026-01-01T00:00:00.000Z',
        };
        wrap(
            <TaskFormModal task={task} onSubmit={mockSubmit} onClose={mockClose} loading={false} />,
        );
        expect(screen.getByText('Edit Task')).toBeTruthy();
    });

    it('pre-fills form fields with task data', () => {
        const task = {
            _id: '1',
            title: 'My Task',
            description: 'My Desc',
            status: 'completed' as const,
            dueDate: '2026-06-15T00:00:00.000Z',
            owner: 'user1',
            createdAt: '2026-01-01T00:00:00.000Z',
        };
        wrap(
            <TaskFormModal task={task} onSubmit={mockSubmit} onClose={mockClose} loading={false} />,
        );
        expect(screen.getByDisplayValue('My Task')).toBeTruthy();
        expect(screen.getByDisplayValue('My Desc')).toBeTruthy();
        expect(screen.getByDisplayValue('2026-06-15')).toBeTruthy();
    });

    it('calls onClose when Cancel button clicked', () => {
        wrap(
            <TaskFormModal onSubmit={mockSubmit} onClose={mockClose} loading={false} />,
        );
        fireEvent.click(screen.getByText('Cancel'));
        expect(mockClose).toHaveBeenCalled();
    });

    it('shows "Saving..." when loading', () => {
        wrap(
            <TaskFormModal onSubmit={mockSubmit} onClose={mockClose} loading={true} />,
        );
        expect(screen.getByText('Saving...')).toBeTruthy();
    });

    it('shows "Create" button for new task', () => {
        wrap(
            <TaskFormModal onSubmit={mockSubmit} onClose={mockClose} loading={false} />,
        );
        expect(screen.getByText('Create')).toBeTruthy();
    });

    it('shows "Update" button for existing task', () => {
        const task = {
            _id: '1',
            title: 'Task',
            status: 'pending' as const,
            owner: 'user1',
            createdAt: '2026-01-01T00:00:00.000Z',
        };
        wrap(
            <TaskFormModal task={task} onSubmit={mockSubmit} onClose={mockClose} loading={false} />,
        );
        expect(screen.getByText('Update')).toBeTruthy();
    });

    it('calls onSubmit with form data when submitted', () => {
        wrap(
            <TaskFormModal onSubmit={mockSubmit} onClose={mockClose} loading={false} />,
        );

        const titleInput = screen.getByRole('textbox', { name: /task title/i });
        fireEvent.change(titleInput, { target: { value: 'New task title' } });

        fireEvent.click(screen.getByText('Create'));

        expect(mockSubmit).toHaveBeenCalledWith(
            expect.objectContaining({ title: 'New task title' }),
        );
    });
});
