export class SideBarMenuItem {
    name: string = '';
    permissionName: string = '';
    icon: string = '';
    route: string = '';
    icon1: string = '';
    items: SideBarMenuItem[];
    key: string = '';
    constructor(name: string, permissionName: string, icon: string, icon1: string, route: string, items?: SideBarMenuItem[], key?: string) {
        this.name = name;
        this.permissionName = permissionName;
        this.icon = icon;
        this.route = route;
        this.icon1 = name;
        this.key = icon1;
        if (items === undefined) {
            this.items = [];    
        } else {
            this.items = items;
        }        


      
    }

      toggleimgicon(){
     
        }
}