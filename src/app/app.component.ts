import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet, NavigationStart } from '@angular/router';
import { UserAuthService } from './service/user-auth.service';
import { HeaderComponent } from './partials/header/header.component';
import { FooterComponent } from './partials/footer/footer.component';
import { HeaderAllComponent } from './partials/header-all/header-all.component';
import { filter } from 'rxjs';
import { RouterService } from './service/router.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderAllComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ReplicaGifts';
  isRootRoute = true; // Assuming the initial route is the root route
  admin = false;

  constructor(private router: Router, private routerService: RouterService) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isRootRoute = (event.url === '/' || event.url.includes('/#contact'));
        this.admin = this.routerService.isRouteAdmin();
      }
    });
  }
  get isAdminRoute() {
    return this.routerService.isRouteAdmin();
  }
}
