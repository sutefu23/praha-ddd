export interface ITransaction<ClientType = unknown> {
  exec(
    client: ClientType,
    callback: (txclient: ClientType) => void,
  ): Promise<void>
}
