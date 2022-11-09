import { DataSource } from "./data_source";
import { UserModel } from "./user";

export interface ContentSearch {
    customer_code?:string,
    status?: string[],
    from_date?: Date ,
    to_date?: Date ,
    data_source?: DataSource ,
    name_task?: string,
}
export interface SyncTaskModel {
    id?: number,
    created_at?: Date ,
    updated_at?: Date ,
    is_active?: boolean,
    creator?: number ,
    name?: string,
    data_source?: number,
    task_type?:string,
    status?: string,
    from_date?: Date,
    to_date?: Date,
    data_source_relate?: DataSource,
    creator_relate?: UserModel,
}