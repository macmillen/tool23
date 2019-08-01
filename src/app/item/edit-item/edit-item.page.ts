import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ToastController, AlertController, IonInput } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoadingController, Platform, ActionSheetController } from '@ionic/angular';
import { ItemService } from 'src/app/services/item.service';
import { UserService } from 'src/app/services/user.service';
import { Item } from 'src/app/models/item.model';
import { User } from 'src/app/models/user.model';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Address } from 'src/app/models/address.model';



@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.page.html',
  styleUrls: ['./edit-item.page.scss'],
})

/**
 * Page for editing specific items
 */
export class EditItemPage implements OnInit {

  validationsForm: FormGroup;

  user: User;  // User if Item
  pageTitle: string;  // Title of Page
  item: Item = null;  // Item to edit
  statusBool = true;  // Status of item
  imageBase64: any = '../../../assets/placeholder_item.png';  // Image of item
  downloadURL = ''; 
  isEditMode = false; // Switch for edit or create mode
  imageUploaded = false;  // Check value for finished image upload
  itemID: string; // ID of item to change
  percent = -1; // Percentage of upload status

  @ViewChild('itemTitle')
  private itemTitleRef: IonInput;

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA,
    correctOrientation: true,
    targetHeight: 500,
    targetWidth: 500
  };

  validationsMessages = {
    title: [
      { type: 'required', message: 'Titel ist benötig.' },
      { type: 'minlength', message: 'Titel muss mindesten 5 Zeichen lang sein.' },
      { type: 'maxlength', message: 'Titel darf nicht länger als 25 Zeichen sein.' }
    ],
    description: [
      { type: 'required', message: 'Beschreibung ist benötigt' }
    ],
    street: [
      { type: 'required', message: 'Straße ist benötigt' }
    ],
    houseNumber: [
      { type: 'required', message: 'Hausnummer ist benötigt' }
    ],
    zip: [
      { type: 'required', message: 'Straße ist benötigt' },
      { type: 'pattern', message: '5 Zahlen' }
    ],
    city: [
      { type: 'required', message: 'Straße ist benötigt' }
    ],
    tags: [
      { type: 'maxlength', message: 'Tag darf nicht länger als 10 Zeichen sein.'},
      { type: 'minlength', message: 'Tag muss mindesten 3 Zeichen lang sein.' }

    ]
  };

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private fireStorage: AngularFireStorage,
    private itemService: ItemService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private userService: UserService,
    private camera: Camera,
    private alertController: AlertController,
    public formBuilder: FormBuilder,
    public actionSheetController: ActionSheetController,
    public plt: Platform) {
  }

  /**
   * Set initial values for page, determines if edit or create item
   * 
   */
  ngOnInit() {
    this.itemID = this.route.snapshot.paramMap.get('itemID');
    if (this.itemID) {
      this.isEditMode = true;
      this.loadItem(this.itemID);
      this.loadUser();
      this.pageTitle = 'Item bearbeiten';
    } else {
      this.isEditMode = false;
      this.pageTitle = 'Item erstellen';
      this.loadUser();
    }

    // Validation

    this.validationsForm = this.formBuilder.group({
      title: new FormControl('', Validators.compose([
        Validators.maxLength(25),
        Validators.minLength(5),
        Validators.required
      ])),
      description: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      houseNumber: new FormControl('', Validators.required),
      zip: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]{5}')
      ])),
      city: new FormControl('', Validators.required),
      tags: new FormControl('', Validators.compose([
        Validators.maxLength(10),
        Validators.minLength(3)
      ]))
    });
  }

  /**
   * If Create-Mode, set focus to Title
   */
  ionViewDidEnter() {
    if (!this.isEditMode) {
      this.itemTitleRef.setFocus();
    }
  }

  /**
   * Presents alert to confirm deletion of item
   * @param item Item Object to delete
   */
  async presentAlertConfirm(item: Item) {
    const alert = await this.alertController.create({
      header: 'Bestätigen',
      message: '<strong>Item wirklich löschen?</strong>',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.deleteItem();
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * opens options sheet to select which source to take image from
   */
  async presentCameraActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Foto',
      buttons: [{
        text: 'Kamera',
        icon: 'camera',
        handler: () => {
          this.options.sourceType = this.camera.PictureSourceType.CAMERA;
          this.takeImage();
        }
      }, {
        text: 'Bibliothek',
        icon: 'image',
        handler: () => {
          this.options.sourceType = this.camera.PictureSourceType.SAVEDPHOTOALBUM;
          this.takeImage();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  /**
   * Takes image with selected method and saves it
   */
  takeImage() {
    this.camera.getPicture(this.options).then((imageData) => {
      // If it's base64 (DATA_URL):
      this.imageBase64 = 'data:image/jpeg;base64,' + imageData;
      this.imageUploaded = true;
    }, (err) => {
      // Handle error
    });
  }

  /**
   * Presents loading message
   */
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Lädt...',
    });
    await loading.present();
  }

  /**
   * loads item from server by ID
   * @param itemID ID of item to load
   */
  loadItem(itemID: string) {
    this.itemService.getItem(itemID).subscribe({
      next: item => {
        this.item = item;
        this.setEditItem(item);
        this.getItemImageURL();
        this.statusBool = this.item.status === 'active' ? true : false;
      }
    });
  }

  /**
   * get current user from server
   */
  loadUser() {
    this.userService.getUser('0').subscribe({
      next: user => {
        this.user = user;
        if (!this.isEditMode) {
          this.item = {
            userID: '0', description: '', status: 'active', tags: [],
            title: '', address: null
          };
          this.setAdress(this.user.address);
        }
      }
    });
  }
/**
 * set values in html form to values from item
 * @param item Item Object to fetch values from
 */
  setEditItem(item: Item) {
    console.log(item);
    this.validationsForm.get('title').setValue(item.title);
    this.validationsForm.get('description').setValue(item.description);
    this.validationsForm.get('street').setValue(item.address.street);
    this.validationsForm.get('houseNumber').setValue(item.address.houseNumber);
    this.validationsForm.get('city').setValue(item.address.city);
    this.validationsForm.get('zip').setValue(item.address.zip);
  }
/**
 * set address values in html form to values from address values
 * @param userAdress Address Object to fetch values from
 */
  setAdress(userAdress: Address) {
    this.validationsForm.get('street').setValue(userAdress.street);
    this.validationsForm.get('houseNumber').setValue(userAdress.houseNumber);
    this.validationsForm.get('city').setValue(userAdress.city);
    this.validationsForm.get('zip').setValue(userAdress.zip);
  }

  /**
   * Fetch Item-URL from Server 
   */
  getItemImageURL() {
    const ref = this.fireStorage.ref(`item-images/${this.item._id}.jpg`);
    ref.getDownloadURL().subscribe({
      next: url => { this.imageBase64 = url; }
    });
  }

  /**
   * Reads tags from html form field and saves it in class variable for tags
   */
  addTag() {
    const value = this.validationsForm.get('tags').value as string;
    if (value.length < 3 || !this.item) { return; }
    const tags = new Set<string>(this.item.tags);
    tags.add(this.validationsForm.get('tags').value);
    this.item.tags = Array.from(tags);
    this.validationsForm.get('tags').setValue('');
  }
/**
 * Sends update of item to server, with changed values
 */
  updateItem() {
    this.item.status = this.statusBool ? 'active' : 'disabled';
    let uploadedImage = !this.imageUploaded;
    let uploadedItem = false;

    // Uploading Image
    if (this.imageUploaded) {
      const ref = this.fireStorage.ref(`/item-images/${this.item._id}.jpg`);
      const uploadTask = ref.putString(this.imageBase64, 'data_url', { contentType: 'image/jpg' });

      // Presenting the Loading Screen
      this.presentLoading();
      uploadTask.percentageChanges().subscribe(percent => {
        this.percent = percent;
      });
      uploadTask.snapshotChanges().pipe(
        finalize(() => ref.getDownloadURL().subscribe(itemImage => {
          this.loadingController.dismiss();
          uploadedImage = true;
          this.goToAccountView(uploadedImage, uploadedItem);
        }))
      ).subscribe();
    }

    this.itemService.updateItem(this.item).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: `Der Gegenstand '${this.item.title}' wurde aktualisiert!`,
          duration: 2000,
          position: 'top'
        });
        toast.present();
        uploadedItem = true;
        this.goToAccountView(uploadedImage, uploadedItem);
      },
      error: async () => {
        const toast = await this.toastController.create({
          message: `Der Gegenstand '${this.item.title}' konnte nicht aktualisiert werden!`,
          duration: 2000
        });
        toast.present();
        uploadedItem = false;
        this.goToAccountView(uploadedImage, uploadedItem);
      }
    });
  }
/**
 * If finisched (all true), navigate back to account view
 * @param uploadedImage Image to upload
 * @param uploadedItem Item, which the image is for
 */
  goToAccountView(uploadedImage: boolean, uploadedItem: boolean) {
    if (uploadedImage && uploadedItem) {
      this.navController.navigateRoot('/tabs/account-view');
    }
  }

  /**
   * creates Item and pushes it to server
   */
  createItem() {
    this.item.status = this.statusBool ? 'active' : 'disabled';
    this.itemService.createItem(this.item).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: `Der Gegenstand '${this.item.title}' wurde erstellt!`,
          duration: 2000,
          position: 'top'
        });
        toast.present();

        this.navController.navigateRoot('/tabs/account-view');
      }
    });
  }

  /**
   * Deletes current Item and sends delete request to server
   */
  deleteItem() {
    this.itemService.deleteItem(this.item._id).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: `Der Gegenstand' ${this.item.title} ' wurde gelöscht`,
          duration: 2000,
          position: 'top'
        });
        toast.present();

        this.navController.navigateRoot('/tabs/account-view');
      }
    });
  }

  /**
   * Opens camera action sheet
   */
  openCamera() {
    this.presentCameraActionSheet();
  }

  /**
   * Updates its variables from values input and updates or creates item
   * @param values the fields to input from
   */
  onSubmit(values) {
    console.log(values);
    this.item.title = values.title;
    this.item.description = values.description;
    this.item.address = {street: values.street, houseNumber: values.houseNumber, zip: values.zip, city: values.city};
    if (this.isEditMode) {
      this.updateItem();
    } else {
      this.createItem();
    }
  }

}
