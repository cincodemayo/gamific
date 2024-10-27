export type Product = {
    id: string;
    name: string;
    account_id: string;
}
  
export type Journey = {
    id: string;
    name: string;
    account_id: string;
}

export type JourneyColumn = {
    id: string;
    name: string;
    journey_id: string;
    position: number;
    color: string;
    account_id: string;
}

export type Mission = {
    id: string;
    name: string;
    user_id: string;
    account_id: string;
}

export type MissionColumn = {
    id: string;
    name: string;
    mission_id: string;
    account_id: string;
    position: number;
    color: string;
}

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
    account_id: string;
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

export type UpdatedColumnData = {
    name?: string;
    color?: string;
    position?: number;
};