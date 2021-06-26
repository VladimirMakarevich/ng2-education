import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { filter, withLatestFrom } from "rxjs/operators";
import { CurrentThemeService } from "../@core/services/theme.service";
import { NbThemeService } from "@nebular/theme";
import { ActivatedRoute } from "@angular/router";
import { AbService } from "../@core/services/ab.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  public themes = ['default', 'cosmic', 'corporate', 'dark', 'material-dark', 'material-light'];

  public constructor(
    private activatedRoute: ActivatedRoute,
    private abService: AbService,
    private themeService: NbThemeService,
    private currentThemeService: CurrentThemeService
  ) {

    this.themeService.onThemeChange()
      .subscribe((theme: any) => {
      });

    this.activatedRoute.queryParams
      .subscribe((params: any) => {
        if (params.theme && this.themes.includes(params.theme)) {
          this.themeService.changeTheme(params.theme);
          this.currentThemeService.setCurrentTheme(params.theme);
        } else {
          this.themeService.changeTheme(this.currentThemeService.getCurrentTheme());
        }
      });
  }

  public ngOnInit(): void {

    const variants = [
      AbService.VARIANT_THEME_CORPORATE,
      AbService.VARIANT_THEME_DEFAULT,
      AbService.VARIANT_THEME_COSMIC,
      AbService.VARIANT_THEME_DARK,
    ];

    this.abService.onAbEvent()
      .pipe(
        withLatestFrom(this.activatedRoute.queryParams),
        filter(([e, params]: [{ name: string }, any]) => !params.theme),
      )
      .subscribe(([e, params]: [{ name: string }, any]) => {
        const themeName = e.name.replace('theme-change-', '');
        if (variants.includes(e.name) && this.themes.includes(themeName)) {
          this.themeService.changeTheme(themeName);
        }
      });
  }

}
