export type User = {
    id: string;
    firstName: string;
    lastName: string;
    profile: string;
};

export type Session = {
    user?: User;
};

export type Auth = {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    scope: string;
    id: string;
    firstname: string;
    lastname: string;
    profile: string;
};
