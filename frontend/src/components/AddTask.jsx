import React, { useState, useEffect, useRef } from 'react';

const AddTask = ({ onAddTask, onCancel, editingTask, isEditing = false }) => {
  const [isActive, setIsActive] = useState(isEditing);
  const [taskText, setTaskText] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const textareaRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    if (isEditing && editingTask) {
      const newText = editingTask.raw_text || editingTask.title || '';
      setTaskText(newText);
      

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.value = newText;
          adjustTextareaHeight();
          syncScroll();
          
          textareaRef.current.setSelectionRange(0, 0);
        }
      }, 50);
    }
  }, [isEditing, editingTask]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const syncScroll = () => {
    if (textareaRef.current && previewRef.current) {
      previewRef.current.scrollTop = textareaRef.current.scrollTop;
      previewRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const handleScroll = () => {
    syncScroll();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current && previewRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      const newHeight = textarea.scrollHeight;
      textarea.style.height = newHeight + 'px';
      previewRef.current.style.height = newHeight + 'px';
    }
  };

  useEffect(() => {
    if ((isActive || isEditing) && textareaRef.current) {
      textareaRef.current.focus();
      adjustTextareaHeight();
      syncScroll();
      
      if (isEditing) {
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.setSelectionRange(0, 0);
          }
        }, 10);
      }
    }
  }, [isActive, isEditing]);

  useEffect(() => {
    adjustTextareaHeight();
    syncScroll();
  }, [taskText]);

  const handleInputChange = (e) => {
    setTaskText(e.target.value);
    
    requestAnimationFrame(() => {
      adjustTextareaHeight();
      syncScroll();
    });
  };

  // Función para renderizar texto con colores
  const renderColoredText = (text) => {
    if (!text) return null;

    const elements = [];
    let lastIndex = 0;
    
    // Patrones en el orden correcto
    const patterns = [
      { regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, type: 'email' },
      { regex: /(https?|ftp):\/\/[^\s<]+|www\.[^\s<]+\.[^\s<]+/g, type: 'link' },
      { regex: /(^|\s)(@[^\s]+)/g, type: 'mention' },
      { regex: /(^|\s)(#[^\s]+)/g, type: 'hashtag' }
    ];

    const matches = [];
    
    patterns.forEach(({ regex, type }) => {
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({ 
          type, 
          text: match[0], 
          index: match.index, 
          length: match[0].length 
        });
      }
    });

    // Ordenar por posición
    matches.sort((a, b) => a.index - b.index);
    
    // Eliminar overlaps
    const cleanMatches = [];
    let lastEnd = 0;
    matches.forEach(match => {
      if (match.index >= lastEnd) {
        cleanMatches.push(match);
        lastEnd = match.index + match.length;
      }
    });

    // Construir elementos
    cleanMatches.forEach((match, i) => {
      // Texto normal antes del match
      if (match.index > lastIndex) {
        const normalText = text.slice(lastIndex, match.index);
        elements.push(
          <span key={`normal-${i}`} className="input-normal-text">
            {normalText}
          </span>
        );
      }

      // Texto con color
      const className = `input-${match.type}`;
      elements.push(
        <span key={`${match.type}-${i}`} className={className}>
          {match.text}
        </span>
      );

      lastIndex = match.index + match.length;
    });

    // Texto restante
    if (lastIndex < text.length) {
      elements.push(
        <span key="normal-final" className="input-normal-text">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return elements;
  };

  const getActionButtonIcon = () => {
    if (isEditing) {
      return<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="main-grid-item-icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
  <polyline points="17 21 17 13 7 13 7 21" />
  <polyline points="7 3 7 8 15 8" />
</svg>
;
    }
    if (isActive && taskText.trim().length > 0) {
      return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="main-grid-item-icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
  <line x1="12" x2="12" y1="5" y2="19" />
  <line x1="5" x2="19" y1="12" y2="12" />
</svg>
;
    }
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="main-grid-item-icon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
  <line x1="18" x2="6" y1="6" y2="18" />
  <line x1="6" x2="18" y1="6" y2="18" />
</svg>
;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting task:', taskText);
    
    if (!taskText.trim()) {
      if (isEditing) {
        if (window.confirm('¿Eliminar esta tarea?')) {
          handleCancel();
        }
      } else {
        handleCancel();
      }
      return;
    }

    const taskData = {
      title: taskText.trim(),
      raw_text: taskText.trim(),
      status: 'open',
      priority: 'normal',
      is_public: false,
      due_date: new Date().toISOString()
    };

    if (isEditing && editingTask) {
      onAddTask(editingTask.id, taskData);
    } else {
      onAddTask(taskData);
      setTaskText('');
      setIsActive(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      setTaskText('');
      setIsActive(false);
    }
  };

  const hasContent = taskText.trim().length > 0;

  if (!isActive && !isEditing) {
    return (
      <div className="task-item empty-task">
        <div 
          className="add-task-placeholder"
          onClick={() => setIsActive(true)}
        >
          + Type to add new task
        </div>
      </div>
    );
  }

  return (
    <div className={`task-item editing-task ${isEditing ? 'editing-existing' : ''}`}>
      <div className="task-header">
        <button 
          type="button" 
          className="btn-action-icon"
          onClick={handleCancel}
          title={isEditing ? "Cancel editing" : "Close"}
        >
          {getActionButtonIcon()}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="add-task-form">
        <div className="input-with-preview">
          <textarea
            ref={textareaRef}
            value={taskText}
            onChange={handleInputChange}
            onScroll={handleScroll}
            placeholder="Type to add new task"
            className="task-input-real"
            autoFocus
            rows={1}
          />
          <div 
            ref={previewRef}
            className="input-preview"
          >
            {taskText ? renderColoredText(taskText) : <span className="input-placeholder"></span>}
          </div>
        </div>
        
        <div className={`char-counter ${taskText.length > 900 ? 'warning' : ''} ${taskText.length > 1000 ? 'error' : ''}`}>
          {taskText.length}/1000 caracteres
        </div>

        <div className="action-buttons">
          <button type="button" className="btn btn-status" title="Open">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" x2="14" y1="3" y2="10" />
              <line x1="3" x2="10" y1="21" y2="14" />
            </svg>
            {windowWidth < 1230 && <span className="btn-text">Open</span>}
          </button>

          <button type="button" className="btn btn-status" title="Today">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
              <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            {windowWidth < 1230 && <span className="btn-text">Today</span>}
          </button>

          <button type="button" className="btn btn-status" title="Public">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
              <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
              <path d="M7 11V7a5 5 0 0 1 9.9-1" />
            </svg>
            {windowWidth < 1230 && <span className="btn-text">Public</span>}
          </button>

          <button type="button" className="btn btn-status" title="Normal">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
              <line x1="12" x2="12" y1="2" y2="6" />
              <line x1="12" x2="12" y1="18" y2="22" />
              <line x1="4.93" x2="7.76" y1="4.93" y2="7.76" />
              <line x1="16.24" x2="19.07" y1="16.24" y2="19.07" />
              <line x1="2" x2="6" y1="12" y2="12" />
              <line x1="18" x2="22" y1="12" y2="12" />
              <line x1="4.93" x2="7.76" y1="19.07" y2="16.24" />
              <line x1="16.24" x2="19.07" y1="7.76" y2="4.93" />
            </svg>
            {windowWidth < 1230 && <span className="btn-text">Normal</span>}
          </button>

          <button type="button" className="btn btn-status" title="Estimation">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="8" x2="16" y1="12" y2="12" />
            </svg>
            {windowWidth < 1230 && <span className="btn-text">Estimation</span>}
          </button>
          
          <div className="action-buttons-right">
            <button 
              type="button" 
              onClick={handleCancel}
              className="btn btn-cancel"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`btn ${hasContent ? 'btn-add' : 'btn-ok'}`}
            >
              {isEditing ? 'Update' : (hasContent ? 'Add' : 'OK')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTask;