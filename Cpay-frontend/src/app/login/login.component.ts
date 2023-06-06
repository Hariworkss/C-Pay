import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginErrorMsg:string=''
  logSuccessMsg:boolean=false
  constructor(private loginfb:FormBuilder,private api:ApiService, private loginRouter:Router){}

  loginForm=this.loginfb.group({      //formgroup
    //formarrays
    acno:['',[Validators.required,Validators.pattern('[0-9]*')]],   
    password:['',[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]]
  })   

  //formcontrol passes to login.html


  login(){

    if(this.loginForm.valid){
      // console.log(this.registerForm.value)
    let acno=this.loginForm.value.acno
    let password=this.loginForm.value.password

    // alert(`Login Successfull`)
    //make an api call for login
      this.api.login(acno,password).subscribe((result:any)=>{

        //store currentUser in local storage
        localStorage.setItem('currentUser',result.currentUser)
        //set token in localstorage 
        localStorage.setItem('token',result.token)
        //store acno in locsl storage
        localStorage.setItem('currentAcno',result.currentAcno)

        this.logSuccessMsg=true

        //redirected to dashboard
        setTimeout(()=>{
          this.loginRouter.navigateByUrl('/dashboard')

        },1000)
      },
      //response 401
      (result:any)=>{
        //error message 
        this.loginErrorMsg=result.error.message
        //setTimeout
        setTimeout(()=>{
          this.loginForm.reset()
          this.loginErrorMsg=''
        },2000)
      }
      )
    }
    else{
      alert('Invalid Credentials')
    }

   }



}
