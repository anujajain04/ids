﻿import { Injectable } from '@angular/core';
import { AccountServiceProxy, ImpersonateInput, ImpersonateOutput } from '@shared/service-proxies/service-proxies';
import { AppUrlService } from '@app/shared/common/nav/app-url.service';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';

@Injectable()
export class ImpersonationService {

    constructor(
        private _accountService: AccountServiceProxy,
        private _appUrlService: AppUrlService,
        private _authService: AppAuthService
    ) {

    }

    impersonate(userId: number, tenantId?: number): void {

        let input = new ImpersonateInput();
        input.userId = userId;
        input.tenantId = tenantId;

        this._accountService.impersonate(input)
            .subscribe((result: ImpersonateOutput) => {
                this._authService.logout(false);

                var targetUrl = this._appUrlService.getAppRootUrlOfTenant(result.tenancyName) + "?impersonationToken=" + result.impersonationToken;
                if (input.tenantId) {
                    targetUrl = targetUrl + '&tenantId=' + input.tenantId;
                }

                location.href = targetUrl;
            });
    }

    backToImpersonator(): void {
        this._accountService.backToImpersonator()
            .subscribe((result: ImpersonateOutput) => {
                this._authService.logout(false);

                var targetUrl = this._appUrlService.getAppRootUrlOfTenant(result.tenancyName) + "?impersonationToken=" + result.impersonationToken;
                if (abp.session.impersonatorTenantId) {
                    targetUrl = targetUrl + '&tenantId=' + abp.session.impersonatorTenantId;
                }

                location.href = targetUrl;
            });
    }
}