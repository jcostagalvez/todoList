import { JSX, useMemo, useState } from 'react';
import { Todos } from './componentes/list component/Todos';
import { Footer } from './componentes/footer/Footer';
import { Paginacion } from './componentes/paginacion/paginacion';
import { FilterValue } from './utils/typeScript/vite-env';
import { TODO_FILTERS } from './utils/typeScript/consts';
import { Header } from './componentes/header/header';

const mockTodos = [
  { id: 1, title: 'Ir a la manifestación', completed: true, emoji: '🧨' },
  { id: 2, title: 'Realizar el to do', completed: false, emoji: '👷' },
  { id: 3, title: 'Ver a Yamila', completed: false, emoji: '😍' },
  { id: 4, title: 'Convertirlo en NPM Package para que todo puedan disfrutarlo', completed: false, emoji: '💻' },
  { id: 5, title: 'Ir a la manifestación otra vez', completed: true, emoji: '🧨' },
  { id: 6, title: 'Otra tarea más', completed: false, emoji: '👷' },
  { id: 7, title: 'Ir a la manifestación', completed: true, emoji: '🧨' },
  { id: 8, title: 'Realizar el to do', completed: false, emoji: '👷' },
  { id: 9, title: 'Ver a Yamila', completed: false, emoji: '😍' },
  { id: 10, title: 'Convertirlo en NPM Package para que todo puedan disfrutarlo', completed: false, emoji: '💻' },
  { id: 11, title: 'Ir a la manifestación otra vez', completed: true, emoji: '🧨' },
  { id: 12, title: 'Otra tarea más', completed: false, emoji: '👷' },
  { id: 13, title: 'Tarea Impar', completed: false, emoji: '👷' },
  { id: 14, title: 'Tarea par', completed: false, emoji: '👷' },
];

const App = (): JSX.Element => {
  const [todos, setTodos] = useState(mockTodos);
  const [filter, setFilter] = useState<FilterValue>(TODO_FILTERS.ALL);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 3;
  const VISIBLE_PAGES = 3;

  // Memoizar para evitar cálculos innecesarios
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case TODO_FILTERS.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case TODO_FILTERS.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const totalPages = Math.ceil(filteredTodos.length / ITEMS_PER_PAGE);
  const currentTodos = filteredTodos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const pageArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pageArray.slice(
    Math.max(0, currentPage - Math.ceil(VISIBLE_PAGES / 2)),
    Math.min(totalPages, currentPage + Math.floor(VISIBLE_PAGES / 2))
  );

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  const addTodo = (todo: { title: string; emoji: string }) => {
    setTodos(prev => [
      ...prev,
      {
        id: prev.length + 1,
        title: todo.title,
        completed: false,
        emoji: todo.emoji,
      },
    ]);
  };

  const removeTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: number) => {
    
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    console.log('pagina actual ---> en el toggle', currentPage);
    console.log('total de paginas ---> en el toggle', totalPages);
    console.log('currentTodos ---> en el toggle', currentTodos.length);
    if(currentPage == totalPages && currentTodos.length == 1){
      const changePage = currentPage == 1 ? 1: currentPage - 1;
      setCurrentPage(changePage)
    }

  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  const changeFilter = (newFilter: FilterValue) => {
    setFilter(newFilter);
    setCurrentPage(1);
    console.log('Deberia ponerse en la pagina 1, esta pasando esto¿?', currentPage);
  };

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="todoapp">
      <Header onSaveTarea={addTodo} />
      <Todos todos={currentTodos} 
      onremove={removeTodo} 
      onselect={toggleTodo} />
      <Paginacion
        totalPaginas={pageArray}
        arrayPaginas={visiblePages}
        paginaActual={currentPage}
        paginadoVisible={VISIBLE_PAGES}
        onPaginaChange={changePage}
      />
      <Footer
        activeCount={activeCount}
        completedCount={completedCount}
        onClearCompleted={clearCompleted}
        filterSelected={filter}
        handleFilterChange={changeFilter}
      />
    </div>
  );
};

export default App;