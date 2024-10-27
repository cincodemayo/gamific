export type Task = {
    id: string;
    name: string;
    description: string;
    position: number;
    points: number;
    column_id: string;
    user_id: string;
    account_id: string;
    subtasks: Subtask[];
    related_tasks: string[];
    completed: boolean;
};

export type Subtask = {
    id: string;
    name: string;
    task_id: string;
    completed: boolean;
};

export type OptionalTaskData = {
    name?: string;
    description?: string;
    position?: number;
    points?: number;
    column_id?: string;
    user_id?: string;
    subtasks?: Subtask[];
    related_tasks?: string[];
    completed?: string[];
};