export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            inquiries: {
                Row: {
                    id: string
                    name: string | null
                    email: string | null
                    content: string | null
                    status: string | null
                    admin_reply: string | null
                    created_at: string
                    updated_at: string | null
                    replied_at: string | null
                }
                Insert: {
                    id?: string
                    name?: string | null
                    email?: string | null
                    content?: string | null
                    status?: string | null
                    admin_reply?: string | null
                    created_at?: string
                    updated_at?: string | null
                    replied_at?: string | null
                }
                Update: {
                    id?: string
                    name?: string | null
                    email?: string | null
                    content?: string | null
                    status?: string | null
                    admin_reply?: string | null
                    created_at?: string
                    updated_at?: string | null
                    replied_at?: string | null
                }
            }
            payment_history: {
                Row: {
                    id: string
                    subscription_id: string | null
                    user_id: string | null
                    payment_key: string | null
                    order_id: string | null
                    amount: number | null
                    status: string | null
                    method: string | null
                    card_company: string | null
                    card_number: string | null
                    receipt_url: string | null
                    approved_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    subscription_id?: string | null
                    user_id?: string | null
                    payment_key?: string | null
                    order_id?: string | null
                    amount?: number | null
                    status?: string | null
                    method?: string | null
                    card_company?: string | null
                    card_number?: string | null
                    receipt_url?: string | null
                    approved_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    subscription_id?: string | null
                    user_id?: string | null
                    payment_key?: string | null
                    order_id?: string | null
                    amount?: number | null
                    status?: string | null
                    method?: string | null
                    card_company?: string | null
                    card_number?: string | null
                    receipt_url?: string | null
                    approved_at?: string | null
                    created_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    phone: string | null
                    name: string | null
                    avatar_url: string | null
                    business_type: string | null
                    experience_level: string | null
                    budget_range: string | null
                    interests: string[] | null
                    created_at: string
                    updated_at: string | null
                }
                Insert: {
                    id: string
                    email?: string | null
                    phone?: string | null
                    name?: string | null
                    avatar_url?: string | null
                    business_type?: string | null
                    experience_level?: string | null
                    budget_range?: string | null
                    interests?: string[] | null
                    created_at?: string
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    email?: string | null
                    phone?: string | null
                    name?: string | null
                    avatar_url?: string | null
                    business_type?: string | null
                    experience_level?: string | null
                    budget_range?: string | null
                    interests?: string[] | null
                    created_at?: string
                    updated_at?: string | null
                }
            }
            stories: {
                Row: {
                    id: number
                    created_at: string
                    title: string | null
                    image_url: string | null
                    founder_image_url: string | null // 추가
                    tags: string[] | null
                    badges: string[] | null
                    metric: string | null
                    content: Json | null
                    updated_at: string | null
                    interview_content: Json | null
                    guide_content: Json | null
                }
                Insert: {
                    id?: number
                    created_at?: string
                    title?: string | null
                    image_url?: string | null
                    founder_image_url?: string | null // 추가
                    tags?: string[] | null
                    badges?: string[] | null
                    metric?: string | null
                    content?: Json | null
                    updated_at?: string | null
                    interview_content?: Json | null
                    guide_content?: Json | null
                }
                Update: {
                    id?: number
                    created_at?: string
                    title?: string | null
                    image_url?: string | null
                    founder_image_url?: string | null // 추가
                    tags?: string[] | null
                    badges?: string[] | null
                    metric?: string | null
                    content?: Json | null
                    updated_at?: string | null
                    interview_content?: Json | null
                    guide_content?: Json | null
                }
            }
            subscription_plans: {
                Row: {
                    id: string
                    name: string | null
                    price: number | null
                    duration_months: number | null
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name?: string | null
                    price?: number | null
                    duration_months?: number | null
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string | null
                    price?: number | null
                    duration_months?: number | null
                    description?: string | null
                    created_at?: string
                }
            }
            subscriptions: {
                Row: {
                    id: string
                    user_id: string | null
                    plan_id: string | null
                    billing_key: string | null
                    customer_key: string | null
                    status: string | null
                    next_billing_date: string | null
                    last_billing_date: string | null
                    started_at: string | null
                    expires_at: string | null
                    canceled_at: string | null
                    created_at: string
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    plan_id?: string | null
                    billing_key?: string | null
                    customer_key?: string | null
                    status?: string | null
                    next_billing_date?: string | null
                    last_billing_date?: string | null
                    started_at?: string | null
                    expires_at?: string | null
                    canceled_at?: string | null
                    created_at?: string
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    plan_id?: string | null
                    billing_key?: string | null
                    customer_key?: string | null
                    status?: string | null
                    next_billing_date?: string | null
                    last_billing_date?: string | null
                    started_at?: string | null
                    expires_at?: string | null
                    canceled_at?: string | null
                    created_at?: string
                    updated_at?: string | null
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
