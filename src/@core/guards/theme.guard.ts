import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CurrentThemeService } from "../services/theme.service";

@Injectable()
export class ThemeGuard implements CanActivate {

  public constructor(
    private router: Router,
    private currentThemeService: CurrentThemeService
  ) {
  }

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.currentThemeService.currentTheme$.pipe(
      map(theme => {
        if (!theme) {
          this.router.navigate(['themes']);
        }
        return true;
      }));
  }

}
