import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
    {
        path: 'account-view/:userID',
        canActivate: [AuthGuard],
        loadChildren: './user/account-view/account-view.module#AccountViewPageModule'
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
        path: 'transaction-detail/:itemID',
        canActivate: [AuthGuard],
        loadChildren: './transaction/transaction-detail/transaction-detail.module#TransactionDetailPageModule'
    },
    {
        path: 'edit-user/:userID',
        canActivate: [AuthGuard],
        loadChildren: './user/edit-user/edit-user.module#EditUserPageModule'
    },
    {
        path: 'edit-item/:itemID',
        canActivate: [AuthGuard],
        loadChildren: './item/edit-item/edit-item.module#EditItemPageModule'
    },
    {
        path: 'edit-item',
        canActivate: [AuthGuard],
        loadChildren: './item/edit-item/edit-item.module#EditItemPageModule'
    },
    {
        path: 'slide',
        loadChildren: './slide/slide.module#SlidePageModule'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
