import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModulesManagerService } from 'src/app/core/services/module-manager.service';
import { SONGS, TOPICS } from '../songs';
import { BehaviorSubject, Subscription } from 'rxjs';
import { marked } from 'marked';
import { debounceTime } from 'rxjs/operators';


@Component({
    selector: 'app-songs-page',
    templateUrl: './songs-page.component.html',
    styleUrls: ['./songs-page.component.scss']
})
export class SongsPageComponent implements OnInit, OnDestroy {
    constructor(private modulesManager: ModulesManagerService) { }

    songsForm: FormGroup;

    topics = ['Всі тематики', ...TOPICS];
    filteredSongs$ = new BehaviorSubject(SONGS);
    selectedSong$ = new BehaviorSubject(null);
    fontSize = 18;
    subscription: Subscription;

    @ViewChild('songText', {static: false}) songText: ElementRef;

    ngOnInit(): void {
        this.modulesManager.setActiveModule('');
        marked.setOptions({ breaks: true });

        this.songsForm = new FormGroup({
            search: new FormControl(''),
            isDeepSearch: new FormControl(false),
            topics: new FormControl('Всі тематики'),
        });

        this.subscription = this.songsForm.valueChanges
            .pipe(debounceTime(300))
            .subscribe((formValue) => {
                let list = SONGS;
                if (formValue.search) {
                    list = list.filter((song) => {
                        const key = formValue.search.toLowerCase();
                        return song.index.toString().includes(key) ||
                        song.title.toLowerCase().includes(key) ||
                        (formValue.isDeepSearch && song.text.toLowerCase().includes(key));
                    });
                }

                if (formValue.topics !== 'Всі тематики') {
                    list = list.filter((song) => song.topic === formValue.topics);
                }

                this.filteredSongs$.next(list);
            });
    }

    onSubmitForm() { }

    selectSong(song) {
        const data = { ...song, html: marked(song.text) }
        this.selectedSong$.next(data);
    }

    clearSelectedSong() {
        this.selectedSong$.next(null);
    }

    increaseFontSize() {
        const currFontSize = this.getFontSize();
        if (currFontSize < 52) {
            this.songText.nativeElement.style.fontSize = `${currFontSize + 1}px`;
        }
    }

    decreaseFontSize() {
        const currFontSize = this.getFontSize();
        if (currFontSize > 12) {
            this.songText.nativeElement.style.fontSize = `${currFontSize - 1}px`;
        }
    }

    private getFontSize(): number {
        const element = this.songText.nativeElement;
        const computedStyle = window.getComputedStyle(element);
        const fontSize = computedStyle.getPropertyValue('font-size');
        return parseFloat(fontSize);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
