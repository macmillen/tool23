import { Component, OnInit } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { ItemService } from 'src/app/services/item.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.page.html',
  styleUrls: ['./create-item.page.scss'],
})
export class CreateItemPage implements OnInit {

  item: Item = {userID: '0', description: '', status: 'active', tags: [],
                title: '', address: { city: '', houseNumber: '', street: '', zip: '' } };
  tagInput = '';
  statusBool = true;

  constructor(
    private itemService: ItemService,
    private toastController: ToastController,
    private navController: NavController
  ) { }

  ngOnInit() {
  }

  addTag() {
    const tags = new Set<string>(this.item.tags);
    tags.add(this.tagInput);
    this.item.tags = Array.from(tags);
    this.tagInput = '';
  }

  createItem() {
    this.item.status = this.statusBool ? 'active' : 'disabled';
    this.itemService.createItem(this.item).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: `Der Gegenstand '${this.item.title}' wurde erstellt!`,
          duration: 2000
        });
        toast.present();

        this.navController.navigateRoot('/account-view');
      }
    });
  }

}
