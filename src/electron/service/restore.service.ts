import { download } from '../utils/httpsDownload';

interface DownloadProps {
  url: string;
  dest: string;
  hasFileNameOnPath?: boolean;
}

class RestoreService {

  async httpsDownload(downloadProps: DownloadProps): Promise<string> {
    const {url, dest, hasFileNameOnPath} = downloadProps;
    return download(url, dest, hasFileNameOnPath);
  }

}

export default new RestoreService();