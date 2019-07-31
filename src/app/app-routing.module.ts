import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'main-list',
		pathMatch: 'full'
	},
	{
		path: 'account-view/:userID',
		canActivate: [AuthGuard],
		loadChildren:
			'./user/account-view/account-view.module#AccountViewPageModule'
	},
	{
		path: 'account-view',
		canActivate: [AuthGuard],
		loadChildren:
			'./user/account-view/account-view.module#AccountViewPageModule'
	},
	{
		path: 'item-detail/:itemID',
		canActivate: [AuthGuard],
		loadChildren: './item/item-detail/item-detail.module#ItemDetailPageModule'
	},
	{
		path: 'signup',
		loadChildren: './user/signup/signup.module#SignupPageModule'
	},
	{
		path: 'main-list',
		canActivate: [AuthGuard],
		loadChildren: './main/main-list/main-list.module#MainListPageModule'
	},
	{
		path: 'transaction-detail/:itemID',
		canActivate: [AuthGuard],
		loadChildren:
			'./transaction/transaction-detail/transaction-detail.module#TransactionDetailPageModule'
	},
	{
		path: 'transaction-list',
		canActivate: [AuthGuard],
		loadChildren:
			'./transaction/transaction-list/transaction-list.module#TransactionListPageModule'
	},
	{
		path: 'edit-user/:userID',
		loadChildren: './user/edit-user/edit-user.module#EditUserPageModule'
	},
	{
		path: 'edit-item/:itemID',
		loadChildren: './item/edit-item/edit-item.module#EditItemPageModule'
	},
	{
		path: 'edit-item',
		loadChildren: './item/edit-item/edit-item.module#EditItemPageModule'
	},
	{
		path: 'slide',
		canActivate: [AuthGuard],
		loadChildren: './slide/slide.module#SlidePageModule'
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule {}
