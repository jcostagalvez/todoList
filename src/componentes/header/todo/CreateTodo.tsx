import { useState } from "react";
import ReactDOM from "react-dom";
import '../../../utils/css/popUp.css';
interface props {
  onsave: (todo : {title: string, emoji:string}) => void,
  onClose: (isActive: true) => void
}

export const CreateTodo: React.FC <props>=({onsave, onClose}) => {
  const [title, setTitle] = useState<string>('')

  const handleClick = () : void => {
    onsave({title: title, emoji:'⌚'});
    onClose(true);
  }

  const handleClose = () : void => {
    onClose(true);
  }

    return ReactDOM.createPortal(
      <>
        <div>
          <div className="popup-overlay">
            <div className="popup-container">
              <button className="close-btn"
              onClick={handleClose}>
                X
              </button>
              <h2>Crea una tarea</h2>
              <input
                type="text"
                placeholder="Nombre de la tarea"
                className="input-field"
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="button-group">
                <button className="save-btn" 
                onClick={handleClick}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </>,
      document.getElementById("root") as HTMLElement
    )
}