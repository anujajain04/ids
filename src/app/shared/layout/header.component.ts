import { Component, OnInit, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { LocalizationService } from '@abp/localization/localization.service';
import { AbpSessionService } from '@abp/session/abp-session.service';
import { AbpMultiTenancyService } from '@abp/multi-tenancy/abp-multi-tenancy.service';
import {
    ProfileServiceProxy,
    UserLinkServiceProxy,
    UserServiceProxy,
    LinkedUserDto,
    ChangeUserLanguageDto
} from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

import { ChangePasswordModalComponent } from './profile/change-password-modal.component';
import { ChangeProfilePictureModalComponent } from './profile/change-profile-picture-modal.component';
import { MySettingsModalComponent } from './profile/my-settings-modal.component'
import { AppSessionService } from '@shared/common/session/app-session.service';
import { AppAuthService } from '@app/shared/common/auth/app-auth.service';
import { ImpersonationService } from '@app/admin/users/impersonation.service';
import { LinkedAccountService } from '@app/shared/layout/linked-account.service';

@Component({
    templateUrl: './header.component.html',
    selector: 'header',
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent extends AppComponentBase implements OnInit {
    @ViewChild('changePasswordModal') changePasswordModal: ChangePasswordModalComponent;
    isImpersonatedLogin: boolean = false;
    shownLoginNameTitle: string = "";
    shownLoginName: string = "";
    unreadChatMessageCount = 0;
    chatConnected = false;
    userName: string = "";
    constructor(
        injector: Injector,
         private _authService: AppAuthService,
    ) {
        super(injector);
        debugger
        this.userName = localStorage.getItem("userName");
    }

    ngOnInit() {
        
    }
    ChangePassword(): void {
        debugger
        this._authService.reset();
    }
    logout(): void {
        debugger
        this._authService.logout();
    }
}