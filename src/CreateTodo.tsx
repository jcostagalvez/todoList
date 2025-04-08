import './Create_todo.css'


interface props {
    onsave: number
}

export const CreateTodo: React.FC <props>=({onsave}) => {
    return(
        //cuadro de creacion de la tarea 
        <div className="popup-overlay">
        <div className="popup-container">
          <button className="close-btn">
            X
          </button>
          <h2>Crea una tarea</h2>
          <input
            type="text"
            placeholder="Nombre de la tarea"
            className="input-field"
          />
          <textarea
            placeholder="Descripción de la tarea"
            className="input-field"
          />
          <div className="button-group">
            <button className="save-btn" >
              Guardar
            </button>
            <button className="close-btn">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )
}