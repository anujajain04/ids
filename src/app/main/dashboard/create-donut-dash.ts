import { Component, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AnalysisService } from '@shared/service-proxies/ids-analysis-service-proxies';
@Component({
    selector: 'dash-donut',
    templateUrl: './create-donut-dash.html',
    animations: [appModuleAnimation()]
})

export class DashboardDonutComponent {

    constructor() {
        AnalysisService.isAnalysisPage = true;
    }




}