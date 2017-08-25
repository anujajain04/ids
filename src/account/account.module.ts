import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RecaptchaModule } from 'ng2-recaptcha';
import { ModalModule } from 'ng2-bootstrap/modal';

import { AbpModule, ABP_HTTP_PROVIDER } from '@abp/abp.module';

import { AccountRoutingModule } from './account-routing.module';

import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { API_BASE_URL } from "@shared/service-proxies/service-proxies";

import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppUrlService } from '@app/shared/common/nav/app-url.service';
import { UtilsModule } from '@shared/utils/utils.module';

import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './password/forgot-password.component';
import { ResetPasswordComponent } from './password/reset-password.component';
import { LoginService } from './login/login.service';

export function appInitializerFactory(appSessionService: AppSessionService): () => Promise<boolean> {
    return () => appSessionService.init();
}

export function apiBaseUrlFactory(): string {
    return AppConsts.remoteServiceBaseUrl;
}

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        JsonpModule,

        RecaptchaModule.forRoot(),
        ModalModule.forRoot(),

        AbpModule,
        UtilsModule,
        ServiceProxyModule,
        AccountRoutingModule
    ],
    declarations: [
        AccountComponent,
        LoginComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFactory,
            deps: [AppSessionService],
            multi: true
        },
        ABP_HTTP_PROVIDER,
        { provide: API_BASE_URL, useFactory: apiBaseUrlFactory },
        LoginService,
        AppSessionService,
        AppUrlService
    ],
    bootstrap: [AccountComponent]
})
export class AccountModule {

}