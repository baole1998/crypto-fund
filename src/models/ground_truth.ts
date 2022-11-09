import { CustomerDocModel } from './customer_doc';
import { CustomerInfoModel } from './customer_info';
import { DataSource } from './data_source';
import { EngineModel } from './engine';
import { SyncTaskModel } from './sync_task';
import { UserModel } from './user';

export interface ContentSearch {
  code?: string,
  status?: string[],
  to_date?: Date ,
  from_date?: Date ,
  data_source?: DataSource,
  engine1_id?: EngineModel,
  engine2_id?: EngineModel,
  creator?: UserModel,
}
export interface GroundTruthModel {
  id?: number;
  created_at?: Date;
  updated_at?: Date;
  is_active?: boolean;
  type?: string;
  engine1?: EngineModel;
  engine2?: EngineModel;
  data_source?: DataSource;
  filter?: string;
  description?: string;
  from_date?: Date;
  to_date?: Date;
  schedule?: Date;
  status?: string;
  creator?: UserModel;
  name?: string,
  sync_task?: SyncTaskModel,
  creator_relate?: UserModel
}

export interface GroundTruthDetailModel {
  id?: number;
  created_at?: Date;
  updated_at?: Date;
  is_active?: boolean;
  engine1_result_id?: number;
  customer_docs_id?: number;
  back_verified_level?: number;
  sign_verified_level?: number;
  ground_truth_result_id?: number;
  engine2_result_id?: number;
  front_verified_level?: number;
  face_verified_level?: number;
  ground_truth_result?: CustomerInfoModel;
  VVN?: CustomerInfoModel;
  FDM?: CustomerInfoModel;
  customer_docs?: CustomerDocModel,
}