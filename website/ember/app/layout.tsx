import type {Metadata,Viewport} from 'next';
import './globals.css';
export const viewport:Viewport={width:'device-width',initialScale:1,viewportFit:'cover'};
export const metadata:Metadata={title:'EMBER — There is more out there',description:'An immersive journey from Earth to Saturn. Scroll into the extraordinary.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
