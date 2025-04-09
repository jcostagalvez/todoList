import { useState } from 'react'
import {CreateTodo} from './CreateTodo'
import './assets/header.css';
interface props {
    onSaveTarea:  (todo : {title: string, emoji:string}) => void
}


export const Header: React.FC<props> = ({onSaveTarea}) => {
    const [isVisible, setIsVisible] =  useState<boolean>(false)

    const isNewTarea = (todo : {title: string, emoji:string}) : void =>{
        console.log(todo)
        onSaveTarea(todo)
    }
    const handleStateIsClose = (isclose: boolean) : void => {
        setIsVisible(!isclose);
    }

    return(
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            height: '50px',
          }}>
            <button className="add-task-btn" onClick={() => {setIsVisible(!isVisible)}}>
            <span className="add-task-icon">+</span> 
                Crear una tarea </button>
            {isVisible && (
            <CreateTodo
            onsave={isNewTarea}
            onClose={handleStateIsClose}
            />
            )}
        </div>
    )
}