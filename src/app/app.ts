import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import { EXPORT_SERVICE } from 'projects/ngx-formly-builder/src/lib/core/token';
import { FormlyBuilder } from 'projects/ngx-formly-builder/src/lib/ngx-formly-builder';
import { FormBuilderService } from 'projects/ngx-formly-builder/src/lib/services/form-builder.service';
import { CustomExportService } from './custom-export.service';

@Component({
  selector: 'app-root',
  imports: [FormlyBuilder, DragDropModule],
  providers: [
    {
      provide: EXPORT_SERVICE,
      useClass: CustomExportService,
    },
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly #formBuilderService = inject(FormBuilderService);

  constructor() {
    // Initialize with default fields including a two-column layout example
    this.#formBuilderService.$fields.set([
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'firstName',
            type: 'input',
            className: 'col-6',
            wrappers: ['field-wrapper'],
            props: {
              label: 'First Name',
              placeholder: 'Enter your first name',
              required: true,
            },
          },
          {
            key: 'lastName',
            type: 'input',
            className: 'col-6',
            wrappers: ['field-wrapper'],
            props: {
              label: 'Last Name',
              placeholder: 'Enter your last name',
              required: true,
            },
          },
        ],
      },
      {
        key: 'email',
        type: 'input',
        wrappers: ['field-wrapper'],
        props: {
          label: 'Email',
          placeholder: 'Enter your email',
          type: 'email',
        },
      },
    ]);
  }
}
