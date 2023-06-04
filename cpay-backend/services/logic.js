// imported db.js
const db = require('./db')

// import jwt token
const jwt = require('jsonwebtoken')

// logic for register
const register=(acno,username,password)=>{
    console.log('register works')
    // check acno is in database
    return db.User.findOne({acno}).then((response)=>{
        if(response){
            return{
                statusCode:401,
                message:'Acno already Registered'
            }
        }
        else{
            const newUser = new db.User({
                acno,
                username,
                password,
                image:'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436180.jpg?size=626&ext=jpg',
                balance:200,
                transaction:[],
                chat:[]
            })
            // save to database
            newUser.save()
            //to send response back to client
            return{
                statusCode:200,
                message:'Successfully Registered'
            }

        }
    })

}

//logic for login - asynchronous function-> promise - .then
const login=(acno,password)=>{
    console.log('inside the login function')
    // console.log(acno)
    return db.User.findOne({acno,password}).then((result)=>{
      //acno present in database
        if(result){
            //token generated just below .parameters acno and secret key
            const token=jwt.sign({login:acno},'superkey2023')
            return{
                statusCode:200,
                message:'Successfully logged in', 
                currentUser:result.username,        
                token, //send to the client
                currentAcno:acno
            }
        }
        else{
            //acno not present in database
            return{
                statusCode:401,
                message:'Invalid Data'
            }
        }
    })
}



// get all users
const getAllUsers=()=>{
    return db.User.find().then((result)=>{
        if(result){
            return{
                statusCode:200,
                allUsers:result
            }
        }
        else{
            return{
                statusCode:401,
                message:"No User exits"
            }
        }
    })
}

//logic for balance enquiry
const getBalance=(acno)=>{
    return db.User.findOne({acno}).then((result)=>{
        if(result){
            return{
                statusCode:200,
                balance:result.balance
            }
        }
        else{
            return{
              statusCode:401,
              message:'Invalid Data'
            }
        }
    })
}

//fund transfer
const fundTransfer=(fromAcno,fromAcnoPswd,toAcno,amt)=>{
    console.log('inside fund transferrrr')
    console.log(fromAcno)
    console.log(amt)

    //convert amt into number
    let amount=parseInt(amt)

    //check fromAcno in mongoDB
    return db.User.findOne({
        acno:fromAcno,
        password:fromAcnoPswd
    }).then((debitdetails)=>{
        if(debitdetails){  //if from acno and pass is present
            return db.User.findOne({acno:toAcno}).then((creditDetails)=>{  
                if(creditDetails){    // check if to acno 
                    if(debitdetails.balance>amount){
                        debitdetails.balance-=amount;
                        // console.log(debitdetails)  
                //pushing debit_details to transaction array in Debit_acc 
                        debitdetails.transaction.push({  
                            type:'Debit',
                            amount,
                            fromAcno,
                            toAcno
                        })
                        //save changes to mongodb
                        debitdetails.save()

                        //update toAcno
                        creditDetails.balance+=amount
                        creditDetails.transaction.push({
                            type:'credit',
                            amount,
                            fromAcno,
                            toAcno
                        })
                        //save to MongoDB
                        creditDetails.save()

                        //send response to the client side
                        return{
                            statusCode:200,
                            message:'Fund Transfer successful'
                        }


                    }
                    else{
                        return{
                            statusCode:401,
                            message:'Insufficient Balance'
                          }
                    }
                }
                else{   
                    return{
                        statusCode:401,
                        message:'Invalid Datas'
                      }
                }
            })
        }
        else{   //else of fromAcc
            return{
                statusCode:401,
                message:'Invalid Data'
              }
        }
    })
}

// Transaction history logic
const getTransationHistory=(acno)=>{
    return db.User.findOne({acno}).then((result)=>{
        if(result){
            return{
                statusCode:200,
                toUser:result,
                transaction:result.transaction
            }
        }
        else{
            return{
                statusCode:401,
                message:"Account does not exist"
            }
        }
    })
}

    //logic to delete account
    const deleteUserAccount=(acno)=>{
        //acno delete from MongoDB
        return db.User.deleteOne({acno}).then((result)=>{
            if(result){
                    return{
                        statusCode:200,
                        message:'Account deleted Successfully'
                    }
                }
            else{
                return{
                    statusCode:401,
                    message:"Account does not exist"
                }
            }
        })
    }


    // Msg transaction

    const messageTransfer=(fromAcno,toAcno,msg)=>{
        console.log('inside message logic transferrrr')
        console.log(fromAcno)
        console.log(msg)

        //check fromAcno in mongoDB
        return db.User.findOne({
            acno:fromAcno,
        }).then((debitdetails)=>{
            if(debitdetails){  //if from acno and pass is present
                return db.User.findOne({acno:toAcno}).then((creditDetails)=>{  
                    if(creditDetails){    // check if to acno 
                        if(msg){
                    //pushing msg debit details to chat array in Debit_acc 
                            debitdetails.chat.push({  
                                type:'send',
                                msg,
                                fromAcno,
                                toAcno
                            })
                            //save changes to mongodb
                            debitdetails.save()
    
                            //update toAcno
                            creditDetails.chat.push({
                                type:'recieve',
                                msg,
                                fromAcno,
                                toAcno
                            })
                            //save to MongoDB
                            creditDetails.save()
    
                            //send response to the client side
                            return{
                                statusCode:200,
                                message:'Fund Transfer successful'
                            }
    
    
                        }
                        else{
                            return{
                                statusCode:401,
                                message:'Enter a msg to send'
                              }
                        }
                    }
                    else{   
                        return{
                            statusCode:401,
                            message:'Invalid credit Data'
                          }
                    }
                })
            }
            else{   //else of fromAcc
                return{
                    statusCode:401,
                    message:'Invalid debit Data'
                  }
            }
        })
    }


    // Chat history logic
const getChatHistory=(acno)=>{
    return db.User.findOne({acno}).then((result)=>{
        if(result){
            console.log(result.chat)
            return{
                statusCode:200,
                toUser:result,
                chat:result.chat
            }
        }
        else{
            return{
                statusCode:401,
                message:"Account does not exist"
            }
        }
    })
}





// exports
module.exports = {
    register,
    login,
    getAllUsers,
    fundTransfer,
    getBalance,
    getTransationHistory,
    deleteUserAccount,
    messageTransfer,
    getChatHistory
}
