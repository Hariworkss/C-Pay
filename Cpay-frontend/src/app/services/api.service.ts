import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


const options = {
  headers :new HttpHeaders()
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  base_url:string='http://localhost:6002'
  constructor( private http:HttpClient) { }


  //api call for register
  register(acno:any,username:any,password:any){

    const body={
      acno,username,password
    }
    return this.http.post(`${this.base_url}/register`,body)
  }

  // api call for login
  login(acno:any,password:any){
    const body={
      acno,
      password
    }
    return this.http.post(`${this.base_url}/login`,body)
  }

  //append token to the req header
  appendToken(){
    // get token from local storage
    let token = localStorage.getItem('token')
     //create http header
    let headers = new HttpHeaders()   
    if(token){
      headers = headers.append('verify-token',token)
      options.headers = headers  //overloading
    }
    return options
  }

  getAllUsers(){
    return this.http.get(`${this.base_url}/getallusers`);
  }

  //api call for fund transfer
  fundTransfer(curAcno:any,toAcno:any,password:any,amount:any){
    const body={
      curAcno,
      toAcno,
      password,
      amount
    }
    return this.http.post(`${this.base_url}/fund-transfer`,body,this.appendToken())
  }


  // api call for msg transfer
  messageTransfer(curAcno:any,toAcno:any,msg:any){
    const body={
      curAcno,
      toAcno,
      msg
    }
    return this.http.post(`${this.base_url}/message-transfer`,body,this.appendToken())
  }


  getTransactionHistory(currentAcno:any){   
    return this.http.get(`${this.base_url}/getTransationHistory/`+currentAcno,this.appendToken())
  }

  getChatHistory(currentAcno:any){   
    return this.http.get(`${this.base_url}/getChatHistory/`+currentAcno,this.appendToken())
  }

  deleteAccount(acno:any){
    return this.http.delete(`${this.base_url}/delete-account/${acno}`,this.appendToken())
  }

}
