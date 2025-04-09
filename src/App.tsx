import { JSX, useState } from 'react'
import { Todos } from './Todos';
import { Footer } from './Footer';
import { FilterValue } from './vite-env';
import { TODO_FILTERS } from './consts';
import { Header } from './header';
const mockTodos = [
  {
    id: 1,
    title: 'Ir a la manifestación',
    completed: true,
    emoji:'🧨'
  },
  {
    id: 2,
    title: 'Realizar el to do',
    completed: false,
    emoji:'👷'
  },
  {
    id: 3,
    title: 'Ver a Yamila',
    completed: false,
    emoji:'😍'
  },
  {
    id: 4,
    title: 'Convertirlo en NPM Package para que todo puedan disfrutarlo',
    completed: false,
    emoji: '💻'
    }
]
const App = (): JSX.Element =>{
  const[todos, setTodos] = useState(mockTodos);
  const [filterSelected, setFilterSelected] = useState<FilterValue>(TODO_FILTERS.ALL);

  const handleRemove = (id: number) : void => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
  }

  const handlecheck = (id: number) : void => {
    const updateTodos = todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed} : todo);
    setTodos(updateTodos);
  }

  const mapActiveCompleted = () => {
    const todosMap = new Map();
    const lstActiveAccount = todos.filter(todo => todo.completed == false)
    const lstCompletedAccount = todos.filter(todo => todo.completed == true)
    todosMap.set('active', lstActiveAccount)
    todosMap.set('Completed', lstCompletedAccount)
    return todosMap;
  }

  const onClearCompleted = () => {
    const lstActiveAccount = todos.filter(todo => todo.completed == false)
    setTodos(lstActiveAccount);
  }

  const handleFilterChange = (filter: FilterValue): void => {
    console.log('filtro escogido en react ----> ' + filter);
    setFilterSelected(filter)
  }
  const addTarea = (todo : {title: string, emoji:string}): void => {
    const newTodo = {
      id: todos.length + 2,
      title: todo.title,
      completed: false,
      emoji:todo.emoji
    }
    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
  
    
  }

  const onfilterTodo = todos.filter(todo => {
    if(filterSelected == TODO_FILTERS.ACTIVE) return !todo.completed;
    if(filterSelected == TODO_FILTERS.COMPLETED) return todo.completed;
    return todo
  })
  
  return(
    <div className='todoapp'>
      <Header onSaveTarea={addTarea}/>
      <Todos todos={onfilterTodo} onremove ={handleRemove} onselect = {handlecheck}/>
      <Footer activeCount = {mapActiveCompleted().get('active').length}
              completedCount= {mapActiveCompleted().get('Completed').length}
              onClearCompleted = {onClearCompleted}
              filterSelected = {filterSelected}
              handleFilterChange = {handleFilterChange}
      />
    </div>
  )

}


export default App
