import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NbComponentSize, NbComponentStatus, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-call-action-card',
  styleUrls: ['./call-action-card.component.scss'],
  template: `
    <nb-card>
      <div class="icon-container">
        <div class="icon">
          <nb-icon [icon]="type"></nb-icon>
        </div>
      </div>

      <div class="details">
        <div class="title h6">{{ title }}</div>
      </div>

      <div class="actions">
        <a nbButton [size]="buttonSize" [status]="getButtonStatus()" hero [href]="link">
          {{ linkTitle }}
        </a>
      </div>
    </nb-card>
  `,
})
export class CallActionCardComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  @Input()
  public title: string;
  @Input()
  public type: string;
  @Input()
  public link: string;
  @Input()
  public linkTitle: string;

  public currentTheme: string;
  public buttonSize: NbComponentSize;

  public constructor(
    private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService,
  ) {
  }

  public ngOnInit(): void {
    this.themeService.getJsTheme()
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.currentTheme = theme.name;
      });

    const {xxl} = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xxl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXxl: boolean) => {
        this.buttonSize = isLessThanXxl
          ? 'small'
          : 'large';
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getButtonStatus(): NbComponentStatus {
    switch (this.currentTheme) {
      case 'cosmic':
        return 'primary';
      case 'corporate':
        return 'warning';
      default:
        return 'danger';
    }
  }

}
