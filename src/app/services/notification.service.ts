import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Notification, NotificationType } from "../common/constants";
@Injectable({
	providedIn: 'root'
})
export class NotificationService {

	private getHttpError: Subject<number> = new Subject<number>();
    private showContinue: Subject<boolean> = new Subject<boolean>();
    private showLoading: Subject<boolean> = new Subject<boolean>();
    private clearSideOptions: Subject<boolean> = new Subject<boolean>();
    private getHomeOptions: Subject<number> = new Subject<number>();
	private clickBetContinue: Subject<boolean> = new Subject<boolean>();
	private updateHeader: Subject<boolean> = new Subject<boolean>();
	
	private _subject = new Subject<Notification>();
	private _idx = 0;

	constructor() {
		//empty
	 }

	getObservable(): Observable<Notification> {
		return this._subject.asObservable();
	}
	
	info(title: string, message: string, classProp: string, classPropAnimation: string, timeout: number) {
		this._subject.next(new Notification(this._idx++, NotificationType.info, title, message, classProp, classPropAnimation, timeout));
	}
	
	success(title: string, message: string, classProp: string, classPropAnimation: string, timeout: number) {
		this._subject.next(new Notification(this._idx++, NotificationType.success, title, message, classProp, classPropAnimation, timeout));
	}
	
	warning(title: string, message: string, classProp: string, classPropAnimation: string, timeout: number) {
		this._subject.next(new Notification(this._idx++, NotificationType.warning, title, message, classProp, classPropAnimation, timeout));
	}
	
	error(title: string, message: string, classProp: string, classPropAnimation: string, timeout = 0) {
		this._subject.next(new Notification(this._idx++, NotificationType.error, title, message, classProp, classPropAnimation, timeout));
	}
	  
	init() {
        this.getHttpError = new Subject<number>();
        this.showContinue = new Subject<boolean>();
        this.showLoading = new Subject<boolean>();
        this.clearSideOptions = new Subject<boolean>();
        this.getHomeOptions = new Subject<number>();
		this.clickBetContinue = new Subject<boolean>();
        this.updateHeader = new Subject<boolean>();
	} 


	notifyHttpError(httpError: number) {
		this.getHttpError.next(httpError);
	}  

	onHttpError() {
		return this.getHttpError.asObservable();
	}

	notifyShowNext(show: boolean) {
		this.showContinue.next(show);
	}  

	onShowNext() {
		return this.showContinue.asObservable();
    }
    
    notifyShowLoading(show: boolean) {
		this.showLoading.next(show);
	}  

	onShowLoading() {
		return this.showLoading.asObservable();
    }
    
    notifyClearSideOptions(show: boolean) {
		this.clearSideOptions.next(show);
	}  

	onClearSideOptions() {
		return this.clearSideOptions.asObservable();
    }
    
    notifyHomeOptions(option: number) {
		this.getHomeOptions.next(option);
	}  

	onHomeOptions() {
		return this.getHomeOptions.asObservable();
    }
    
	clear() {
		this.getHttpError.complete();
        this.showContinue.complete();
        this.showLoading.complete();
        this.clearSideOptions.complete();
		this.clickBetContinue.complete();
        this.updateHeader.complete();
	}
}