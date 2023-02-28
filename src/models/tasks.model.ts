import {v4 as uuidCreator} from 'uuid';

export class Tasks {
    public id: string;
            constructor(public title: string,public description: string){
                this.id = uuidCreator();
            }
}