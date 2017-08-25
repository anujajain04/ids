import { Component, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { AnalysisService } from '@shared/service-proxies/ids-analysis-service-proxies';
import { gojscontextComponent } from '../analysis/gojscontext.component';
@Component({
    selector: 'algorithm',
    templateUrl: './Algorithm.html',
    animations: [appModuleAnimation()]
})

export class AlgorithmComponent {

    constructor() {
        AnalysisService.isAnalysisPage = true;
    }




}
