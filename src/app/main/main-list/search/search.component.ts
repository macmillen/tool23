import { Component, OnInit, ViewChild } from '@angular/core';
import { Item } from 'src/app/models/item.model';
import { ModalController, IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})

export class SearchComponent implements OnInit {

  itemList;
  items: Item[] = [];
  filteredItems: Item[] = [];
  

  @ViewChild(IonSearchbar)
  private searchbar: IonSearchbar;  

  constructor(private modalController: ModalController) {
    this.items = this.itemList;
    this.filteredItems = this.items;
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.filteredItems = this.items;
  }

  ionViewDidEnter() { 
    this.searchbar.setFocus();    
  }

  clearSearchbar() {
    this.searchbar.value = '';
    this.filteredItems = this.items;
  }

  doSearch() {      
    this.filteredItems = this.items.filter(r => {
      return (
        r.title.search(this.searchbar.value) > -1 || 
        r.tags.indexOf(this.searchbar.value) > -1 );
    });
  }

}
