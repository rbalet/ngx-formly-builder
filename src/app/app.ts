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
    // Initialize with default fields demonstrating two-column layout
    this.#formBuilderService.$fields.set([
      {
        key: 'title',
        type: 'markdown',
        wrappers: ['field-wrapper'],
        defaultValue: '# Job Application\n\nApply for the position and join our team.',
      },
      {
        key: 'firstName',
        type: 'input',
        wrappers: ['field-wrapper'],
        className: 'col-6',
        props: {
          label: 'First Name',
          placeholder: 'Enter your first name',
          required: true,
        },
      },
      {
        key: 'lastName',
        type: 'input',
        wrappers: ['field-wrapper'],
        className: 'col-6',
        props: {
          label: 'Last Name',
          placeholder: 'Enter your last name',
          required: true,
        },
      },
      {
        key: 'email',
        type: 'input',
        wrappers: ['field-wrapper'],
        className: 'col-6',
        props: {
          label: 'Email',
          placeholder: 'Enter your email',
          type: 'email',
          required: true,
        },
      },
      {
        key: 'phone',
        type: 'input',
        wrappers: ['field-wrapper'],
        className: 'col-6',
        props: {
          label: 'Phone Number',
          placeholder: 'Enter your phone number',
          type: 'tel',
        },
      },
      {
        key: 'position',
        type: 'input',
        wrappers: ['field-wrapper'],
        props: {
          label: 'Position Applied For',
          placeholder: 'Enter the position you are applying for',
        },
      },
    ]);
  }
}
