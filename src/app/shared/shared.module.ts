import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { PhotoCaruselComponent } from './components/photo-carusel/photo-carusel.component';
import { DonateButtonComponent } from './components/donate-button/donate-button.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ImageLoaderDirective } from './directives/image-loader.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { VideoPopupComponent } from './components/video-popup/video-popup.component';
import { DonateModalComponent } from './components/donate-modal/donate-modal.component';
import {MatTabsModule} from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { ChipsInputComponent } from './components/chips-input/chips-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ErrorMessageComponent } from './components/error-message/error-message.component';

@NgModule({
    declarations: [
        PhotoCaruselComponent,
        DonateButtonComponent,
        VideoPopupComponent,
        ImageLoaderDirective,
        DonateModalComponent,
        ChipsInputComponent,
        ErrorMessageComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        IvyCarouselModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatTabsModule,
        MatInputModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatChipsModule,
        ReactiveFormsModule
    ],
    exports: [
        MatButtonToggleModule,
        MatProgressBarModule,
        MatButtonModule,
        MatMenuModule,
        TranslateModule,
        MatExpansionModule,
        MatDialogModule,
        MatIconModule,
        MatTooltipModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatSnackBarModule,

        PhotoCaruselComponent,
        DonateButtonComponent,
        VideoPopupComponent,
        ChipsInputComponent,
        ErrorMessageComponent,

        ImageLoaderDirective
    ],
})
export class SharedModule {}
