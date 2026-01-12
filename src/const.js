const POINTS_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const EMPTY_POINT = {
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'flight'
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const SortType = {
  DEFAULT: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

const SORT_ITEMS = [
  { type: SortType.DEFAULT, checked: true },
  { type: SortType.EVENT, disabled: true },
  { type: SortType.TIME},
  { type: SortType.PRICE },
  { type: SortType.OFFERS, disabled: true },
];


export {POINTS_TYPES, EMPTY_POINT, FilterType, Mode, SortType, SORT_ITEMS };
