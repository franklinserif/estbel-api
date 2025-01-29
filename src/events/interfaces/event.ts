import { EEvent } from '@events/enum/eventName';
import { Event } from '@events/entities/event.entity';

export type TEventState = EEvent.EVENT_START | EEvent.EVENT_END;

export interface IEvents {
  old: Event;
  new: Event;
}
