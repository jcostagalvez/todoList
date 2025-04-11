import { TodoItem } from '../header/todo/Todo'
import { type ListOfTodos } from '../../utils/typeScript/vite-env'
import 'todomvc-app-css/index.css'

//Esto solo podemso hacerlo con React.FC y sirve por asi decirlo para pasarle parametros
interface props {
    todos: ListOfTodos,
    onremove: (id: number) => void
    onselect: (id: number) => void
}

export const Todos: React.FC<props> = ({todos, onremove, onselect}) =>{
    const actualDate = new Date().toLocaleDateString();
    const style = {fontSize: "30px"};
    return(
        <>
        <h1  style={style} >Lista de tareas para el {actualDate}</h1>
        <ul className='todo-list'>
          {todos.map(todo => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                <TodoItem  todo = {todo} onremove={onremove} onselect={onselect}/>  
            </li>
          ))}
        </ul>
      </>
    )
}