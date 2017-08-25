import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule, TabsModule, TooltipModule } from 'ng2-bootstrap';
import { AdminRoutingModule } from './admin-routing.module'
import { UtilsModule } from '@shared/utils/utils.module'
import { AppCommonModule } from '@app/shared/common/app-common.module'
import { AdminComponent } from './admin.component'
import { ImpersonationService } from './users/impersonation.service';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        CommonModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        AdminRoutingModule,
        UtilsModule,
        AppCommonModule
    ],
    declarations: [
        AdminComponent,          
    ],
    providers: [
        ImpersonationService
    ]
})
export class AdminModule { }