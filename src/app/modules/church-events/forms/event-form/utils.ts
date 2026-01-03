import { CalendarEventType } from "src/app/core/enums/calendar.enum";

export const filterPlaces = (value, places) => {
    const filterValue = value.toLowerCase();
    return places.filter(p => p.toLowerCase().includes(filterValue));
}

export const typePermissions = (type?: CalendarEventType) => {
    return {
        name: true,
        start: true,
        finish: true,
        place: !!type && ![CalendarEventType.загальне_служіння].includes(type),
        person: !!type && ![CalendarEventType.загальне_служіння, CalendarEventType.молитва].includes(type),
        preachers: [CalendarEventType.загальне_служіння].includes(type),
        singers: [CalendarEventType.загальне_служіння, CalendarEventType.євангелізація].includes(type),
        cars: [CalendarEventType.молодіжне, CalendarEventType.євангелізація, CalendarEventType.табір, CalendarEventType.інше].includes(type),
        frequency: true,
        date: true,
        days: true,
    }
};
