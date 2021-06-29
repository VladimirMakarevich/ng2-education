import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { StateService } from "../../../@core/services/state.service";

@Component({
  selector: 'app-toggle-settings-button',
  styleUrls: ['./toggle-settings-button.component.scss'],
  template: `
    <button nbButton appearance="outline" class="toggle-settings" (click)="toggleSettings()">
      <nb-icon class="icon" [class.icon-pulse]="enablePulse" icon="settings-2-outline" pack="eva"></nb-icon>
    </button>
  `,
})
export class ToggleSettingsButtonComponent implements OnInit, OnDestroy {

  protected destroy$ = new Subject<void>();

  public enablePulse = true;

  @HostBinding('class.position-start')
  public positionStart = false;

  @HostBinding('class.position-end')
  public positionEnd = false;

  @HostBinding('class.expanded')
  public expanded = false;

  public constructor(
    protected sidebarService: NbSidebarService,
    protected stateService: StateService
  ) {
  }

  public ngOnInit(): void {
    this.stateService.onSidebarState()
      .pipe(
        map(sidebar => sidebar.id !== 'end'),
        takeUntil(this.destroy$),
      )
      .subscribe((isSettingsSidebarEnd: boolean) => {
        this.positionEnd = isSettingsSidebarEnd;
        this.positionStart = !isSettingsSidebarEnd;
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public toggleSettings(): void {
    this.sidebarService.toggle(false, 'settings-sidebar');
    this.expanded = !this.expanded;
    this.enablePulse = false;
  }

}
