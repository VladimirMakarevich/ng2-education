import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { RippleService } from "../../../@core/services/ripple.service";
import { CurrentThemeService } from "../../../@core/services/theme.service";
import { LayoutService } from "../../../@core/services/layout.service";

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  public materialTheme$: Observable<boolean>;
  public userPictureOnly: boolean = false;
  public user: any;

  public themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
    {
      value: 'material-light',
      name: 'Material Light',
    },
    {
      value: 'material-dark',
      name: 'Material Dark',
    },
  ];

  public currentTheme = 'default';

  public userMenu = [{title: 'Profile'}, {title: 'Log out'}];

  public constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private rippleService: RippleService,
    private currentThemeService: CurrentThemeService,
  ) {
    this.materialTheme$ = new Observable(subscriber => {
      const themeName: string = this.currentThemeService.getCurrentTheme();

      subscriber.next(themeName.startsWith('material'));
    });
  }

  public ngOnInit(): void {
    this.currentTheme = this.themeService.currentTheme;

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    const {xl} = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({name}) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => {
        this.currentTheme = themeName;
        this.rippleService.toggle(themeName?.startsWith('material'));
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public changeTheme(themeName: string): void {
    this.currentThemeService.setCurrentTheme(themeName);
    this.themeService.changeTheme(themeName);

    this.materialTheme$ = new Observable(subscriber => {
      subscriber.next(this.currentThemeService.getCurrentTheme().startsWith('material'));
    });
  }

  public toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  public navigateHome(): boolean {
    this.menuService.navigateHome();
    return false;
  }

  public startSearch(): void {
  }

  public trackEmailClick(): void {
  }

}
