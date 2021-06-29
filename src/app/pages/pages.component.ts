import { Component, OnDestroy, OnInit } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MetadataService } from "../../@core/services/metadata.service";

@Component({
  selector: 'app-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <app-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </app-sample-layout>
  `,
})
export class PagesComponent implements OnInit, OnDestroy {
  public destroy$: Subject<boolean> = new Subject<boolean>();

  public constructor(
    private menuService: NbMenuService,
    private metaDataService: MetadataService
  ) {
  }

  public menu = MENU_ITEMS;

  public ngOnInit(): void {
    // @ts-ignore
    if (window['dataLayer']) {
      // @ts-ignore
      window['dataLayer'].push({'event': 'optimize.activate'});
    }

    this.menuService
      .onItemSelect()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: { tag: string; item: NbMenuItem }) => {
        if (data.item.title !== 'E-commerce' && data.item.title !== 'IoT Dashboard')
          this.metaDataService.updateTitle(`Ngx-admin dashboard by Akveo | ${data.item.title}`);
        this.metaDataService.updateDescription('Ngx-admin is Angular 9+ Bootstrap 4+ admin dashboard template.' +
          ' Over 40+ Angular Components, 60+ Usage Examples and UI features.');
        this.metaDataService.updateKeywords('ngx-admin, ngx admin dashboard features, ngx admin forms,' +
          ' ngx-admin maps, ngx-admin UI features, ngx-admin tables, ngx admin overlays, ngx-admin extra components');
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
