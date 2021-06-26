import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ngx-switcher',
  styleUrls: ['./switcher.component.scss'],
  template: `
    <label class="switch-label" [class.vertical]="vertical">
      <span class="first" [class.active]="vertical || isFirstValue()">
        {{vertical ? currentValueLabel() : firstValueLabel}}
      </span>

      <div class="switch">
        <input type="checkbox" [checked]="isSecondValue()" (change)="changeValue()">
        <span class="slider"></span>
      </div>

      <span *ngIf="!vertical"
            class="second"
            [class.active]="isSecondValue()">
          {{secondValueLabel}}
      </span>
    </label>
  `,
})
export class SwitcherComponent {
  @Input()
  public firstValue: any;
  @Input()
  public secondValue: any;

  @Input()
  public firstValueLabel: string;
  @Input()
  public secondValueLabel: string;

  @Input()
  public vertical: boolean;

  @Input()
  public value: any;
  @Output()
  public valueChange = new EventEmitter<any>();

  public isFirstValue(): boolean {
    return this.value === this.firstValue;
  }

  public isSecondValue(): boolean {
    return this.value === this.secondValue;
  }

  public currentValueLabel(): string {
    return this.isFirstValue()
      ? this.firstValueLabel
      : this.secondValueLabel;
  }

  public changeValue(): void {
    this.value = this.isFirstValue()
      ? this.secondValue
      : this.firstValue;

    this.valueChange.emit(this.value);
  }

}
