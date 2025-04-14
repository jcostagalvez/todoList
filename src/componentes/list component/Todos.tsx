import { TodoItem } from './listElement/Todo'
import { type ListOfTodos } from '../../utils/typeScript/vite-env'
import 'todomvc-app-css/index.css'
import {useRef, useState } from 'react'

//Esto solo podemso hacerlo con React.FC y sirve por asi decirlo para pasarle parametros
interface props {
    todos: ListOfTodos,
    onremove: (id: number) => void
    onselect: (id: number) => void
    onDragDrop: (todos: ListOfTodos) => void
}

export const Todos: React.FC<props> = ({ todos, onremove, onselect, onDragDrop }) => {
    const actualDate = new Date().toLocaleDateString();
    const style = {fontSize: "20px"};
    const[startIndex, setStartIndex] = useState(0);
    const isTouching = useRef(false);

    const handleDragStart = (index: number) => {
      console.log('Drag started at index:', index);
      setStartIndex(index);
    }

    const handleDrop = (index: number) => {
      const updatedTodos = [...todos];
      const [movedTodo] = updatedTodos.splice(startIndex, 1);
      updatedTodos.splice(index, 0, movedTodo);
      onDragDrop(updatedTodos);
    }
    return(
        <>
        <h1  style={style} >Lista de tareas para el {actualDate}</h1>
        <ul className='todo-list' 
        onDragOver={(e) => e.preventDefault()}>
          {todos.map((todo, index) => (
            <li draggable={todo.completed ? 'false' : 'true'}
            onDragStart={(e) => {
              handleDragStart(index);
              e.currentTarget.style.opacity = '1'; 
            }}
            onDrag={(e) => {
              e.currentTarget.style.opacity = '0'; 
            }}
            onDragEnd={(e) => {
              e.currentTarget.style.opacity = '1'; 
            }}
            onDrop={(e) => {
              handleDrop(index);
              e.currentTarget.style.opacity = '1';
            }}
            onTouchStart={(e) => {
              if(todo.completed) return;
              isTouching.current = true;
              handleDragStart(index);
              e.currentTarget.style.opacity = '0'; 
            }}
            onTouchMove={(e) => {
              if (!isTouching.current) return;
              const touch = e.touches[0];
              const element = document.elementFromPoint(touch.clientX, touch.clientY);
              const listItem = element?.closest('li');
              if (listItem && listItem.parentElement) {
                const siblings = Array.from(listItem.parentElement.children);
                const targetIndex = siblings.indexOf(listItem);
                if (targetIndex !== -1 && targetIndex !== startIndex) {
                  handleDrop(targetIndex);
                }
              }
              e.preventDefault(); // Prevent scroll
            }}
            onTouchEnd={(e) => {
              isTouching.current = false;
              e.currentTarget.style.opacity = '1';
            }}
            key={todo.id} 
            className={todo.completed ? 'completed' : ''}>
              <TodoItem  todo={todo} onremove={onremove} onselect={onselect}/>  
            </li>
          ))}
        </ul>
      </>
    )
}