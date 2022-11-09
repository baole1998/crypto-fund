import { CompareTaskModel } from "./compare_task";
import { EngineModel } from "./engine";
import { GroundTruthModel } from "./ground_truth";
import { UserModel } from "./user";

export interface CompareDetailModel {
    updated_at?: Date,
    created_at?: Date,
    is_active?: boolean,
    id?: number,
    compare_task_id?: CompareTaskModel,
    ground_truth_result_id?: GroundTruthModel ,
    engine1_result_id?: EngineModel ,
    engine2_result_id?: EngineModel ,
    compare_result_engine1_id?: number ,
    compare_result_engine2_id?: number,
}
export interface ContentSearch {
    description: string,
    name: string ,
    version: number ,
    verified: string ,
    env: string,
}