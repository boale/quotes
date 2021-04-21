import { FormGroup } from '@angular/forms';

import * as uuid from 'uuid';

import { QuoteTag } from './quote-tag.models';

export function generateUniqueId(): string {
  return uuid.v4();
}

export function getTagsArrayFromTagsData(tags: string | string[], separator: string = ', '): QuoteTag[] {
  const tagsArray = typeof tags === 'string' ? tags.split(separator) : tags;

  return tagsArray.map((tag: string) => ({
    id: generateUniqueId(),
    value: tag,
  }));
}

export function getFormattedTagsFromFormValue(tagForm: FormGroup, separator: string = ', '): string {
  return Object.entries(tagForm.value)
    .filter(([ _, value ]) => !!value)
    .map(([ _, value ]) => (value as string).replace(/,/g, ''))
    .join(separator);
}
