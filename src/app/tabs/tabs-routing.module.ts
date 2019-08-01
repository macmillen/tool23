import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children:
            [
                {
                    path: 'account-view',
                    canActivate: [AuthGuard],
                    children:
                        [
                            {
                                path: '',
                                loadChildren: '../user/account-view/account-view.module#AccountViewPageModule'
                            }
                        ]
                },
                {
                    path: 'main-list',
                    canActivate: [AuthGuard],
                    children:
                        [
                            {
                                path: '',
                                loadChildren: '../main/main-list/main-list.module#MainListPageModule'
                            }
                        ]
                },
                {
                    path: 'transaction-list',
                    canActivate: [AuthGuard],
                    children:
                        [
                            {
                                path: '',
                                loadChildren: '../transaction/transaction-list/transaction-list.module#TransactionListPageModule'
                            }
                        ]
                },
                {
                    path: '',
                    redirectTo: '/tabs/main-list',
                    pathMatch: 'full'
                }
            ]
    },
    {
        path: '',
        redirectTo: '/tabs/main-list',
        pathMatch: 'full'
    }
];

@NgModule({
    imports:
        [
            RouterModule.forChild(routes)
        ],
    exports:
        [
            RouterModule
        ]
})
export class TabsPageRoutingModule { }
