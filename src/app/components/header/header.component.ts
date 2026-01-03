import { LandingHeader, landingHeaderType } from './../../core/constants/landing';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit, Renderer2, Self, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, filter, throttleTime } from 'rxjs/operators';

import { ModulesManagerService } from '../../core/services/module-manager.service';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe.service';
import { Language } from '../../core/enums/language.enum';
import { LanguageService } from '../../core/services/language.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers: [UnsubscribeService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

    public languages = Object.values(Language);
    public currentLang: Language;
    headerLinks: LandingHeader[];
    private pagesLinks;
    navbarColor = false;
    showBackArrow = false;

    @ViewChild('linksMenuTrigger') linksMenuTrigger: MatMenuTrigger;
    @ViewChild('langsMenuTrigger') langsMenuTrigger: MatMenuTrigger;

    @HostListener('window:scroll', ['$event']) onscroll() {
        if (this.router.url === "/events") {
            this.navbarColor = true;
            return;
        }

        if (window.innerWidth <= 1400) {
            this.navbarColor = window.scrollY > 30 ? true : false;
        } else {
            this.navbarColor = window.scrollY > 100 ? true : false;
        }
    }

    constructor(
        @Self() private unsub: UnsubscribeService,
        private modulesManager: ModulesManagerService,
        private renderer: Renderer2,
        private cd: ChangeDetectorRef,
        private langService: LanguageService,
        private router: Router,
    ) { }

    ngOnInit() {
        this.unsub.subs = this.modulesManager.getActiveModule$
            .pipe(distinctUntilChanged())
            .subscribe(module => {
                this.headerLinks = landingHeaderType[module] || [];
                this.showBackArrow = !module;
                this.cd.markForCheck();
            });

        fromEvent(window, 'scroll')
            .pipe(throttleTime(50))
            .subscribe(() => this.onScroll());

        this.unsub.subs = this.langService.getLanguageObs()
            .subscribe(lang => this.currentLang = lang);

        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.navbarColor = val.url === "/events";
                this.cd.markForCheck();
            }
        });
    }

    public linkAction(id: string) {
        if (window.innerWidth <= 800) {
            this.linksMenuTrigger.openMenu();
        } else {
            this.scrollTo(id);
        }
    }

    setCurrentLink() {
        this.pagesLinks = document.querySelectorAll(".page-link");
        if (this.pagesLinks.length) {
            this.renderer.addClass(this.pagesLinks[0], 'current');
        }
    }

    public scrollTo(id: string) {
        const element = document.getElementById(id);
        element?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
        });
    }

    private onScroll() {
        const fromTop = window.scrollY;
        if (!this.pagesLinks || !this.pagesLinks.length) {
            this.setCurrentLink()
        }

        if (fromTop < 0) {
            return;
        } // fix for mobile

        this.pagesLinks.forEach(link => {
            const sectionId = link.id?.split('.')[0];
            const section = document.getElementById(sectionId);
            if (
                section &&
                section.offsetTop <= fromTop &&
                section.offsetTop + section.offsetHeight > fromTop
            ) {
                this.renderer.addClass(link, 'current');
            } else {
                this.renderer.removeClass(link, 'current');
            }
        });
    }

    changeLanguage(lang: Language) {
        this.langService.setLanguage(lang);
    }

    goBack() {
        if (this.router.url.includes('camp/projects')) {
            this.router.navigate(['camp']);
        } else {
            this.router.navigate(['/']);
        }
    }
}
