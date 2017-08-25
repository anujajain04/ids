import{Component,Injector} from '@angular/core';
import{AppComponentBase} from '@shared/common/app-component-base';
import{appModuleAnimation} from '@shared/animations/routerTransition';

@Component({
    templateUrl:'./view-dashboard-chordChart.component.html',
    animations:[appModuleAnimation()]
})

export class viewdashboardchordChartComponent extends AppComponentBase{
    
    constructor(
        injector:Injector
    ){
        super(injector)
    }
}