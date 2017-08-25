import { Component, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AnalysisService } from '@shared/service-proxies/ids-analysis-service-proxies';
@Component({
    selector: 'dash-horizontal-bar',
    templateUrl: './create-horizontalbar-dash.html',
    animations: [appModuleAnimation()]
})

export class DashboardHorizontalBarComponent {

    constructor() {
        AnalysisService.isAnalysisPage = true;
    }




}