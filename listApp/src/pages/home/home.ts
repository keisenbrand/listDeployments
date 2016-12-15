import { Component } from '@angular/core';

import { NavParams, NavController } from 'ionic-angular';

import { UshahidiApi } from '../../providers/ushahidi-api';

import { DatabaseService } from '../../providers/database-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [UshahidiApi]
})

export class HomePage {

	deployment: any;
	token: string = null;
	site: any;

  constructor(
		public api: UshahidiApi,
		public navParams: NavParams,
		public navCtrl: NavController,
		public database:DatabaseService,) {	}

	ionViewWillEnter() {
		console.log("Deployment Add ionViewWillEnter");
	    this.platform.ready().then(() => {
	      StatusBar.styleLightContent();
	      StatusBar.backgroundColorByHexString('#3f4751');
	    });
	}

    searchDeployments(event) {
    console.log(`Deployment Add searchDeployments ${event.target.value}`);
    let search = event.target.value;
    if (search && search.length > 0) {
      this.loading = true;
      this.api.searchDeployments(search).then(results => {
        this.deployments = <any[]>results;
        this.loading = false;
      });
    }
    else {
      this.deployments = [];
    }
  }

}
