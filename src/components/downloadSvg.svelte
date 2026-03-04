<script lang="ts">
  import type { iSVG } from '@/types/svg';
  import JSZip from 'jszip';
  import download from 'downloadjs';
  import { toast } from 'svelte-sonner';
  import { DownloadIcon } from 'lucide-svelte';
  import { getSvgContent } from '@/utils/getSvgContent';
  import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
  } from '@/ui/dialog';
  import { buttonStyles } from '@/ui/styles';
  import { cn } from '@/utils/cn';

  type DownloadFormat = 'svg' | 'png';

  // Props:
  export let svgInfo: iSVG;
  export let isDarkTheme: () => boolean;

  // Shared:
  let iconStroke = 1.8;
  let iconSize = 16;
  let mainDownloadStyles =
    'flex items-center space-x-2 rounded-md p-2 duration-100 hover:bg-neutral-200 dark:hover:bg-neutral-700/40';
  let cardDownloadStyles =
    'flex w-full h-full flex-col p-4 rounded-md shadow-sm dark:bg-neutral-800/20 bg-neutral-200/10 border border-neutral-200 dark:border-neutral-800 space-y-2';

  const getCategoryText = () =>
    Array.isArray(svgInfo.category) ? svgInfo.category.sort().join(' - ') : svgInfo.category;

  const toPngBlob = async (url: string) => {
    const svgText = await getSvgContent(url);
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const objectUrl = URL.createObjectURL(svgBlob);
    const targetWidth = 512;

    const getAspectRatioFromSvg = () => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = doc.querySelector('svg');

        if (!svgElement) return null;

        const viewBox = svgElement.getAttribute('viewBox');
        if (viewBox) {
          const values = viewBox
            .trim()
            .split(/[\s,]+/)
            .map(Number);

          if (values.length === 4 && values[2] > 0 && values[3] > 0) {
            return values[2] / values[3];
          }
        }

        const widthAttr = Number.parseFloat(svgElement.getAttribute('width') || '');
        const heightAttr = Number.parseFloat(svgElement.getAttribute('height') || '');

        if (widthAttr > 0 && heightAttr > 0) {
          return widthAttr / heightAttr;
        }
      } catch {
        return null;
      }

      return null;
    };

    try {
      return await new Promise<Blob>((resolve, reject) => {
        const img = new Image();

        img.onload = () => {
          const parsedRatio = getAspectRatioFromSvg();
          const fallbackRatio = img.naturalWidth > 0 && img.naturalHeight > 0
            ? img.naturalWidth / img.naturalHeight
            : 1;

          const aspectRatio = parsedRatio && parsedRatio > 0 ? parsedRatio : fallbackRatio;
          const targetHeight = Math.max(1, Math.round(targetWidth / aspectRatio));

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const ctx = canvas.getContext('2d', { alpha: true });
          if (!ctx) {
            reject(new Error('Canvas context is unavailable'));
            return;
          }

          // 透明底：先清空画布，不填充任何背景色。
          ctx.clearRect(0, 0, targetWidth, targetHeight);
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to convert SVG to PNG'));
              return;
            }

            resolve(blob);
          }, 'image/png');
        };

        img.onerror = () => reject(new Error('Failed to load SVG image'));
        img.src = objectUrl;
      });
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const downloadSingle = async ({
    url,
    filename,
    format,
    isWordmark
  }: {
    url?: string;
    filename: string;
    format: DownloadFormat;
    isWordmark?: boolean;
  }) => {
    if (!url) return;

    try {
      if (format === 'svg') {
        download(url, `${filename}.svg`, 'image/svg+xml');
      } else {
        const pngBlob = await toPngBlob(url);
        download(pngBlob, `${filename}.png`, 'image/png');
      }

      const category = getCategoryText();
      const itemType = isWordmark ? 'Wordmark' : 'Icon';
      toast.success(`正在下载 ${format.toUpperCase()}...`, {
        description: `${svgInfo.title} - ${itemType} - ${category}`
      });
    } catch {
      toast.error(`下载 ${format.toUpperCase()} 失败`, {
        description: `${svgInfo.title}`
      });
    }
  };

  // Download all variants:
  const downloadAllVariants = async ({
    lightRoute,
    darkRoute,
    format,
    isWordmark
  }: {
    lightRoute: string;
    darkRoute: string;
    format: DownloadFormat;
    isWordmark?: boolean;
  }) => {
    try {
      const zip = new JSZip();
      const prefix = isWordmark ? `${svgInfo.title}_wordmark` : `${svgInfo.title}`;

      if (format === 'svg') {
        const lightSvg = await getSvgContent(lightRoute);
        const darkSvg = await getSvgContent(darkRoute);

        zip.file(`${prefix}_light.svg`, lightSvg);
        zip.file(`${prefix}_dark.svg`, darkSvg);
      } else {
        const lightPngBlob = await toPngBlob(lightRoute);
        const darkPngBlob = await toPngBlob(darkRoute);

        zip.file(`${prefix}_light.png`, lightPngBlob);
        zip.file(`${prefix}_dark.png`, darkPngBlob);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      download(content, `${prefix}_light_dark_${format}.zip`, 'application/zip');

      const category = getCategoryText();
      toast.success(`正在下载 ${format.toUpperCase()} 的浅色与深色版本...`, {
        description: isWordmark
          ? `${svgInfo.title} - Wordmark - ${category}`
          : `${svgInfo.title} - ${category}`
      });
    } catch {
      toast.error(`下载 ${format.toUpperCase()} 版本失败`, {
        description: `${svgInfo.title}`
      });
    }
  };
</script>

<Dialog>
  <DialogTrigger title="下载 SVG 或 PNG" class={mainDownloadStyles}>
    <DownloadIcon size={iconSize} strokeWidth={iconStroke} />
  </DialogTrigger>
  <DialogContent class="max-w-[760px]">
    <DialogHeader>
      <DialogTitle>下载 {svgInfo.title}</DialogTitle>
      <DialogDescription>请选择下载格式：SVG 或 PNG。</DialogDescription>
    </DialogHeader>

    <div
      class={cn(
        'flex flex-col space-y-2 mt-4 h-auto',
        'md:space-y-0 md:flex-row md:space-x-2 md:items-center md:justify-center'
      )}
    >
      {#if typeof svgInfo.route === 'string'}
        <div class={cardDownloadStyles}>
          <img src={svgInfo.route} alt={svgInfo.title} class="h-auto my-4" />

          <button
            title="下载 Icon Logo 为 SVG"
            class={buttonStyles}
            on:click={() =>
              downloadSingle({
                url: svgInfo.route,
                filename: `${svgInfo.title}`,
                format: 'svg'
              })}
          >
            <DownloadIcon class="mr-2" size={iconSize} />
            <p>Icon Logo（SVG）</p>
          </button>

          <button
            title="下载 Icon Logo 为 PNG"
            class={buttonStyles}
            on:click={() =>
              downloadSingle({
                url: svgInfo.route,
                filename: `${svgInfo.title}`,
                format: 'png'
              })}
          >
            <DownloadIcon class="mr-2" size={iconSize} />
            <p>Icon Logo（PNG）</p>
          </button>
        </div>
      {:else}
        <div class={cardDownloadStyles}>
          <img
            src={isDarkTheme() ? svgInfo.route.dark : svgInfo.route.light}
            alt={svgInfo.title}
            class="h-10 my-4"
          />

          <button
            title="下载浅色与深色版本为 SVG"
            class={buttonStyles}
            on:click={() =>
              typeof svgInfo.route !== 'string' &&
              downloadAllVariants({
                lightRoute: svgInfo.route.light,
                darkRoute: svgInfo.route.dark,
                format: 'svg'
              })}
          >
            <DownloadIcon size={iconSize} />
            <p>浅色与深色版本（SVG）</p>
          </button>

          <button
            title="下载浅色与深色版本为 PNG"
            class={buttonStyles}
            on:click={() =>
              typeof svgInfo.route !== 'string' &&
              downloadAllVariants({
                lightRoute: svgInfo.route.light,
                darkRoute: svgInfo.route.dark,
                format: 'png'
              })}
          >
            <DownloadIcon size={iconSize} />
            <p>浅色与深色版本（PNG）</p>
          </button>

          <button
            title="下载浅色版本为 SVG"
            class={buttonStyles}
            on:click={() =>
              typeof svgInfo.route !== 'string' &&
              downloadSingle({
                url: svgInfo.route.light,
                filename: `${svgInfo.title}_light`,
                format: 'svg'
              })}
          >
            <DownloadIcon class="mr-2" size={iconSize} />
            仅浅色版本（SVG）
          </button>

          <button
            title="下载浅色版本为 PNG"
            class={buttonStyles}
            on:click={() =>
              typeof svgInfo.route !== 'string' &&
              downloadSingle({
                url: svgInfo.route.light,
                filename: `${svgInfo.title}_light`,
                format: 'png'
              })}
          >
            <DownloadIcon class="mr-2" size={iconSize} />
            仅浅色版本（PNG）
          </button>

          <button
            title="下载深色版本为 SVG"
            class={buttonStyles}
            on:click={() =>
              typeof svgInfo.route !== 'string' &&
              downloadSingle({
                url: svgInfo.route.dark,
                filename: `${svgInfo.title}_dark`,
                format: 'svg'
              })}
          >
            <DownloadIcon class="mr-2" size={iconSize} />
            仅深色版本（SVG）
          </button>

          <button
            title="下载深色版本为 PNG"
            class={buttonStyles}
            on:click={() =>
              typeof svgInfo.route !== 'string' &&
              downloadSingle({
                url: svgInfo.route.dark,
                filename: `${svgInfo.title}_dark`,
                format: 'png'
              })}
          >
            <DownloadIcon class="mr-2" size={iconSize} />
            仅深色版本（PNG）
          </button>
        </div>
      {/if}

      {#if typeof svgInfo.wordmark === 'string' && svgInfo.wordmark !== undefined}
        <div class={cardDownloadStyles}>
          <img src={svgInfo.wordmark} alt={svgInfo.title} class="h-auto my-4" />

          <button
            title="下载 Wordmark Logo 为 SVG"
            class={buttonStyles}
            on:click={() =>
              typeof svgInfo.wordmark === 'string' &&
              downloadSingle({
                url: svgInfo.wordmark,
                filename: `${svgInfo.title}_wordmark`,
                format: 'svg',
                isWordmark: true
              })}
          >
            <DownloadIcon class="mr-2" size={iconSize} />
            <p>Wordmark Logo（SVG）</p>
          </button>

          <button
            title="下载 Wordmark Logo 为 PNG"
            class={buttonStyles}
            on:click={() =>
              typeof svgInfo.wordmark === 'string' &&
              downloadSingle({
                url: svgInfo.wordmark,
                filename: `${svgInfo.title}_wordmark`,
                format: 'png',
                isWordmark: true
              })}
          >
            <DownloadIcon class="mr-2" size={iconSize} />
            <p>Wordmark Logo（PNG）</p>
          </button>
        </div>
      {/if}

      {#if typeof svgInfo.wordmark !== 'string' && svgInfo.wordmark !== undefined}
        <div class={cardDownloadStyles}>
          <img
            src={isDarkTheme() ? svgInfo.wordmark.dark : svgInfo.wordmark.light}
            alt={svgInfo.title}
            class="h-10 my-4"
          />

          <button
            title="下载 Wordmark 浅色与深色版本为 SVG"
            class={buttonStyles}
            on:click={() =>
              typeof svgInfo.wordmark !== 'string' &&
              downloadAllVariants({
                lightRoute: svgInfo.wordmark?.light || '',
                darkRoute: svgInfo.wordmark?.dark || '',
                format: 'svg',
                isWordmark: true
              })}
          >
            <DownloadIcon class="mr-2" size={iconSize} />
            Wordmark 浅色与深色版本（SVG）
          </button>

          <button
            title="下载 Wordmark 浅色与深色版本为 PNG"
            class={buttonStyles}
            on:click={() =>
              typeof svgInfo.wordmark !== 'string' &&
              downloadAllVariants({
                lightRoute: svgInfo.wordmark?.light || '',
                darkRoute: svgInfo.wordmark?.dark || '',
                format: 'png',
                isWordmark: true
              })}
          >
            <DownloadIcon class="mr-2" size={iconSize} />
            Wordmark 浅色与深色版本（PNG）
          </button>

          <button
            title="下载 Wordmark 浅色版本为 SVG"
            class={buttonStyles}
            on:click={() =>
              typeof svgInfo.wordmark !== 'string' &&
              downloadSingle({
                url: svgInfo.wordmark?.light,
                filename: `${svgInfo.title}_wordmark_light`,
                format: 'svg',
                isWordmark: true
              })}
          >
            <DownloadIcon class="mr-2" size={iconSize} />
            Wordmark 浅色版本（SVG）
          </button>

          <button
            title="下载 Wordmark 浅色版本为 PNG"
            class={buttonStyles}
            on:click={() =>
              typeof svgInfo.wordmark !== 'string' &&
              downloadSingle({
                url: svgInfo.wordmark?.light,
                filename: `${svgInfo.title}_wordmark_light`,
                format: 'png',
                isWordmark: true
              })}
          >
            <DownloadIcon class="mr-2" size={iconSize} />
            Wordmark 浅色版本（PNG）
          </button>

          <button
            title="下载 Wordmark 深色版本为 SVG"
            class={buttonStyles}
            on:click={() =>
              typeof svgInfo.wordmark !== 'string' &&
              downloadSingle({
                url: svgInfo.wordmark?.dark,
                filename: `${svgInfo.title}_wordmark_dark`,
                format: 'svg',
                isWordmark: true
              })}
          >
            <DownloadIcon class="mr-2" size={iconSize} />
            Wordmark 深色版本（SVG）
          </button>

          <button
            title="下载 Wordmark 深色版本为 PNG"
            class={buttonStyles}
            on:click={() =>
              typeof svgInfo.wordmark !== 'string' &&
              downloadSingle({
                url: svgInfo.wordmark?.dark,
                filename: `${svgInfo.title}_wordmark_dark`,
                format: 'png',
                isWordmark: true
              })}
          >
            <DownloadIcon class="mr-2" size={iconSize} />
            Wordmark 深色版本（PNG）
          </button>
        </div>
      {/if}
    </div>
  </DialogContent>
</Dialog>
