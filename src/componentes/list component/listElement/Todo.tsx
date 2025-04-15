// componente de linea del todo

import React from "react";
import { type Todo } from "../../../utils/typeScript/vite-env";

interface props{
    todo:Todo,
    onremove: (id: string) => void,
    onselect: (id: string) => void
}
export const TodoItem: React.FC <props>=({todo, onremove, onselect}) =>{

    return(
        <div className="view">
            <input className="toggle"
            checked = {todo.completed}
            type="checkbox"
            onChange={() => {onselect(todo.id)}}
            />
            
            <label> <span>{todo.emoji}</span>{todo.title} </label>
            <button className="destroy" onClick={() => {onremove(todo.id)}}></button>
        </div>
        
    )
}