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

    filteredTags: string[] = [];    // Array for filtered Tags, aka. they where searched for
    tags: string[];                 // Array for all strings to search in
    searchString = '';              // The search-string to search for
    loading = false;                // Is true, if tags are downloaded from the server; else false

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

    /**
     * Takes the search string and returns it to the main-view-page
     * 
     * @param {string} tag String/tag to search for
     * @returns void (closes the modal and returns to main-view-page)
     */
    search(tag: string) {
        if (tag) {
            this.searchString = tag;
        }
        this.modalController.dismiss({ searchString: this.searchString });
    }

    /**
     * Downloads the latest tags and fills the class variable array to give suggestions
     * 
     * @returns void (sets the class variable tags)
     */
    getTags() {
        this.loading = true;
        this.itemService.getTags().subscribe({
            next: tags => {
                this.loading = false;
                this.tags = tags;
                this.filteredTags = tags;
            }
        });
    }

    /**
     * Filters full list of tags
     * @param {string} str The Search String
     * @returns Array of filtered tags
     */
    filterTags(str: string): string[] {
        this.searchString = str;
        return this.tags.filter(
            (v) => v.toLowerCase().includes(str.toLowerCase())
        );
    }

    /**
     * Filter Tags and set searchString by value given from Key-Input-Event-String
     * 
     * @param {any} ev Event which is automaticly called by angular
     * @returns void (sets class variable filteredTags)
     */
    setTags(ev: any) {
        const searchString = ev.target.value;
        this.filteredTags = this.filterTags(searchString);
    }

    /**
     * CLears the searchbar and resets the filteredTag-Array with unfiltered one
     * 
     * @returns void
     */
    clearSearchbar() {
        this.searchbar.value = '';
        this.filteredTags = this.tags;
    }

}
