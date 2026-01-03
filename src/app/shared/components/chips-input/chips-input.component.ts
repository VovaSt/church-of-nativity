import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
    addItemToChipsHandler,
    filterItemsForChips,
    removeItemFromChipsHandler,
    selectedItemInChipsHandler
} from './utils';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
    selector: 'app-chips-input',
    templateUrl: './chips-input.component.html',
    styleUrls: ['./chips-input.component.scss']
})
export class ChipsInputComponent implements OnInit {
    inputCtrl = new FormControl();
    filteredList$: Observable<string[]>;
    separatorKeysCodes: number[] = [ENTER, COMMA];

    @Input() title: string;
    @Input() placeholder: string;
    @Input() form: FormGroup;
    @Input() list: string[];
    @Input() propertyName: string;

    @ViewChild('chipsInput') input: ElementRef<HTMLInputElement>;

    constructor() {}

    ngOnInit(): void {
        this.filteredList$ = this.inputCtrl.valueChanges.pipe(
            startWith(''),
            map(item => filterItemsForChips(item, this.list, this.form, this.propertyName))
        );
    }

    addItemToChips(event: MatChipInputEvent): void {
        addItemToChipsHandler(event, this.form, this.inputCtrl, this.propertyName);
    }

    selectedItemInChips(event: MatAutocompleteSelectedEvent): void {
        selectedItemInChipsHandler(event, this.form, this.input, this.inputCtrl, this.propertyName);
    }

    removeItemFromChips(preacher: string): void {
        removeItemFromChipsHandler(preacher, this.form, this.inputCtrl, this.propertyName);
    }
}
