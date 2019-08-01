import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-slide',
    templateUrl: './slide.page.html',
    styleUrls: ['./slide.page.scss']
})
/**
 * Page to display intro slides
 */
export class SlidePage implements OnInit {
    constructor(
        private navController: NavController,
    ) { }

    ngOnInit() { }

    /**
     * Hides the slide and navigates to root directory
     */
    hideView() {    
        this.navController.navigateRoot('/');
    }
}
