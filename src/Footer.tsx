import { Filters } from "./Filters"
import { FilterValue } from "./vite-env"

interface props {
    handleFilterChange: (filter: FilterValue) => void
    activeCount: number
    completedCount: number
    onClearCompleted: () => void
    filterSelected: FilterValue
}
export const Footer: React.FC<props> = ({
    activeCount,
    completedCount,
    onClearCompleted,
    filterSelected,
    handleFilterChange
  }) => {
    const singleActiveCount = activeCount === 1
    const activeTodoWord = singleActiveCount ? 'tarea' : 'tareas'
  
    return (
      <footer className="footer">
  
        <span className="todo-count">
          <strong>{activeCount}</strong> {activeTodoWord} pendiente{!singleActiveCount && 's'}
        </span>
  
        <Filters filterSelected={filterSelected} 
        onFilterChange={handleFilterChange} />
  
        {
          completedCount > 0 && (
            <button
              className="clear-completed"
              onClick={onClearCompleted}>
                Borrar completados
            </button>
          )
        }
      </footer>
    )
  }