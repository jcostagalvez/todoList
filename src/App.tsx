import { JSX, useEffect, useMemo, useState } from 'react';
import { Todos } from './componentes/list component/Todos';
import { Footer } from './componentes/footer/Footer';
import { Paginacion } from './componentes/Paginacion_Componente/Paginacion';
import { FilterValue, ListOfTodos, Todo } from './utils/typeScript/vite-env';
import { TODO_FILTERS } from './utils/typeScript/consts';
import { Header } from './componentes/header/header';
import { auth, db, provider } from './firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { signInWithPopup } from 'firebase/auth';


const App = (): JSX.Element => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<FilterValue>(TODO_FILTERS.ALL);
  const [currentPage, setCurrentPage] = useState(1);

  const getTodos = async () => {
    try {
      const q = query(collection(db, 'tareas'), orderBy('completed', 'asc'));
      const querySnapshot = await getDocs(q);
      const todos: Todo[] = querySnapshot.docs.map(doc => {
        const data = doc.data() as Omit<Todo, "id">;
        return {
          id: doc.id,
          ...data
        };
      });
      setTodos(todos);
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

  const addTodo = async(todo: { title: string; emoji: string }) => {
    if(todos.length < 100){
      try{
        await addDoc(collection(db, 'tareas'), {
          title : todo.title,
          emoji : todo.emoji,
          completed: false
        });
        getTodos();
      }catch(error){
        console.error("Error al agregar la tarea:", error);
      }
    }
    else{
      alert("La base de datos ha llegado a 100 tareas, hay que eliminar para seguir agragando");
    }
  };

  const removeTodo = async (id: string) => {
    try {
      console.log('se ejecuta el try');
      await deleteDoc(doc(db, 'tareas', id));
      getTodos();
      goToNextPageWithTodo();
    } catch (error) {
      console.log('se ejecuta el catch');
      console.error('Error eliminando el documento:', error);
    }
  };

  const goToNextPageWithTodo = () => {
    if(currentPage == totalPages && currentTodos.length == 1){
      const changePage = currentPage == 1 ? 1: currentPage - 1;
      setCurrentPage(changePage)
    }
  }

  const toggleTodo = async (id: string) => {
    try {
      const ref = doc(db, 'tareas', id);
      const todoUpdate = todos.find(todo => todo.id === id);
      await updateDoc(ref, {completed: !todoUpdate?.completed});
      getTodos();
    } catch (error) {
      console.log('se ejecuta el catch');
      console.error('Error al actualizar:', error);
    }
    if (filter != 'all') goToNextPageWithTodo();

  };

  const clearCompleted = async () => {
    try {
      // 1. Hacemos una query solo por los completados
      const q = query(collection(db, 'tareas'), where('completed', '==', true));
      const snapshot = await getDocs(q);
  
      // 2. Borramos cada uno
      const deletePromises = snapshot.docs.map(docSnap =>
        deleteDoc(doc(db, 'tareas', docSnap.id))
      );
      await Promise.all(deletePromises);
      getTodos();
    } catch (error) {
      console.error('Error al eliminar completados:', error);
    }
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