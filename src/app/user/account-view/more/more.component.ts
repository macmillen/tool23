import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NavController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.scss'],
})
export class MoreComponent implements OnInit {

  constructor(
    private userService: UserService,
    private navController: NavController,
    private popOverController: PopoverController,
  ) { }

  ngOnInit() { }

  /**
  * signs current user out via server and closes popUp
  * 
  * @returns void (closes popup)
  */
  signOut() {
    this.userService.signOut().subscribe({
      next: () => {
        this.navController.navigateRoot('/signup');
        this.popOverController.dismiss();
      }
    });
  }

}
