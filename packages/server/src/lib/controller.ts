import { Router } from 'express';

export class Controller {
  public readonly router: Router;

  constructor() {
    this.router = Router();
  }
}
