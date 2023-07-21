import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/_Models/account';
import { AccountService } from 'src/app/_Services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  Name: any;

  constructor() { }

  ngOnInit(): void {
    this.Name = localStorage.getItem("name");
  }
  // getAccountDetails() {
  //   this.accountService.getAccountDetails().subscribe(
  //     account => {
  //       // Access the account details and perform any necessary actions
  //       console.log(account);
  //     },
  //     error => {
  //       console.log('Error retrieving account details:', error);
  //     }
  //   );
  // }

}
