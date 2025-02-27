import { TEventState } from '@events/interfaces/event';
import { Event } from '@events/entities/event.entity';

export abstract class EventUtils {
  static getEventId(event: Event, eventState: TEventState) {
    return `event-${event.id}-${eventState}-${event.repeat ? 'weekly' : 'day'}`;
  }
}
