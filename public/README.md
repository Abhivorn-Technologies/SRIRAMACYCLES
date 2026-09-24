# Public Assets Directory

Store static local assets here. Any file in this folder is served directly from the root URL.

## Directory Structure:
- `public/images/` -> Place local product photos, hero banners, brand logos (`/images/sample.jpg`)
- `public/icons/`  -> Place custom SVG icons or favicons (`/icons/cycle-icon.svg`)

## Usage in Next.js:
```tsx
import Image from 'next/image';

// Local public image:
<Image src="/images/your-photo.jpg" alt="Cycle" width={800} height={600} />

// Remote Cloud / CDN image (configured in next.config.js):
<Image src="https://images.unsplash.com/..." alt="Cycle" width={800} height={600} />
```
