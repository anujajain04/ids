import{Component,Injector} from '@angular/core';
import{AppComponentBase} from '@shared/common/app-component-base';
import{appModuleAnimation} from'@shared/animations/routerTransition';

@Component({
    templateUrl:'./view-dashboard-pieChart.component.html'
})

export class viewdashboardpieChartComponent extends AppComponentBase{
    constructor(
        injector:Injector
    ){
        super(injector)
    }
}