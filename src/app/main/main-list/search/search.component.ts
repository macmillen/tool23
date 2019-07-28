import { Component, OnInit, ViewChild } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { ModalController, IonSearchbar, NavParams } from '@ionic/angular';
import { ItemService } from 'src/app/services/item.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})

export class SearchComponent implements OnInit {

  filteredTags: string[] = [];
  tags: string[];
  searchString = '';

  @ViewChild(IonSearchbar)
  private searchbar: IonSearchbar;

  constructor(
    public modalController: ModalController,
    private itemService: ItemService,
  ) { }

  ngOnInit() {
    this.getTags();
  }

  ionViewDidEnter() {
    this.searchbar.setFocus();
  }

  search(tag: string) {
    if (tag) {
      this.searchString = tag;
    }
    this.modalController.dismiss({ searchString: this.searchString });
  }

  getTags() {
    this.itemService.getTags().subscribe({
      next: tags => this.tags = tags
    });
  }

  filterTags(str: string) {
    this.searchString = str;
    return this.tags.filter(
      (v) => v.toLowerCase().includes(str.toLowerCase())
    );
  }

  setTags(ev: any) {
    const searchString = ev.target.value;
    this.filteredTags = this.filterTags(searchString);
  }

  clearSearchbar() {
    this.searchbar.value = '';
    this.filteredTags = [];
  }

}
