import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from './../../../environments/environment';
import { Attendee } from './../../models/attendee';

declare const Pusher: any;

@Injectable()
export class AttendeeService {

  constructor(
    public http: HttpClient
  ) {  }

  public getAttendees() {
    return this.http.get<Attendee[]>('api/attendees');
  }

  public liveAttendees(): Observable<any> {
    const pusher = new Pusher(environment.pusherAppKey, {
      wsHost: 'ws.pusherapp.com',
      httpHost: 'sockjs.pusher.com',
      cluster: 'mt1',
      encrypted: true
    });

    const channel = pusher.subscribe('attendees');

    return Observable.create(observer => {
      channel.bind('new-checkin', (attendee: Attendee) => observer.next(attendee));
    });
  }
}
