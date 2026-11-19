import type { ComponentType } from 'react';
import type { DemoProps } from '../types';
import { CardTilt3d } from './CardTilt3d';
import { Typewriter } from './Typewriter';
import { Glassmorphism } from './Glassmorphism';
export const demoRegistry: Record<string, ComponentType<DemoProps>> = { CardTilt3d, Typewriter, Glassmorphism };
