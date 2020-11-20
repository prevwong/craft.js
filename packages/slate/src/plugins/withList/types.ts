export const ListHotkey = {
  TAB: 'Tab',
  ENTER: 'Enter',
  DELETE_BACKWARD: 'Backspace',
};

// Type option
export interface ListTypeOption {
  typeUl?: string;
  typeOl?: string;
  typeLi?: string;
  typeP?: string;
}

export type WithListOptions = ListTypeOption;
