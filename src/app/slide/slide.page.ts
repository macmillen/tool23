import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-slide',
	templateUrl: './slide.page.html',
	styleUrls: ['./slide.page.scss']
})
export class SlidePage implements OnInit {
	constructor(private router: Router) {}

	ngOnInit() {}

	hideView() {
		this.router.navigate(['main-list']);
	}
}
