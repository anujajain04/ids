import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { ModalModule, TooltipModule } from 'ng2-bootstrap';
import { FileUploadModule } from '@node_modules/ng2-file-upload';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/layout/header.component';
import { SideBarComponent } from './shared/layout/side-bar.component';
import { FooterComponent } from './shared/layout/footer.component';
import { BreadcrumbComponent } from './main/breadcrumb/breadcrumb.component';
import { ChangePasswordModalComponent } from '@app/shared/layout/profile/change-password-modal.component';
import { ChangeProfilePictureModalComponent } from '@app/shared/layout/profile/change-profile-picture-modal.component';
import { MySettingsModalComponent } from '@app/shared/layout/profile/my-settings-modal.component';
import { AbpModule, ABP_HTTP_PROVIDER } from '@abp/abp.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { AppCommonModule } from './shared/common/app-common.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { MainModule } from './main/main.module';
import { AdminModule } from './admin/admin.module';
import { API_BASE_URL } from '@shared/service-proxies/service-proxies';
import { AppConsts } from '@shared/AppConsts';
import { AppSessionService } from '@shared/common/session/app-session.service';
import { ImpersonationService } from './admin/users/impersonation.service';
import { LinkedAccountService } from './shared/layout/linked-account.service';
import { LinkAccountModalComponent } from '@app/shared/layout/link-account-modal.component';
import { CreateAnalysisComponent } from '../app/main/analysis/create-analysis-studio';
//import { CreateModelAnalysisComponent } from '../app/main/model/create-model-analysis-studio';
import { gojsComponent } from '../app/main/analysis/gojs.component';
import { gojscontextComponent } from '../app/main/analysis/gojscontext.component';
import { BlankComponent } from './main/analysis/property-pane/blank.component';
//import { CreateModelAnalysisComponent } from '../app/main/model/create-model-analysis-studio';
//import { CreateModelAnalysisComponent } from '../app/main/model/create-model-analysis-studio';


@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,       
        SideBarComponent,
        FooterComponent,
        BreadcrumbComponent, 
        LinkAccountModalComponent,
        ChangePasswordModalComponent,
        ChangeProfilePictureModalComponent,
        MySettingsModalComponent,
        BreadcrumbComponent,
        CreateAnalysisComponent,
        //CreateModelAnalysisComponent,
        gojsComponent,
        gojscontextComponent,
     //  CreateModelAnalysisComponent
        //CreateModelAnalysisComponent,
        BlankComponent
        //AlgorithmComponent,
        //DynamicFormComponent,
        //DynamicFormQuestionComponent
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        FileUploadModule,
        AbpModule,
        AppRoutingModule,
        UtilsModule,
        AppCommonModule,
        ServiceProxyModule,
        MainModule,
        AdminModule,
      //  Ng2PaginationModule
    ],
    providers: [
        ABP_HTTP_PROVIDER,
        { provide: API_BASE_URL, useFactory: () => { return AppConsts.remoteServiceBaseUrl; } },
        {
            provide: APP_INITIALIZER,
            useFactory: (appSessionService: AppSessionService) => () => appSessionService.init(),
            deps: [AppSessionService],
            multi: true
        },
        ImpersonationService,
        LinkedAccountService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
