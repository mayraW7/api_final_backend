import { Request, Response } from "express";
import { usersList } from "../data/user";
import { RequestError } from "../errors/request.error";
import { ServerError } from "../errors/server.error";
import { Transactions } from "../models/transactions.model";
import { SuccessResponse } from "../util/response.success";

export class TransactionsController {
    
    public  createTransaction(req: Request, res: Response){
           try{
                const { title, value, type} = req.body;
                const { userId } = req.params;        

                const transaction = new Transactions(title, value, type);

                const user = usersList.find(user => user.id === userId);

                if(!user){
                    return RequestError.notFound(res, "User");
                }
                    user.transactions.push(transaction);
                    
            return SuccessResponse.created(res, "Transaction was successfully created.", user)

        } catch (error: any) {
        return ServerError.genericError(res, error);
    }
}
    public transactionId (req: Request, res: Response){
        try{
            const { userId, id}= req.params;

            const user = usersList.find(user => user.id === userId);
            if(!user){
                return RequestError.notFound(res, "User");
            }
            const transaction = user.transactions.find(transaction => transaction.id === id);
            
            if(!transaction){
                return RequestError.notFound(res, "Transaction");
            }
            return SuccessResponse.success(res, "Transaction search", transaction);

        }catch (error: any) {
            return ServerError.genericError(res, error);
        }
}
    public transactionExtract (req: Request, res: Response){
        try{
            const {userId}= req.params;
            const {title, type} = req.query;
            const user = usersList.find(user => user.id === userId);
            if(!user){
                return RequestError.notFound(res, "User");
            }
            let alltransactions = user.transactions || [];

            if(title){
                alltransactions = alltransactions.filter((transaction)=> transaction.title.toLowerCase().includes((title as string).toLowerCase()));

                // return SuccessResponse.success(res, "Title search filter result.",
                // {
                //     transactions: filterTitle,
                // })
            }

            if(type){
                alltransactions = alltransactions.filter((transaction)=> transaction.type === type);

                // return SuccessResponse.success(res, "Type search filter result.", filterType)
            }
            
            let incomes = alltransactions.filter((transaction)=>(transaction.type == "income")).reduce((prev, transaction)=>{
                return  prev + transaction.value;
            },0)

            let outcomes = alltransactions.filter((transaction)=>(transaction.type == "outcome")).reduce((prev, transaction)=>{return  prev + transaction.value;},0)

            let totall = incomes - outcomes;

            return res.status(200).send({
                ok: true,
                message: "Transactions successfully listed",
                data:{
                "transactions": alltransactions,
                "balance": {
                    "income": incomes,
                    "outcome":outcomes,
                    "total": totall
                }
                }
            });

        }catch (error: any) {
            return ServerError.genericError(res, error);
        }
}
    public update (req: Request, res: Response){
        try{
            const{userId, id} = req.params;
            const{title, value, type} = req.body;
            const user = usersList.find(user => user.id === userId);
            if(!user){
                return RequestError.notFound(res, "User");
            }
            const transaction = user.transactions.find(transaction => transaction.id === id);
            if(!transaction){
                return RequestError.notFound(res, "Transaction")
            }
                transaction.title = title ?? transaction.title;
                transaction.value = value ?? transaction.value;
                transaction.type = type ?? transaction.type;
    
            return res.status(200).send({
                ok: true,
                message: `Transaction ${id} successfully updated!`,
            });
    
        }catch (error: any) {
            return ServerError.genericError(res, error);
        }    
}
    public delete (req: Request, res: Response){
        try{
            const{userId, id} = req.params;
            const user = usersList.find(user => user.id === userId);
            if(!user){
                return RequestError.notFound(res, "User");
            }
            const transaction = user.transactions.find(transaction => transaction.id === id);
            if(!transaction){
                return RequestError.notFound(res, "Transaction");
            }
        
            const indexTransaction = user.transactions.findIndex((transaction) => transaction.id === id);

            user.transactions.splice(indexTransaction, 1);

            return res.status(200).send({
                ok: true,
                message: `Transaction was successfully deleted!`,
                data: id,
            });

    }catch (error: any) {
            return ServerError.genericError(res, error);
    }
}

}