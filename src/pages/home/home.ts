import { Component } from '@angular/core';
import { NavController, ActionSheetController, ToastController, Platform, LoadingController, Loading, ModalController, AlertController } from 'ionic-angular';
import { Camera, File, Transfer, FilePath } from 'ionic-native';
import { PopPage } from '../pop/pop';
 
declare var cordova: any;
 
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  lastImage: string = null;
  loading: Loading;
  noMatch = true;
 
  constructor(public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, public modalCtrl: ModalController, public alertCtrl: AlertController) {}
 
	public presentActionSheet() {
		let actionSheet = this.actionSheetCtrl.create({
	  		title: 'Select Image Source',
	  		buttons: [
	    	{
	      		text: 'Load from Library',
	      		handler: () => {
	        		this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
	      		}
		    },
		    {
	      		text: 'Use Camera',
	      		handler: () => {
		        this.takePicture(Camera.PictureSourceType.CAMERA);
	      	}
		    },
		    {
	      		text: 'Cancel',
	      		role: 'cancel'
		    }
		  ]
		});
		actionSheet.present();
	}


	public takePicture(sourceType) {
  		// Create options for the Camera Dialog
  		var options = {
	    	quality: 100,
	    	sourceType: sourceType,
	    	saveToPhotoAlbum: false,
	    	correctOrientation: true
	  	};
	 
  		// Get the data of an image
	  	Camera.getPicture(options).then((imagePath) => {
    		// Special handling for Android library
	    	if (this.platform.is('android') && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
	      		FilePath.resolveNativePath(imagePath)
	      		.then(filePath => {
	          		let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
	          		let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
	        		this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
	      		});
	    	} else {
	      		var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
	      		var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
	      		this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
	    	}
	  	}, (err) => {
    		this.presentToast('Error while selecting image.');
	  	});
	}

	// Create a new name for the image
	private createFileName() {
  		var d = new Date(),
  		n = d.getTime(),
  		newFileName =  n + ".jpg";
  		return newFileName;
	}
	 
	// Copy the image to a local folder
	private copyFileToLocalDir(namePath, currentName, newFileName) {
  		File.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
			this.lastImage = newFileName;
	  	}, error => {
			this.presentToast('Error while storing file.');
	  	});
	}
	 
	private presentToast(text) {
  		let toast = this.toastCtrl.create({
	    	message: text,
	    	duration: 3000,
	    	position: 'top'
	  	});
  		toast.present();
	}
	 
	// Always get the accurate path to your apps folder
	public pathForImage(img) {
  		if (img === null) {
	    	return '';
	  	} else {
	    	return cordova.file.dataDirectory + img;
	  	}
	}

	public presentModal(name, face_token) {
    	let modal = this.modalCtrl.create(PopPage, {name:name, face_token:face_token});
    	modal.present();
	}

	public showAlert() {
		let alert = this.alertCtrl.create({
	  		title: 'No Match Found!',
	  		subTitle: 'sorry this kid is not a member!',
	  		buttons: ['OK']
		});
		alert.present();
	}

	public uploadImage() {
  		// Destination URL
		var url = "https://api-us.faceplusplus.com/facepp/v3/search";

		// File for Upload
		var targetPath = this.pathForImage(this.lastImage);

		// File name only
		var filename = this.lastImage;

		var options = {
			fileKey: "image_file",
			fileName: filename,
			chunkedMode: false,
			mimeType: "multipart/form-data",
			params : {'fileName': filename, 'api_key' : 'L3zlAkOiZow4SC_bpdiK25cY57T1Shki', 'api_secret': 'x973IIFodvKTvqA05zvLfFuYRoci9bRo', 'faceset_token':'160b7c939a5b5dbe7e5bea4f94327a33'}
		};

		const fileTransfer = new Transfer();
	 
  		this.loading = this.loadingCtrl.create({
	    	content: 'Uploading...',
	  	});
	  	this.loading.present();
	 
  		// Use the FileTransfer to upload the image
	  	fileTransfer.upload(targetPath, url, options).then((data) => {
	    	this.loading.dismissAll()
	    	let obj = JSON.parse(data.response);

	    	// check if existing
	    	let donees = [
				{name:'ALDRED LINDIO',face_token:'b6a8f5ffe7b5acf1a426242ae4befb61'},
				{name:'ALEX ADRIAN NIEVES',face_token:'c4fd77a7aa991ab26f5c640ffba860a5'},
				{name:'ANDREW SEVILLA',face_token:'751924140d38481481b6b3d0fc42a715'},
				{name:'ANGELO LOCANA',face_token:'652df27a50b54ef26c0ec842d611c189'},
				{name:'AXIEL RHO LOPEZ',face_token:'119ec185da0c959b530283c916f31def'},
				{name:'ALIESA LACIA',face_token:'8c7a99e70a13cd4bc170fae24404fdbd'},
				{name:'ANALYN ASEJO',face_token:'31dcdb93b152f8442de28f9030857c0d'},
				{name:'CASSANDRA BALINES',face_token:'6952dc732136af966b339367a30c736b'},
				{name:'CHERRY BIEN',face_token:'d9a4bd048ace65dbf7c4a09b7b4024ce'},
				{name:'HANNAH MAE BONTO',face_token:'3279ded0bd940fa9cefb5c63e5e38853'},
			];


			let search = obj.results[0];

			let q = new Promise((resolve, reject) => {
				if(search.confidence >= 75) {
					resolve(true);
				} else {
					reject(true);
				}

			});

			q.then(() => {
				this.presentToast('Image succesful uploaded.');
				let value = donees.find(function (d) {
				    return d.face_token == search.face_token;
				}).name;

				this.presentModal(value, search.face_token);
				this.noMatch = true;
			},() => {
				this.noMatch = false;
				this.showAlert();
			});
			

	  	}, err => {
	    	this.loading.dismissAll()
	    	this.presentToast('Error while uploading file.');
	    	alert('Fail: ' + JSON.stringify(err));
	  	});
	}

}