import type { Role } from "./permissions";

export interface User{
    id: number;
    username:string;
    email:string;
    firstName:string;
    lastName:string;
    image?: string;

    role: Role;
}