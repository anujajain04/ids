import { Component, ViewContainerRef, OnInit, ViewEncapsulation } from '@angular/core';
import { AccountModule } from './account.module';
import { LoginService } from './login/login.service';
import { AppConsts } from '@shared/AppConsts';

import * as moment from 'moment';

@Component({
    selector: 'app-root',
    templateUrl: './account.component.html',
    styleUrls: [
        './account.component.less'
    ],
    encapsulation: ViewEncapsulation.None
})
export class AccountComponent implements OnInit {
    private height: number;
    private viewContainerRef: ViewContainerRef;
    private height1: number;
    private width: number;
    currentYear: number = moment().year();

    public constructor(
        private _loginService: LoginService,
        viewContainerRef: ViewContainerRef
    ) {
        this.viewContainerRef = viewContainerRef; // We need this small hack in order to catch application root view container ref for modals
    }

    showTenantChange(): boolean {
        return abp.multiTenancy.isEnabled && !this.supportsTenancyNameInUrl();
    }

    ngOnInit(): void {
        this.height = window.innerHeight-79;
        this._loginService.init();
        this.width = window.innerWidth-308;
        this.height1 = this.width/3;
    }

    private supportsTenancyNameInUrl() {
        return (AppConsts.appBaseUrlFormat && AppConsts.appBaseUrlFormat.indexOf(AppConsts.tenancyNamePlaceHolderInUrl) >= 0);
    }
}
