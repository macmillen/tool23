import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: '', redirectTo: 'item-detail', pathMatch: 'full' },
	{ path: 'home', loadChildren: './home/home.module#HomePageModule' },
	{
		path: 'account-view',
		loadChildren:
			'./user/account-view/account-view.module#AccountViewPageModule'
	},
  { path: 'item-detail', loadChildren: './item/item-detail/item-detail.module#ItemDetailPageModule' }
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
	],
	exports: [RouterModule]
})
export class AppRoutingModule {}
