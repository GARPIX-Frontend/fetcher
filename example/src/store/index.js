import { createStoreon } from 'storeon'
import {page} from 'fetcher';
import { storeonDevtools } from 'storeon/devtools';

const storeonParams = [
  page,
];

if(process.env.NODE_ENV === 'development') {
  storeonParams.push(storeonDevtools)
}

export const store = createStoreon(storeonParams);
