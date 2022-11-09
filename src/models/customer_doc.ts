import { DataSource } from "./data_source";
import { SyncTaskModel } from "./sync_task";

export interface ContentSearch {
    customer_code?:string,
    status?: string[],
    from_date?: Date ,
    to_date?: Date ,
    data_source?: DataSource,
    uid?: string,
}

export interface CustomerDocModel {
    id?: number,
    created_at?: Date ,
    updated_at?: Date ,
    is_active?: boolean,
    task_id?: number ,
    uid?: string,
    file_name?: string,
    front_path?:string,
    back_path?: string,
    face_path?: string,
    sign_path?: string,
    data_source?: DataSource,
    note?: string,
    customer_code?: string,
    exec_date?: Date,
    business_type?: string,
    status?: string,
    sync_task?: SyncTaskModel,
    data_source_relate?: DataSource,
    level?: number,
    customer_info?: any,
    recheck?: boolean,
    
}
