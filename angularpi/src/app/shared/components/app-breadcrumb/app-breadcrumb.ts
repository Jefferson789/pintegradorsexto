import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './app-breadcrumb.html',
  styleUrl: './app-breadcrumb.css'
})
export class AppBreadcrumb implements OnInit {
  breadcrumbs: {
    label: string;
    url: string;
  }[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.breadcrumbs =
      this.buildBreadcrumbs(
        this.route.root
      );

    this.router.events
      .pipe(
        filter(
          event =>
            event instanceof NavigationEnd
        )
      )
      .subscribe(() => {

        this.breadcrumbs =
          this.buildBreadcrumbs(
            this.route.root
          );

        this.cdr.detectChanges();

      });

  }

  private buildBreadcrumbs(
    route: ActivatedRoute,
    url = '',
    breadcrumbs: any[] = []
  ): any[] {

    const label =
      route.snapshot.data['breadcrumb'];

    const routeUrl =
      route.snapshot.url
        .map(segment => segment.path)
        .join('/');

    const newUrl =
      routeUrl
        ? `${url}/${routeUrl}`
        : url;

    if (label) {

      breadcrumbs.push({
        label,
        url: newUrl
      });

    }

    for (const child of route.children) {

      this.buildBreadcrumbs(
        child,
        newUrl,
        breadcrumbs
      );

    }

    return breadcrumbs;

  }
}