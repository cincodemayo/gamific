export type Task = {
    id: string;
    column_id: string;
    name: string;
    subtasks: Subtask[];
    position: number;
    description: string;
    points: number;
    completed: boolean;
    related_tasks: string[];
    user_id: string;
};

export type Subtask = {
    id: string;
    name: string;
    completed: boolean;
};

export type OptionalTaskData = {
    name?: string;
    description?: string;
    column_id?: string;
    subtasks?: Subtask[];
    position?: number;
};