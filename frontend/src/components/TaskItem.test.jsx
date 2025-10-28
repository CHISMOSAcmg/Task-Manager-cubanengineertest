import { render, screen } from '@testing-library/react';
import TaskItem from './TaskItem';

const mockTask = {
  id: 1,
  title: 'Test task @team #project email@test.com https://example.com',
  raw_text: 'Test task @team #project email@test.com https://example.com',
  status: 'open',
  priority: 'normal',
  is_public: false,
  mentions: ['team'],
  hashtags: ['project'],
  emails: ['email@test.com'],
  links: ['https://example.com']
};

describe('TaskItem Component', () => {
  test('renders task content with parsed text', () => {
    render(<TaskItem task={mockTask} />);
    
    // El texto está dividido, usar una búsqueda más flexible
    expect(screen.getByText('Test task', { exact: false })).toBeInTheDocument();
    
    // Verificar elementos de parsing
    const mentions = screen.getAllByText(/@team/);
    expect(mentions[0]).toHaveClass('mention');
    
    const hashtags = screen.getAllByText(/#project/);
    expect(hashtags[0]).toHaveClass('hashtag');
    
    const emails = screen.getAllByText(/email@test.com/);
    expect(emails[0]).toHaveClass('email');
    
    const links = screen.getAllByText(/https:\/\/example.com/);
    expect(links[0]).toHaveClass('link');
  });

  test('renders task metadata correctly', () => {
    render(<TaskItem task={mockTask} />);
    
    expect(screen.getByText('open')).toBeInTheDocument();
    expect(screen.getByText('normal')).toBeInTheDocument();
  });

  test('renders public tag when task is public', () => {
    const publicTask = { ...mockTask, is_public: true };
    render(<TaskItem task={publicTask} />);
    
    expect(screen.getByText('Public')).toBeInTheDocument();
  });
});