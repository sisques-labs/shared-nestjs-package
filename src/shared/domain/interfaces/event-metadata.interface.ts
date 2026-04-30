/**
 * Interface for event metadata.
 *
 * @interface IEventMetadata
 * @property {string} aggregateRootId - The id of the aggregate root.
 * @property {string} aggregateRootType - The type of the aggregate root.
 * @property {string} entityId - The id of the entity.
 * @property {string} entityType - The type of the entity.
 * @property {string} eventType - The type of the event.
 * @property {string} [schemaVersion] - The version of the event schema contract (e.g. "1.0.0"). Defaults to "1.0.0".
 * @property {string} [correlationId] - ID propagated from the originating request for distributed tracing.
 * @property {string} [causationId] - ID of the event or command that caused this event.
 */
export interface IEventMetadata {
  aggregateRootId: string;
  aggregateRootType: string;
  entityId: string;
  entityType: string;
  eventType: string;
  schemaVersion?: string;
  correlationId?: string;
  causationId?: string;
}
