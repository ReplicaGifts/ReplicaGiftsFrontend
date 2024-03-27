import { Routes } from '@angular/router';

import { AuthGuard } from './auth.guard';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { WishListComponent } from './wish-list/wish-list.component';
import { UserAuthGuard } from './user-auth.guard';
import { DeleveryDetailsComponent } from './delevery-details/delevery-details.component';
import { ShopeComponent } from './shope/shope.component';

import { RegisterComponent } from './register/register.component';
import { TearmsAndConditionComponent } from './tearms-and-condition/tearms-and-condition.component';
import { PrivacyPaclicyComponent } from './privacy-paclicy/privacy-paclicy.component';
import { OrderViewComponent } from './order-view/order-view.component';

export const routes: Routes = [


    { path: '', component: ProductListComponent },
    { path: 'product/:id', component: ProductDetailsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'cart', component: ShoppingCartComponent },
    { path: 'wish', component: WishListComponent },
    { path: 'shop', component: ShopeComponent },
    { path: 'buy-now/:id', component: DeleveryDetailsComponent },
    { path: 'check-out', component: DeleveryDetailsComponent },
    { path: 'order-view/:id', component: OrderViewComponent },
    { path: 'terms', component: TearmsAndConditionComponent },
    { path: 'privacy-policy', component: PrivacyPaclicyComponent },
];
