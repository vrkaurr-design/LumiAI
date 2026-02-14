export const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashedpassword',
    name: 'Test User',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
};

export const mockProduct = {
    id: 'product-123',
    sku: 'TEST-SKU',
    name: 'Test Product',
    description: 'Description',
    price: { toNumber: () => 29.99 } as any, // Mock Prisma Decimal
    category: 'SKINCARE',
    tone: 'NEUTRAL',
    skinType: 'DRY',
    stock: 100,
    images: ['img.jpg'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
};
