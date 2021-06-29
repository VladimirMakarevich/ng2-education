import { Component, Input, OnDestroy } from '@angular/core';
import { NbLayoutDirection, NbLayoutDirectionService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-layout-direction-switcher',
  template: `
    <app-switcher
      [firstValue]="directions.RTL"
      [secondValue]="directions.LTR"
      [firstValueLabel]="'RTL'"
      [secondValueLabel]="'LTR'"
      [value]="currentDirection"
      (valueChange)="toggleDirection($event)"
      [vertical]="vertical">
    </app-switcher>
  `,
})
export class LayoutDirectionSwitcherComponent implements OnDestroy {
  public directions = NbLayoutDirection;
  public currentDirection: NbLayoutDirection;
  public alive = true;

  @Input()
  public vertical: boolean = false;

  public constructor(
    private directionService: NbLayoutDirectionService
  ) {
    this.currentDirection = this.directionService.getDirection();

    this.directionService.onDirectionChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(newDirection => this.currentDirection = newDirection);
  }

  public toggleDirection(newDirection): void {
    this.directionService.setDirection(newDirection);
  }

  public ngOnDestroy(): void {
    this.alive = false;
  }

}
