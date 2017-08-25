import { Component, EventEmitter, Output, Injector } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DatasetService, DeleteDatasetDto, DatasetListDto, DatasetType, DatasetDto, DatasetHistoryDto, PassService, LoadingService } from '@shared/service-proxies/ids-service-proxies';
import { WorkspaceService, WorkspaceDto } from '@shared/service-proxies/ids-workspace-service-proxies';
import { TokenService } from '@abp/auth/token.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SideBarMenuItem } from '../../shared/layout/side-bar-menu-item';
import { SideBarMenu } from '../../shared/layout/side-bar-menu';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'create-workspace',
    templateUrl: './create-workspace.component.html',
    animations: [appModuleAnimation()]
})
export class CreateWorksapceComponent{
    workDataset: WorkspaceDto = WorkspaceDto.fromJS();
    complexForm: FormGroup;
    private height: number;
    constructor(private wService: WorkspaceService, workSpace: FormBuilder, private _session: TokenService, private _router: Router, private load: LoadingService) {
        debugger;
        if (this.wService.CreateWorkspace !== undefined) {
            if (this.wService.CreateWorkspace instanceof (WorkspaceDto)) {
                this.wService.workDataset.entityName = this.wService.workDataset.entityName;
                this.wService.workDataset.entityDescription = this.wService.workDataset.entityDescription;
              }
        }
        this.complexForm = workSpace.group({
            'name': [null, Validators.required],
            'description': [null, Validators.required]
        });
        this.workDataset = this.wService.workDataset;
       
    }
    ngOnInit() {
        this.height = window.innerHeight - 300;
    }
    @Output() onclick = new EventEmitter();
    change(i: boolean) {
        this.onclick.emit(i);
    }
    enableError() {
        this.complexForm.controls['name'].markAsTouched();
        this.complexForm.controls['description'].markAsTouched();
        if (this.complexForm.valid) {
            this.submitForm(this.complexForm.value);
        }
    }
   save() {
        debugger;
      this.load.start()
        debugger
        this.wService.CreateWorkspace(this.wService.workDataset.toJS()).subscribe(res => {
            this.load.stop()         
            if (res !== null && res !== undefined) {
                abp.notify.success("Workspace Created Successfully");
                this.wService.tempList.push(new SideBarMenuItem(res.entityName, null, res.entityName, res.entityKey, "/createworkspaces"));
                this.wService.workDataset.entityName = "";
                this.wService.workDataset.entityDescription = "";
            } else {
                abp.notify.error("Failed to create workspace");
            }
        })

    }
   updateForm() {
       debugger
     this.load.start()
       this.wService.editWorkspace(this.wService.editKey).subscribe(res => {
           var p = res;
           res.entityName = this.wService.workDataset.entityName;
           res.entityDescription = this.wService.workDataset.entityDescription;
           res.changeFlag = "True";
           this.wService.workDataset = res;
           this.wService.updateWorkspace(this.wService.workDataset.toJS()).subscribe(result => {
               debugger
               this.load.stop()
               if (res !== null && res !== undefined) {
                   this.wService.getWorkspacelist().subscribe(res => {
                       this.load.stop()
                       debugger
                       this.wService.workspacelist = [];
                       this.wService.tempList = [];
                       this.wService.workspacelist = res;
                       //this.wService.tempList = res;
                       this.wService.tempList.push(new SideBarMenuItem("Create WorkSpace", null, "createworkspaces", "/workspaces", "/createworkspaces/"));
                      for (let p of this.wService.workspacelist) {
                         this.wService.tempList.push(new SideBarMenuItem(p.entityName, null, p.entityName, p.entityKey, "/createworkspaces"))
                       }

                       this.wService.menu = new SideBarMenu("MainMenu", "MainMenu", [
                           new SideBarMenuItem("Studio", null, "../../../assets/global/img/Black chevron icon.svg", "", "", this.wService.tempList),
                           new SideBarMenuItem("Dashboard", null, "../../../assets/global/img/Black dashborad icon.svg", "", "/dashboard"),
                           new SideBarMenuItem("Dataset Channel", null, "../../../assets/global/img/Black data channel icon.svg", "", "/dataset"),
                           //new SideBarMenuItem("Analysis", null, "../../../assets/global/img/Dashboard icon white.svg","", "/analysis"),
                           new SideBarMenuItem("Models", null, "../../../assets/global/img/Black models icon.svg", "", "/model"),
                           new SideBarMenuItem("Use Cases", null, "../../../assets/global/img/Black models icon.svg", "", "/useCases"),
                           // new SideBarMenuItem("Workspace", null, "work", "/workspaces"),

                       ]);
                   });
                   this.wService.update = false;
                   this._router.navigate(['createworkspaces']);
                   this.wService.workDataset.entityName = "";
                   this.wService.workDataset.entityDescription = "";
                   abp.notify.success("Workspace Updated Successfully");
               } else {
                   abp.notify.error("Failed to update workspace");
               }

           })
          

       })
   }
    submitForm(value: any): WorkspaceDto {
        debugger;
        if (this.wService.workDataset !== undefined) {
            //this.workDataset.entityName = value.name;
            //this.workDataset.entityDescription = value.description;
            this.wService.workDataset.entityType = 'workspace';
            this.wService.workDataset.changeFlag = 'False';
            this.wService.workDataset.parentKey = 'c9863b68-9d8a-4105-8e4b-63e121d94cba';
            this.save();
        }

        return this.wService.workDataset;
    }
}