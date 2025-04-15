import { JSX, useEffect, useMemo, useState } from 'react';
import { Todos } from './componentes/list component/Todos';
import { Footer } from './componentes/footer/Footer';
import { Paginacion } from './componentes/Paginacion_Componente/Paginacion';
import { FilterValue, ListOfTodos, Todo } from './utils/typeScript/vite-env';
import { TODO_FILTERS } from './utils/typeScript/consts';
import { Header } from './componentes/header/header';
import { auth, db, provider } from './firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { signInWithPopup } from 'firebase/auth';


const App = (): JSX.Element => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<FilterValue>(TODO_FILTERS.ALL);
  const [currentPage, setCurrentPage] = useState(1);

  const getTodos = async () => {
    console.log('Pasa por el metodo async');
    try {
      const q = query(collection(db, 'tareas'));
      const querySnapshot = await getDocs(q);
      console.log('Esta llegando al getTodos')
      const todos: Todo[] = querySnapshot.docs.map(doc => {
        const data = doc.data() as Omit<Todo, "id">;
        return {
          id: doc.id,
          ...data
        };
      });
      setTodos(todos);
      console.log('todos --->> ', todos[0].id);
      return todos;
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  useEffect(() => {
  getTodos();
  }, []);

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
    // Se soluciona cuando lo añada a Firebase
    setTodos(prev => [
      ...prev,
      {
        id: prev.length + '1',
        title: todo.title,
        completed: false,
        emoji: todo.emoji,
      },
    ]);
  };

  const removeTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    goToNextPageWithTodo();
  };

  const goToNextPageWithTodo = () => {
    if(currentPage == totalPages && currentTodos.length == 1){
      const changePage = currentPage == 1 ? 1: currentPage - 1;
      setCurrentPage(changePage)
    }
  }

  const toggleTodo = (id: string) => {
    
    setTodos(prev => {
      const updatedTodos = prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      const toggledTodo = updatedTodos.find(todo => todo.id === id);
      if (toggledTodo && toggledTodo.completed) {
      // Move the toggled todo to the end of the list
      return [...updatedTodos.filter(todo => todo.id !== id), toggledTodo];
      }
      return updatedTodos;
    });

    if (filter != 'all') goToNextPageWithTodo();

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
  
  const handleDragdrop = (todosOrder: ListOfTodos) => {
    setTodos(prev => {
      const updatedTodos = [...prev];
      todosOrder.forEach((todo, index) => {
      const originalIndex = updatedTodos.findIndex(t => t.id === todo.id);
      if (originalIndex !== -1) {
        updatedTodos.splice(originalIndex, 1);
        updatedTodos.splice(index, 0, todo);
      }
      });
      return updatedTodos;
    });
  }
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Usuario logueado:", result.user);
    } catch (error) {
      console.error("Error al loguearse:", error);
    }
  }
  return (
    <div className="todoapp">
      <Header onSaveTarea={addTodo} />
      <button onClick={loginWithGoogle}>
        Iniciar sesión con Google
      </button>
      <Todos todos={currentTodos} 
      onremove={removeTodo} 
      onselect={toggleTodo} 
      onDragDrop = {handleDragdrop}/>
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