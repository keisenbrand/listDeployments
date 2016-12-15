import { Component } from '@angular/core';
import { Platform, NavParams, NavController, LoadingController, ToastController, AlertController, ViewController } from 'ionic-angular';
import { UshahidiApi } from '../../providers/ushahidi-api';
import { DatabaseService } from '../../providers/database-service';
import { StatusBar } from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [UshahidiApi]
})

export class HomePage {

  deployments: any = [];
  loading: boolean = false;

  constructor(
    public platform:Platform,
		public api: UshahidiApi,
		public navParams: NavParams,
		public navCtrl: NavController,
		public database:DatabaseService,
    public alertController: AlertController,
    public viewController: ViewController,
    public loadingController:LoadingController,
    public toastController: ToastController) {	}

	ionViewWillEnter() {
		console.log("Deployment Add ionViewWillEnter");
	    this.platform.ready().then(() => {
	      StatusBar.styleLightContent();
	      StatusBar.backgroundColorByHexString('#3f4751');
	    });
	}

  doCancel(event) {
    console.log("Deployment Add doCancel");
    this.viewController.dismiss();
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

  addDeployment(event, deployment) {
    console.log(`Deployment Add addDeployment`);
    let loading = this.loadingController.create({
      content: "Adding..."
    });
    loading.present();
    this.database.addDeployment(deployment).then(
      (results) => {
        console.log(`Deployment Add addDeployment ID ${results}`);
        loading.dismiss();
        if (results) {
          deployment['id'] = results;
          let data = { 'deployment' : deployment };
          this.viewController.dismiss(data);
        }
        else {
          let alert = this.alertController.create({
            title: 'Problem Adding Deployment',
            subTitle: 'There was a problem adding your deployment.',
            buttons: ['OK']
          });
          alert.present();
        }
      },
      (error) => {
        console.error(`Deployment Add addDeployment ${error}`);
        loading.dismiss();
        let alert = this.alertController.create({
          title: 'Problem Adding Deployment',
          subTitle: error,
          buttons: ['OK']
        });
        alert.present();
      });
  }

}
