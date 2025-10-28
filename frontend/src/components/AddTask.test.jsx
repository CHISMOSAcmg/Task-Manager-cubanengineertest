import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTask from './AddTask';

const mockOnAddTask = vi.fn();

describe('AddTask Component', () => {
  beforeEach(() => {
    mockOnAddTask.mockClear();
  });

  test('renders empty state correctly', () => {
    render(<AddTask onAddTask={mockOnAddTask} />);
    expect(screen.getByText('[ ] Type to add new task')).toBeInTheDocument();
  });

  test('enters editing mode when clicked', async () => {
    const user = userEvent.setup();
    render(<AddTask onAddTask={mockOnAddTask} />);
    
    await user.click(screen.getByText('[ ] Type to add new task'));
    
    expect(screen.getByPlaceholderText('Type to add new task')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  test('changes OK button to Add when text is entered', async () => {
    const user = userEvent.setup();
    render(<AddTask onAddTask={mockOnAddTask} />);
    
    await user.click(screen.getByText('[ ] Type to add new task'));
    await user.type(screen.getByPlaceholderText('Type to add new task'), 'Test task');
    
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  test('parses text correctly for mentions, hashtags, emails, and links', async () => {
    const user = userEvent.setup();
    render(<AddTask onAddTask={mockOnAddTask} />);
    
    await user.click(screen.getByText('[ ] Type to add new task'));
    const input = screen.getByPlaceholderText('Type to add new task');
    
    // Escribir texto con espacios entre elementos para mejor parsing
    await user.type(input, 'Hello @team check #project test@email.com https://example.com');
    
    // Verificar que el parsing se muestra correctamente
    // Usar getAllByText ya que puede haber múltiples elementos
    const mentions = screen.getAllByText(/@team/);
    expect(mentions[0]).toHaveClass('mention');
    
    const hashtags = screen.getAllByText(/#project/);
    expect(hashtags[0]).toHaveClass('hashtag');
    
    const emails = screen.getAllByText(/test@email.com/);
    expect(emails[0]).toHaveClass('email');
    
    const links = screen.getAllByText(/https:\/\/example.com/);
    expect(links[0]).toHaveClass('link');
  });

  test('calls onAddTask with correct data when form is submitted', async () => {
    const user = userEvent.setup();
    render(<AddTask onAddTask={mockOnAddTask} />);
    
    await user.click(screen.getByText('[ ] Type to add new task'));
    await user.type(screen.getByPlaceholderText('Type to add new task'), 'Test task @team');
    await user.click(screen.getByText('Add'));

    expect(mockOnAddTask).toHaveBeenCalledWith({
      title: 'Test task @team',
      raw_text: 'Test task @team',
      status: 'open',
      priority: 'normal',
      is_public: false,
      due_date: expect.any(String)
    });
  });

  test('cancels correctly and resets form', async () => {
    const user = userEvent.setup();
    render(<AddTask onAddTask={mockOnAddTask} />);
    
    await user.click(screen.getByText('[ ] Type to add new task'));
    await user.type(screen.getByPlaceholderText('Type to add new task'), 'Test task');
    
    // Hacer clic en Cancel antes de que se envíe
    await user.click(screen.getByText('Cancel'));

    expect(screen.getByText('[ ] Type to add new task')).toBeInTheDocument();
    expect(mockOnAddTask).not.toHaveBeenCalled();
  });
});