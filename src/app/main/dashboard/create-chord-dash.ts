import { Component, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AnalysisService } from '@shared/service-proxies/ids-analysis-service-proxies';
@Component({
    selector: 'dash-chord',
    templateUrl: './create-chord-dash.html',
    animations: [appModuleAnimation()]
})

export class DashboardChordComponent {

    constructor() {
        AnalysisService.isAnalysisPage = true;
    }




}