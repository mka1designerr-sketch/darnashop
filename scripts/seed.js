// Seed database from data/products.json
// Run with: npm run db:seed

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const file = path.join(process.cwd(), 'data', 'products.json');
  if (!fs.existsSync(file)) {
    console.log('No data/products.json found. Skipping products seed.');
    return;
  }
  const raw = fs.readFileSync(file, 'utf8');
  const list = JSON.parse(raw);
  let created = 0;
  for (const p of list) {
    const variants = Array.isArray(p.variants) ? p.variants : [];
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        price: Math.round(Number(p.price || 0)),
        qty: Math.round(Number(p.qty || 0)),
        categories: Array.isArray(p.categories) ? p.categories : [],
        description: p.description ?? null,
        deliveryInfo: p.deliveryInfo ?? null,
      },
      create: {
        id: p.id,
        name: p.name,
        price: Math.round(Number(p.price || 0)),
        qty: Math.round(Number(p.qty || 0)),
        categories: Array.isArray(p.categories) ? p.categories : [],
        description: p.description ?? null,
        deliveryInfo: p.deliveryInfo ?? null,
        variants: {
          create: variants.map((v) => ({
            colorName: v.colorName,
            colorHex: v.colorHex ?? null,
            images: Array.isArray(v.images) ? v.images : [],
            isPrimary: Boolean(v.isPrimary),
          })),
        },
      },
    });
    if (!(await prisma.variant.count({ where: { productId: p.id } }))) {
      // If update path had wiped variants earlier, ensure they exist
      if (variants.length) {
        await prisma.product.update({
          where: { id: p.id },
          data: { variants: { create: variants } },
        });
      }
    }
    created++;
  }
  console.log(`Seeded/updated ${created} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
