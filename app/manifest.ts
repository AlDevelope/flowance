import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Flowance',
    short_name: 'Flowance',
    description: 'Your personal finance flowing seamlessly',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4CAF85',
    icons: [
      {
        src: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
