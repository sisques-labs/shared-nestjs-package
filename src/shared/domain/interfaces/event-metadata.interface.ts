/**
 * Interface for event metadata.
 *
 * @interface IEventMetadata
 * @property {string} aggregateRootId - The id of the aggregate root.
 * @property {string} aggregateRootType - The type of the aggregate root.
 * @property {string} entityId - The id of the entity.
 * @property {string} entityType - The type of the entity.
 * @property {string} eventType - The type of the event.
 */
export interface IEventMetadata {
  aggregateRootId: string;
  aggregateRootType: string;
  entityId: string;
  entityType: string;
  eventType: string;
}
