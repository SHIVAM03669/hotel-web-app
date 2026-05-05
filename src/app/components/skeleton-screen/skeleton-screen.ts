import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-screen',
  standalone: true,
  template: `
    <div class="skeleton-wrapper" [attr.aria-label]="ariaLabel" aria-live="polite" role="status">
      @switch (variant) {
        @case ('avatar') {
          <div class="skeleton shimmer avatar" [style.width.px]="width" [style.height.px]="height"></div>
        }
        @case ('title') {
          <div class="skeleton shimmer line line-title" [style.width.%]="80"></div>
        }
        @case ('text') {
          @for (_ of lineItems; track $index) {
            <div class="skeleton shimmer line" [style.width.%]="$last ? 65 : 100"></div>
          }
        }
        @case ('image') {
          <div class="skeleton shimmer image" [style.height.px]="height"></div>
        }
        @default {
          <div class="skeleton-card">
            <div class="skeleton shimmer image mb"></div>
            <div class="skeleton shimmer line line-title"></div>
            <div class="skeleton shimmer line"></div>
            <div class="skeleton shimmer line w-70"></div>
          </div>
        }
      }
    </div>
  `,
  styles: `
    .skeleton-wrapper {
      width: 100%;
    }

    .skeleton {
      position: relative;
      overflow: hidden;
      background: #e9ecef;
      border-radius: 0.5rem;
    }

    .shimmer::after {
      content: '';
      position: absolute;
      inset: 0;
      transform: translateX(-100%);
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55), transparent);
      animation: shimmer 1.25s infinite;
    }

    .avatar {
      border-radius: 50%;
      width: 48px;
      height: 48px;
    }

    .image {
      height: 160px;
      border-radius: 0.75rem;
    }

    .line {
      height: 12px;
      margin-top: 0.5rem;
      border-radius: 999px;
    }

    .line-title {
      height: 16px;
      width: 75%;
      margin-top: 0;
    }

    .w-70 {
      width: 70%;
    }

    .mb {
      margin-bottom: 0.75rem;
    }

    .skeleton-card {
      width: 100%;
      border: 1px solid #e9ecef;
      border-radius: 0.75rem;
      padding: 1rem;
      background: #fff;
    }

    @keyframes shimmer {
      100% {
        transform: translateX(100%);
      }
    }

    @media (max-width: 576px) {
      .image {
        height: 120px;
      }
    }
  `,
})
export class SkeletonScreen {
  @Input() variant: 'card' | 'avatar' | 'title' | 'text' | 'image' = 'card';
  @Input() lines = 3;
  @Input() width = 48;
  @Input() height = 48;
  @Input() ariaLabel = 'Loading content';

  get lineItems(): number[] {
    return Array.from({ length: Math.max(1, this.lines) }, (_, index) => index);
  }
}
