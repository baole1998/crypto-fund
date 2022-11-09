import { DataSource } from './data_source';
import { EngineModel } from './engine';
import { SyncTaskModel } from './sync_task';
import { UserModel } from './user';

export interface ContentSearch {
  description: string,
  name: string ,
  version: number ,
  verified: string ,
  env: string,
}
export interface GroundTruthTaskModel {
  id?: number;
  created_at?: Date;
  updated_at?: Date;
  is_active?: boolean;
  is_compare?: boolean;
  engine1_id?: EngineModel;
  engine2_id?: EngineModel;
  name?: string;
  sync_task_id?: SyncTaskModel;
  filter?: string;
  from_date?: Date;
  to_date?: Date;
  schedule?: Date;
  status?: string;
  creator?: UserModel;
}
