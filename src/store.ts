import { writable, Readable, readable } from "svelte/store";

export class Game {
  public round: number = 0;
  public play: boolean = false;
}

export let GameStore = writable<Game>(new Game());
