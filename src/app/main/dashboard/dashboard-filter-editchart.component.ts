import {Component,Injector} from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    templateUrl:'./dashboard-filter.editchart.component.html',
    animations:[appModuleAnimation()]
})


export class DashboardFilterEditChartComponent extends AppComponentBase{
constructor(
    injector:Injector
)
{
    super(injector);
}

}
