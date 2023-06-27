import {Identity} from "../domain/Identity";

export interface Usecase<I,O>{
    execute(payload?:I): Promise<O> | O
    canExecute?(identity: Identity, payload? :I): Promise<boolean>

}