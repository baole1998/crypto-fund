import { DataSource } from "./data_source";
import { EngineModel } from "./engine";

export interface ReportModel {
    id?: number,
    created_at?: Date ,
    updated_at?: Date ,
    data_source_info?: DataSource ,
    engine1?: EngineModel,
    engine2?: EngineModel,
    acc_success?: number,
    matched_comparison?: number,
    failed_comparison?: string,
    sync_date?: Date,
}
export interface ContentSearch {
    code?: string,
    data_source?: DataSource,
    from_date?: Date,
    to_date?: Date,
}