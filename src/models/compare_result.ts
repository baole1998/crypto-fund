import { CompareTaskModel } from "./compare_task";
import { EngineModel } from "./engine";
import { GroundTruthModel } from "./ground_truth";
import { UserModel } from "./user";

export interface CompareResultModel {
    updated_at?: Date,
    created_at?: Date,
    is_active?: boolean,
    id?: number,

    // card_number?: CompareTaskModel,
    // full_name?: GroundTruthModel ,
    // birthday?: EngineModel ,
    // gender?: EngineModel ,
    // address?: number ,
    // hometown?: number,
    // issue_date?: number,
    // issue_by?: number,
    // expired_date?: number,
    // face_validation?: boolean,
    // sign_validation?: boolean,
}
export interface ContentSearch {
    description: string,
    name: string ,
    version: number ,
    verified: string ,
    env: string,
}