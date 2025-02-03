import { EnumEvent } from '@events/enum/event';
import { Event } from '@events/entities/event.entity';

export type TEventState = EnumEvent.EVENT_START | EnumEvent.EVENT_END;

export interface IEvents {
  old: Event;
  new: Event;
}
