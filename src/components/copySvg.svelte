<!--
  [INPUT]: 依赖 @/types/svg 的 iSVG、types/assets 的统一主题解析、lucide-svelte、toast、Popover 与 SVG/剪贴板工具
  [OUTPUT]: 对外提供 CopySvg 组件，将当前主题对应的主 Logo 或 Wordmark 写入剪贴板
  [POS]: components 层的共享 SVG 操作组件，被 svgCard 消费，不自行解释 single/themed 存储结构
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script lang="ts">
  import { resolveStoredAsset } from "@/types/assets";
  import type { iSVG } from "@/types/svg";

  import { ClipboardIcon, CopyIcon, Loader, X } from "lucide-svelte";
  import { toast } from "svelte-sonner";
  import * as Popover from "@/ui/popover";

  // Utils:
  import { getSvgContent } from "@/utils/getSvgContent";
  import { clipboard } from "@/utils/clipboard";
  import { buttonStyles } from "@/ui/styles";
  import { cn } from "@/utils/cn";

  // Props:
  export let iconSize = 24;
  export let iconStroke = 2;
  export let isWordmarkSvg = false;
  export let svgInfo: iSVG;
  let optionsOpen = false;
  let isLoading = false;

  const getSvgUrl = (): string => {
    const theme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    const asset = isWordmarkSvg ? svgInfo.wordmark : svgInfo.route;
    if (!asset) throw new Error("Wordmark 资源不存在");
    return resolveStoredAsset(
      asset,
      theme,
      `${svgInfo.title}${isWordmarkSvg ? " Wordmark" : " 主 Logo"}`,
    );
  };

  // 复制 SVG 到剪贴板:
  const copyToClipboard = async () => {
    optionsOpen = false;
    try {
      const content = await getSvgContent(getSvgUrl());
      await clipboard(content);
      const category = Array.isArray(svgInfo.category)
        ? [...svgInfo.category].sort().join(" - ")
        : svgInfo.category;
      toast.success(
        isWordmarkSvg ? "已复制组合 SVG 到剪贴板" : "已复制到剪贴板",
        {
          description: `${svgInfo.title} - ${category}`,
        },
      );
    } catch {
      toast.error("复制 SVG 失败", { description: svgInfo.title });
    }
  };

  const loadImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("SVG 图片加载失败"));
      image.src = url;
    });

  const canvasBlob = (canvas: HTMLCanvasElement) =>
    new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("PNG 转换失败"))),
        "image/png",
      );
    });

  // 复制 PNG 到剪贴板:
  const copyPngToClipboard = async (width: number, height: number) => {
    optionsOpen = false;
    isLoading = true;
    let objectUrl = "";

    try {
      const svgText = await getSvgContent(getSvgUrl());
      objectUrl = URL.createObjectURL(
        new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }),
      );
      const image = await loadImage(objectUrl);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas 不可用");

      canvas.width = width;
      canvas.height = height;
      const ratio = image.naturalWidth / image.naturalHeight || 1;
      const drawWidth = width / height > ratio ? height * ratio : width;
      const drawHeight = width / height > ratio ? height : width / ratio;
      context.clearRect(0, 0, width, height);
      context.drawImage(
        image,
        (width - drawWidth) / 2,
        (height - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );

      const blob = await canvasBlob(canvas);
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      toast.success("已复制 PNG 到剪贴板", {
        description: `${svgInfo.title} - ${svgInfo.category}`,
      });
    } catch {
      toast.error("复制 PNG 失败", { description: svgInfo.title });
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      isLoading = false;
    }
  };
</script>

<Popover.Root
  open={optionsOpen}
  onOpenChange={(isOpen) => (optionsOpen = isOpen)}
>
  <Popover.Trigger
    title="复制 SVG 或 PNG"
    aria-label="复制 SVG 或 PNG"
    class="flex min-h-[36px] min-w-[36px] items-center space-x-2 rounded-md p-2 text-[#737373] duration-100 hover:bg-neutral-200 dark:text-[#737373] dark:hover:bg-neutral-700/40"
  >
    {#if optionsOpen}
      <X size={iconSize} strokeWidth={iconStroke} />
    {:else if isLoading}
      <Loader size={iconSize} strokeWidth={iconStroke} class="animate-spin" />
    {:else}
      <CopyIcon size={iconSize} strokeWidth={iconStroke} />
    {/if}
  </Popover.Trigger>
  <Popover.Content class="flex flex-col space-y-2" sideOffset={0.3}>
    <button
      class={cn(buttonStyles, "w-full rounded-md")}
      title={isWordmarkSvg ? "复制组合 SVG 到剪贴板" : "复制 SVG 到剪贴板"}
      on:click={() => copyToClipboard()}
    >
      <ClipboardIcon size={16} strokeWidth={2} />
      <span>复制 SVG</span>
    </button>
    <button
      class={cn(buttonStyles, "w-full rounded-md")}
      title="复制 PNG 到剪贴板"
      disabled={isLoading}
      on:click={() => copyPngToClipboard(500, 500)}
    >
      <ClipboardIcon size={16} strokeWidth={2} />
      <span>复制 PNG</span>
    </button>
  </Popover.Content>
</Popover.Root>
