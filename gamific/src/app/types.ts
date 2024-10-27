export type Journey = {
    id: string;
    name: string;
    description: string;
    account_id: string;
    completed: boolean;
    columns: JourneyColumn[];
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
    description: string;
    position: number;
    column_id: string;
    account_id: string;
    completed: boolean;
    users: string[];
    columns: MissionColumn[];
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
    description: string;
    task_id: string;
    account_id: string;
    completed: boolean;
};

export type Milestone = {
    id: string;
    name: string;
    description: string;
    account_id: string;
}

export type Prize = {
    id: string;
    name: string;
    description: string;
    points: number;
    account_id: string;
}

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

export type OptionalMissionData = {
    name?: string;
    description?: string;
    position?: number;
    column_id?: string;
    users?: string[];
    completed?: string[];
};