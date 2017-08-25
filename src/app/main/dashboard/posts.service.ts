import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PostService {
    constructor(private http: Http) {
        console.log('post service initialize....');
    }
    getPosts() {
        return this.http.get('https://restcountries.eu/rest/v1/currency/eur')
            .map(res => res.json());
    }
    // private getHeaders() {
    //     let headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //     headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
    //     return headers;
    // }

}
// export class DashBoard{
//     status_code:number;
//     string_message:string;
//     dataset_list:string;
//     constructor(status_code:number,string_message:string,dataset_list:string){
//             this.status_code=status_code;
//             this.string_message=string_message;
//             this.dataset_list=dataset_list;
//     }
// }
