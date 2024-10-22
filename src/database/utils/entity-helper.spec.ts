import { EntityHelper } from './entity-helper';

describe('EntityHelper', () => {
  let entity: EntityHelper;

  beforeEach(() => {
    entity = new EntityHelper();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('setEntityName', () => {
    it('should set the __entity property to the name of the constructor', () => {
      entity.setEntityName();

      expect(entity.__entity).toBe('EntityHelper');
    });
  });
});
