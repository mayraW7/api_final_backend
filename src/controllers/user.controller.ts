
import { Request, Response } from "express";
import { usersList } from "../data/user";
import { RequestError } from "../errors/request.error";
import { ServerError } from "../errors/server.error";
import { User } from "../models/user.model";
import { SuccessResponse } from "../util/response.success";

export class UserController {

    public includeUser(req: Request, res: Response) {
        try{  

        const { name, cpf, email, age, password } = req.body;
     
        const user = new User(name,cpf,email,age,password);

        usersList.push(user);

        return SuccessResponse.created(res, "User was successfully create", user)

        }
        catch (error: any) {
                return ServerError.genericError(res, error);
        }
    };


    public getId (req: Request, res: Response){
        try{
            const { id } = req.params;
    
            const user = usersList.find(user=> user.id === id);
    
            if(!user) {
                return RequestError.notFound(res, "User");
            }

            const idResult = user.toJson();

            return SuccessResponse.success(res,"Usuário:", idResult);
    
        } catch (error: any) {
            return ServerError.genericError(res, error);     
        };
        }
    public loginUser (req: Request, res: Response){
        try{
            const {cpf, password } = req.body;

            if (!cpf || !password){
                return RequestError.fieldNotProvided(res, "CPF or Password");
            }
            const user = usersList.find(user=> user.cpf === cpf && user.password === password);
            if(!user){
                return RequestError.invalidAccess(res, "Credentials");
            }
            return SuccessResponse.success(res, "Login successfully done.", user.toJson());

        }catch(error: any) {
            return ServerError.genericError(res, error);
        }
    }
};