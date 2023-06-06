import { Component } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {


  constructor(private registerfb:FormBuilder,private api1:ApiService, private registerRouter:Router){}
  regErrorMsg:string=''
  regSuccessMsg: string=''

  registerForm=this.registerfb.group({      //formgroup
    //formarrays
    username:['',[Validators.required,Validators.pattern('[a-zA-Z ]*')]],
    acno:['',[Validators.required,Validators.pattern('[0-9]*')]],   
    password:['',[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]]
  }) 
 //formcontrol passes to register.html

  register(){
    if(this.registerForm.valid){
      // console.log(this.registerForm.value)
    let uname=this.registerForm.value.username
    let acno=this.registerForm.value.acno
    let password=this.registerForm.value.password

    this.api1.register(acno,uname,password).subscribe((result:any)=>{
      // alert(result.message)
      this.regSuccessMsg=result.message;

      //loading time 
      setTimeout(()=>{
        this.registerRouter.navigateByUrl('')

      },4000);
    },
    (result:any)=>{
      this.regErrorMsg=result.error.message //already registered
    })

    //time interval
    setTimeout(()=>{
      this.registerForm.reset()
      this.regErrorMsg="Please provide unique Account Number"
    },2000)
    // alert(`Successfully Registered`)
    }
    else{
      alert('Invalid Form')
    }

  }




}
