import { Component, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AnalysisService } from '@shared/service-proxies/ids-analysis-service-proxies';
@Component({
    selector: 'dash-word',
    templateUrl: './create-word-dash.html',
    animations: [appModuleAnimation()]
})

export class DashboardWordComponent {

    constructor() {
        AnalysisService.isAnalysisPage = true;
    }




}