import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderBoardComponent implements OnInit {
  leaderBoard: {userName: string, walletWorth: number, rank: number}[];
  constructor(private currencyService: CurrencyService) { }

  ngOnInit() {
    this.currencyService.getLeaderBoard().subscribe(leaderBoard =>{
      this.leaderBoard = leaderBoard.leaderBoard;
    })
  }
}
