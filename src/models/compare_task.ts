import { EngineModel } from "./engine";
import { GroundTruthModel } from "./ground_truth";
import { UserModel } from "./user";

export interface CompareTaskModel {
    updated_at?: Date,
    created_at?: Date,
    is_active?: boolean,
    id?: number,
    name?: string,
    // engine1_id?: EngineModel | Number ,
    // engine2_id?: EngineModel | Number ,
    ground_truth_id?: GroundTruthModel | Number ,
    filter?: string ,
    type?: string | object,
    status?: string,
    creator?: UserModel,
    engine_info?: object
    customer_docs_id?: Array<Number>
}

export interface CompareTaskResponse {
    updated_at?: Date,
    created_at?: Date,
    is_active?: boolean,
    id?: number,
    name?: string,
    compare_engine: Object,
    ground_truth_task?: GroundTruthModel ,
    filter?: string ,
    type?: string | object,
    status?: string,
    creator?: UserModel,
}
export interface ContentSearch {
    description: string,
    name: string ,
    version: number ,
    verified: string ,
    env: string,
    from_date?: Date, 
    to_date?: Date
}