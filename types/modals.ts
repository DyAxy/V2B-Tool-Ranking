interface ResponseData<Structure> {
    success: boolean;
    data: Structure;
}
interface AuthData {
    token: "string";
    is_admin: 0 | 1;
    auth_data: "string";
}
interface CheckLoginData {
    is_admin: boolean;
    is_login: boolean;
}
interface SearchData {
    user_id: number;
    u: number;
    d: number;
    total: number;
    email: string;
}