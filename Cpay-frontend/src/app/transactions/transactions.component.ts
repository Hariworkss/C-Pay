import { Component,OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit{
  transaction:any=[]
  searchTerm:string=''
  currentAcno:string=''
  CurrentAcnoNum:Number=0


  constructor(private api:ApiService,private transRouter:Router){}

  ngOnInit(): void {

    if(!localStorage.getItem('token')){   
      alert('Please Login')
      this.transRouter.navigateByUrl('')

    }
    
    if(localStorage.getItem('currentAcno')){
      this.currentAcno=localStorage.getItem('currentAcno')||''
      this.CurrentAcnoNum = +this.currentAcno
    }

      // get Transactions
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

  searchitem(event:any){
    this.searchTerm=event.target.value;
  }


}
