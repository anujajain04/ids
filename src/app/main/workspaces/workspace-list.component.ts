import { Component, Injector } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { CreateWorksapceComponent } from './create-workspace.component';

@Component({
    templateUrl: './workspace-list.component.html',
    animations: [appModuleAnimation()]
})
export class WorkspaceListComponent extends AppComponentBase {

    datasetStage: boolean;
    constructor(injector: Injector) {
        super(injector);

        this.datasetStage = true;

    }

    change(i: boolean) {
        this.datasetStage = i;
    }

    isDataset(): boolean {
        return this.datasetStage;
    }


}