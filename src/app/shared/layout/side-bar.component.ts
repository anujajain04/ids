import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { SideBarMenu } from './side-bar-menu';
import { SideBarMenuItem } from './side-bar-menu-item';
import { DatasetListComponent } from '../../main/dataset/dataset-list.component';
import { WorkspaceService, WorkspaceDto } from '@shared/service-proxies/ids-workspace-service-proxies';
import { DatasetService, DeleteDatasetDto, DatasetListDto, DatasetType, DatasetDto, DatasetHistoryDto, PassService, LoadingService } from '@shared/service-proxies/ids-service-proxies';
import { DashboardService, DashboardDto, DeletedashboardDto, DashboardStudioConfig } from '@shared/service-proxies/ids-dashboard-service-proxies';
import { PermissionCheckerService } from '@abp/auth/permission-checker.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
    templateUrl: './side-bar.component.html',
    selector: 'side-bar'
})
export class SideBarComponent extends AppComponentBase {
    @ViewChild(DatasetListComponent) datasetList: DatasetListComponent;
    i: any;
    j: any;
    listName: any;
    deleteDash: WorkspaceDto[] = [];
    private height: number;
    constructor(injector: Injector, public permission: PermissionCheckerService, public workspace: WorkspaceService, private _router: Router, private dashboardService: DashboardService, private load: LoadingService) {
        super(injector);
        this.getList();
      
    }
    getList() {
        debugger
      this.load.start()
        this.workspace.getWorkspacelist().subscribe(res => {
            this.load.stop()
            debugger
            this.workspace.workspacelist = res;
            this.workspace.tempList.push(new SideBarMenuItem("Create WorkSpace", null, "createworkspaces", "/workspaces", "/createworkspaces/"));
            for (let p of this.workspace.workspacelist) {
                this.workspace.tempList.push(new SideBarMenuItem(p.entityName, null, p.entityName, p.entityKey, ""))
            }
            this.workspace.menu = new SideBarMenu("MainMenu", "MainMenu", [
                new SideBarMenuItem("Studio", null, "../../../assets/global/img/Black chevron icon.svg", "", "", this.workspace.tempList),
                new SideBarMenuItem("Dashboard", null, "../../../assets/global/img/Black dashborad icon.svg", "", "/dashboard"),
                new SideBarMenuItem("Dataset Channel", null, "../../../assets/global/img/Black data channel icon.svg", "", "/dataset"),
                //new SideBarMenuItem("Analysis", null, "../../../assets/global/img/Dashboard icon white.svg","", "/analysis"),
                new SideBarMenuItem("Models", null, "../../../assets/global/img/Black models icon.svg", "", "/model"),
                new SideBarMenuItem("Use Cases", null, "../../../assets/global/img/Black models icon.svg", "", "/useCases"),
                // new SideBarMenuItem("Workspace", null, "work", "/workspaces"),

            ]);
        });
    }
    lowermenu: SideBarMenu = new SideBarMenu("MainMenu", "MainMenu", [
        new SideBarMenuItem("Administrator", null, "../../../assets/global/img/Black Administration icon.svg", "", "/administrator"),
        new SideBarMenuItem("Getting Started", null, "../../../assets/global/img/Black getting started icon.svg", "", "/getting-started"),
        new SideBarMenuItem("Support", null, "../../../assets/global/img/Black support icon.svg", "", "/support")
    ]);
    checkChildMenuItemPermission(menuItem): boolean {
      
        for (var i = 0; i < menuItem.items.length; i++) {
            var subMenuItem = menuItem.items[i];

            if (subMenuItem.permissionName && this.permission.isGranted(subMenuItem.permissionName)) {
                return true;
            }

            if (subMenuItem.items && subMenuItem.items.length) {
                return this.checkChildMenuItemPermission(subMenuItem);
            } else if (!subMenuItem.permissionName) {
                return true;
            }
        }

        return false;
    }

    showMenuItem(menuItem): boolean {
        if (menuItem.permissionName) {
            return this.permission.isGranted(menuItem.permissionName);
        }

        if (menuItem.items && menuItem.items.length) {
            return this.checkChildMenuItemPermission(menuItem);
        }

        return true;
    }
    draw(value: any, e: any) {
        debugger
       var count= document.getElementsByClassName("listItem").length;
       for (var i = 0; i < count; i++) {
           document.getElementById('draw' + i).style.display = "none";
           document.getElementById('ListItems' + i).style.display = "none";
       }
       document.getElementById('draw' + value).style.display = "block";
       document.getElementById('ListItems' + value).style.display = "block";
        e.stopPropagation();
    }

    editWorkspace(d:any,k:any) {
        debugger
      this.load.start()
        this.workspace.editKey = k.key;
        this.workspace.editWorkspace(this.workspace.editKey).subscribe(res => {
            this.load.stop()
            this.workspace.update = true;
            this.workspace.workDataset.entityName = res.entityName;
            this.workspace.workDataset.entityDescription = res.entityDescription;
            this._router.navigate(['createworkspaces', res.entityKey]);
        
        })

    }

    deleteWorkspace(d: any,k:any) {
        debugger
      this.load.start()
        this.workspace.deleteWorkspace(k.key).subscribe(res => {
            this.load.stop()
            if (res.statusCode === 1) {
                abp.notify.success(res.statusMessage);
                this.workspace.tempList = [];
            this.getList();
            } else {
                abp.notify.error(res.statusMessage);
            }
        })
    }

    showWorkspace(key:any,name:any) {
        debugger
        WorkspaceService.WorkSpaceKey = key;
      this.load.start()
        this.workspace.changeWorkspace().subscribe(res => {
            this.load.stop()
            if (res.statusCode === 1) {
                abp.notify.success(res.statusMessage);
            } else {
                abp.notify.error(res.statusMessage);
            }
        })               
        if (name === 'Create WorkSpace') {
            this.workspace.update = false;
            this.workspace.workDataset.entityName = "";
            this.workspace.workDataset.entityDescription = "";
            this._router.navigate(['createworkspaces']);
        }
        else {
            this.listName = name;
            document.getElementById('Studio').innerText = name;
            //if (this._router.url === '/dataset') {
                this._router.navigate(['dashboard']);
                //this.datasetList.getDatasetList();
            }
        //}
    }
    selected(value: any) {
        var lists = document.getElementsByClassName("listCount").length
        for (var i = 0; i < lists; i++) {
            document.getElementById('listNum' + i).style.backgroundColor = "";
        }
        document.getElementById('listNum' + value).style.backgroundColor = "lightgray";
    }
    checkindex(value: any,e) {
        debugger
        this.j = -1;
        this.i = value;
        var dropdown = document.getElementById('List');
        if (e.target.innerText === "Studio" || e.target.innerText === this.listName) {
            if (dropdown.style.display === "" || dropdown.style.display === "none") {
                dropdown.style.display = "block";
                e.stopPropagation();
            }
            else {
                dropdown.style.display = "";
            }
        }
    }


    checkindex2(value: any) {
        debugger
        this.i = -1;
        this.j = value;
    }

    ngOnInit() {
        this.height = window.innerHeight - 447;
        try {
            $(function () {
                $('#nav li').not("#nav li ul li").click(function (e) {
                    $(this).children('ul').stop().toggle();
                    // $('li', $(this).siblings()).slideUp();
                    $(this).find('ul').slideUp();
                    e.stopPropagation();
                });
                $("#nav li ul li").click(function (e) {
                    $(this).children('ul').stop().toggle();
                    e.stopPropagation();
                });
                $('#nav li').not("ul li ul li").click(function (e) {
                    e.stopPropagation();
                    $("#nav li ul").hide();
                    $(this).children('ul').stop().toggle();
                });
            });
            $(document).click(function () {
                $("#nav li ul").hide();
            });
        } catch (e) {
            console.error(e.message);
        }
    }
}