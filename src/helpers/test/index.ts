export const getRepositoryMock = (entityMock?: unknown) => {
  const mockDeleteSingleton = jest.fn().mockReturnThis();
  const mockExecuteSingleton = jest.fn().mockReturnThis();
  const mockFromSingleton = jest.fn().mockReturnThis();
  const mockGetManySingleton = jest.fn().mockReturnThis();
  const mockGetOneSingleton = jest.fn().mockReturnThis();
  const mockInnerJoinSingleton = jest.fn().mockReturnThis();
  const mockInnerJoinAndSelectSingleton = jest.fn().mockReturnThis();
  const mockOrderBySingleton = jest.fn().mockReturnThis();
  const mockWhereSingleton = jest.fn().mockReturnThis();
  const mockLimitSingleton = jest.fn().mockReturnThis();
  const mockOffsetSingleton = jest.fn().mockReturnThis();

  return {
    findOne: jest.fn().mockResolvedValue(entityMock),
    save: jest.fn().mockResolvedValue(entityMock),
    newEntity: jest.fn().mockResolvedValue(entityMock),
    merge: jest.fn().mockResolvedValue(entityMock),
    delete: jest.fn().mockResolvedValue(entityMock),
    update: jest.fn().mockResolvedValue(entityMock),
    create: jest.fn().mockResolvedValue(entityMock),
    remove: jest.fn().mockResolvedValue(entityMock),
    preload: jest.fn().mockResolvedValue(entityMock),
    find: jest.fn().mockResolvedValue([entityMock]),
    createQueryBuilder: () => ({
      delete: mockDeleteSingleton,
      execute: mockExecuteSingleton,
      from: mockFromSingleton,
      getMany: mockGetManySingleton,
      getOne: mockGetOneSingleton,
      innerJoin: mockInnerJoinSingleton,
      innerJoinAndSelect: mockInnerJoinAndSelectSingleton,
      orderBy: mockOrderBySingleton,
      where: mockWhereSingleton,
      limit: mockLimitSingleton,
      offset: mockOffsetSingleton,
    }),
  };
};

export const getTxManagerMock = () => {
  return {
    save: jest.fn().mockImplementation((entity) => {
      return {
        id: 1,
        ...entity,
      };
    }),
  };
};

export const getConnectionMock = (txManager = getTxManagerMock()) => {
  return {
    transaction: jest
      .fn()
      .mockImplementation((callback) => callback(txManager)),
  };
};
