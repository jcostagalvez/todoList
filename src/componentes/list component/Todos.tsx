import { TodoItem } from './listElement/Todo'
import { type ListOfTodos } from '../../utils/typeScript/vite-env'
import 'todomvc-app-css/index.css'
import {useState } from 'react'

//Esto solo podemso hacerlo con React.FC y sirve por asi decirlo para pasarle parametros
interface props {
    todos: ListOfTodos,
    onremove: (id: number) => void
    onselect: (id: number) => void
    onDragDrop: (todos: ListOfTodos) => void
}

export const Todos: React.FC<props> = ({ todos, onremove, onselect, onDragDrop }) => {
    const actualDate = new Date().toLocaleDateString();
    const style = {fontSize: "30px"};
    const[startIndex, setStartIndex] = useState(0);

    const handleDragStart = (index: number) => {
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
            /*Aqui es donde empieza el ondrag y me da un index */
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
            key={todo.id} 
            className={todo.completed ? 'completed' : ''}>
              <TodoItem  todo = {todo} onremove={onremove} onselect={onselect}/>  
            </li>
          ))}
        </ul>
      </>
    )
}