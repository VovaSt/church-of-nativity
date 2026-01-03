import { Component, OnInit, ɵ_sanitizeHtml } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModulesManagerService } from 'src/app/core/services/module-manager.service';
import { SONGS } from '../songs';
import { BehaviorSubject } from 'rxjs';
import { marked } from 'marked';


@Component({
  selector: 'app-songs-page',
  templateUrl: './songs-page.component.html',
  styleUrls: ['./songs-page.component.scss']
})
export class SongsPageComponent implements OnInit {
    constructor(private modulesManager: ModulesManagerService) {}

    songsForm: FormGroup;

    topics = ['Молитовні', 'Жатва'];
    songs = SONGS;
    selectedSong$ = new BehaviorSubject(null);

    ngOnInit(): void {
        this.modulesManager.setActiveModule(null);
        marked.setOptions({
            breaks: true
        });
    }

    onSubmitForm() {}

    selectSong(song) {
        const data = {...song, html: marked(song.text)}
        this.selectedSong$.next(data);
    }

    clearSelectedSong() {
        this.selectedSong$.next(null);
    }
}
