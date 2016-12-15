import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SecureStorage } from 'ionic-native';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { DatabaseService } from './database-service';

@Injectable()
export class UshahidiApi {

clientId: any = String;
  clientSecret: any = String;
  accessToken: any = String;
  refreshToken: any = String;

  constructor(
    public platform:Platform,
    public http: Http,
    public database: DatabaseService) {
    console.log('API Service Provider');
    this.clientId = "ushahidiui";
    this.clientSecret = "35e7f0bca957836d05ca0492211b0ac707671261";
    this.accessToken = null;
    this.refreshToken = null;
    platform.ready().then(() => {
      // let secureStorage: SecureStorage = new SecureStorage();
      // secureStorage.create('ushahidi').then(
      //    () => console.log('SecureStorage Created'),
      //    err => console.error(`SecureStorage Failed ${err}`)
      // );
    });
  }

  getHeaders(accessToken:string=null) {
    let headers = new Headers();
    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    if (accessToken != null) {
      headers.set("Authorization", `Bearer ${accessToken}`)
    }
    return headers;
  }

  searchDeployments(search:string, cache:boolean=true) {
    return new Promise(resolve => {
      let params = new URLSearchParams();
      if (search != null) {
        params.set("q", search);
      }
      let url = "https://api.ushahidi.io/deployments";
      let headers = this.getHeaders();
      let options = new RequestOptions({ headers: headers, search: params });
      console.log(`Downloading ${url} ${params.toString()}`);
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
          (json) => {
            console.log(`Downloaded ${url} ${JSON.stringify(json)}`);
            let deployments = json;
            resolve(deployments);
          },
          (err) => {
            console.error(`Failed ${url} ${JSON.stringify(err)}`);
            resolve(null);
          });
    });
  }

  getConfigSite(host:string, token:string) {
    return new Promise(resolve => {
      let api = "/api/v3/config/";
      let params = new URLSearchParams();
      let url = host + api;
      let headers = this.getHeaders(token);
      let options = new RequestOptions({ headers: headers, search: params });
      console.log(`API Downloading ${url} ${params.toString()}`);
      this.http.get(url, options)
        .map(res => res.json())
        .subscribe(
          (json) => {
            console.log(`API Downloaded ${url} ${JSON.stringify(json)}`);
            let results = json.results;
            for (let i = 0; i < results.length; i++) {
              let item = results[i];
              if (item.id == 'site') {
                console.log(`API Downloaded Site ${item}`);
                resolve(item);
              }
            }
          },
          (err) => {
            console.error(`API Failed ${url} ${JSON.stringify(err)}`);
            resolve(null);
          }
        );
    });
  }

}
