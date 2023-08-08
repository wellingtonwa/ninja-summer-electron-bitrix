import { RestoreLink } from '../../model/restoreLink';
import { EVENT_APPEND_LOG } from '../../constants';
import { download } from '../utils/httpsDownload';
import windowService from './window.service';
import downloadService from './download.service';

interface DownloadProps {
  url: string;
  dest: string;
  hasFileNameOnPath?: boolean;
}

interface DownloadAndRestoreProps extends RestoreLink, DownloadProps {}

class RestoreService {

  async httpsDownload(downloadProps: DownloadProps): Promise<string> {
    const {url, dest, hasFileNameOnPath} = downloadProps;
    return await downloadService.download({url, dest, hasFileNameOnPath, logFunction: windowService});
  }

  async downloadAndRestore(values: DownloadAndRestoreProps) {
    const {url, nomeBanco, dest, hasFileNameOnPath} = values;
    const downloadedFile = await this.httpsDownload({url, dest, hasFileNameOnPath});

  }



}

export default new RestoreService();
