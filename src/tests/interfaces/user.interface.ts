export interface CreateUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    password: string
    phone: string;
    address: string;
    profilePicture: string;
    createdAt: Date;
    updatedAt: Date;
  }

export interface UpdateUser {
    id: number;
    firstName: string;
    lastName: string;
    password: string
    phone: string;
    address: string;
    profilePicture: string
  }