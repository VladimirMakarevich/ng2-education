import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Injectable()
export class CurrentThemeService implements OnDestroy {
  public alive = true;

  public readonly currentTheme$: Observable<any> = new Observable(subscriber => {
    subscriber.next(localStorage.theme);
  }).pipe(takeWhile(() => this.alive));

  public setCurrentTheme(themeName: string): void {
    const currentTheme = {
      themeName: themeName
    };

    localStorage.setItem('theme', JSON.stringify(currentTheme));
  }

  public getCurrentTheme(): string {
    return localStorage.theme ? JSON.parse(localStorage.theme).themeName : 'default';
  }

  public ngOnDestroy(): void {
    this.alive = false;
  }

}
