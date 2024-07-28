export interface ITransaction {
  exec(callback: (txclient: unknown) => void): Promise<void>
}
