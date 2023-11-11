export class Entity {
  constructor(partial?: Partial<Entity>) {
    Object.assign(this, JSON.parse(JSON.stringify(partial)));
  }
}
