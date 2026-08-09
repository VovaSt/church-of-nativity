import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModulesManagerService } from 'src/app/core/services/module-manager.service';
import { TOPICS } from '../songs';
import { Observable, Subscription } from 'rxjs';
import { marked } from 'marked';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SongsService } from 'src/app/core/services/songs.service';
import { ActivatedRoute, Router } from '@angular/router';


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
    fontSize = 22;
    scrollPosition = 0;
    align = false;
    subscription!: Subscription;
    subscription2!: Subscription;

    @ViewChild('songText', {static: false}) songText!: ElementRef;

    constructor(
        private modulesManager: ModulesManagerService,
        private songsService: SongsService,
        private router: Router,
        private route: ActivatedRoute
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

        if (this.route.snapshot.queryParams['id']) {
            this.songsService.setSelectedSongById(+this.route.snapshot.queryParams['id']);
        }

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
        this.songsService.setSelectedSong(song);
        window.scrollTo(0, 0);
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { id: song.index },
            queryParamsHandling: 'merge'
        });
    }

    clearSelectedSong() {
        this.songsService.setSelectedSong(null);
        setTimeout(() => window.scrollTo(0, this.scrollPosition), 0);
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { id: undefined },
            queryParamsHandling: 'merge'
        });
    }

    increaseFontSize() {
        this.fontSize++;
    }

    decreaseFontSize() {
        this.fontSize--;
    }

    favorite(title: string) {
        this.songsService.setFavoriteStatusForSong(title);
    }

    alignText(shouldAlign: boolean) {
        this.align = shouldAlign;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.subscription2.unsubscribe();
    }
}
