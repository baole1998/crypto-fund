
export interface ReportModel {
    id?: number,
    created_at?: Date ,
    updated_at?: Date ,
    full_name?: string ,
    username?: string,
    email?: string,
    is_active?: boolean,
    role?: Date,
    last_login?: Date,
}
export interface ContentSearch {
    description: string,
    name: string ,
    version: number ,
    verified: string ,
    env: string,
}