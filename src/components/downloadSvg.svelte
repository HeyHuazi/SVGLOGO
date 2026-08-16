<!--
  [INPUT]: 依赖 @/types/svg、download-assets 下载视图模型、jszip/downloadjs、toast、Dialog 与 SVG 内容读取
  [OUTPUT]: 对外提供 DownloadSvg，统一导出主 Logo/Wordmark 的单一或 light/dark SVG、PNG 与主题 ZIP
  [POS]: components 层的共享下载组件，模板只遍历规范资源组，不自行判断存储联合类型
  [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
-->
<script lang="ts">
  import { browser } from "$app/environment";
  import type { iSVG } from "@/types/svg";
  import JSZip from "jszip";
  import download from "downloadjs";
  import { toast } from "svelte-sonner";
  import { DownloadIcon } from "lucide-svelte";
  import { getSvgContent } from "@/utils/getSvgContent";
  import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from "@/ui/dialog";
  import { buttonStyles } from "@/ui/styles";
  import { cn } from "@/utils/cn";
  import {
    buildDownloadGroups,
    type DownloadGroup,
    type DownloadableAsset,
  } from "./download-assets";

  type DownloadFormat = "svg" | "png";

  export let svgInfo: iSVG;
  export let isDarkTheme: () => boolean;

  let iconStroke = 1.8;
  let iconSize = 16;
  let mainDownloadStyles =
    "flex items-center space-x-2 rounded-md p-2 text-[#737373] dark:text-[#737373] duration-100 hover:bg-neutral-200 dark:hover:bg-neutral-700/40";
  let cardDownloadStyles =
    "flex w-full h-full flex-col p-4 rounded-md shadow-sm dark:bg-neutral-800/20 bg-neutral-200/10 border border-neutral-200 dark:border-neutral-800 space-y-2";
  $: groups = buildDownloadGroups(
    svgInfo,
    browser && isDarkTheme() ? "dark" : "light",
  );

  const getCategoryText = () =>
    Array.isArray(svgInfo.category)
      ? [...svgInfo.category].sort().join(" - ")
      : svgInfo.category;

  const toPngBlob = async (url: string) => {
    const svgText = await getSvgContent(url);
    const svgBlob = new Blob([svgText], {
      type: "image/svg+xml;charset=utf-8",
    });
    const objectUrl = URL.createObjectURL(svgBlob);
    const targetWidth = 512;

    const getAspectRatioFromSvg = () => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const svgElement = doc.querySelector("svg");
        if (!svgElement) return null;
        const viewBox = svgElement.getAttribute("viewBox");
        if (viewBox) {
          const values = viewBox
            .trim()
            .split(/[\s,]+/)
            .map(Number);
          if (values.length === 4 && values[2] > 0 && values[3] > 0)
            return values[2] / values[3];
        }
        const width = Number.parseFloat(svgElement.getAttribute("width") || "");
        const height = Number.parseFloat(
          svgElement.getAttribute("height") || "",
        );
        return width > 0 && height > 0 ? width / height : null;
      } catch {
        return null;
      }
    };

    try {
      return await new Promise<Blob>((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
          const parsedRatio = getAspectRatioFromSvg();
          const fallbackRatio =
            image.naturalWidth > 0 && image.naturalHeight > 0
              ? image.naturalWidth / image.naturalHeight
              : 1;
          const ratio =
            parsedRatio && parsedRatio > 0 ? parsedRatio : fallbackRatio;
          const targetHeight = Math.max(1, Math.round(targetWidth / ratio));
          const canvas = document.createElement("canvas");
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const context = canvas.getContext("2d", { alpha: true });
          if (!context)
            return reject(new Error("Canvas context is unavailable"));
          context.clearRect(0, 0, targetWidth, targetHeight);
          context.drawImage(image, 0, 0, targetWidth, targetHeight);
          canvas.toBlob(
            (blob) =>
              blob ? resolve(blob) : reject(new Error("PNG 转换失败")),
            "image/png",
          );
        };
        image.onerror = () => reject(new Error("SVG 图片加载失败"));
        image.src = objectUrl;
      });
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  async function downloadSingle(
    item: DownloadableAsset,
    format: DownloadFormat,
  ) {
    try {
      if (format === "svg") {
        const svgText = await getSvgContent(item.url);
        if (!svgText?.trim().startsWith("<svg"))
          throw new Error("Invalid SVG content");
        download(
          new Blob([svgText], { type: "image/svg+xml;charset=utf-8" }),
          `${item.filename}.svg`,
          "image/svg+xml",
        );
      } else {
        download(
          await toPngBlob(item.url),
          `${item.filename}.png`,
          "image/png",
        );
      }
      toast.success(`正在下载 ${format.toUpperCase()} 格式...`, {
        description: `${svgInfo.title} - ${item.role === "wordmark" ? "组合标志" : "标识"} - ${getCategoryText()}`,
      });
    } catch {
      toast.error(`下载 ${format.toUpperCase()} 格式失败`, {
        description: svgInfo.title,
      });
    }
  }

  async function downloadThemeZip(
    group: DownloadGroup,
    format: DownloadFormat,
  ) {
    if (group.variant.kind !== "themed") return;
    try {
      const zip = new JSZip();
      for (const item of group.items) {
        zip.file(
          `${item.filename}.${format}`,
          format === "svg"
            ? await getSvgContent(item.url)
            : await toPngBlob(item.url),
        );
      }
      const prefix =
        group.role === "wordmark" ? `${svgInfo.title}_wordmark` : svgInfo.title;
      download(
        await zip.generateAsync({ type: "blob" }),
        `${prefix}_light_dark_${format}.zip`,
        "application/zip",
      );
      toast.success(`正在下载亮暗双版本（${format.toUpperCase()}）...`, {
        description: `${svgInfo.title} - ${group.label} - ${getCategoryText()}`,
      });
    } catch {
      toast.error(`下载亮暗双版本失败`, { description: svgInfo.title });
    }
  }
</script>

<Dialog>
  <DialogTrigger
    title="下载 SVG 或 PNG"
    aria-label="下载 SVG 或 PNG"
    class={mainDownloadStyles}
  >
    <DownloadIcon size={iconSize} strokeWidth={iconStroke} />
  </DialogTrigger>
  <DialogContent class="max-w-[760px]">
    <DialogHeader>
      <DialogTitle>下载 {svgInfo.title}</DialogTitle>
      <DialogDescription>请选择品牌资源与下载格式。</DialogDescription>
    </DialogHeader>

    <div
      class={cn(
        "mt-4 grid h-auto gap-2",
        groups.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1",
      )}
    >
      {#each groups as group}
        <div class={cardDownloadStyles}>
          <div class="flex items-center justify-between gap-2">
            <strong class="text-sm">{group.label}</strong>
            <span class="text-xs text-neutral-400"
              >{group.variant.kind === "themed"
                ? "亮暗双版本"
                : "单一版本"}</span
            >
          </div>
          <img
            src={group.preview}
            alt={`${svgInfo.title} ${group.label}`}
            class="mx-auto my-4 max-h-12 max-w-full"
          />

          {#if group.variant.kind === "themed"}
            <button
              class={buttonStyles}
              on:click={() => downloadThemeZip(group, "svg")}
            >
              <DownloadIcon size={iconSize} /><span>亮暗双版本 ZIP（SVG）</span>
            </button>
            <button
              class={buttonStyles}
              on:click={() => downloadThemeZip(group, "png")}
            >
              <DownloadIcon size={iconSize} /><span>亮暗双版本 ZIP（PNG）</span>
            </button>
          {/if}

          {#each group.items as item}
            <div class="grid grid-cols-2 gap-2">
              <button
                class={buttonStyles}
                title={`下载${item.label} SVG`}
                on:click={() => downloadSingle(item, "svg")}
              >
                <DownloadIcon size={iconSize} /><span>{item.label} SVG</span>
              </button>
              <button
                class={buttonStyles}
                title={`下载${item.label} PNG`}
                on:click={() => downloadSingle(item, "png")}
              >
                <DownloadIcon size={iconSize} /><span>{item.label} PNG</span>
              </button>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </DialogContent>
</Dialog>
