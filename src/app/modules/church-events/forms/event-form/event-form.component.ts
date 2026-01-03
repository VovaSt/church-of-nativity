import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CalendarService, typeFilters } from 'src/app/core/services/calendar.service';
import { CalendarEventData } from 'src/app/core/types/calendar.type';
import { filterPlaces, typePermissions } from './utils';
import { CalendarEventType } from 'src/app/core/enums/calendar.enum';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventFormComponent implements OnInit {
    @Input() data: CalendarEventData | null;

    eventForm: FormGroup;

    types: Object[] = [...typeFilters];

    typePermissions$: Observable<any>;

    places: string[];
    filteredPlaces$: Observable<string[]>;
    preachers: string[];
    singers: string[];
    cars: string[];

    constructor(
        private formBuilder: FormBuilder,
        private calendarService: CalendarService
    ) {}

    ngOnInit(): void {
        this.eventForm = this.formBuilder.group({
            type: [(this.data?.type || CalendarEventType.загальне_служіння), Validators.required],
            name: [(this.data?.name || 'Загальне служіння'), Validators.required],
            start: [(this.data?.start || '10:00'), Validators.required],
            finish: [(this.data?.finish || '12:00')],
            place: [(this.data?.place || '')],
            person: [(this.data?.person || '')],
            preachers: [(this.data?.preachers || ["Стахов Петро", "Редич Діма"])],
            singers: [(this.data?.singers || ["Молодіжний хор"])],
            cars: [(this.data?.cars || [])],
            frequency: [(this.data?.frequency || "once")],
            date: [(this.data?.date || new Date())],
            days: [(this.data?.days || [])],
        });

        this.places = this.calendarService.getPlaces();
        this.preachers = this.calendarService.getPreachers();
        this.singers = this.calendarService.getSingers();
        this.cars = this.calendarService.getCars();

        this.filteredPlaces$ = this.eventForm.get("place").valueChanges.pipe(
            startWith(''),
            map(value => filterPlaces(value, this.places))
        );

        this.typePermissions$ = this.eventForm.get("type").valueChanges.pipe(
            startWith(typePermissions()),
            map(value => {
                const type = CalendarEventType[value] ? value : undefined;
                return typePermissions(type);
            })
        );
    }
}
