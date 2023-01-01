export interface Player {
  name: string;
  currentCity: string;
  points: number;
  motivation: number;
}

export interface State {
  players: Player[];
  currentPlayerIndex: number;
}

export class RemoteStoreService {
  constructor(private readonly apiKey: string = "VSunoUZhyvgYkVYasZYBJU") {}

  async save(id: string, state: State) {
    await fetch(`https://kvdb.io/${this.apiKey}/${id}`, {
      method: "POST",
      body: JSON.stringify(state),
    });
    console.log(`stored remote state with id ${id}`);
  }

  async fetch(id: string): Promise<State> {
    const resp = await fetch(`https://kvdb.io/${this.apiKey}/${id}`);
    const body = await resp.text();

    console.log(`fetched remote state with id ${id}: '${body}'`);
    return JSON.parse(body) as State;
  }
}
