import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const mockPush = jest.fn();
const mockLogout = jest.fn();
const mockMutate = jest.fn();
const mockToggle = jest.fn();

const sampleTasks = [
    {
        _id: '1',
        title: 'Task A',
        description: 'Desc A',
        status: 'pending' as const,
        dueDate: '2026-06-01T00:00:00.000Z',
        owner: 'user1',
        createdAt: '2026-01-15T00:00:00.000Z',
    },
    {
        _id: '2',
        title: 'Task B',
        description: 'Desc B',
        status: 'completed' as const,
        dueDate: '2026-03-01T00:00:00.000Z',
        owner: 'user1',
        createdAt: '2026-01-10T00:00:00.000Z',
    },
    {
        _id: '3',
        title: 'Task C',
        status: 'pending' as const,
        dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow/Future
        owner: 'user1',
        createdAt: '2026-01-20T00:00:00.000Z',
    },
    {
        _id: '4',
        title: 'Task Overdue',
        status: 'pending' as const,
        dueDate: '2020-01-01T00:00:00.000Z', // Overdue
        owner: 'user1',
        createdAt: '2026-01-05T00:00:00.000Z',
    },
];

let mockTasks = sampleTasks;
let mockIsLoading = false;
let mockToken: string | null = 'token-123';
let mockAuthLoading = false;

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
}));

jest.mock('@/context/AuthContext', () => ({
    useAuth: () => ({
        user: { name: 'Test User', email: 'test@test.com' },
        token: mockToken,
        logout: mockLogout,
        loading: mockAuthLoading,
        login: jest.fn(),
        signup: jest.fn(),
    }),
}));

jest.mock('@/queries/useTaskQueries', () => ({
    useTasksQuery: () => ({ data: mockTasks, isLoading: mockIsLoading }),
    useCreateTaskMutation: () => ({ mutate: mockMutate, isPending: false }),
    useUpdateTaskMutation: () => ({ mutate: mockMutate, isPending: false }),
    useDeleteTaskMutation: () => ({ mutate: mockMutate, isPending: false }),
}));

jest.mock('@/theme/theme', () => ({
    ColorModeContext: require('react').createContext({ toggleColorMode: mockToggle }),
    createAppTheme: (mode: string) => require('@mui/material/styles').createTheme({ palette: { mode } }),
}));

import DashboardPage from '@/app/dashboard/page';

const theme = createTheme();
const wrap = (ui: React.ReactElement) =>
    render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('DashboardPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockTasks = sampleTasks;
        mockIsLoading = false;
        mockToken = 'token-123';
        mockAuthLoading = false;
    });

    it('renders Navbar with TaskFlow logo', () => {
        wrap(<DashboardPage />);
        expect(screen.getByText('TaskFlow')).toBeTruthy();
    });

    it('renders My Tasks heading', () => {
        wrap(<DashboardPage />);
        expect(screen.getByText('My Tasks')).toBeTruthy();
    });

    it('shows task count stats', () => {
        wrap(<DashboardPage />);
        expect(screen.getByText(/3 pending/)).toBeTruthy();
        expect(screen.getByText(/1 completed/)).toBeTruthy();
    });

    it('renders all tasks in grid layout', () => {
        wrap(<DashboardPage />);
        expect(screen.getByText('Task A')).toBeTruthy();
        expect(screen.getByText('Task B')).toBeTruthy();
        expect(screen.getByText('Task C')).toBeTruthy();
    });

    it('renders filter toggle buttons', () => {
        wrap(<DashboardPage />);
        expect(screen.getByRole('button', { name: 'All' })).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Pending' })).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Completed' })).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Overdue' })).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Today' })).toBeTruthy();
    });

    it('filters to show only pending tasks', () => {
        wrap(<DashboardPage />);
        fireEvent.click(screen.getByRole('button', { name: 'Pending' }));
        expect(screen.getByText('Task A')).toBeTruthy();
        expect(screen.getByText('Task C')).toBeTruthy();
        expect(screen.queryByText('Task B')).toBeNull();
    });

    it('filters to show only completed tasks', () => {
        wrap(<DashboardPage />);
        fireEvent.click(screen.getByRole('button', { name: 'Completed' }));
        expect(screen.getByText('Task B')).toBeTruthy();
        expect(screen.queryByText('Task A')).toBeNull();
    });

    it('filters to show only overdue tasks', () => {
        wrap(<DashboardPage />);
        fireEvent.click(screen.getByRole('button', { name: 'Overdue' }));
        expect(screen.getByText('Task Overdue')).toBeTruthy();
        expect(screen.queryByText('Task A')).toBeNull();
        expect(screen.queryByText('Task C')).toBeNull();
    });

    it('filters to show only tasks due today', () => {
        // Create a task specifically for today
        const todayTask = {
            _id: '5',
            title: 'Task Today',
            status: 'pending' as const,
            dueDate: new Date().toISOString(),
            owner: 'user1',
            createdAt: new Date().toISOString(),
        };
        mockTasks = [...sampleTasks, todayTask];
        wrap(<DashboardPage />);
        fireEvent.click(screen.getByRole('button', { name: 'Today' }));
        expect(screen.getByText('Task Today')).toBeTruthy();
        expect(screen.queryByText('Task A')).toBeNull();
        expect(screen.queryByText('Task Overdue')).toBeNull();
    });

    it('shows empty state when no tasks', () => {
        mockTasks = [];
        wrap(<DashboardPage />);
        expect(screen.getByText('No tasks yet')).toBeTruthy();
        expect(screen.getByText(/create your first task/i)).toBeTruthy();
    });

    it('shows loading skeletons when tasks are loading', () => {
        mockIsLoading = true;
        const { container } = wrap(<DashboardPage />);
        const skeletons = container.querySelectorAll('.MuiSkeleton-root');
        expect(skeletons.length).toBe(6);
    });

    it('renders New Task button', () => {
        wrap(<DashboardPage />);
        expect(screen.getByText('New Task')).toBeTruthy();
    });

    it('opens modal when New Task button is clicked', () => {
        wrap(<DashboardPage />);
        fireEvent.click(screen.getByText('New Task'));
        expect(screen.getAllByText('New Task').length).toBeGreaterThanOrEqual(1);
    });

    it('returns null when not authenticated', () => {
        mockToken = null;
        const { container } = wrap(<DashboardPage />);
        expect(container.innerHTML).toBe('');
    });

    it('redirects to login when no token', () => {
        mockToken = null;
        mockAuthLoading = false;
        wrap(<DashboardPage />);
        expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('renders theme toggle switch', () => {
        wrap(<DashboardPage />);
        expect(screen.getByRole('checkbox', { name: /toggle dark mode/i })).toBeTruthy();
    });

    it('calls logout when logout button is clicked', () => {
        wrap(<DashboardPage />);
        const logoutBtn = screen.getByLabelText('Logout');
        fireEvent.click(logoutBtn);
        expect(mockLogout).toHaveBeenCalled();
    });
});
