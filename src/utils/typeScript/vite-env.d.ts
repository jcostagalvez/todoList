import { TODO_FILTERS } from "./consts";

import { TODO_FILTERS } from "./consts";

export interface Todo {
    id: number,
    title: string,
    completed: boolean,
    emoji: string
}

export type id = pick<Todo, 'id'>;

export type ListOfTodos = Todo[];

export type FilterValue = typeof TODO_FILTERS[keyof typeof TODO_FILTERS];