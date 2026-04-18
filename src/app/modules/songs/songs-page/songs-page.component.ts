import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModulesManagerService } from 'src/app/core/services/module-manager.service';
import { SONGS, TOPICS } from '../songs';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { marked } from 'marked';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { SongsService } from 'src/app/core/services/songs.service';


@Component({
    selector: 'app-songs-page',
    templateUrl: './songs-page.component.html',
    styleUrls: ['./songs-page.component.scss']
})
export class SongsPageComponent implements OnInit, OnDestroy {
    songsForm!: FormGroup;

    topics = ['Всі тематики', ...TOPICS];
    selectedSong$ = new Observable();
    songList$ = new Observable();
    fontSize = 18;
    scrollPosition = 0;
    subscription!: Subscription;
    subscription2!: Subscription;

    @ViewChild('songText', {static: false}) songText!: ElementRef;

    constructor(
        private modulesManager: ModulesManagerService,
        private songsService: SongsService
    ) {
        this.songList$ = this.songsService.songList$;
        this.selectedSong$ = this.songsService.selectedSong$;
     }

    ngOnInit(): void {
        this.modulesManager.setActiveModule('songs');
        marked.setOptions({ breaks: true });

        this.songsForm = new FormGroup({
            search: new FormControl(''),
            topics: new FormControl('Всі тематики'),
        });

        this.subscription = this.songsForm.valueChanges
            .pipe(debounceTime(300))
            .subscribe((formValue) => {
                this.songsService.setFilters(formValue);
            });

        this.subscription2 = this.songsService.favoriteSongsAreShown$
            .pipe(distinctUntilChanged())
            .subscribe((value) => {
                this.songsForm.reset({
                    search: '',
                    topics: 'Всі тематики',
                });
            });
    }

    onSubmitForm() { }

    selectSong(song: any) {
        this.scrollPosition = window.pageYOffset;
        const data = { ...song, html: marked(song.text) }
        this.songsService.setSelectedSong(data);
        window.scrollTo(0, 0);
    }

    clearSelectedSong() {
        this.songsService.setSelectedSong(null);
        setTimeout(() => window.scrollTo(0, this.scrollPosition), 0);
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

    favorite(title: string) {
        this.songsService.setFavoriteStatusForSong(title);
    }

    private getFontSize(): number {
        const element = this.songText.nativeElement;
        const computedStyle = window.getComputedStyle(element);
        const fontSize = computedStyle.getPropertyValue('font-size');
        return parseFloat(fontSize);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.subscription2.unsubscribe();
    }
}
