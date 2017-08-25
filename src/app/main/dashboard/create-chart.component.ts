import {Component,Injector} from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    templateUrl:'./create-chart.component.html',
    animations:[appModuleAnimation()]
})


export class CreateChartComponent extends AppComponentBase{
        constructor(injector:Injector)
        {
            super(injector);
        }

}
