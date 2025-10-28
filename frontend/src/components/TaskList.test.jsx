import { render, screen, waitFor } from '@testing-library/react';
import TaskList from './TaskList';
import { taskService } from '../services/api';

// Mock the API service
vi.mock('../services/api', () => ({
  taskService: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
  },
}));

describe('TaskList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders empty state when no tasks', async () => {
    taskService.getTasks.mockResolvedValue({ data: [] });
    
    render(<TaskList />);
    
    await waitFor(() => {
      // Usar queryAllByText y verificar que existe al menos uno
      const emptyStates = screen.queryAllByText(/Type to add new task/);
      expect(emptyStates.length).toBeGreaterThan(0);
    });
  });

  test('renders tasks when API returns data', async () => {
    const mockTasks = [
      {
        id: 1,
        title: 'Test task 1',
        raw_text: 'Test task 1',
        status: 'open',
        priority: 'normal',
      },
      {
        id: 2, 
        title: 'Test task 2',
        raw_text: 'Test task 2',
        status: 'today',
        priority: 'high',
      }
    ];
    
    taskService.getTasks.mockResolvedValue({ data: mockTasks });
    
    render(<TaskList />);
    
    await waitFor(() => {
      expect(screen.getByText('Test task 1', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('Test task 2', { exact: false })).toBeInTheDocument();
    });
  });

  test('shows loading state initially', () => {
    taskService.getTasks.mockImplementation(() => new Promise(() => {})); 
    
    render(<TaskList />);
    
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });
});