enum Role { MALE="MEN", FEMALE="WOMEN", OTHERS=3 };

export interface personType {
    name: string;
    age: number;
    hobbies: string[];
    role?: [number, string]; // tuple - fixed length array
    gender: Role
}