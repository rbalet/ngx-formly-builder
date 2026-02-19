export type ScreenSize = 'sm' | 'md' | 'lg';

export type ValidationConditionType =
  | 'contains'
  | 'notContains'
  | 'minLength'
  | 'maxLength';

export interface ValidationCondition {
  type: ValidationConditionType;
  value: string;
}
