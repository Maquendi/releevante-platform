export interface UserId{
  value: string
}

interface AppUser {
  id: string;
  org?: string,
  name?: string;
}

export class User {
  constructor(public data: AppUser) {}
}
