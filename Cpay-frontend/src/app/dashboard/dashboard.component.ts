import { Component, OnInit } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  filteredUsers:any=[]
  logoutStatus:boolean=false;
  user=''
  currentAcno:string=''
  CurrentAcnoNum:Number=0
  balance:number=0
  fundTransferSuccessMsg:string=''
  fundTransferErrorMsg:string=''
  searchTerm:String=''

  toUser:any={}
  toUserName:string=''
  toUserAcno:Number=0
  toUserImage:string=''
  transaction:any=[]
  creditacno:Number=0;
  allUsers:[]=[];
  currentUserDetails:any=[];
  passwordTerm:String=''
  invalidpassword:boolean=false
  message:String=''
  chat:any=[]


  constructor(private fundfb:FormBuilder,private api:ApiService, private loginRouter:Router, http:HttpClientModule, private dashboardRouter:Router){}
  ngOnInit(): void {
    if(!localStorage.getItem('token')){   
      alert('Please Login')
      this.dashboardRouter.navigateByUrl('')

    }
    if(localStorage.getItem('currentUser')){
      this.user=localStorage.getItem('currentUser')||''
      console.log(this.user)
    }
    if(localStorage.getItem('currentAcno')){
      this.currentAcno=localStorage.getItem('currentAcno')||''
      this.CurrentAcnoNum = +this.currentAcno
    }

    this.api.getAllUsers().subscribe((result:any)=>{
      // console.log(result)
      this.allUsers = result.allUsers;
     this.filteredUsers= this.allUsers.filter((users:any)=>users.acno!=this.currentAcno)
    //  storing current user deatils 
     this.currentUserDetails = this.allUsers.filter((users:any)=>users.acno==this.currentAcno) 
     console.log(this.currentUserDetails)
      console.log(this.allUsers)
      console.log(this.filteredUsers)
    })

  }


  // search input keyup function 
  search(event:any){
    this.searchTerm=event.target.value;

  }

  fundForm=this.fundfb.group({                                            //form group
    amount:['',[Validators.required,Validators.pattern('[0-9]*')]],
    password:['',[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]]      //form control in html page
  }) 



  // to get send user data - given in chat / pay button
  passToAcno(toAcno:any){
    this.creditacno = toAcno;
    console.log(this.creditacno)
    this.toUser = this.filteredUsers.filter((user:any)=>user.acno==toAcno)
    // console.log(this.toUser[0].acno)
    this.toUserName = this.toUser[0].username
    this.toUserImage = this.toUser[0].image
    this.toUserAcno = this.toUser[0].acno
    // caling both fns for getting corrensponding from/to user infos at 'click' on chat / pay button 
    this.getTransactions();
    this.getChats();
  }

  // fund transfer
  fundTransfer(){
    if(this.fundForm.valid){
      let curAcno = this.CurrentAcnoNum
      let creditAcno = this.creditacno
      let amount=this.fundForm.value.amount
      let password=this.fundForm.value.password

      this.api.fundTransfer(curAcno,creditAcno,password,amount).subscribe((result:any)=>{
        console.log(result);
        this.fundTransferSuccessMsg=result.message; //successful
        setTimeout(()=>{
          this.getTransactions()
          this.fundForm.reset()
          this.fundTransferSuccessMsg=''
        },2000)
      },
      (result:any)=>{
        console.log(result.error.message);
        this.fundTransferErrorMsg=result.error.message; //error
        setTimeout(()=>{
          // this.fundForm.reset()
          this.fundTransferErrorMsg=''
        },2000)
      }
      )
    }
    else{
      alert('Please provide a valid data')
    }
    
  }


  // get Transactions
  getTransactions(){
    this.api.getTransactionHistory(this.CurrentAcnoNum).subscribe((result:any)=>{
      // console.log(result); 
      this.transaction=result.transaction; //transaction array
      console.log(this.transaction)
    },
    (result:any)=>{
      console.log(result.error.message);
    }
    )

  }

  // get Chats
  getChats(){
    this.api.getChatHistory(this.CurrentAcnoNum).subscribe((result:any)=>{
      // console.log(result); 
      this.chat=result.chat; //transaction array
      console.log(this.chat)
    },
    (result:any)=>{
      console.log(result.error.message);
    }
    )

  }



  //add message info to string from event - (keyup)
  addMessage(event:any){
    this.message =  event.target.value;
    console.log(this.message)
  }
  
  // Message Transfer
  messageTransfer(){

    let curAcno = this.CurrentAcnoNum
      let creditAcno = this.creditacno
      let message=this.fundForm.value.amount

      this.api.messageTransfer(curAcno,creditAcno,message).subscribe((result:any)=>{
        console.log(result);
        // this.fundTransferSuccessMsg=result.message; //successful
        setTimeout(()=>{
          this.getChats()
          this.fundForm.reset()
          // this.fundTransferSuccessMsg=''
        },1000)
      },
      (result:any)=>{
        console.log(result.error.message);
        this.fundTransferErrorMsg=result.error.message; //error
        setTimeout(()=>{
          // this.fundForm.reset()
          this.fundTransferErrorMsg=''
        },2000)
      }
      )

  }




  //balance refresh current user
  getBalance(){
    this.api.getAllUsers().subscribe((result:any)=>{
      // console.log(result)
      this.allUsers = result.allUsers;
     this.filteredUsers= this.allUsers.filter((users:any)=>users.acno!=this.currentAcno)
    //  storing current user deatils 
     this.currentUserDetails = this.allUsers.filter((users:any)=>users.acno==this.currentAcno) 
     console.log(this.currentUserDetails)
      console.log(this.allUsers)
      console.log(this.filteredUsers)
    })
  }

 //logout fn
 logout(){
  this.logoutStatus=true;
  localStorage.clear();
    setTimeout(()=>{
       this.dashboardRouter.navigateByUrl('');
      },500)
  }


  // taking input password values
  passwordPass(event:any){
    this.passwordTerm=event.target.value;
    console.log(this.passwordTerm)

  }
  // delete account
  deleteAccount(){
    if(this.currentUserDetails[0].password==this.passwordTerm){
      this.api.deleteAccount(this.CurrentAcnoNum).subscribe((result:any)=>{
        console.log(result)
        alert('Account Deleted')
        localStorage.clear()
        this.dashboardRouter.navigateByUrl('/')
      })
    }
    else{
      this.invalidpassword=true;
    }
  }


  
}
