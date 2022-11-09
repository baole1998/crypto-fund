import { CustomerDocModel } from "./customer_doc";
import { DataSource } from "./data_source";

export interface ContentSearch {
    from_date?: Date,
    to_date?: Date ,
    customer_code?: string ,
    uid?: string ,
    data_source?: DataSource,
}
export interface CustomerInfoModel {
    id?: number,
    created_at?: Date ,
    updated_at?: Date ,
    is_active?: boolean,
    customer_docs_id?: number ,
    customer_doc?: CustomerDocModel ,
    source_engine?: number,
    card_number?: number,
    full_name?:string,
    birthday?: string,
    gender?: string,
    address?: string,
    home_town?: string,
    issue_date?: string,
    issue_by?: string,
    expired_date?: string,
    face_validation?: boolean,
    sign_validation?: boolean,
    face_similarity?: string,
    status?: string,
    last_modifier?: string,
    version?: string,
    data_source_relate?: DataSource,
}