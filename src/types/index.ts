export type UserType = {
    id:number,
    username:string,
    email:string,
    password:string,
    confirmPassword:string
}

export type UserFormDataType = {
    username:string,
    email:string,
    password:string,
    confirmPassword:string
}

export type TokenType = {
    token:string,
    tokenExpiration:string
}

export type CategoryType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'