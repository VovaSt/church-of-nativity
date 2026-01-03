import { Component } from '@angular/core';

@Component({
    selector: 'app-error-message',
    template: `
        <div class="error-message">
            Щось пішло не так...
        </div>
    `,
    styles: [`
        :host {
            background: red;
        }
    `]
})
export class ErrorMessageComponent { }
