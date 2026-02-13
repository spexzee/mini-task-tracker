import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '@/components/TaskCard';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

const wrap = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const basePendingTask = {
    _id: '1',
    title: 'Test Task',
    description: 'A test description',
    status: 'pending' as const,
    dueDate: '2026-12-01T00:00:00.000Z',
    owner: 'user1',
    createdAt: '2026-01-01T00:00:00.000Z',
};

const baseCompletedTask = {
    ...basePendingTask,
    _id: '2',
    title: 'Done Task',
    status: 'completed' as const,
};

describe('TaskCard', () => {
    const mockToggle = jest.fn();
    const mockEdit = jest.fn();
    const mockDelete = jest.fn();

    beforeEach(() => jest.clearAllMocks());

    it('renders task title and description', () => {
        wrap(
            <TaskCard task={basePendingTask} onToggle={mockToggle} onEdit={mockEdit} onDelete={mockDelete} />,
        );
        expect(screen.getByText('Test Task')).toBeTruthy();
        expect(screen.getByText('A test description')).toBeTruthy();
    });

    it('shows Pending chip for pending task', () => {
        wrap(
            <TaskCard task={basePendingTask} onToggle={mockToggle} onEdit={mockEdit} onDelete={mockDelete} />,
        );
        expect(screen.getByText('Pending')).toBeTruthy();
    });

    it('shows Completed chip for completed task', () => {
        wrap(
            <TaskCard task={baseCompletedTask} onToggle={mockToggle} onEdit={mockEdit} onDelete={mockDelete} />,
        );
        expect(screen.getByText('Completed')).toBeTruthy();
    });

    it('renders formatted due date', () => {
        wrap(
            <TaskCard task={basePendingTask} onToggle={mockToggle} onEdit={mockEdit} onDelete={mockDelete} />,
        );
        expect(screen.getByText(/1 Dec 2026/)).toBeTruthy();
    });

    it('calls onToggle when checkbox is clicked', () => {
        wrap(
            <TaskCard task={basePendingTask} onToggle={mockToggle} onEdit={mockEdit} onDelete={mockDelete} />,
        );
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mockToggle).toHaveBeenCalledWith(basePendingTask);
    });

    it('calls onEdit when edit button is clicked', () => {
        wrap(
            <TaskCard task={basePendingTask} onToggle={mockToggle} onEdit={mockEdit} onDelete={mockDelete} />,
        );
        const editBtn = screen.getByLabelText('Edit');
        fireEvent.click(editBtn);
        expect(mockEdit).toHaveBeenCalledWith(basePendingTask);
    });

    it('calls onDelete when delete button is clicked', () => {
        wrap(
            <TaskCard task={basePendingTask} onToggle={mockToggle} onEdit={mockEdit} onDelete={mockDelete} />,
        );
        const deleteBtn = screen.getByLabelText('Delete');
        fireEvent.click(deleteBtn);
        expect(mockDelete).toHaveBeenCalledWith('1');
    });

    it('renders without due date', () => {
        const noDueTask = { ...basePendingTask, dueDate: undefined };
        wrap(
            <TaskCard task={noDueTask} onToggle={mockToggle} onEdit={mockEdit} onDelete={mockDelete} />,
        );
        expect(screen.getByText('Test Task')).toBeTruthy();
    });

    it('renders without description', () => {
        const noDescTask = { ...basePendingTask, description: undefined };
        wrap(
            <TaskCard task={noDescTask} onToggle={mockToggle} onEdit={mockEdit} onDelete={mockDelete} />,
        );
        expect(screen.getByText('Test Task')).toBeTruthy();
        expect(screen.queryByText('A test description')).toBeNull();
    });
});
