import { Observable } from './Observable'

export interface IObserver {
    update(src: Observable, data: any);
}