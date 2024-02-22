import { exec } from 'child_process';

export const findProcess = (name: String, extraOption: String): Promise<String> => {
  return new Promise((resolve, reject) => {
    exec(`ps auxw | grep ${name} ${extraOption ? extraOption : ''}`, (error, stdout, sterr) => {
      if (error) {
        console.error(sterr);
        reject(error);
        return;
      }
      resolve(stdout);
    });
  }) 
}

export const getUserHomePath = (): Promise<String> => {
  return new Promise((resolve, reject) => {
    exec(`eval echo ~$USER`, (error, stdout, sterr) => {
      if (error) {
        console.error(sterr);
        reject(error);
        return;
      }
      console.log(stdout, '>>');
      resolve(stdout.replace(/( {2}|\n|\r\n)/gm, ''));
    });
  })
}
