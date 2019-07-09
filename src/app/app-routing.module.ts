import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: '', redirectTo: 'item-detail', pathMatch: 'full' },
	
	{
		path: 'account-view',
		loadChildren:
			'./user/account-view/account-view.module#AccountViewPageModule'
	},
	{
		path: 'item-detail',
		loadChildren: './item/item-detail/item-detail.module#ItemDetailPageModule'
	},
	{
		path: 'signup',
		loadChildren: './user/signup/signup.module#SignupPageModule'
	},
	{
		path: 'main-list',
		loadChildren: './main/main-list/main-list.module#MainListPageModule'
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule {}
