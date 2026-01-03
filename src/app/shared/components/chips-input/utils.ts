import { ElementRef } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";

export const filterItemsForChips = (
    value: string,
    list: string[],
    form: FormGroup,
    property: string
) => {
    const filteredList = [...list].filter(preacher => {
        return !form.get(property).value.includes(preacher);
    });
    if (!value) return filteredList.slice();
    const filterValue = value.toLowerCase();
    return filteredList.filter(p => p.toLowerCase().includes(filterValue));
}

export const addItemToChipsHandler = (
    event: MatChipInputEvent,
    form: FormGroup,
    inputCtrl: FormControl,
    property: string
) => {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
        const control = form.get(property);
        const oldValue = [...control.value];
        control.setValue([...oldValue, value]);
    }

    if (input) {
      input.value = '';
    }

    inputCtrl.setValue(null);
}

export const selectedItemInChipsHandler = (
    event: MatAutocompleteSelectedEvent,
    form: FormGroup,
    input: ElementRef<HTMLInputElement>,
    inputCtrl: FormControl,
    property: string
) => {
    const oldValue = [...form.get(property).value];
    form.get(property).setValue([...oldValue, event.option.viewValue]);
    input.nativeElement.value = '';
    inputCtrl.setValue(null);
}

export const removeItemFromChipsHandler = (
    preacher: string,
    form: FormGroup,
    inputCtrl: FormControl,
    property: string
) => {
    const oldValue = [...form.get(property).value];
    const index = oldValue.indexOf(preacher);
    if (index >= 0) {
        oldValue.splice(index, 1);
    }
    form.get(property).setValue([...oldValue]);
    inputCtrl.setValue(inputCtrl.value);
}
