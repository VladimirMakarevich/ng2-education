import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { NbAuthModule, NbDummyAuthStrategy } from '@nebular/auth';
import { NbRoleProvider, NbSecurityModule } from '@nebular/security';
import { Observable, of as observableOf } from 'rxjs';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { UserData } from './data/users';
import { StateService } from "./services/state.service";
import { MetadataService } from "./services/metadata.service";
import { CurrentThemeService } from "./services/theme.service";
import { AbService } from "./services/ab.service";
import { LayoutService } from "./services/layout.service";
import { ThemeGuard } from "./guards/theme.guard";
import { RippleService } from "./services/ripple.service";
import { UserService } from "./mocks/users.service";
import { MockDataModule } from "./mocks/mock-data.module";

const socialLinks = [
  {
    url: 'https://github.com/akveo/nebular',
    target: '_blank',
    icon: 'github',
  },
  {
    url: 'https://www.facebook.com/akveo/',
    target: '_blank',
    icon: 'facebook',
  },
  {
    url: 'https://twitter.com/akveo_inc',
    target: '_blank',
    icon: 'twitter',
  },
];

const DATA_SERVICES = [
  {provide: UserData, useClass: UserService},
  {provide: MAT_RIPPLE_GLOBAL_OPTIONS, useExisting: RippleService},
];

const GUARDS = [
  ThemeGuard,
];

export class NbSimpleRoleProvider extends NbRoleProvider {
  public getRole(): Observable<string> {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }

}

export const NB_CORE_PROVIDERS = [
  ...MockDataModule.forRoot().providers,
  ...DATA_SERVICES,
  ...GUARDS,
  ...NbAuthModule.forRoot({

    strategies: [
      NbDummyAuthStrategy.setup({
        name: 'email',
        delay: 3000,
      }),
    ],
    forms: {
      login: {
        socialLinks: socialLinks,
      },
      register: {
        socialLinks: socialLinks,
      },
    },
  }).providers,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: '*',
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,
  {
    provide: NbRoleProvider, useClass: NbSimpleRoleProvider,
  },
  LayoutService,
  MetadataService,
  StateService,
  AbService,
  CurrentThemeService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
})
export class CoreModule {
  public constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  public static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }

}
