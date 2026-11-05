import { type ComponentProps } from 'react';
import Image from 'next/image';

// Constants
import { IMAGES } from '@/constants/image';

// Utils
import { cn } from '@/utils';

interface AvatarProps extends Omit<ComponentProps<typeof Image>, 'size' | 'src' | 'alt'> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { container: 'h-8 w-8', image: '32px' },
  md: { container: 'h-10 w-10', image: '40px' },
  lg: { container: 'h-14 w-14', image: '56px' },
};

export const Avatar = ({
  src = IMAGES.DEFAULT_AVATAR,
  alt = '',
  size = 'md',
  className,
  onError,
  ...imageProps
}: AvatarProps) => (
  <div
    className={cn(
      'relative flex shrink-0 overflow-hidden rounded-full',
      sizes[size].container,
      className,
    )}
  >
    <Image
      {...imageProps}
      src={src}
      alt={alt}
      fill
      sizes={sizes[size].image}
      className="object-cover"
      onError={(e) => {
        onError?.(e);
      }}
    />
  </div>
);
