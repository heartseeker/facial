import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the Pop page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-pop',
  templateUrl: 'pop.html'
})
export class PopPage {

	faceToken: any;
  fullName: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {

    this.faceToken = navParams.get('face_token');
  	this.fullName = navParams.get('name');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
