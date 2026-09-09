import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'EMBER — Love at first bite',description:'A flame-grilled restaurant concept. Explore our signature burger in 3D and follow your appetite.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
