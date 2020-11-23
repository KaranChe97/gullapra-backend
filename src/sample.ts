import express, { Application, Request, Response, NextFunction } from "express";
import { personType } from './@types/sample';
const app: Application = express();

interface Params {
    // for objects
    a: number;
    b: number; 
}

type Add = (x: Params) => number; // other than objects

const add: Add = (x) => {
    return x.a + x.b;
};

enum Role { MALE="MEN", FEMALE="WOMEN", OTHERS=3 };

const person:personType = {
    name: "che",
    age: 23,
    hobbies:['play', 'code'],
    role:[1,'h'],
    gender: Role.FEMALE
};

console.log(person);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    const sum = add({ a: 1, b: 4 });
    res.send(`Hello there ${sum}`);
});

app.listen(5000, () => console.log("app listening on port 5000"));
