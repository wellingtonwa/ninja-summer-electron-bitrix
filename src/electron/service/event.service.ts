import { ipcMain } from 'electron';
import { ActionController } from '../controllers/actionController';
import { Controller } from '../controllers/controller';

class EventService {

  private registered = false;
  private controllers: Controller[] = [];
  private actions: ActionController[] = [];

  constructor() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const context = require.context('../controllers', true, /\.controller.ts$/);
    context.keys().forEach(
      (it: string) => {
          this.controllers.push({
          name: this.normalizeControllerName(it),
          instance: context(it).default,
        })
      });
  }

  private normalizeControllerName(controller: string) {
    return controller.slice(2, -3).replace('.controller', '');
  }

  private registerIpcAction(action: string, method: string, controller: object) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ipcMain.handle(action, (_, ...args: any[]) => controller[method](...args));
  }

  public registerControllers() {
    if (!this.registered) {
      this.controllers.forEach(controller => {
        const actionController: ActionController = {
          key: controller.name,
          methods: [],
        };

        Object.getOwnPropertyNames(Object.getPrototypeOf(controller.instance))
          .filter(it => it !== 'constructor')
          .forEach(it => {
            this.registerIpcAction(`${controller.name}:${it}`, it, controller.instance);
            actionController.methods.push(it);
          });

        this.actions.push(actionController);
      });

      this.registered = true;
    }
  }

  public getControllerActions() {
    return this.actions;
  }

}

export default new EventService();
