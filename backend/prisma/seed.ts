import { PrismaClient, Role, Category, Tone, SkinType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // 1. Create Admin User
    const adminEmail = 'admin@lumiai.com';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                name: 'LumiAI Admin',
                role: Role.ADMIN,
            },
        });
        console.log('Created Admin User');
    }

    // 2. Products Data
    const products = [
        // MAKEUP - Lipsticks (15 items)
        {
            sku: 'mk-lip-w1',
            name: 'Ruby Red Velvet Lipstick',
            category: Category.MAKEUP,
            type: 'lipstick',
            description: 'A luxurious creamy lipstick with warm undertones that provides intense color payoff and long-lasting wear.',
            detail: 'Enriched with Vitamin E and Shea Butter for hydration. High-impact color with a velvet matte finish.',
            price: 899.00,
            shade: Tone.WARM,
            badge: 'bestseller',
            stock: 45,
            ratingAvg: 4.7,
            ratingCount: 234,
            isFeatured: true,
            images: ['https://placehold.co/600x600/png?text=Ruby+Red', 'https://placehold.co/600x600/png?text=Ruby+Red+Swatch'],
        },
        {
            sku: 'mk-lip-c1',
            name: 'Mauve Magic Matte',
            category: Category.MAKEUP,
            type: 'lipstick',
            description: 'Cool-toned mauve lipstick perfect for everyday wear. Non-drying matte formula.',
            detail: 'Transfer-proof and lightweight. Suitable for all skin tones, especially cool undertones.',
            price: 799.00,
            shade: Tone.COOL,
            badge: 'new',
            stock: 100,
            ratingAvg: 4.5,
            ratingCount: 56,
            isFeatured: false,
            images: ['https://placehold.co/600x600/png?text=Mauve+Magic'],
        },
        {
            sku: 'mk-lip-n1',
            name: 'Nude Perfect Shine',
            category: Category.MAKEUP,
            type: 'lipstick',
            description: 'The ultimate neutral nude with a glossy finish for a natural look.',
            detail: 'High shine without stickiness. Plumping effect.',
            price: 650.00,
            shade: Tone.NEUTRAL,
            stock: 30,
            ratingAvg: 4.2,
            ratingCount: 120,
            images: ['https://placehold.co/600x600/png?text=Nude+Perfect'],
        },
        // ... Generative filler for 12 more makeup items to reach 15
        { sku: 'mk-fnd-w1', name: 'Glow Foundation (Warm)', category: Category.MAKEUP, type: 'foundation', price: 1200, shade: Tone.WARM, description: 'Radiant finish foundation.', detail: 'Medium coverage.', stock: 50, images: ['https://placehold.co/600x600'] },
        { sku: 'mk-fnd-c1', name: 'Matte Foundation (Cool)', category: Category.MAKEUP, type: 'foundation', price: 1200, shade: Tone.COOL, description: 'Full coverage matte.', detail: 'Oil control.', stock: 60, images: ['https://placehold.co/600x600'] },
        { sku: 'mk-fnd-n1', name: 'Silk Foundation (Neutral)', category: Category.MAKEUP, type: 'foundation', price: 1300, shade: Tone.NEUTRAL, description: 'Satin finish.', detail: 'Natural look.', stock: 40, images: ['https://placehold.co/600x600'] },
        { sku: 'mk-blush-w1', name: 'Coral Crush Blush', category: Category.MAKEUP, type: 'blush', price: 550, shade: Tone.WARM, description: 'Peachy warm blush.', detail: 'Buildable pigment.', stock: 80, images: ['https://placehold.co/600x600'] },
        { sku: 'mk-blush-c1', name: 'Pink Pop Blush', category: Category.MAKEUP, type: 'blush', price: 550, shade: Tone.COOL, description: 'Cool pink flush.', detail: 'Soft powder.', stock: 75, images: ['https://placehold.co/600x600'] },
        { sku: 'mk-eye-w1', name: 'Sunset Palette', category: Category.MAKEUP, type: 'eyeshadow', price: 2500, shade: Tone.WARM, description: 'Warm oranges and golds.', detail: '12 shades.', stock: 20, badge: 'limited', images: ['https://placehold.co/600x600'] },
        { sku: 'mk-eye-c1', name: 'Midnight Palette', category: Category.MAKEUP, type: 'eyeshadow', price: 2500, shade: Tone.COOL, description: 'Cool blues and silvers.', detail: '12 shades.', stock: 25, images: ['https://placehold.co/600x600'] },
        { sku: 'mk-mas-1', name: 'Volume Blast Mascara', category: Category.MAKEUP, type: 'mascara', price: 499, shade: Tone.NEUTRAL, description: 'Dramatic volume.', detail: 'Waterproof.', stock: 150, images: ['https://placehold.co/600x600'] },
        { sku: 'mk-mas-2', name: 'Length Infinity Mascara', category: Category.MAKEUP, type: 'mascara', price: 549, shade: Tone.NEUTRAL, description: 'Extreme length.', detail: 'Fiber technology.', stock: 130, images: ['https://placehold.co/600x600'] },
        { sku: 'mk-lip-w2', name: 'Brick Red Matte', category: Category.MAKEUP, type: 'lipstick', price: 850, shade: Tone.WARM, description: 'Deep warm red.', detail: 'Classic matte.', stock: 90, images: ['https://placehold.co/600x600'] },
        { sku: 'mk-lip-c2', name: 'Berry Stain', category: Category.MAKEUP, type: 'lipstick', price: 700, shade: Tone.COOL, description: 'Cool berry tint.', detail: 'Long wear stain.', stock: 65, images: ['https://placehold.co/600x600'] },
        { sku: 'mk-high-1', name: 'Golden Glow Highlighter', category: Category.MAKEUP, type: 'highlighter', price: 950, shade: Tone.WARM, description: 'Warm champagne glow.', detail: 'Liquid highlighter.', stock: 48, images: ['https://placehold.co/600x600'] },

        // SKINCARE - 15 products
        {
            sku: 'sk-moist-d1',
            name: 'HydraSurge Rich Cream',
            category: Category.SKINCARE,
            type: 'moisturizer',
            description: 'Intense hydration for dry skin with Hyaluronic Acid and Ceramide complex.',
            detail: 'Restores skin barrier and locks in moisture for 24 hours.',
            price: 1500.00,
            skinType: SkinType.DRY,
            stock: 55,
            ratingAvg: 4.8,
            ratingCount: 310,
            badge: 'bestseller',
            images: ['https://placehold.co/600x600/png?text=HydraSurge'],
        },
        {
            sku: 'sk-moist-o1',
            name: 'Gel Matte Hydrator',
            category: Category.SKINCARE,
            type: 'moisturizer',
            description: 'Oil-free gel moisturizer perfect for oily and acne-prone skin.',
            detail: 'Controls sebum production and reduces shine.',
            price: 1200.00,
            skinType: SkinType.OILY,
            stock: 8, // Low stock
            ratingAvg: 4.6,
            ratingCount: 180,
            images: ['https://placehold.co/600x600/png?text=Gel+Matte'],
        },
        {
            sku: 'sk-cln-s1',
            name: 'Gentle Foam Cleanser',
            category: Category.SKINCARE,
            type: 'cleanser',
            description: 'pH-balanced cleanser for sensitive skin. Removes impurities without stripping.',
            detail: 'Fragrance-free and hypoallergenic.',
            price: 850.00,
            skinType: SkinType.SENSITIVE,
            stock: 100,
            images: ['https://placehold.co/600x600/png?text=Gentle+Foam'],
        },
        // ... Filler 12 Skincare
        { sku: 'sk-serum-1', name: 'Vitamin C Brightening Serum', category: Category.SKINCARE, type: 'serum', price: 2100, skinType: SkinType.NORMAL, description: 'Fades dark spots.', detail: '15% Vit C.', stock: 60, images: ['https://placehold.co/600x600'] },
        { sku: 'sk-serum-2', name: 'Niacinamide 10% Serum', category: Category.SKINCARE, type: 'serum', price: 1800, skinType: SkinType.OILY, description: 'Refines pores.', detail: 'Zinc 1%.', stock: 95, images: ['https://placehold.co/600x600'] },
        { sku: 'sk-sun-1', name: 'Invisible Shield SPF 50', category: Category.SKINCARE, type: 'sunscreen', price: 999, skinType: SkinType.COMBINATION, description: 'No white cast.', detail: 'Gel based.', stock: 200, images: ['https://placehold.co/600x600'] },
        { sku: 'sk-sun-2', name: 'Mineral Matte SPF 40', category: Category.SKINCARE, type: 'sunscreen', price: 1100, skinType: SkinType.SENSITIVE, description: 'Physical sunscreen.', detail: 'Zinc Oxide.', stock: 45, images: ['https://placehold.co/600x600'] },
        { sku: 'sk-mask-1', name: 'Clay Detox Mask', category: Category.SKINCARE, type: 'mask', price: 750, skinType: SkinType.OILY, description: 'Deep pore cleansing.', detail: 'Kaolin clay.', stock: 35, images: ['https://placehold.co/600x600'] },
        { sku: 'sk-mask-2', name: 'Sleeping Glow Mask', category: Category.SKINCARE, type: 'mask', price: 1400, skinType: SkinType.DRY, description: 'Overnight repair.', detail: 'With Cica.', stock: 50, images: ['https://placehold.co/600x600'] },
        { sku: 'sk-toner-1', name: 'Rose Water Toner', category: Category.SKINCARE, type: 'toner', price: 450, skinType: SkinType.NORMAL, description: 'Refreshing mist.', detail: 'Real rose extract.', stock: 120, images: ['https://placehold.co/600x600'] },
        { sku: 'sk-toner-2', name: 'BHA Exfoliating Toner', category: Category.SKINCARE, type: 'toner', price: 890, skinType: SkinType.COMBINATION, description: 'Unclogs pores.', detail: '2% Salicylic Acid.', stock: 28, images: ['https://placehold.co/600x600'] },
        { sku: 'sk-eye-1', name: 'Caffeine Eye Cream', category: Category.SKINCARE, type: 'eye_care', price: 1600, skinType: SkinType.NORMAL, description: 'Reduces puffiness.', detail: 'Coffee bean extract.', stock: 55, images: ['https://placehold.co/600x600'] },
        { sku: 'sk-lip-1', name: 'Berry Lip Mask', category: Category.SKINCARE, type: 'lip_care', price: 600, skinType: SkinType.DRY, description: 'Overnight lip repair.', detail: 'Shea butter.', stock: 88, images: ['https://placehold.co/600x600'] },
        { sku: 'sk-oil-1', name: 'Rosehip Facial Oil', category: Category.SKINCARE, type: 'face_oil', price: 2400, skinType: SkinType.DRY, description: 'Anti-aging oil.', detail: 'Cold pressed.', stock: 15, badge: 'limited', images: ['https://placehold.co/600x600'] },
        { sku: 'sk-tool-1', name: 'Jade Roller', category: Category.SKINCARE, type: 'tool', price: 1200, skinType: SkinType.NORMAL, description: 'Facial massage tool.', detail: 'Real jade stone.', stock: 40, images: ['https://placehold.co/600x600'] },
    ];

    for (const product of products) {
        const existing = await prisma.product.findUnique({ where: { sku: product.sku } });
        if (!existing) {
            await prisma.product.create({ data: product });
        }
    }

    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
