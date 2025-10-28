import React from 'react';

const TaskItem = ({ task, onEdit }) => {
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Manejar clic en la tarea para editar
  const handleTaskClick = () => {
    if (onEdit) {
      onEdit(task);
    }
  };

  // Función para renderizar el texto con elementos destacados
  const renderTextWithElements = (text) => {
    if (!text) return null;
    
    const elements = [];
    let lastIndex = 0;
  
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const linkRegex = /(https?|ftp):\/\/[^\s<]+|www\.[^\s<]+\.[^\s<]+/g;
    const mentionRegex = /(^|\s)(@[^\s]+)/g;
    const hashtagRegex = /(^|\s)(#[^\s]+)/g;
    
    const matches = [];
    let match;
    
    // Encontrar todas las coincidencias
    while ((match = emailRegex.exec(text)) !== null) {
      matches.push({ type: 'email', text: match[0], index: match.index, length: match[0].length });
    }
    while ((match = linkRegex.exec(text)) !== null) {
      matches.push({ type: 'link', text: match[0], index: match.index, length: match[0].length });
    }
    while ((match = mentionRegex.exec(text)) !== null) {
      // Incluir el espacio en el match para mantener el formato
      const fullMatch = match[1] + match[2];
      matches.push({ type: 'mention', text: fullMatch, index: match.index, length: fullMatch.length });
    }
    while ((match = hashtagRegex.exec(text)) !== null) {
      const fullMatch = match[1] + match[2];
      matches.push({ type: 'hashtag', text: fullMatch, index: match.index, length: fullMatch.length });
    }
    
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
    
    // Procesar cada match
    cleanMatches.forEach((match, i) => {
      // Agregar texto normal antes del match
      if (match.index > lastIndex) {
        const normalText = text.slice(lastIndex, match.index);
        elements.push(
          <span key={`normal-${i}`} className="task-normal-text">
            {normalText}
          </span>
        );
      }
      
      // Agregar el elemento destacado CON STOP PROPAGATION
      if (match.type === 'email') {
        elements.push(
          <span 
            key={`email-${i}`} 
            className="task-element task-email touchable"
            onClick={(e) => {
              e.stopPropagation(); 
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span className="email-text">{match.text}</span>
          </span>
        );
      } else if (match.type === 'link') {
        elements.push(
          <span 
            key={`link-${i}`} 
            className="task-element task-link touchable"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span className="link-text">{match.text}</span>
          </span>
        );
      } else if (match.type === 'mention') {
        elements.push(
          <span 
            key={`mention-${i}`} 
            className="task-element task-mention touchable"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {match.text}
          </span>
        );
      } else if (match.type === 'hashtag') {
        elements.push(
          <span 
            key={`hashtag-${i}`} 
            className="task-element task-hashtag touchable"
            onClick={(e) => {
              e.stopPropagation(); 
            }}
          >
            {match.text}
          </span>
        );
      }
      
      lastIndex = match.index + match.length;
    });
    
   
    if (lastIndex < text.length) {
      elements.push(
        <span key="normal-final" className="task-normal-text">
          {text.slice(lastIndex)}
        </span>
      );
    }
    
    return elements;
  };

  return (
    <div 
      className="task-item editable-task"
      onClick={handleTaskClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="task-content-simple">
        {renderTextWithElements(task.raw_text || task.title)}
      </div>
    </div>
  );
};

export default TaskItem;