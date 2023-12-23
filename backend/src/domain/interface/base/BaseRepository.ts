export abstract class BaseRepository {
  abstract transacting(client: unknown): void
}
