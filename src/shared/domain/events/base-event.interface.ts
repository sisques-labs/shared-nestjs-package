import { IEventMetadata } from '@/shared/domain/interfaces/event-metadata.interface';
import { randomUUID } from 'crypto';

/**
 * Abstract base class for all domain events.
 *
 * @template TData - The type of data associated with the event.
 */
export abstract class BaseEvent<TData> {
  /**
   * Unique identifier for the event.
   */
  readonly eventId: string;

  /**
   * The type of event, usually a descriptive string.
   */
  readonly eventType: string;

  /**
   * The identifier of the aggregate root from which this event originated.
   */
  readonly aggregateRootId: string;

  /**
   * The type of the aggregate root.
   */
  readonly aggregateRootType: string;

  /**
   * The timestamp representing when the event occurred.
   */
  readonly ocurredAt: Date;

  /**
   * The identifier of the entity within the aggregate that this event is related to.
   */
  readonly entityId: string;

  /**
   * The type of the entity tied to this event.
   */
  readonly entityType: string;

  /**
   * The event-specific data payload.
   * @protected
   */
  protected readonly _data: TData;

  /**
   * Initializes a new BaseEvent instance with provided metadata and data.
   *
   * @param metadata - Metadata about the event and its context.
   * @param data - Event payload or data tied to the event.
   */
  constructor(metadata: IEventMetadata, data: TData) {
    this.eventId = randomUUID();
    this.eventType = metadata.eventType;
    this.aggregateRootId = metadata.aggregateRootId;
    this.aggregateRootType = metadata.aggregateRootType;
    this.entityId = metadata.entityId;
    this.entityType = metadata.entityType;
    this.ocurredAt = new Date();
    this._data = data;
  }

  /**
   * Retrieves the event's data payload.
   */
  public get data(): TData {
    return this._data;
  }
}
