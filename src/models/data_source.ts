
export type DataSourceName = 'SMO' | 'IOS' | 'ANDROID' | 'BOT_EKYC';
export interface DataSource {
    id: number,
    created_at: Date ,
    updated_at: Date ,
    is_active: boolean,
    name: DataSourceName ,
}