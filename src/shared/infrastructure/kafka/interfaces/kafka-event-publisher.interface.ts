import { BaseEvent } from '@/shared/domain/events/base-event.interface';

export interface IKafkaEventPublisher {
  publish(topic: string, event: BaseEvent<unknown>): Promise<void>;
}
