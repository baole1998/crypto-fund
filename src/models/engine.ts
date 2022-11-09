import { UserModel } from "./user";

export interface EngineModel {
    name?: string,
    user?: UserModel ,
    creator?: number ,
    env?: number ,
    verified?: string ,
    description?: string,
    status?: boolean,
    url?: string,
    version?: string,
    updated_at?: Date,
    created_at?: Date,
    is_active?: boolean,
    id?: number,
    type?: string
}
export interface ContentSearch {
    description: string,
    name: string ,
    version: number ,
    verified: string ,
    env: string,
}