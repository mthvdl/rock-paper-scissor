import { IObserver } from './IObserver'

export abstract class Observable {

    _observers: IObserver[];

    constructor() {
        this._observers = [];
    }

    public addObserver(observer: IObserver) {
        this._observers.push(observer);
    }

    public removeObserver(observer: IObserver) {
        this._observers = this._observers.filter(obj => obj !== observer);
    }

    /**
     * Iterate over attached observers to trigger their update
     */
    public notify(data: any) {
        for (let observer of this._observers) {
            observer.update(this, data);
        }
    }


}