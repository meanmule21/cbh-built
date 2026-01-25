# Custom Business Hats

A self-contained Next.js e-commerce site for custom embroidered hats.

## Features

- 🎩 Browse hat catalog (Richardson, Yupoong, and more)
- 🎨 Custom embroidery options (standard and 3D puff)
- 🛒 Shopping cart with volume discounts
- 💰 Rewards program
- 📱 Responsive design
- ⚡ Fast and lightweight

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

This will create an optimized production build in the `.next` folder.

### Start Production Server

```bash
npm start
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Click "Deploy"

**No environment variables required!** The site is fully self-contained.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes (currently empty - all features use mock data)
│   ├── components/        # React components
│   ├── order/             # Order flow pages
│   └── page.tsx           # Home page
├── data/                  # Mock data files
│   └── mockData.ts       # Site stats, customers, orders
├── lib/                   # Utility functions and types
│   └── database.types.ts  # TypeScript type definitions
└── public/                # Static assets (images, etc.)
```

## Features Status

- ✅ **Hat Catalog** - Browse and select hats
- ✅ **Shopping Cart** - Add items, adjust quantities
- ✅ **Embroidery Options** - Standard and 3D puff
- ✅ **Volume Discounts** - Automatic pricing tiers
- ✅ **Rewards Program** - Customer tier system
- ✅ **Order Review** - Review before checkout
- ⚠️ **Payment** - Currently shows contact message (no payment processing)
- ⚠️ **Order History** - Uses mock data (no database)
- ⚠️ **Inventory** - Shows mock stock levels

## Technology Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (optimized)

## License

Private project
