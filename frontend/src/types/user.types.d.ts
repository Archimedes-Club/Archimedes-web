export interface User{
    id: number,
    name: string,
    email: string,
    phone?: string,
    linkedin_url?: string,
    role: "professor" | "student"
}