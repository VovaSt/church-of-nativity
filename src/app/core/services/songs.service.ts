import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SONGS } from 'src/app/modules/songs/songs';

@Injectable({
  providedIn: 'root'
})
export class SongsService {

    private _favoriteSongsAreShown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public favoriteSongsAreShown$: Observable<boolean> = this._favoriteSongsAreShown$.asObservable();

    private filters$ = new BehaviorSubject<{search: string, topics: string}>({search: '', topics: 'Всі тематики'});
    private favoriteSongs$ = new BehaviorSubject<string[]>([]);
    public songList$ = new Observable();

    private _selectedSong$ = new BehaviorSubject<any>(null);
    public selectedSong$ = this._selectedSong$.asObservable();

    constructor() {
        this.favoriteSongs$.next(this.getFavoriteSongs());

        this.songList$ = combineLatest([
            this.filters$,
            this.favoriteSongs$,
            this.favoriteSongsAreShown$
        ])
            .pipe(map(([filters, favoriteSongs, favoriteSongsAreShown]) => {
                let list = SONGS;
                return list
                    .map(song => {
                        return {...song, isFavorite: favoriteSongs.includes(song.title)}
                    })
                    .filter((song) => {
                        let searchCondition = true;
                        let topicsCondition = true;
                        let favoriteCondition = true;

                        if (filters.search) {
                            const key = filters.search.toLowerCase();
                            searchCondition = song.index.toString().includes(key) ||
                            song.oldTitle.replace(/[\.,?!-:;]/g, "").toLowerCase().includes(key) ||
                            song.text.replace(/[\.,?!-:;]/g, "").toLowerCase().includes(key);
                        }

                        if (filters.topics !== 'Всі тематики') {
                            topicsCondition = song.topic === filters.topics;
                        }

                        if (favoriteSongsAreShown) {
                            favoriteCondition = song.isFavorite;
                        }

                        return searchCondition && topicsCondition && favoriteCondition
                    });
            }))
    }

    public showFavoriteSongs(value: boolean): void {
        this._favoriteSongsAreShown$.next(value);
    }

    public setFilters(filters: {search: string, topics: string}) {
        this.filters$.next(filters);
    }

    public setFavoriteStatusForSong(title: string) {
        const isFavoriteSong = this.favoriteSongs$.value.includes(title);
        if (isFavoriteSong) {
            this.favoriteSongs$.next(
                [...this.favoriteSongs$.value].filter(song => song !== title)
            );
        } else {
            this.favoriteSongs$.next([...this.favoriteSongs$.value, title]);
        }

        this._selectedSong$.next({...this._selectedSong$.value, isFavorite: !isFavoriteSong});
        localStorage.setItem('favoriteSongs', JSON.stringify(this.favoriteSongs$.value));
    }

    public setSelectedSong(song: any) {
        this._selectedSong$.next(song);
    }

    public setSelectedSongById(id: number) {
        if (id) {
            const song = SONGS.find(s => s.index === id);
            if (song) {
                this._selectedSong$.next({
                    ...song,
                    isFavorite: this.favoriteSongs$.getValue().includes(song.title)
                });
            }
        }
    }

    private getFavoriteSongs(): string[] {
        const favoriteSongs = localStorage.getItem("favoriteSongs");
        if (favoriteSongs) {
            return JSON.parse(favoriteSongs);
        }
        return [];
    }
}
