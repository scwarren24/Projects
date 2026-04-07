import { UserProfileRepositoryService } from "./UserProfileRepositoryService.js";
import { UserProfileRemoteFakeService } from "./UserProfileRemoteFakeService.js";

export class UserProfileRepositoryFactory {
  constructor() {
    throw new Error('Cannot instantiate a UserProfileRepositoryFactory object');
  }

  static get(repoType = 'local') {
    if (repoType === 'local') {
      return new UserProfileRepositoryService();
    } else if (repoType === 'remote') {
      return new UserProfileRemoteFakeService();
    } else {
      throw new Error('Invalid repository type');
    }
  }
}
